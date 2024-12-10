import Image from 'next/image'
import Link from 'next/link'

import { ROUTES } from '@/constants/routes'
import { HomepageData } from '@/models/api/homepageData'
import { fetchApi } from '@/utils/fetchApi'
import { useApiError } from '@/utils/hooks/useError'

import { CollectionsList } from '@/components/collectionsList'
import { SectionHeader } from '@/components/pageHeaders/section'
import { ProductsList } from '@/components/productsList'

import styles from './styles.module.scss'

import { FeaturedSection } from './featured'

export async function HomePage() {
  const res = await fetchApi<HomepageData>(ROUTES.api.homepage, 'homepage', {
    next: { revalidate: 10 },
  })

  const error = useApiError(res, true)
  if (error) return <main className={styles.main}>{error}</main>

  const data = res.data!

  return (
    <main className={styles.main}>
      <FeaturedSection />

      <section className={styles.section}>
        <SectionHeader text="New Arrivals" simple />
        <ProductsList products={data.newArrivals} useFullName />
      </section>

      <section className={styles.collectionSection}>
        <section className={styles.section}>
          <SectionHeader text="Collections" simple />
          <CollectionsList collections={data.collections} isInvertedColour />
        </section>
      </section>

      <section className={styles.section}>
        <SectionHeader text="Categories" simple />
        <div className={styles.categoryList}>
          {data.categories.map((category) => (
            <article key={category.slug} className={styles.categoryCard}>
              <div className={styles.image}>
                <Link href={ROUTES.category(category.slug)}>
                  <Image
                    src={`/categories/${category.slug}.png`}
                    alt={category.name}
                    fill
                  />
                </Link>
              </div>
              <Link href={ROUTES.category(category.slug)}>
                <span className={styles.name}>{category.name}</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
