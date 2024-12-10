import { useCallback, useEffect, useState } from 'react'

import { DownIcon } from '@/app/product/[slug]/icons/DownIcon'
import styles from './styles.module.scss'

function getScrollRoot() {
  return document.getElementById('scrollRoot')
}

function getScrollTo() {
  return document.getElementById('scrollTo')
}

function scrollBackToTop() {
  const scrollTo = getScrollTo()
  if (scrollTo) {
    scrollTo.scrollIntoView()
  } else {
    getScrollRoot()?.scrollTo({ top: 0 })
  }
}

export const BackToTopButton = () => {
  const [isShowing, setShowing] = useState<boolean>(false)

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
      <button title="Back to top" onClick={scrollBackToTop}>
        <DownIcon />
      </button>
    </div>
  )
}
