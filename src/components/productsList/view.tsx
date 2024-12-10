import { ListedProduct } from '@/models/product'

import styles from './styles.module.scss'

import { ProductCard } from './productCard'

type Props = {
  products: ListedProduct[]
  /** Use this when the list contains products from multiple categories and collections. */
  useFullName?: boolean
  emptyText?: string
}

export const ProductsList = ({ products, useFullName, emptyText }: Props) => {
  if (products.length === 0) {
    return <p>{emptyText || 'No products are available right now.'}</p>
  }

  return (
    <div className={styles.productsList}>
      {products.map((p) => (
        <ProductCard product={p} key={p._id} useFullName={useFullName} />
      ))}
    </div>
  )
}
