'use client'

import { Currency } from '@/models/currency'
import { PriceTier } from '@/models/db/checkoutItem'
import { ProductSaleData } from '@/models/db/product'
import { formatDate, formatPrice } from '@/utils/formatters'

import styles from './styles.module.scss'

type Props = {
  currency: Currency
  prices: PriceTier[]
  quantity: number
  checkoutItemQuantity: number
  sale: ProductSaleData | undefined
  className?: string
  addSaleText?: boolean
  specialVariantDiscount?: number
}

export const ProductPrice = ({
  currency,
  prices,
  quantity,
  checkoutItemQuantity,
  sale,
  className,
  addSaleText,
  specialVariantDiscount = 0,
}: Props) => {
  const hasSpecialVariantDiscount = specialVariantDiscount > 0
  const isUsingDiscountedPrice =
    hasSpecialVariantDiscount || (checkoutItemQuantity > 1 && prices.length > 1)

  const quantityIndex =
    isUsingDiscountedPrice || sale
      ? Math.min(
          checkoutItemQuantity - 1,
          sale ? sale.prices.length - 1 : prices.length - 1
        )
      : checkoutItemQuantity

  const discountedPriceTier = isUsingDiscountedPrice
    ? prices[quantityIndex]
    : undefined

  const salePriceTier = sale ? sale.prices[quantityIndex] : undefined

  return (
    <div
      className={`${styles.wrapper} ${
        addSaleText && salePriceTier ? styles.usingSaleText : ''
      } ${className || ''}`}
    >
      <span
        className={`${styles.basePrice} ${
          isUsingDiscountedPrice || sale ? styles.crossedOut : ''
        }`}
      >
        {formatPrice(prices[0], currency, quantity)} {currency}
      </span>
      {discountedPriceTier && (
        <span
          className={`${styles.discountedPrice} ${
            sale || hasSpecialVariantDiscount ? styles.crossedOut : ''
          }`}
        >
          {formatPrice(discountedPriceTier, currency, quantity)}
        </span>
      )}
      {hasSpecialVariantDiscount && (
        <span
          className={`${styles.salePrice} ${sale ? styles.crossedOut : ''}`}
        >
          {formatPrice(
            prices[quantityIndex][currency] * quantity - specialVariantDiscount,
            currency,
            1
          )}
        </span>
      )}
      {salePriceTier && (
        <span className={styles.salePrice}>
          {addSaleText && (
            <span className={styles.saleText}>
              SALE!
              <br />
              {sale!.until === undefined
                ? '(Lasts forever)'
                : `Until ${formatDate(sale!.until)}`}
            </span>
          )}
          {formatPrice(salePriceTier, currency, quantity)}
        </span>
      )}
    </div>
  )
}
