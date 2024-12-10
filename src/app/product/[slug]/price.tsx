'use client'

import { Fragment, useMemo } from 'react'

import { useAtomValue } from 'jotai'

import { Currency } from '@/models/currency'
import {
  PriceTier,
  ProductPriceData,
  VolumeDiscountDisplayMode,
} from '@/models/db/checkoutItem'
import { ProductSaleData } from '@/models/db/product'
import { formatPrice } from '@/utils/formatters'
import { getUserCurrency } from '@/utils/userLocation'

import { ProductPrice } from '@/components/price'

import styles from './styles.module.scss'

import { cartAtom } from '@/state/atoms/cart'

function getDiscountPercentage(
  discountedPrice: PriceTier,
  regularPrice: PriceTier,
  currency: Currency
) {
  const fraction = discountedPrice[currency] / regularPrice[currency]
  return Math.round((1 - fraction) * 100)
}

type Props = {
  checkoutItemId: string
  data: ProductPriceData
  sale: ProductSaleData | undefined
  checkoutItemPluralName: string
}

export const ProductPagePriceSection = ({
  checkoutItemId,
  data,
  sale,
  checkoutItemPluralName,
}: Props) => {
  const cart = useAtomValue(cartAtom)
  const currency = getUserCurrency()

  const itemQuantity =
    cart.find((item) => item.checkoutItemId === checkoutItemId)?.quantity || 1

  const prices = sale ? sale.prices : data.byQuantity

  const discountText = useMemo(() => {
    if (prices.length === 1) return null

    const discountedPrices = prices.slice(1)

    if (data.volumeDiscountDisplayMode === VolumeDiscountDisplayMode.Exact) {
      return (
        <p>
          {discountedPrices.map((p, i) => {
            const quantity = i + 2
            return (
              <Fragment key={i}>
                <b>{quantity}</b> for{' '}
                <b>{formatPrice(p, currency, quantity, true)}</b>
                {i < discountedPrices.length - 1 && <>, </>}
              </Fragment>
            )
          })}{' '}
          across all {checkoutItemPluralName.toLocaleLowerCase()}
        </p>
      )
    }

    const firstDiscountPercentage = getDiscountPercentage(
      prices[1],
      prices[0],
      currency
    )
    const lastDiscountPercentage = getDiscountPercentage(
      prices[prices.length - 1],
      prices[0],
      currency
    )

    return (
      <div className={styles.percentageDiscount}>
        <p>
          <b>
            {firstDiscountPercentage}% - {lastDiscountPercentage}%
          </b>{' '}
          discounts when you buy <b>2</b> or more!
        </p>

        <details className={styles.priceTable}>
          <summary>Details</summary>
          <table>
            <thead>
              <tr>
                <th>Quantity</th>
                <th>Per Unit</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {discountedPrices.map((p, i) => {
                const quantity = i + 2
                const isLastPrice = i === discountedPrices.length - 1
                const shouldHighlight =
                  itemQuantity === quantity ||
                  (isLastPrice && itemQuantity > quantity)
                return (
                  <tr
                    key={i}
                    className={shouldHighlight ? styles.highlighted : ''}
                  >
                    <td>
                      {quantity}
                      {isLastPrice && '+'}
                    </td>
                    <td>${p[currency]}</td>
                    <td>{formatPrice(p, currency, quantity, true)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </details>
      </div>
    )
  }, [
    checkoutItemPluralName,
    currency,
    data.volumeDiscountDisplayMode,
    itemQuantity,
    prices,
  ])

  return (
    <section className={styles.priceSection}>
      <ProductPrice
        prices={data.byQuantity}
        currency={currency}
        quantity={1}
        checkoutItemQuantity={1}
        sale={sale}
        className={styles.mainPrice}
        addSaleText
      />
      {discountText}
    </section>
  )
}
