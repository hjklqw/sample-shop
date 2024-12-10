import { BottomFrameSvg } from './BottomFrameSvg'
import styles from './styles.module.scss'

type Props = {
  text: string
  icon?: JSX.Element
  description?: React.ReactNode
}

export const FullPageHeader = ({ text, icon, description }: Props) => (
  <header className={styles.header}>
    <h1>
      {icon}
      <span>{text}</span>
    </h1>
    {description && <span className={styles.description}>{description}</span>}
    <BottomFrameSvg className={styles.bottomFrame} />
  </header>
)
