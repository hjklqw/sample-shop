import { ProductDocument } from '@/models/db/product'

export function getCollectionNamePrefix(product: ProductDocument) {
  return product.set?.name.replace(' Collection', '')
}
