'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { useAtom, useSetAtom } from 'jotai'

import { ROUTES } from '@/constants/routes'
import { OrderSuccessData } from '@/models/api/orderSuccessData'
import { fetchApi, postApi } from '@/utils/fetchApi'
import { useError } from '@/utils/hooks/useError'

import { Loader } from '@/components/loader'
import { FullPageHeader } from '@/components/pageHeaders/full'

import styles from './styles.module.scss'

import { ReturnHomeIcon } from './ReturnHomeIcon'
import { SuccessIcon } from './SuccessIcon'
import { cartAtom } from '@/state/atoms/cart'
import { sharedSlotsAtom } from '@/state/atoms/sharedSlots'

export const OrderPageContents = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [cart, setCart] = useAtom(cartAtom)
  const clearSharedSlots = useSetAtom(sharedSlotsAtom)
  const [orderId, setOrderId] = useState<string>()

  const [error, setError] = useState<string>()
  const errorComponent = useError(error)

  const isCallingApi = useRef<boolean>(false)

  // Clear the cart after saving it to DB when the order is successful
  useEffect(() => {
    if (isCallingApi.current) return

    const checkoutSessionId = searchParams.get('success')
    if (!checkoutSessionId) return

    isCallingApi.current = true

    fetchApi<OrderSuccessData>(
      ROUTES.api.getOrder(checkoutSessionId),
      'order data'
    )
      .then((res) => {
        if (res.error || !res.data) {
          setError(res.error || 'An unknown error occurred!')
        } else {
          const id = res.data.orderId
          setOrderId(id)
        }
      })
      .finally(() => {
        setCart([])
        clearSharedSlots({})
      })
  }, [cart, setCart, clearSharedSlots, searchParams])

  return (
    <>
      <FullPageHeader
        text="Success!"
        icon={
          <SuccessIcon style={{ marginRight: '0.5em', marginTop: '-0.1em' }} />
        }
        description="Your order has been completed!"
      />

      {errorComponent}

      <div className={styles.wrapper}>
        <div className={styles.orderId}>
          {orderId ? (
            <div className={styles.text}>
              <span>Order ID:</span>
              <span>{orderId}</span>
            </div>
          ) : (
            <div>
              <Loader />
              Please wait...
            </div>
          )}
        </div>

        <p>
          <b>Thank you for your order!</b> 🎊
        </p>

        <p>
          Confirmation details and a payment receipt have been sent to your
          email. If you find that your shipping details are incorrect, or change
          your mind about anything, please contact me ASAP
          {orderId && ' with the order ID above'}.
        </p>

        {orderId && (
          <button
            type="button"
            className={`primary ${styles.backToHomeButton}`}
            onClick={() => router.push(ROUTES.home)}
          >
            Return home
            <ReturnHomeIcon />
          </button>
        )}
      </div>
    </>
  )
}
