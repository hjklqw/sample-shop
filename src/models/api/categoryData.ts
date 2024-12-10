import { CategoryDocument } from '../db/category'
import { ListedProduct } from '../product'

export interface CategoryData extends CategoryDocument {
  products: ListedProduct[]
}
