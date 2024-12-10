import { TempCartItem } from '@/models/cart'
import { Variant } from '@/models/db/product'
import { getVariantOption } from '@/utils/getVariantOption'
import { SetSlotUsageFunc } from '@/utils/hooks/useSharedSlots'

export function updateSharedSlots(
  tempCartItem: TempCartItem,
  primaryVariant: Variant,
  subVariants: Variant[] | undefined,
  setSlotUsage: SetSlotUsageFunc
) {
  const primaryOptionValue = tempCartItem.variation![primaryVariant.id]
  const { quantity: _, ...variations } = tempCartItem.variation!
  Object.entries(variations).forEach(([id, value]) => {
    const variant =
      id === primaryVariant.id
        ? primaryVariant
        : subVariants!.find((s) => s.id === id)!
    const option = getVariantOption(variant, value)
    if (option?.sharedSlotId) {
      setSlotUsage(
        option.sharedSlotId,
        tempCartItem.quantity,
        tempCartItem.productId,
        variant.id,
        option.name,
        variant.id !== primaryVariant.id ? primaryOptionValue : undefined
      )
    }
  })
}
