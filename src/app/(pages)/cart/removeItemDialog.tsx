import { EditIcon } from '@/components/cartIconButtons/icons/EditIcon'
import { RemoveIcon } from '@/components/cartIconButtons/icons/RemoveIcon'
import { Modal } from '@/components/modal'
import { RemovalWarningIcon } from './icons/RemovalWarningIcon'
import styles from './styles.module.scss'

type Props = {
  isOpen: boolean
  onEditVariationClicked: () => void
  onRemoveAllClicked: () => void
  onCancelClicked: () => void
}

export const RemoveItemDialog = ({
  isOpen,
  onRemoveAllClicked,
  onEditVariationClicked,
  onCancelClicked,
}: Props) => (
  <Modal
    isOpen={isOpen}
    header={
      <>
        <RemovalWarningIcon style={{ marginTop: -5 }} />
        Warning!
      </>
    }
    body={
      <>
        <p>
          <b>
            <i>All</i>
          </b>{' '}
          of your selections and customizations for this product will be
          removed!
        </p>
        <p>
          If you&apos;re looking to only remove some of them, use the
          <b className={styles.editText}> Edit Variations</b> button instead.
        </p>
      </>
    }
    buttons={
      <>
        <button onClick={onEditVariationClicked} className="primary">
          <EditIcon />
          Edit variations
        </button>
        <button className="danger" onClick={onRemoveAllClicked}>
          <RemoveIcon />
          Remove all
        </button>
        <button className="secondary" onClick={onCancelClicked}>
          Nevermind!
        </button>
      </>
    }
  />
)
