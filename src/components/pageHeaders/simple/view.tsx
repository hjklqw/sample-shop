import styles from './styles.module.scss'

type Props = {
  text: string
}

export const SimplePageHeader = ({ text }: Props) => (
  <h1 className={styles.header}>{text}</h1>
)
