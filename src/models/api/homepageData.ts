import { ListedCollection } from '../collection'
import { CategoryDocument } from '../db/category'
import { ListedProduct } from '../product'

export interface HomepageData {
  newArrivals: ListedProduct[]
  collections: ListedCollection[]
  categories: CategoryDocument[]
}
