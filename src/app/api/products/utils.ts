import { CheckoutItems } from '@/models/db/checkoutItem'
import { ProductDocument, Products } from '@/models/db/product'
import { Sets } from '@/models/db/set'
import { listedProductSelector } from '@/models/product'

export function makeDbQuery(ids: string[]) {
  let baseQuery = undefined
  if (ids.length === 0) {
    baseQuery = Products.find({}, listedProductSelector)
  } else if (ids.length === 1) {
    baseQuery = Products.findById(ids, listedProductSelector)
  } else {
    baseQuery = Products.find({ _id: { $in: ids } }, listedProductSelector)
  }

  const populatedQuery = baseQuery
    .populate('set', '_id name', Sets)
    .populate('checkoutItem', undefined, CheckoutItems)

  return ids.length === 1
    ? populatedQuery.lean<ProductDocument>()
    : populatedQuery.lean<ProductDocument[]>()
}
