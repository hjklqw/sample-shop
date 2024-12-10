import { useEffect, useRef } from 'react'
import styles from './styles.module.scss'

type Props = {
  isOpen: boolean
  header: React.ReactNode
  body: React.ReactNode
  buttons: React.ReactNode
  isFullScreenOnMobile?: boolean
}

export const Modal = ({
  isOpen,
  header,
  body,
  buttons,
  isFullScreenOnMobile,
}: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.modal} ${
        isFullScreenOnMobile ? styles.mobileFullScreen : ''
      }`}
    >
      <header className={styles.header}>{header}</header>
      <section className={styles.body}>{body}</section>
      <section className={styles.buttons}>{buttons}</section>
    </dialog>
  )
}
