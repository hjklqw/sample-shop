'use client'

import { ROUTES } from '@/constants/routes'
import { Cart } from '@/models/cart'
import { Currency } from '@/models/currency'
import { getClientStripe } from '@/utils/getClientStripe'
import { getUserCountry } from '@/utils/userLocation'

import { SendIcon } from '@/components/layouts/global/icons/sendIcon'

import styles from './styles.module.scss'

getClientStripe()

type Props = {
  cart: Cart
  isFreeShippingAvailable: boolean
  currency: Currency
}

export const CartCheckoutButton = ({
  cart,
  isFreeShippingAvailable,
  currency,
}: Props) => {
  return (
    <>
      <form action={ROUTES.api.checkout} method="POST">
        {cart.map((product) => (
          <input
            key={product.productId}
            type="hidden"
            name="product"
            value={JSON.stringify(product)}
          />
        ))}
        <input
          type="hidden"
          name="isFreeShippingAvailable"
          value={isFreeShippingAvailable.toString()}
        />
        <input type="hidden" name="currency" value={currency} />
        <input
          type="hidden"
          name="country"
          value={JSON.stringify(getUserCountry())}
        />
        <button
          type="submit"
          role="link"
          className={`primary ${styles.checkoutButton}`}
        >
          Checkout
          <SendIcon />
        </button>
      </form>
    </>
  )
}
