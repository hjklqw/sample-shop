import { StarIcon } from '@/components/loader/icons/starIcon'
import styles from './styles.module.scss'

type Props = {
  text: string
  icon?: React.ReactNode
  simple?: boolean
  id?: string
}

export const SectionHeader = ({ text, icon, simple, id }: Props) => (
  <h2 className={`${styles.header} ${simple ? styles.simple : ''}`} id={id}>
    {icon || <StarIcon />}
    <span>{text}</span>
  </h2>
)
