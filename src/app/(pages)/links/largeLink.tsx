import Link from 'next/link'

import styles from './styles.module.scss'

type Props = {
  href: string
  label: string
  icon: React.ReactNode
  description: string
  footnote?: React.ReactNode
  compact?: boolean
}

export const LargeLink = (props: Props) => (
  <Link
    href={props.href}
    target="_blank"
    className={`${styles.largeLink} ${props.compact ? styles.compact : ''}`}
  >
    <article>
      <h2>
        {props.icon}
        {props.label}
      </h2>
      <p>{props.description}</p>
      {props.footnote && (
        <span className={styles.footnote}>{props.footnote}</span>
      )}
    </article>
  </Link>
)
