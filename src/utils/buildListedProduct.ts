import { ProductDocument } from '@/models/db/product'
import { ListedProduct, SelectedListedProductDocument } from '@/models/product'

import { isOnSale } from './sale'

/** Return a ListedProduct from a DB product. Used in API routes. */
export function buildListProduct(
  p: ProductDocument | SelectedListedProductDocument
): ListedProduct {
  return {
    _id: p._id,
    slug: p.slug,
    category: p.checkoutItem.category,
    name: p.alwaysUseFullName ? p.fullName : p.checkoutItem.name,
    fullName: p.fullName,
    isFreeShippingAvailable: !!p.checkoutItem.isFreeShippingAvailable,
    primaryVariantName: p.primaryVariant?.name,
    price: p.checkoutItem.price.byQuantity[0],
    sale: isOnSale(p.sale) ? p.sale : undefined,
    isPreorderItem: !!p.isPreorderItem,
    stock: p.stock,
  }
}
