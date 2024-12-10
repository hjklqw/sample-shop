import { Schema, model, models } from 'mongoose'

export interface CategoryDocument {
  _id: string
  name: string
  slug: string
  description: string
}

const CategorySchema = new Schema<CategoryDocument>({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})

export const Categories =
  models?.categories || model('categories', CategorySchema, 'categories')
