export interface ListedCollection {
  _id: string
  name: string
  slug: string
  isComingSoon?: boolean
  numProducts: number
}

export const listedCollectionSelector = '_id name slug products'
