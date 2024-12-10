import { CartItem } from '@/models/cart'
import { OrderDocument, OrderStatus } from '@/models/db/order'
import { ProductDocument } from '@/models/db/product'

export type AdminOrderData = {
  [status in OrderStatus]: OrderData[]
}

/** This is a hydrated OrderDocument. */
export interface OrderData extends Omit<OrderDocument, 'items'> {
  items: OrderItemData[]
  createdAt: Date
}

export interface OrderItemData extends CartItem {
  product: Pick<
    ProductDocument,
    'slug' | 'fullName' | 'primaryVariant' | 'subVariants'
  >
}
