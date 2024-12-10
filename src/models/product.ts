import { CheckoutItemDocument, PriceTier } from './db/checkoutItem'
import { ProductSaleData, ProductStock, Variant } from './db/product'

export interface ListedProduct {
  _id: string
  slug: string
  category?: {
    slug: string
    name: string
  }
  name: string
  /** Used when products are displayed in a mixed-category, mixed-collection setting like the cart */
  fullName: string
  /** The base price of the product. */
  price: PriceTier
  /** Only defined if the sale is not yet over; not just if it exists in the DB */
  sale: ProductSaleData | undefined
  isFreeShippingAvailable: boolean
  primaryVariantName: string | undefined
  isPreorderItem: boolean
  stock?: ProductStock
}

export interface ListedProductForCart extends ListedProduct {
  allPrices: PriceTier[]
  primaryVariant?: Variant
  subVariants?: Variant[]
}

export const listedProductSelector =
  '_id slug fullName price.byQuantity sale isFreeShippingAvailable primaryVariant subVariants isPreorderItem stock alwaysUseFullName'

/** This is when it was just selected from the DB, before it's parsed */
export interface SelectedListedProductDocument {
  _id: string
  slug: string
  name: string
  fullName: string
  alwaysUseFullName: boolean | undefined
  price: {
    byQuantity: PriceTier[]
  }
  isFreeShippingAvailable: boolean
  sale: ProductSaleData | undefined
  primaryVariant: Variant
  subVariants: Variant[]
  isPreorderItem: boolean
  checkoutItem: CheckoutItemDocument
  stock?: ProductStock
}
