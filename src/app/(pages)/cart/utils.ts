import { Dispatch, SetStateAction } from 'react'

import { ROUTES } from '@/constants/routes'
import { specialVariantIds } from '@/constants/specialIds'
import { Cart } from '@/models/cart'
import { Currency } from '@/models/currency'
import { VariantPriceType } from '@/models/db/product'
import { ListedProductForCart } from '@/models/product'
import { fetchApi } from '@/utils/fetchApi'
import { getVariantOption, isVariantOptionPaid } from '@/utils/getVariantOption'

import { CartProduct } from './models'

export async function getProductsForCart(
  cart: Cart,
  currency: Currency,
  setProducts: Dispatch<SetStateAction<CartProduct[]>>,
  setError: Dispatch<SetStateAction<string | undefined>>
) {
  const res = await fetchApi<ListedProductForCart[]>(
    ROUTES.api.productsList({
      ids: cart.map((c) => c.productId),
      forCart: true,
    }),
    'cart items',
    { cache: 'no-cache' }
  )

  if (res.error) {
    setError(res.error)
    return
  }

  const cartProducts = res
    .data!.map((product) => transformToCartProduct(product, cart, currency))
    .filter((product) => product !== null)

  setProducts(cartProducts)
}

function transformToCartProduct(
  product: ListedProductForCart,
  cart: Cart,
  currency: Currency
): CartProduct | null {
  const cartItem = cart.find((item) => item.productId === product._id)
  if (cartItem === undefined) return null

  const checkoutItemQuantity = cart.reduce((total, item) => {
    if (item.checkoutItemId === cartItem.checkoutItemId) {
      return total + item.quantity
    }
    return total
  }, 0)

  // Discounted = by Quantity
  const discountedPrice = (() => {
    if (product.sale) {
      const prices = product.sale.prices
      const maxPriceIndex = prices.length - 1
      return prices[Math.min(checkoutItemQuantity - 1, maxPriceIndex)]
    }
    const discountPrices = product.allPrices.slice(1)
    if (checkoutItemQuantity < 2 || discountPrices.length === 0)
      return undefined
    const maxPriceIndex = discountPrices.length - 1
    return discountPrices[Math.min(checkoutItemQuantity - 2, maxPriceIndex)]
  })()

  const priceToUse = discountedPrice
    ? discountedPrice[currency]
    : product.price[currency]

  let baseTotal = priceToUse * cartItem.quantity
  let addonsTotal = 0
  let specialVariantDiscount = 0

  const variants = product.primaryVariant
    ? [product.primaryVariant, ...(product.subVariants || [])]
    : []

  if (variants) {
    cartItem.variations?.forEach((v) => {
      const alreadyCountedServiceOptions: { [variantId: string]: boolean } = {}
      Object.entries(v).forEach(([id, value]) => {
        if (id === specialVariantIds.quantity) return
        const variant = variants!.find((v) => v.id === id)!
        const option = getVariantOption(variant, value)
        if (option) {
          if (variant.isService) {
            if (variant.id in alreadyCountedServiceOptions) return
            alreadyCountedServiceOptions[variant.id] = true
          }
          if (isVariantOptionPaid(option)) {
            const optionPrice = option.price.value[currency]
            const isPercentage =
              option.price.type === VariantPriceType.AdditivePercentage
            if (
              isPercentage ||
              option.price.type === VariantPriceType.Additive
            ) {
              const optionPriceToUse = isPercentage
                ? priceToUse * optionPrice
                : optionPrice
              if (optionPrice < 0) {
                baseTotal += optionPriceToUse
                specialVariantDiscount -= optionPriceToUse
              } else {
                addonsTotal += optionPriceToUse
              }
            } else {
              // Remove one quantity so that this one can be made exact
              baseTotal -= priceToUse
              baseTotal += optionPrice
            }
          }
        }
      })
    })
  }

  return {
    ...product,
    quantity: cartItem.quantity,
    variations: cartItem.variations,
    discountedPrice,
    baseTotal,
    addonsTotal,
    specialVariantDiscount,
    stock: typeof product.stock === 'number' ? product.stock : undefined,
    checkoutItemQuantity,
  }
}
