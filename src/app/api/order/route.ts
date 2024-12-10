import { NextRequest, NextResponse } from 'next/server'

import { OrderSuccessData } from '@/models/api/orderSuccessData'
import { OrderDocument, Orders } from '@/models/db/order'
import { buildApiError } from '@/utils/buildApiError'
import { stripe } from '@/utils/getApiStripe'
import { connectToDb } from '@/utils/mongodb'

export async function GET(req: NextRequest) {
  const checkoutSessionId = req.nextUrl.searchParams.get('checkoutSessionId')

  if (checkoutSessionId === null) {
    return buildApiError(`[Get order] A checkoutSessionId was not given!`)
  }

  const sessionData = await stripe.checkout.sessions.retrieve(checkoutSessionId)
  const stripeTransactionId = sessionData.payment_intent as string

  await connectToDb()

  const order = await Orders.findOne<OrderDocument>(
    { stripeTransactionId },
    '_id',
    { maxTimeMS: 120000 }
  )

  if (order === null) {
    return buildApiError(
      `[Get order] An order with a checkoutSessionId of ${checkoutSessionId} and a stripeTransactionId of ${stripeTransactionId} could not be found`
    )
  }

  return NextResponse.json<OrderSuccessData>({ orderId: order._id })
}
