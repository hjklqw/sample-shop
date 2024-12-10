import { Metadata } from 'next'

import { ROUTES } from '@/constants/routes'
import { ListedCollection } from '@/models/collection'
import { fetchApi } from '@/utils/fetchApi'
import { useApiError } from '@/utils/hooks/useError'

import { CollectionsList } from '@/components/collectionsList'
import { FullPageHeader } from '@/components/pageHeaders/full'

import { CollectionsIcon } from './CollectionsIcon'

export const metadata: Metadata = {
  title: 'Collections',
  description: 'A list of all the products on sale',
}

export default async function CollectionsPage() {
  const res = await fetchApi<ListedCollection[]>(
    ROUTES.api.collectionsList,
    'collection',
    { next: { revalidate: 60 } }
  )

  const error = useApiError(res, true)
  if (error) return error

  return (
    <>
      <FullPageHeader
        icon={
          <CollectionsIcon
            style={{
              fontSize: '0.8em',
              marginRight: '0.8em',
              strokeWidth: 1.2,
            }}
          />
        }
        text="Collections"
        description="(There's more than this, but will add them as time goes on!)"
      />
      <CollectionsList collections={res.data!} />
    </>
  )
}
