'use client'

import { VariantType } from '@/models/db/product'
import { SharedSlotDocument } from '@/models/db/sharedSlot'
import { useSharedSlots } from '@/utils/hooks/useSharedSlots'
import { getUserCurrency } from '@/utils/userLocation'

import { ProductVariationCart } from './cart'
import { SharedComponentProps } from './models'
import { ProductVariantSelector } from './selector'
import { useTempCartItem } from './useTempCartItem'

type Props = Omit<SharedComponentProps, 'currency'> & {
  productId: string
  checkoutItemId: string
  className?: string
  sharedSlotsFromApi: SharedSlotDocument[]
}

export const ProductVariationsSection = ({
  productId,
  className,
  sharedSlotsFromApi,
  ...sharedProps
}: Props) => {
  const subVariantValues = sharedProps.subVariants?.reduce((res, s) => {
    if (s.type !== VariantType.Form) {
      return { ...res, [s.id]: s.options[0] }
    }
    return res
  }, {})

  const tempCartItemProps = useTempCartItem(
    productId,
    sharedProps.checkoutItemId,
    {
      [sharedProps.primaryVariant.id]: undefined,
      ...subVariantValues,
    }
  )
  const currency = getUserCurrency()

  const { getSlotAmount, setSlotUsage } = useSharedSlots(sharedSlotsFromApi)

  return (
    <section className={className}>
      <ProductVariantSelector
        {...sharedProps}
        {...tempCartItemProps}
        getSlotAmount={getSlotAmount}
        setSlotUsage={setSlotUsage}
        currency={currency}
      />
      <ProductVariationCart
        {...sharedProps}
        productId={productId}
        getSlotAmount={getSlotAmount}
        setSlotUsage={setSlotUsage}
        currency={currency}
      />
    </section>
  )
}
