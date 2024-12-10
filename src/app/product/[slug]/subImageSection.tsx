'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import { ProductDocument } from '@/models/db/product'

import styles from './styles.module.scss'

import { DownIcon } from './icons/DownIcon'

type Props = {
  product: ProductDocument
  onSubImageClicked: (imageNumber: number) => void
  selectedImageNumber: number
}

// This isn't quite correct for smaller widths--using an estimated value for now
const singleImageHeight = 158
const rowDisplayBreakpoint = 600

export const SubImageSection = ({
  product,
  onSubImageClicked,
  selectedImageNumber,
}: Props) => {
  const listRef = useRef<HTMLDivElement>(null)
  const lastScrollValue = useRef<number>(-1)

  const [showUpIcon, setShowUpIcon] = useState<boolean>()
  const [showDownIcon, setShowDownIcon] = useState<boolean>()

  const showHideIcons = useCallback(
    (
      listScrollValue: number | undefined,
      listHeightOrWidth: number | undefined,
      singleImageHeightOrWidth: number
    ) => {
      const currScrollValue = listScrollValue || -1
      const threshold = singleImageHeightOrWidth / 2
      if (currScrollValue >= threshold) {
        setShowUpIcon(true)
      } else {
        setShowUpIcon(false)
      }
      const fullListHeightOrWidth =
        product.numSubImages * singleImageHeightOrWidth
      if (
        (currScrollValue === -1 &&
          (listHeightOrWidth || 0 < fullListHeightOrWidth)) ||
        currScrollValue <= lastScrollValue.current - threshold
      ) {
        setShowDownIcon(true)
      } else {
        setShowDownIcon(false)
      }
    },
    [product.numSubImages]
  )

  const onScroll = useCallback(() => {
    if (window.innerWidth <= rowDisplayBreakpoint) {
      showHideIcons(
        listRef.current?.scrollLeft,
        listRef.current?.clientWidth,
        108
      )
    } else {
      showHideIcons(
        listRef.current?.scrollTop,
        listRef.current?.clientHeight,
        singleImageHeight
      )
    }
  }, [showHideIcons])

  const onScrollEnd = useCallback(() => {
    if (window.innerWidth <= rowDisplayBreakpoint) {
      lastScrollValue.current = listRef.current?.scrollLeft || -1
    } else {
      lastScrollValue.current = listRef.current?.scrollTop || -1
    }
    setShowDownIcon(false)
    setShowUpIcon(true)
  }, [])

  useEffect(() => {
    listRef.current?.addEventListener('scrollend', onScrollEnd)
    return () => {
      listRef.current?.removeEventListener('scrollend', onScrollEnd)
    }
  }, [onScroll, onScrollEnd])

  return (
    <div className={styles.subImages}>
      <div
        className={`${styles.moveListIcon} ${styles.up} ${
          showUpIcon ? styles.show : ''
        }`}
      >
        <DownIcon />
      </div>

      <div
        className={styles.list}
        ref={listRef}
        onMouseEnter={onScroll}
        onScroll={onScroll}
      >
        {Array.from({ length: product.numSubImages + 1 }).map((_, i) => (
          <div className={styles.subImage} key={i}>
            <Image
              src={`/products/${product.slug}/${i}.png`}
              alt={product.checkoutItem.name}
              fill
              onClick={() => onSubImageClicked(i)}
              className={
                selectedImageNumber === i ? styles.selected : undefined
              }
              style={{ objectFit: 'contain' }}
            />
          </div>
        ))}
      </div>

      <div
        className={`${styles.moveListIcon} ${styles.down} ${
          showDownIcon ? styles.show : ''
        }`}
      >
        <DownIcon />
      </div>
    </div>
  )
}
