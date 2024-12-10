'use client'

import { useCallback, useMemo, useState } from 'react'

import { useAtom } from 'jotai'

import { useToast } from '@/utils/hooks/useToast'

import { AddToCartButton } from '@/components/addToCartButton'
import { AddedToCartIcon } from '@/components/addToCartButton/icons/AddedToCartIcon'
import { QuantityInput } from '@/components/quantityInput'

import styles from './styles.module.scss'

import { cartAtom } from '@/state/atoms/cart'

export type Props = {
  productId: string
  productStock: number | undefined
  checkoutItemId: string
}

/**
 * This is ONLY for items that have no variants. Otherwise, that functionality is in the VariantsSection.
 * This component is only for the case where there /is/ stock.
 */
export const AddToCartSectionContents = ({
  productId,
  productStock,
  checkoutItemId,
}: Props) => {
  const [cart, setCart] = useAtom(cartAtom)
  const { toast, showToast } = useToast({
    message: 'Removed from cart',
    icon: <AddedToCartIcon fontSize="1.2em" style={{ marginTop: '-0.1em' }} />,
  })

  const cartItem = useMemo(
    () => cart.find((item) => item.productId === productId),
    [cart, productId]
  )

  const defaultQuantity = useMemo(() => cartItem?.quantity || 1, [cartItem])
  const [quantity, setQuantity] = useState<number>(defaultQuantity)
  const maxQuantity = productStock || 50

  const shouldShowAddToCartButton = !cartItem || maxQuantity > 1

  const removeFromCart = useCallback(() => {
    setCart((items) => {
      const index = items.findIndex((item) => item.productId === productId)
      return [...items.slice(0, index), ...items.slice(index + 1)]
    })
    showToast()
  }, [setCart, showToast, productId])

  return (
    <section className={styles.addToCartSection}>
      <label>
        <span>Quantity:</span>
        <QuantityInput
          defaultQuantity={defaultQuantity}
          max={maxQuantity}
          onChange={(newQuantity) => setQuantity(newQuantity)}
        />
      </label>
      <div className={styles.buttonContainer}>
        {shouldShowAddToCartButton && (
          <AddToCartButton
            item={{ productId, quantity, checkoutItemId }}
            replaceQuantity
          />
        )}
        {cartItem && (
          <button
            type="button"
            className={`danger ${styles.removeFromCartButton}`}
            onClick={removeFromCart}
          >
            Remove from cart
          </button>
        )}
      </div>
      {toast}
    </section>
  )
}
