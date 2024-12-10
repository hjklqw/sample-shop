import { ROUTES } from '@/constants/routes'
import { ListedCollection } from '@/models/collection'
import { buildClassName } from '@/utils/classNames'
import Image from 'next/image'
import Link from 'next/link'
import styles from './styles.module.scss'

type Props = {
  collection: ListedCollection
  isInvertedColour?: boolean
}

export const CollectionCard = ({ collection, isInvertedColour }: Props) => {
  const image = (
    <Image
      src={
        collection.isComingSoon
          ? '/coming-soon.png'
          : `/collections/${collection.slug}.png`
      }
      alt={collection.name}
      fill
    />
  )
  const name = <span className={styles.name}>{collection.name}</span>

  return (
    <article
      className={buildClassName(
        styles.collectionCard,
        isInvertedColour ? styles.inverted : undefined
      )}
    >
      <div className={styles.image}>
        {collection.isComingSoon ? (
          image
        ) : (
          <Link href={ROUTES.collection(collection.slug)}>{image}</Link>
        )}
      </div>

      {collection.isComingSoon ? (
        <div>
          {name}
          <span className={styles.comingSoonText}>Coming soon!</span>
        </div>
      ) : (
        <>
          <Link href={ROUTES.collection(collection.slug)}>{name}</Link>
          <span className={styles.numProducts}>
            {collection.numProducts} product{collection.numProducts > 1 && 's'}
          </span>
        </>
      )}
    </article>
  )
}
