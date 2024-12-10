import Image from 'next/image'
import Link from 'next/link'

import { ROUTES } from '@/constants/routes'

import styles from './styles.module.scss'

type Props = {
  currentItemName: string
  cardItemSlug: string
  cardItemName: string
}

export const CollectionSectionCard = ({
  currentItemName,
  cardItemSlug,
  cardItemName,
}: Props) => {
  const isCurrent = currentItemName === cardItemSlug
  const size = isCurrent ? 300 : 200
  return (
    <div className={isCurrent ? styles.currentItem : undefined}>
      <Image
        src={`/products/amazing-decoration-${cardItemSlug}/transparent.png`}
        alt={cardItemName}
        width={size}
        height={size}
        style={{ objectFit: 'contain' }}
      />
      <span>
        {cardItemName}s
        {!isCurrent && (
          <Link href={ROUTES.product(`amazing-decoration-${cardItemSlug}`)}>
            Take a look →
          </Link>
        )}
      </span>
    </div>
  )
}
