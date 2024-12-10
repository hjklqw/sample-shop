import { Cart } from '../cart'
import { Schema, model, models } from 'mongoose'

import { Products } from './product'

export enum OrderStatus {
  RECEIVED = 'received',
  PROCESSING = 'processing',
  PACKED = 'packed',
  SHIPPED = 'shipped',
}

export interface OrderDocument {
  _id: string
  stripeTransactionId: string
  items: Cart
  status: OrderStatus
}

const OrderSchema = new Schema<OrderDocument>(
  {
    stripeTransactionId: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: String,
        quantity: Schema.Types.Number,
        variations: [Schema.Types.Mixed],
      },
    ],
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.RECEIVED,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
)

OrderSchema.virtual('items.product', {
  ref: Products,
  localField: 'items.productId',
  foreignField: '_id',
  justOne: true,
  options: {
    lean: true,
  },
})

export const Orders = models?.order || model('order', OrderSchema)
