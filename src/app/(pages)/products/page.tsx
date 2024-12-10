import { Metadata } from 'next'

import { ROUTES } from '@/constants/routes'
import { ListedProduct } from '@/models/product'
import { fetchApi } from '@/utils/fetchApi'
import { useApiError } from '@/utils/hooks/useError'

import { FullPageHeader } from '@/components/pageHeaders/full'
import { ProductsList } from '@/components/productsList'

import { ProductsIcon } from './ProductsIcon'

export const metadata: Metadata = {
  title: 'Products',
  description: 'A list of all the products on sale',
}

export default async function ProductsPage() {
  const res = await fetchApi<ListedProduct[]>(
    ROUTES.api.productsList(),
    'products',
    { next: { revalidate: 60 } }
  )

  const error = useApiError(res)

  return (
    <>
      <FullPageHeader
        icon={
          <ProductsIcon style={{ marginRight: '0.55em', fontSize: '0.95em' }} />
        }
        text="All Products"
        description="(There's more than this, but will add them as time goes on!)"
      />
      {error || <ProductsList products={res.data!} useFullName />}
    </>
  )
}
