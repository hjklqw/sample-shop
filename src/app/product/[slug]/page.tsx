import Link from 'next/link'
import { Metadata } from 'next/types'

import { ROUTES } from '@/constants/routes'
import { ProductData } from '@/models/api/productData'
import { DynamicRouteProps } from '@/models/page'
import { fetchApi } from '@/utils/fetchApi'
import { useApiError } from '@/utils/hooks/useError'

import { ProductVariationsSection } from '@/components/productVariations'
import { ProductTabs } from '@/components/tabs'

import styles from './styles.module.scss'

import { ProductPreorderBanner } from './banner'
import { ProductHeader } from './header'

export default async function SingleProductPage({ params }: DynamicRouteProps) {
  const { slug } = await params
  const res = await fetchApi<ProductData>(ROUTES.api.product(slug), 'product', {
    next: { revalidate: 10 },
  })

  const error = useApiError(res, true)
  if (error) return error

  const product = res.data!.product

  if (product === null) {
    return <p>Product not found</p>
  }

  return (
    <div className={styles.wrapper}>
      {product.set && (
        <div className={styles.partOfCollectionText}>
          Part of the{' '}
          <Link href={ROUTES.collection(product.set.slug)}>
            {product.set.name}
          </Link>{' '}
          collection
        </div>
      )}

      <ProductHeader product={product} />

      {product.isPreorderItem && <ProductPreorderBanner product={product} />}

      <section className={styles.main} id="scrollTo">
        <ProductTabs
          className={styles.tabsSection}
          slug={product.slug}
          isPreorderItem={product.isPreorderItem}
          isFreeShippingAvailable={
            !!product.checkoutItem.isFreeShippingAvailable
          }
          isLocalPickupAvailable={!!product.isLocalPickupAvailable}
          price={product.checkoutItem.price.byQuantity[0]}
          timeline={product.timeline}
          faq={product.faq}
        />

        {product.primaryVariant && !product.isInactive && (
          <ProductVariationsSection
            className={styles.variantSection}
            productId={product._id}
            checkoutItemId={product.checkoutItem._id}
            primaryVariant={product.primaryVariant}
            subVariants={product.subVariants}
            sharedSlotsFromApi={res.data!.sharedSlots}
            productName={product.checkoutItem.name}
            checkoutItemPluralName={product.checkoutItem.namePlural}
            stock={product.stock}
          />
        )}
      </section>
    </div>
  )
}

export async function generateMetadata({
  params,
}: DynamicRouteProps): Promise<Metadata> {
  const { slug } = await params
  const res = await fetchApi<ProductData>(ROUTES.api.product(slug), 'product', {
    next: { revalidate: 3600 },
  })

  if (res.error) {
    return {
      title: 'Error',
    }
  }

  if (res.data?.product === undefined) {
    return {
      title: 'Not found',
    }
  }

  const { product } = res.data!

  const titleParts = [
    product.isPreorderItem ? '[PREORDER]' : undefined,
    product.fullName,
  ].filter((part) => part !== undefined)

  return {
    title: titleParts.join(' '),
    openGraph: {
      images: [`/products/${slug}/0.png`],
    },
  }
}
