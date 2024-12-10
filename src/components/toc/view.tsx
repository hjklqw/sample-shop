import { useCallback, useEffect, useRef, useState } from 'react'

import { MenuIcon } from '../layouts/global/icons/menuIcon'

import { useClickOutside } from '@/utils/hooks/useClickOutside'

import styles from './styles.module.scss'

function getScrollRoot() {
  return document.getElementById('scrollRoot')
}

function getScrollTo() {
  return document.getElementById('scrollTo')
}

type Props = {
  items: {
    icon?: JSX.Element
    id: string
    name: string
    level?: number
    isLastItemInSubLevel?: boolean
  }[]
}

export const Toc = ({ items }: Props) => {
  const [isShowing, setShowing] = useState<boolean>(false)
  const [isShowingMobile, setShowingMobile] = useState<boolean>(false)

  const mobileButtonRef = useRef<HTMLButtonElement>(null)
  const tocRef = useClickOutside<HTMLDivElement>(true, (e) => {
    if (!mobileButtonRef?.current?.contains(e.target as Node)) {
      setShowingMobile(false)
    }
  })

  const onScroll = useCallback((e: Event) => {
    const container = e.target as HTMLBodyElement
    const scrollTo = getScrollTo()
    const extraThreshold = scrollTo
      ? scrollTo.clientTop + window.innerHeight
      : 0
    const threshold = window.innerHeight / 2 + extraThreshold
    setShowing(container.scrollTop > threshold)
  }, [])

  useEffect(() => {
    getScrollRoot()?.addEventListener('scroll', onScroll)
    return () => getScrollRoot()?.removeEventListener('scroll', onScroll)
  }, [onScroll])

  return (
    <div className={`${styles.container} ${isShowing ? '' : styles.hidden}`}>
      <div
        ref={tocRef}
        className={`${styles.toc} ${
          isShowingMobile ? styles.isShowingMobile : ''
        }`}
      >
        {items.map((item, i) => {
          const classnames = [
            styles.item,
            item.level ? styles[`level-${item.level}`] : '',
            item.isLastItemInSubLevel ? styles.lastItem : '',
          ].join(' ')

          return (
            <a key={i} className={classnames} href={`#${item.id}`}>
              {item.icon}
              {item.name}
            </a>
          )
        })}
      </div>
      <button
        ref={mobileButtonRef}
        className={styles.mobileMenuButton}
        title="Table of contents"
        onClick={() => setShowingMobile((v) => !v)}
      >
        <MenuIcon />
      </button>
    </div>
  )
}
