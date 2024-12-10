import { ProductDocument } from '@/models/db/product'
import { isOnSale } from '@/utils/sale'

import styles from './styles.module.scss'

import { AddToCartSection } from './addToCartSection'
import { ImageSection } from './imageSection'
import { ProductPagePriceSection } from './price'
import { getCollectionNamePrefix } from './utils'

type Props = {
  product: ProductDocument
}

export const ProductHeader = ({ product }: Props) => (
  <header className={styles.header}>
    <ImageSection product={product} />

    <section className={styles.dataSection}>
      <div>
        <h1 className={styles.productName}>
          {product.set && (
            <span className={styles.collectionPrefix}>
              {getCollectionNamePrefix(product)}
            </span>
          )}
          {product.isPreorderItem && (
            <span className={styles.preorderLabel}>PREORDER</span>
          )}
          {product.alwaysUseFullName
            ? product.fullName
            : product.checkoutItem.name}
        </h1>

        <ProductPagePriceSection
          data={product.checkoutItem.price}
          sale={isOnSale(product.sale) ? product.sale : undefined}
          checkoutItemId={product.checkoutItem._id}
          checkoutItemPluralName={product.checkoutItem.namePlural}
        />

        {product.metadata && (
          <ul className={styles.metadata}>
            {product.metadata.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        )}
      </div>

      {product.primaryVariant === undefined && !product.isInactive ? (
        <AddToCartSection
          productId={product._id}
          productStock={product.stock as number}
          checkoutItemId={product.checkoutItem._id}
        />
      ) : (
        <p className={styles.nudgingText}>
          {product.isInactive ? (
            <>
              Check out the details below!
              <br />
              (Note that this product can no longer be purchased; if you&apos;re
              still interested in it, feel free to drop me a message via email
              or Twitter.)
            </>
          ) : (
            'Check out the details and choose your designs below!'
          )}
        </p>
      )}
    </section>
  </header>
)
