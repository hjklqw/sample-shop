import { HydratedDocument } from 'mongoose'
import Stripe from 'stripe'

import { Cart } from '@/models/cart'
import { OrderDocument, Orders } from '@/models/db/order'
import { connectToDb } from '@/utils/mongodb'

export async function saveOrderToDb(
  checkoutSession: Stripe.Checkout.Session,
  cart: Cart
): Promise<{
  orderId: string
  alreadyAccessed: boolean
}> {
  const stripeTransactionId = checkoutSession.payment_intent as string

  await connectToDb()

  const existingOrder = await Orders.findOne<OrderDocument>(
    { stripeTransactionId },
    { maxTimeMS: 20000 }
  )

  if (existingOrder !== null) {
    console.log(
      '[Order] Save re-accessed for existing order: ',
      existingOrder._id
    )
    return {
      orderId: existingOrder._id,
      alreadyAccessed: true,
    }
  }

  console.log(`[Order] Saving new order for CSID: ${checkoutSession.id}`)

  const order: HydratedDocument<OrderDocument> = new Orders({
    stripeTransactionId,
    items: cart,
  })
  await order.save()

  return {
    orderId: order._id,
    alreadyAccessed: false,
  }
}
