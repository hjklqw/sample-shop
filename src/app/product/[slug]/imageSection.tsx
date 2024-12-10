'use client'

import { useState } from 'react'

import { ProductDocument } from '@/models/db/product'

import { ZoomableImage } from '@/components/zoomableImage/view'

import styles from './styles.module.scss'

import { SubImageSection } from './subImageSection'

type Props = {
  product: ProductDocument
}

export const ImageSection = ({ product }: Props) => {
  const [currImageNumber, setCurrImageNumber] = useState<number>(0)

  return (
    <section className={styles.imageSection}>
      <SubImageSection
        product={product}
        onSubImageClicked={(imageNumber) => setCurrImageNumber(imageNumber)}
        selectedImageNumber={currImageNumber}
      />

      <div className={styles.mainImage}>
        <ZoomableImage
          src={`/products/${product.slug}/${currImageNumber}.png`}
          alt={
            product.alwaysUseFullName
              ? product.fullName
              : product.checkoutItem.name
          }
          fill
          fullWidth={800}
          fullHeight={800}
        />
      </div>
    </section>
  )
}
