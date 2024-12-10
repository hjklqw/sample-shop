import { CollectionCard } from './collectionCard'

import { ListedCollection } from '@/models/collection'
import styles from './styles.module.scss'

type Props = {
  collections: ListedCollection[]
  isInvertedColour?: boolean
}

export const CollectionsList = ({ collections, isInvertedColour }: Props) => (
  <div className={styles.collectionsList}>
    {collections.map((c) => (
      <CollectionCard
        key={c._id}
        collection={c}
        isInvertedColour={isInvertedColour}
      />
    ))}
  </div>
)
