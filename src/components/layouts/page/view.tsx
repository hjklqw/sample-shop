import styles from './styles.module.scss'

type Props = {
  children: React.ReactNode
}

export const PageLayout = ({ children }: Props) => {
  return (
    <div className={styles.pageLayout}>
      <div className={styles.contents}>{children}</div>
    </div>
  )
}
