'use client'

import Image from 'next/image'
import { CSSProperties, useState } from 'react'

import { buildClassName } from '@/utils/classNames'
import styles from './styles.module.scss'

type Props = {
  src: string
  alt: string
  fullWidth: number
  fullHeight: number
  width?: number | `${number}`
  height?: number | `${number}`
  fill?: boolean
  style?: CSSProperties
  className?: string
}

export const ZoomableImage = (props: Props) => {
  const [isZoomed, setZoomed] = useState<boolean>(false)

  const classNames = buildClassName(styles.image, props.className)

  return (
    <>
      <Image
        src={props.src}
        alt={props.alt}
        width={props.width}
        height={props.height}
        fill={props.fill}
        style={props.style}
        onClick={() => setZoomed(true)}
        className={classNames}
      />
      {isZoomed && (
        <div
          className={styles.zoomedContainer}
          onClick={() => setZoomed(false)}
        >
          <div className={styles.backdrop} />
          <Image
            src={props.src}
            alt={props.alt}
            width={props.fullWidth}
            height={props.fullHeight}
            className={classNames}
          />
        </div>
      )}
    </>
  )
}
