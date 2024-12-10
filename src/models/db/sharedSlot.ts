import { model, models, Schema } from 'mongoose'

export interface SharedSlotDocument {
  _id: string
  amount: number
}

const SharedSlotSchema = new Schema<SharedSlotDocument>({
  _id: Schema.Types.ObjectId,
  amount: Schema.Types.Number,
})

export const SharedSlots =
  models?.sharedSlot || model('sharedSlot', SharedSlotSchema, 'sharedSlots')
