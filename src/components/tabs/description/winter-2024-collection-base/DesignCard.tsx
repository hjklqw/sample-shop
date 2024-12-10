import Image from 'next/image'

import styles from './styles.module.scss'

type Props = {
  imageName: string
  number: number
  title: string
  frontText: React.ReactNode
  backText: React.ReactNode
  /** Doesn't show the text 'front' and 'back' if this is true */
  isSpecial?: boolean
  /** Will be used for both width and height */
  imageSize?: number
  id?: string
}

export const DesignCard = ({
  imageName,
  number,
  title,
  frontText,
  backText,
  isSpecial,
  imageSize,
  id,
}: Props) => (
  <div className={styles.designCard} id={id || imageName}>
    <p className={styles.title}>
      <span className={styles.number}>{number}</span>
      {title}
    </p>
    <Image
      src={`/products/amazing-decoration-a/${imageName}.png`}
      alt={title}
      width={imageSize || 400}
      height={imageSize || 400}
      style={{ objectFit: 'contain' }}
    />
    <p className={styles.frontText}>
      {!isSpecial && <b className={styles.label}>Front:</b>}
      {frontText}
    </p>
    <p className={styles.backText}>
      {!isSpecial && <b className={styles.label}>Back:</b>}
      {backText}
    </p>
  </div>
)
