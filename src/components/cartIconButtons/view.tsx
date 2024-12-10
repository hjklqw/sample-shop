import { ReactNode } from 'react'

import styles from './styles.module.scss'

import { EditIcon } from './icons/EditIcon'
import { RemoveIcon } from './icons/RemoveIcon'

type Props = {
  onEditClicked: () => void
  onRemoveClicked: () => void
  editAltText: string
  hideEditButton?: boolean
}

/** Edit and Remove action buttons for cart. This is for styling consistency only and does not contain any functionality. */
export const CartIconButtons = ({
  onEditClicked,
  onRemoveClicked,
  editAltText,
  hideEditButton,
}: Props) => (
  <div className={styles.wrapper}>
    {!hideEditButton && (
      <button
        type="button"
        className={`${styles.cartItemActionButton} circular`}
        title={editAltText}
        onClick={onEditClicked}
      >
        <EditIcon />
      </button>
    )}
    <button
      type="button"
      className={`${styles.cartItemActionButton} circular`}
      title="Remove item"
      onClick={onRemoveClicked}
    >
      <RemoveIcon />
    </button>
  </div>
)
