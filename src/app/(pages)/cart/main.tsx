'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useAtom } from 'jotai'

import { freeShippingMinTotal } from '@/constants/stripeShippingOptions'
import { formatPrice } from '@/utils/formatters'
import { useError } from '@/utils/hooks/useError'
import { getUserCurrency } from '@/utils/userLocation'

import { Loader } from '@/components/loader'

import styles from './styles.module.scss'

import { CartCheckoutButton } from './checkoutButton'
import { CartItemsList } from './itemsList'
import { CartProduct } from './models'
import { getProductsForCart } from './utils'
import { cartAtom } from '@/state/atoms/cart'

type Props = {
  error?: string
}

export const CartPageMain = ({ error: checkoutError }: Props) => {
  const [cart, setCart] = useAtom(cartAtom)
  const currency = getUserCurrency()

  const [cartItems, setCartItems] = useState<CartProduct[]>([])
  const [isLoading, setLoading] = useState<boolean>(true)
  const isFetching = useRef<boolean>(false)
  const [productFetchError, setError] = useState<string>()

  const searchParams = useSearchParams()
  const error = useError(
    productFetchError || checkoutError || searchParams.get('error')
  )

  useEffect(() => {
    if (cart.length > 0) {
      if (isFetching.current) return
      isFetching.current = true
      getProductsForCart(cart, currency, setCartItems, setError).finally(() => {
        isFetching.current = false
        setLoading(false)
      })
    } else {
      setCartItems([])
      setLoading(false)
    }
  }, [cart, currency])

  const total = useMemo(
    () => cartItems.reduce((res, p) => (res += p.baseTotal + p.addonsTotal), 0),
    [cartItems]
  )

  const isFreeShippingAvailable = useMemo(
    () => cartItems.every((p) => p.isFreeShippingAvailable),
    [cartItems]
  )

  const showFreeShippingMessage = useMemo(() => {
    if (isFreeShippingAvailable) return total < freeShippingMinTotal[currency]
    return false
  }, [isFreeShippingAvailable, total, currency])

  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loader}>
          <Loader />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.pageWrapper} ${styles.loading}`}>
      {error}

      <CartItemsList
        products={cartItems}
        currency={currency}
        setCart={setCart}
      />

      {cartItems.length > 0 && (
        <section className={styles.checkoutSection}>
          <p className={styles.totalText}>
            Total: {formatPrice(total, currency)}
          </p>
          {showFreeShippingMessage && (
            <p>
              Please note that to qualify for free shipping on this order, the
              total must be at least{' '}
              {formatPrice(freeShippingMinTotal, currency, 1, true)}.
            </p>
          )}
          <p>Taxes and shipping will be calculated at checkout.</p>

          <CartCheckoutButton
            cart={cart}
            isFreeShippingAvailable={
              isFreeShippingAvailable && total >= freeShippingMinTotal[currency]
            }
            currency={currency}
          />
        </section>
      )}
    </div>
  )
}
