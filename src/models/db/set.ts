import { SelectedListedProductDocument } from '@/models/product'
import { model, models, Schema } from 'mongoose'

export interface SetDocument {
  _id: string
  name: string
  slug: string
  description?: string
  products: SelectedListedProductDocument[]
}

const SetSchema = new Schema<SetDocument>({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: String,
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'product',
    },
  ],
})

export const Sets = models?.set || model('set', SetSchema)
