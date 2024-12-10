import { ProductSaleData } from '@/models/db/product'

/** Returns true only if the sale is still going on, /not/ only if it's defined. */
export function isOnSale(sale: ProductSaleData | undefined) {
  return sale
    ? sale.until === undefined || Date.now() <= new Date(sale.until).getTime()
    : false
}
