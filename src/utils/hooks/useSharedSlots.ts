import { useCallback, useEffect } from 'react'

import { useAtom } from 'jotai'

import { ClientSharedSlot } from '@/models/clientSharedSlots'
import { SharedSlotDocument } from '@/models/db/sharedSlot'

import { sharedSlotsAtom } from '@/state/atoms/sharedSlots'

export type GetSlotAmountFunc = (slotId: string) => number
export type GetSlotUsageFunc = (
  slotId: string,
  productId: string,
  variantId: string,
  optionName: string,
  primaryVariantValue?: string
) => number
export type SetSlotUsageFunc = (
  slotId: string,
  amount: number,
  productId: string,
  variantId: string,
  optionName: string,
  primaryVariantValue?: string
) => boolean

export function useSharedSlots(sharedSlotsFromDb: SharedSlotDocument[]) {
  const [sharedSlots, setSharedSlots] = useAtom(sharedSlotsAtom)

  // Update client slot amounts from DB
  useEffect(
    () => {
      setSharedSlots((existingClientSlots) =>
        sharedSlotsFromDb.reduce((res, dbSlot) => {
          const existingSlot = existingClientSlots[dbSlot._id]
          const slotValue = existingSlot
            ? {
                ...existingSlot,
                amount:
                  Object.keys(existingSlot.usage).length === 0
                    ? dbSlot.amount
                    : Math.min(existingSlot.amount, dbSlot.amount),
              }
            : { amount: dbSlot.amount, usage: {} }
          return {
            ...res,
            [dbSlot._id]: slotValue,
          }
        }, {})
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sharedSlotsFromDb]
  )

  /**
   * Retrieves client slot data with the given ID.
   * If a slot does not yet exist in client data, it will be added from API data.
   * An error is thrown if a slot with that ID can not be found in both client and API data.
   */
  const getSlot = useCallback(
    (slotId: string): ClientSharedSlot => {
      const slot = sharedSlots[slotId]

      if (slot === undefined) {
        const slotFromApi = sharedSlotsFromDb.find((s) => s._id === slotId)
        if (!slotFromApi)
          throw new Error(`A slot with ID ${slotId} doesn't exist!`)
        const newClientSlot: ClientSharedSlot = {
          amount: slotFromApi.amount,
          usage: {},
        }
        setSharedSlots({
          ...sharedSlots,
          [slotId]: newClientSlot,
        })
        return newClientSlot
      }

      return slot
    },
    [setSharedSlots, sharedSlots, sharedSlotsFromDb]
  )

  /** Get the remaining amount a slot has. */
  const getSlotAmount: GetSlotAmountFunc = useCallback(
    (slotId: string) => getSlot(slotId).amount,
    [getSlot]
  )

  /**
   * See how much a slot has been used for the specific product's variant option.
   * @param primaryVariantValue Give this for subvariants
   */
  const getSlotUsage: GetSlotUsageFunc = useCallback(
    (
      slotId: string,
      productId: string,
      variantId: string,
      optionName: string,
      primaryVariantValue?: string
    ) => {
      const slot = getSlot(slotId)
      const baseUsage = slot.usage[productId]
      if (baseUsage === undefined) return 0

      const actualUsage = primaryVariantValue
        ? baseUsage.subVariants?.[variantId]?.[optionName]?.[
            primaryVariantValue
          ]
        : baseUsage.primaryVariant?.[optionName]

      return actualUsage ?? 0
    },
    [getSlot]
  )

  /**
   * Subtracts the overall amount from the specified slot and updates the specific product variant option's amount.
   * @returns false when the slot cannot be used, and true if the usage succeeded
   * @param primaryVariantValue Give this for subvariants
   * @param recalculateTotalAmount ignore the passed-in amount and just recalculate it based off the usage.
   */
  const setSlotUsage: SetSlotUsageFunc = useCallback(
    (
      slotId: string,
      amount: number,
      productId: string,
      variantId: string,
      optionName: string,
      primaryVariantValue?: string
    ) => {
      const slot = sharedSlots[slotId]

      if (slot && slot.amount - amount < 0) {
        return false
      }

      const usageBasePath = slot.usage[productId]
      const oldUsage = primaryVariantValue
        ? usageBasePath?.subVariants?.[variantId]?.[optionName]?.[
            primaryVariantValue
          ]
        : usageBasePath?.primaryVariant?.[optionName]

      const newAmount = (() => {
        if (oldUsage !== undefined) {
          const diff = oldUsage - amount
          return slot.amount + diff
        }
        return slot.amount - amount
      })()

      setSharedSlots({
        ...sharedSlots,
        [slotId]: {
          ...sharedSlots[slotId],
          amount: newAmount,
          usage: {
            ...slot.usage,
            [productId]: {
              ...slot.usage[productId],
              primaryVariant: primaryVariantValue
                ? slot.usage[productId]?.primaryVariant
                : { [optionName]: amount },
              subVariants: primaryVariantValue
                ? {
                    [variantId]: {
                      ...slot.usage[productId]?.subVariants?.[variantId],
                      [optionName]: {
                        ...slot.usage[productId]?.subVariants?.[variantId]?.[
                          optionName
                        ],
                        [primaryVariantValue]: amount,
                      },
                    },
                  }
                : slot.usage[productId]?.subVariants,
            },
          },
        },
      })
      return true
    },
    [setSharedSlots, sharedSlots]
  )

  return { getSlotAmount, getSlotUsage, setSlotUsage }
}
