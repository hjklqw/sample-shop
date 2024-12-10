import { SparklesIcon } from '@/components/layouts/global/icons/sparklesIcon'
import { Modal } from '@/components/modal'
import { CartItemVariation } from '@/models/cart'
import {
  GetSlotAmountFunc,
  SetSlotUsageFunc,
} from '@/utils/hooks/useSharedSlots'
import { SubComponentProps } from '../models'
import { ProductVariantSelector } from '../selector'

type Props = SubComponentProps & {
  cartItemVariation?: CartItemVariation
  onUpdateClicked: () => void
  onCancelClicked: () => void
  getSlotAmount: GetSlotAmountFunc
  setSlotUsage: SetSlotUsageFunc
}

export const UpdateVariationModal = ({
  cartItemVariation,
  onUpdateClicked,
  onCancelClicked,
  ...subComponentProps
}: Props) => {
  return (
    <Modal
      isOpen={cartItemVariation !== undefined}
      header="Update variation"
      body={<ProductVariantSelector {...subComponentProps} isUpdateMode />}
      buttons={
        <>
          <button type="button" onClick={onUpdateClicked} className="primary">
            <SparklesIcon />
            Update
          </button>
          <button type="button" onClick={onCancelClicked} className="secondary">
            Cancel
          </button>
        </>
      }
      isFullScreenOnMobile
    />
  )
}
