import { ProductDocument, ProductTimelineEventType } from '@/models/db/product'

import styles from './styles.module.scss'

import { CustomizationIcon } from './icons/CustomizationIcon'
import { ExclusiveIcon } from './icons/ExclusiveIcon'
import { SafeAndFlexibleIcon } from './icons/SafeAndFlexibleIcon'

type Props = {
  product: ProductDocument
}

export const ProductPreorderBanner = ({ product }: Props) => {
  const timelineEndDate = (() => {
    const endEntry = product.timeline!.find(
      (entry) => entry.eventType === ProductTimelineEventType.END
    )!
    return endEntry.dateDisplay
  })()

  return (
    <section className={styles.banner}>
      <div>
        <span>
          <SafeAndFlexibleIcon />
          Safe and flexible
        </span>
        <span>
          This is a preorder item ending{' '}
          <span className={styles.preorderEndDate}>{timelineEndDate}</span>.
        </span>{' '}
        You can edit or cancel at any time before that!
      </div>
      <div>
        <span>
          <CustomizationIcon />
          <span>
            Made for <i>you</i>
          </span>
        </span>
        <span>
          Want this bigger or smaller? Without text?{' '}
          {product.checkoutItem.name.includes('Keychain') &&
            'With a different type of clasp? '}
          Just let me know, and I&apos;ll make it happen!
        </span>
      </div>
      <div>
        <span>
          <ExclusiveIcon />
          Exclusive
        </span>
        <span>
          These items might not be available for sale afterwards, so grab them
          now! Customizations are only available during preorder.
        </span>
      </div>
    </section>
  )
}
