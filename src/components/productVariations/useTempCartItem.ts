import { useCallback, useMemo, useState } from 'react'

import { useDebouncedCallback } from 'use-debounce'

import { CartItemVariation, TempCartItem } from '@/models/cart'

import { KvpOrString } from './models'

// For security purposes, the primary variant will /only/ hold the name of the variant and not any variant data.
// This data should be retrieved from DB when necessary.
export function useTempCartItem(
  productId: string,
  checkoutItemId: string,
  defaultVariationData: CartItemVariation,
  defaultQuantity?: number
) {
  const emptyTempCartItem: Required<TempCartItem> = useMemo(
    () => ({
      productId,
      checkoutItemId,
      quantity: defaultQuantity ?? 1,
      variation: defaultVariationData,
    }),
    [productId, defaultVariationData, defaultQuantity, checkoutItemId]
  )

  const [tempCartItem, setTempCartItem] =
    useState<Required<TempCartItem>>(emptyTempCartItem)

  const updateVariation = useDebouncedCallback(
    (variantId: string, kvp: KvpOrString) => {
      setTempCartItem((item) => ({
        ...item,
        variation: {
          ...item.variation,
          [variantId]:
            typeof kvp === 'string'
              ? kvp
              : {
                  ...item.variation[variantId],
                  ...kvp,
                },
        },
      }))
    },
    100
  )

  const replaceVariation = useCallback(
    (variantId: string, newValue: any | undefined) => {
      setTempCartItem((item) => {
        const { [variantId]: _, ...otherVariations } = item.variation
        return {
          ...item,
          variation:
            newValue === undefined
              ? otherVariations
              : {
                  ...item.variation,
                  [variantId]: newValue,
                },
        }
      })
    },
    []
  )

  const updateQuantity = useCallback((amount: number) => {
    setTempCartItem((item) => ({ ...item, quantity: amount }))
  }, [])

  const resetTempCartItem = useCallback(() => {
    setTempCartItem(emptyTempCartItem)
  }, [emptyTempCartItem])

  return {
    tempCartItem,
    updateVariation,
    replaceVariation,
    updateQuantity,
    resetTempCartItem,
  }
}
