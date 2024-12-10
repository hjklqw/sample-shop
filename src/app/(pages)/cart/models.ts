import { CartItem } from '@/models/cart'
import { PriceTier } from '@/models/db/checkoutItem'
import { ListedProductForCart } from '@/models/product'

export type CartProduct = ListedProductForCart &
  Omit<CartItem, 'productId' | 'checkoutItemId'> & {
    /** This is per UNIT, not the total. */
    discountedPrice: PriceTier | undefined
    baseTotal: number
    addonsTotal: number
    /** For variants that have negative prices, like a B-grade thing. This holds the amount to remove from the price, not the total discounted price. */
    specialVariantDiscount: number
    /** This is only for products with NO variants--eg. ones where we can edit their quantity in-place in cart. */
    stock?: number
    checkoutItemQuantity: number
  }
