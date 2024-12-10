'use client'

import Image from 'next/image'
import Link from 'next/link'

import { ROUTES } from '@/constants/routes'
import { ListedProduct } from '@/models/product'
import { getUserCurrency } from '@/utils/userLocation'

import { ProductPrice } from '@/components/price'

import styles from './styles.module.scss'

type Props = {
  product: ListedProduct
  useFullName?: boolean
}

export const ProductCard = ({ product, useFullName }: Props) => {
  const currency = getUserCurrency()
  const stock = typeof product.stock === 'number' ? product.stock : 50

  return (
    <article className={styles.productCard}>
      <div className={styles.image}>
        <div className={styles.stickerContainer}>
          {product.sale && <div className={styles.saleSticker}>SALE!</div>}
          {stock === 0 && (
            <div className={styles.soldOutSticker}>SOLD OUT!</div>
          )}
          {stock > 0 && stock <= 3 && (
            <div className={styles.soldOutSticker}>
              {stock}
              <br />
              LEFT!
            </div>
          )}
        </div>
        <Link href={ROUTES.product(product.slug)}>
          <Image
            src={`/products/${product.slug}/0.png`}
            alt={product.name}
            fill
          />
        </Link>
      </div>

      <Link href={ROUTES.product(product.slug)}>
        <span className={styles.name}>
          {useFullName ? product.fullName : product.name}
        </span>
      </Link>

      {product.category && (
        <Link href={ROUTES.category(product.category.slug)}>
          <span className={styles.category}>{product.category.name}</span>
        </Link>
      )}

      {product.isPreorderItem && (
        <span className={styles.preorderLabel}>PREORDER</span>
      )}

      <ProductPrice
        prices={[product.price]}
        currency={currency}
        quantity={1}
        checkoutItemQuantity={1}
        sale={product.sale}
        className={styles.price}
      />
    </article>
  )
}
