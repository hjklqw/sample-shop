import { Schema, model, models } from 'mongoose'

import { CategoryDocument } from './category'

export interface PriceTier {
  CAD: number
  USD: number
}

export enum VolumeDiscountDisplayMode {
  Percentage = 'percentage',
  Exact = 'exact',
}

export interface ProductPriceData {
  volumeDiscountDisplayMode: VolumeDiscountDisplayMode
  byQuantity: PriceTier[]
}

export interface CheckoutItemDocument {
  _id: string
  name: string
  /** Just an S will be appended if this is undefined in the DB.
   * The single-product route is currently the only one that will convert this (and the only one that uses it) */
  namePlural: string
  stripeId: string
  isFreeShippingAvailable?: boolean
  price: ProductPriceData
  category: CategoryDocument
}

const CheckoutItemSchema = new Schema<CheckoutItemDocument>({
  name: {
    type: String,
    required: true,
  },
  namePlural: String,
  stripeId: {
    type: String,
    required: true,
  },
  isFreeShippingAvailable: [Schema.Types.Boolean],
  category: {
    type: Schema.Types.ObjectId,
    ref: 'category',
  },
  price: {
    volumeDiscountDisplayMode: {
      type: String,
      enum: Object.values(VolumeDiscountDisplayMode),
    },
    byQuantity: [
      {
        CAD: Schema.Types.Number,
        USD: Schema.Types.Number,
      },
    ],
  },
})

export const CheckoutItems =
  models?.checkoutItem ||
  model('checkoutItem', CheckoutItemSchema, 'checkoutItems')
