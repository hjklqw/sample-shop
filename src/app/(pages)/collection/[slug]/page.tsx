import { Metadata } from 'next'

import { CollectionsIcon } from '../../collections/CollectionsIcon'

import { ROUTES } from '@/constants/routes'
import { SetDocument } from '@/models/db/set'
import { DynamicRouteProps } from '@/models/page'
import { ListedProduct } from '@/models/product'
import { fetchApi } from '@/utils/fetchApi'
import { useApiError } from '@/utils/hooks/useError'

import { FullPageHeader } from '@/components/pageHeaders/full'
import { ProductsList } from '@/components/productsList'

type RetVal = Omit<SetDocument, 'products'> & {
  products: ListedProduct[]
}

export default async function CollectionPage({ params }: DynamicRouteProps) {
  const { slug } = await params

  const res = await fetchApi<RetVal>(
    ROUTES.api.collection(slug),
    'collection',
    { next: { revalidate: 60 } }
  )

  const error = useApiError(res, true)
  if (error) return error

  const collection = res.data!

  return (
    <>
      <FullPageHeader
        icon={
          <CollectionsIcon
            style={{
              fontSize: '0.8em',
              marginRight: '1.2em',
              strokeWidth: 1.2,
            }}
          />
        }
        text={collection.name}
        description={collection.description}
      />
      <ProductsList products={collection.products} />
    </>
  )
}

export async function generateMetadata({
  params,
}: DynamicRouteProps): Promise<Metadata> {
  const { slug } = await params

  const res = await fetchApi<RetVal>(
    ROUTES.api.collection(slug),
    'collection',
    { next: { revalidate: 60 } }
  )

  if (res.error || res.data === undefined) {
    return {
      title: 'Not found',
    }
  }

  const collection = res.data!

  return {
    title: collection.name,
  }
}
