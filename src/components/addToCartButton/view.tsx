'use client'

import { useCallback, useMemo } from 'react'

import { useAtom } from 'jotai'

import { TempCartItem } from '@/models/cart'
import { useToast } from '@/utils/hooks/useToast'

import styles from './styles.module.scss'

import { AddedToCartIcon } from './icons/AddedToCartIcon'
import { ShoppingCartIcon } from './icons/ShoppingCartIcon'
import { cartAtom } from '@/state/atoms/cart'

type Props = {
  item: TempCartItem
  onAddCompleted?: () => void
  /** Replace the item's quantity instead of adding to what's already in cart */
  replaceQuantity?: boolean
}

/**
 * When a variant is given, the quantity passed in will be:
 *  1. Added to the existing product (if applicable), and
 *  2. Copied over into the variant data itself
 */
export const AddToCartButton = ({
  item: newItem,
  onAddCompleted,
  replaceQuantity,
}: Props) => {
  const [cart, setCart] = useAtom(cartAtom)
  const { toast, showToast } = useToast({
    message: 'Added to cart!',
    icon: <AddedToCartIcon fontSize="1.2em" style={{ marginTop: '-0.1em' }} />,
  })

  const amountToAdd = newItem.quantity || 1

  const existingItemIndex = useMemo(
    () =>
      cart.findIndex((cartItem) => cartItem.productId === newItem.productId),
    [cart, newItem.productId]
  )

  const onAddToCartClicked = useCallback(() => {
    const variation = newItem.variation
      ? { ...newItem.variation, quantity: newItem.quantity }
      : undefined

    const isNewItem = existingItemIndex === -1

    setCart((v) => {
      if (isNewItem) {
        return [
          ...v,
          {
            productId: newItem.productId,
            checkoutItemId: newItem.checkoutItemId,
            quantity: amountToAdd,
            variations: variation ? [variation] : undefined,
          },
        ]
      }

      const existingItem = v[existingItemIndex]
      return [
        ...v.slice(0, existingItemIndex),
        {
          ...existingItem,
          quantity: replaceQuantity
            ? amountToAdd
            : existingItem.quantity + amountToAdd,
          variations: variation
            ? [...(existingItem.variations || []), variation]
            : existingItem.variations,
        },
        ...v.slice(existingItemIndex + 1),
      ]
    })

    showToast(isNewItem ? undefined : 'Updated quantity!')
    onAddCompleted?.()
  }, [
    setCart,
    existingItemIndex,
    amountToAdd,
    newItem,
    showToast,
    onAddCompleted,
    replaceQuantity,
  ])

  // Disable button when there are variations that need choosing.
  // Items without variations are always enabled.
  const isDisabled = useMemo(() => {
    const variations = Object.values(newItem.variation || {})
    if (variations.length === 0) return false

    return variations.some((v) => v === undefined || v === null)
  }, [newItem])

  return (
    <>
      <button
        className={`${styles.button} animated`}
        onClick={onAddToCartClicked}
        disabled={isDisabled}
      >
        <ShoppingCartIcon />
        {newItem.variation
          ? 'Add variation to cart'
          : existingItemIndex === -1
            ? 'Add to cart'
            : 'Update cart'}
      </button>
      {toast}
    </>
  )
}
