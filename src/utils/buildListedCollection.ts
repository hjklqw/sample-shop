import { ListedCollection } from '@/models/collection'
import { SetDocument } from '@/models/db/set'

/** Return a ListedProduct from a DB product. Used in API routes. */
export function buildListedCollection(c: SetDocument): ListedCollection {
  const numProducts = c.products?.length || 0
  return {
    _id: c._id,
    name: c.name,
    slug: c.slug,
    isComingSoon: numProducts === 0,
    numProducts,
  }
}

export function buildListedCollections(
  collections: SetDocument[]
): ListedCollection[] {
  return collections.map((c) => buildListedCollection(c))
}
