import { ProductDocument } from '../db/product'
import { SharedSlotDocument } from '../db/sharedSlot'

export interface ProductData {
  product: ProductDocument
  sharedSlots: SharedSlotDocument[]
}
