import { Metadata } from 'next'

import { CollectionsIcon } from '../../collections/CollectionsIcon'

import { ROUTES } from '@/constants/routes'
import { CategoryData } from '@/models/api/categoryData'
import { DynamicRouteProps } from '@/models/page'
import { fetchApi } from '@/utils/fetchApi'
import { useApiError } from '@/utils/hooks/useError'

import { FullPageHeader } from '@/components/pageHeaders/full'
import { ProductsList } from '@/components/productsList'

export default async function CategoryPage({ params }: DynamicRouteProps) {
  const { slug } = await params

  const res = await fetchApi<CategoryData>(
    ROUTES.api.category(slug),
    'category',
    { next: { revalidate: 60 } }
  )

  const error = useApiError(res, true)
  if (error) return error

  const category = res.data!

  return (
    <>
      <FullPageHeader
        icon={
          <CollectionsIcon
            style={{
              fontSize: '0.8em',
              marginRight: '0.7em',
              strokeWidth: 1.2,
            }}
          />
        }
        text={category.name}
        description={category.description}
      />
      <ProductsList products={category.products} useFullName />
    </>
  )
}

export async function generateMetadata({
  params,
}: DynamicRouteProps): Promise<Metadata> {
  const { slug } = await params

  const res = await fetchApi<CategoryData>(
    ROUTES.api.category(slug),
    'category',
    { next: { revalidate: 60 } }
  )

  if (res.error || res.data === undefined) {
    return {
      title: 'Not found',
    }
  }

  const category = res.data!

  return {
    title: category.name,
  }
}
