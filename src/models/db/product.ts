import { Schema, model, models } from 'mongoose'

import { CheckoutItemDocument, PriceTier } from './checkoutItem'
import { SetDocument } from './set'

export enum VariantType {
  ButtonList = 'buttonList',
  Dropdown = 'dropdown',
  Toggle = 'toggle',
  Form = 'form',
}

export enum VariantPriceType {
  Exact = 'exact',
  Additive = 'additive',
  AdditivePercentage = 'additivePercentage',
}

export interface VariantOptionPriceData {
  type: VariantPriceType
  value: PriceTier
}

export interface SimpleVariantOption {
  name: string
  slots?: number
  sharedSlotId?: string
  /** Whether or not the buyer needs to contact me for further information after checkout if they get this option */
  requiresContact?: boolean
}

export interface ExtendedVariantOption extends SimpleVariantOption {
  productId: string
  price: VariantOptionPriceData
}

export type VariantOption = string | SimpleVariantOption | ExtendedVariantOption

export interface Variant {
  id: string
  name: string
  type: VariantType
  options: VariantOption[]
  /** Only available for VariantType.Form */
  formFieldNames?: { [fieldKey: string]: string }
  /** If a variant defines a service, then any options with extra prices can /not/ be multiplied by the quantity. */
  isService?: boolean
}

export enum ProductTimelineEventType {
  MAIN = 'main',
  /** An unimportant event */
  SMALL = 'small',
  /** The end of a preorder campaign */
  END = 'end',
  SHIPMENT = 'shipment',
  /** This is a type that is NOT used in the DB; it's just for rendering in the Timeline component. */
  PRODUCTION = 'production',
}

export type ProductTimelineEntry = {
  date: Date
  dateDisplay: string
  event: string
  subEvent?: string
  eventType: ProductTimelineEventType
}

export interface ProductFaqEntry {
  question: string
  answer: string
}

export interface ProductSaleData {
  until: Date
  prices: PriceTier[]
}

/** If it's a single number, then there are no variants. Otherwise, stock is keyed by all non-form-type variants. */
export type ProductStock =
  | number
  | { [variantOptionName: string]: ProductStock }

export interface ProductDocument {
  _id: string
  slug: string
  fullName: string
  alwaysUseFullName?: boolean
  isInactive?: boolean
  checkoutItem: CheckoutItemDocument
  numSubImages: number
  isPreorderItem?: boolean
  isLocalPickupAvailable?: boolean
  metadata?: string[]
  sale?: ProductSaleData
  set?: Pick<SetDocument, '_id' | 'slug' | 'name'> & {
    numOtherCollectionProducts: number
  }
  stock?: ProductStock
  primaryVariant?: Variant
  subVariants?: Variant[]
  timeline?: ProductTimelineEntry[]
  faq?: ProductFaqEntry[]
  /** For use in emails only. Wrap these as `https://i.imgur.com/${emailImageId}.png` */
  emailImageId: string
}

const VariantSchema = {
  id: String,
  name: String,
  fullName: String,
  type: {
    type: String,
    enum: Object.values(VariantType),
  },
  options: [
    {
      name: String,
      stock: Schema.Types.Number,
      slots: Schema.Types.Number,
      sharedSlotId: String,
      requiresContact: Schema.Types.Boolean,
      productId: String,
      price: {
        type: {
          type: String,
          enum: Object.values(VariantPriceType),
        },
        value: {
          CAD: Schema.Types.Number,
          USD: Schema.Types.Number,
        },
      },
    },
  ],
  formFieldNames: Schema.Types.Mixed,
}

const ProductSchema = new Schema<ProductDocument>({
  _id: Schema.Types.ObjectId,
  slug: Schema.Types.String,
  fullName: Schema.Types.String,
  alwaysUseFullName: Schema.Types.Boolean,
  isInactive: Schema.Types.Boolean,
  checkoutItem: {
    type: Schema.Types.ObjectId,
    ref: 'checkoutItem',
  },
  numSubImages: Schema.Types.Number,
  isPreorderItem: Schema.Types.Boolean,
  isLocalPickupAvailable: [Schema.Types.Boolean],
  metadata: [String],
  sale: {
    until: Schema.Types.Date,
    prices: [
      {
        CAD: Schema.Types.Number,
        USD: Schema.Types.Number,
      },
    ],
  },
  set: {
    type: Schema.Types.ObjectId,
    ref: 'set',
  },
  stock: Schema.Types.Mixed,
  primaryVariant: VariantSchema,
  subVariants: VariantSchema,
  timeline: [
    {
      date: Schema.Types.Date,
      dateDisplay: String,
      event: String,
      subEvent: String,
      eventType: {
        type: String,
        enum: Object.values(ProductTimelineEventType),
      },
    },
  ],
  faq: [
    {
      question: String,
      answer: String,
    },
  ],
  emailImageId: String,
})

export const Products = models?.product || model('product', ProductSchema)
