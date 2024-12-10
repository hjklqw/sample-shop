import { SharedSlots } from '@/models/db/sharedSlot'

export async function updateSharedSlots(usedSharedSlots: {
  [slotId: string]: string
}) {
  try {
    const slotUpdateQueries = Object.entries(usedSharedSlots).map(
      ([slotId, amount]) => ({
        updateOne: {
          filter: { _id: slotId },
          update: { amount: parseInt(amount) },
        },
      })
    )
    await SharedSlots.bulkWrite(slotUpdateQueries)
  } catch (error: any) {
    throw new Error('Unable to write shared slots', { cause: error })
  }
}
