import Stripe from 'stripe'

import { specialVariantIds } from '@/constants/specialIds'
import { stripeShippingOptions } from '@/constants/stripeShippingOptions'
import { Cart } from '@/models/cart'
import { Currency, PossibleUserCountry } from '@/models/currency'
import {
  ExtendedVariantOption,
  ProductDocument,
  SimpleVariantOption,
  Variant,
  VariantPriceType,
  VariantType,
} from '@/models/db/product'
import { SharedSlotDocument } from '@/models/db/sharedSlot'
import { getVariantOption, isVariantOptionPaid } from '@/utils/getVariantOption'
import { isOnSale } from '@/utils/sale'

export function buildLineItems(
  products: ProductDocument[],
  currency: Currency,
  cart: Cart,
  sharedSlots: SharedSlotDocument[]
) {
  const usedSharedSlots: { [slotId: string]: number } = {}

  // @ts-ignore
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = products
    .flatMap((p) => {
      const cartItem = cart.find((item) => item.productId === p._id.toString())
      if (cartItem === undefined) return null

      const checkoutItemQuantity = cart.reduce((total, item) => {
        if (item.checkoutItemId === cartItem.checkoutItemId) {
          return total + item.quantity
        }
        return total
      }, 0)

      const lastPriceIndex = p.checkoutItem.price.byQuantity.length
      const priceIndexByQuantity =
        checkoutItemQuantity <= lastPriceIndex
          ? checkoutItemQuantity - 1
          : lastPriceIndex - 1

      const pricesToUse = isOnSale(p.sale)
        ? p.sale!.prices
        : p.checkoutItem.price.byQuantity

      const baseProductPrice = pricesToUse[priceIndexByQuantity][currency] * 100
      const dataForProduct: Stripe.Checkout.SessionCreateParams.LineItem = {
        price_data: {
          currency,
          product: p.checkoutItem.stripeId,
          unit_amount: Math.round(baseProductPrice),
        },
        quantity: cartItem.quantity,
      }

      const addons: {
        [id: string]: {
          option: ExtendedVariantOption
          count: number
          name: string
        }
      } = {}
      let alreadyCountedServiceOptions: { [variantId: string]: boolean } = {}

      function addAddon(
        addon: SimpleVariantOption | ExtendedVariantOption,
        variant: Variant
      ) {
        if (!isVariantOptionPaid(addon)) {
          return
        }
        if (variant.isService) {
          if (addon.productId in alreadyCountedServiceOptions) return
          alreadyCountedServiceOptions[variant.id] = true
        }
        if (addon.productId in addons) {
          addons[addon.productId].count += 1
        } else {
          addons[addon.productId] = {
            option: addon as ExtendedVariantOption,
            count: 1,
            name: addon.name,
          }
        }
      }

      function detectAddon(variant: Variant, value: any) {
        const addon = getVariantOption(variant, value)
        if (addon) addAddon(addon, variant)
      }

      cartItem.variations?.forEach((v) => {
        alreadyCountedServiceOptions = {}
        Object.entries(v).forEach(([id, value]) => {
          if (id === p.primaryVariant?.id) {
            detectAddon(p.primaryVariant, value)
          } else if (id !== specialVariantIds.quantity) {
            const subVariant = p.subVariants!.find((sv) => sv.id === id)!
            if (
              subVariant.type === VariantType.Form &&
              typeof subVariant !== 'string'
            ) {
              addAddon(
                subVariant.options[0] as
                  | SimpleVariantOption
                  | ExtendedVariantOption,
                subVariant
              )
            } else {
              detectAddon(subVariant, value)
            }
          }
        })
      })

      const extraItems = Object.values(addons)
      if (extraItems.length === 0) {
        return dataForProduct
      }

      extraItems.forEach((addon) => {
        const slotId = addon.option.sharedSlotId
        if (!slotId) return

        const sharedSlot = sharedSlots.find((s) => s._id.toString() === slotId)
        if (!sharedSlot) return

        if (sharedSlot.amount === 0) {
          throw new Error(
            `Looks like "${addon.name}" was sold out while you were browsing! Please remove this option from your cart and try again.`
          )
        }

        const remainingSlots = sharedSlot.amount - addon.count
        if (remainingSlots < 0) {
          throw new Error(
            `Looks like "${
              addon.name
            }" was sold while you were browsing! Please remove ${-remainingSlots} of these from your cart and try again.`
          )
        }

        usedSharedSlots[slotId] = remainingSlots
      })

      const addonData: Stripe.Checkout.SessionCreateParams.LineItem[] =
        extraItems
          .map((addon) => {
            const rawPrice = addon.option.price.value[currency]
            const price = rawPrice * 100
            const productId = addon.option.productId

            const isPercentage =
              addon.option.price.type === VariantPriceType.AdditivePercentage
            const percentagePrice = Math.round(
              baseProductPrice * Math.abs(rawPrice)
            )

            if (price < 0) {
              dataForProduct.quantity! -= addon.count
              return {
                price_data: {
                  currency,
                  product: productId,
                  unit_amount: isPercentage
                    ? percentagePrice
                    : baseProductPrice + price,
                },
                quantity: addon.count,
              }
            }

            return {
              price_data: {
                currency,
                product: productId,
                unit_amount: isPercentage ? percentagePrice : price,
              },
              quantity: addon.count,
            }
          })
          .filter((addon) => addon !== null)

      return [dataForProduct, ...addonData]
    })
    .filter((p) => p !== null && p.quantity! > 0)

  return {
    usedSharedSlots,
    lineItems,
  }
}

export function buildShippingOptions(
  products: ProductDocument[],
  currency: Currency,
  country: PossibleUserCountry,
  isFreeShippingAvailable: boolean
) {
  const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] =
    []

  const isCanadianCurrency = currency === 'CAD'

  if (country.isCanada && isCanadianCurrency) {
    shippingOptions.push({
      shipping_rate: stripeShippingOptions.tracked.domestic,
    })
  }
  if (country.isUs) {
    shippingOptions.push({ shipping_rate: stripeShippingOptions.tracked.us })
  }
  if (country.isInternational && !isCanadianCurrency) {
    shippingOptions.push({
      shipping_rate: stripeShippingOptions.tracked.international,
    })
  }

  if (isFreeShippingAvailable) {
    shippingOptions.push({
      shipping_rate: isCanadianCurrency
        ? stripeShippingOptions.free.domestic
        : stripeShippingOptions.free.us,
    })
  }

  if (products.every((p) => p.isLocalPickupAvailable)) {
    shippingOptions.push({
      shipping_rate: stripeShippingOptions.free.localPickup,
    })
  }

  return shippingOptions
}
