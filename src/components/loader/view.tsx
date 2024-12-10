import { StarIcon } from './icons/starIcon'
import styles from './styles.module.scss'

type Props = {
  className?: string
}

export const Loader = ({ className }: Props) => (
  <StarIcon className={`${styles.loader} ${className}`} />
)
