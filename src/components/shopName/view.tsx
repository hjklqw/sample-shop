import Image from 'next/image'

import styles from './styles.module.scss'

type Props = {
  className?: string
}

export const ShopName = ({ className }: Props) => (
  <div className={`${styles.shopName} ${className || ''}`}>
    <span>Shop</span>
    <span>
      Sample
      <span className={styles.exclaimationMark}>!</span>
    </span>
  </div>
)
