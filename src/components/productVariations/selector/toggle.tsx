import { ButtonList, ButtonListProps } from './buttonList'
import styles from './styles.module.scss'

export const Toggle = ({ className, ...props }: ButtonListProps) => {
  return (
    <ButtonList {...props} className={`${styles.toggle} ${className || ''}`} />
  )
}
