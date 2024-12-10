import styles from './styles.module.scss'

export type Props = {
  icon?: JSX.Element
  message: React.ReactNode
}

/** Use with the `useToast` hook */
export const Toast = ({ icon, message }: Props) => (
  <div className={styles.toast}>
    {icon}
    {message}
  </div>
)
