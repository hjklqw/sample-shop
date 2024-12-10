import { NextApiRequest } from 'next'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import Stripe from 'stripe'

import { CartItem } from '@/models/cart'
import { buildApiError } from '@/utils/buildApiError'
import { stripe } from '@/utils/getApiStripe'

import { saveOrderToDb } from './save'
import { sendOrderConfirmationEmail } from './sendEmail'
import { updateSharedSlots } from './updateSharedSlots'
import { updateStock } from './updateStock'

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: NextApiRequest) {
  const body = await request.body()
  const requestHeaders = await headers()
  const signature = requestHeaders.get('stripe-signature') as string
  const origin = process.env.NEXT_PUBlIC_HOST!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return buildApiError(
      error,
      '[Order webhook] Error verifying webhook signature'
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await completeCheckout(event.data.object, origin)
        break

      case 'checkout.session.async_payment_failed':
        await handlePaymentFailed()
        break

      default:
        console.log(
          `Unhandled event type: ${event.type} | Event ID: ${event.id}`
        )
    }
  } catch (error: any) {
    return buildApiError(error, '[Order webhook]')
  }

  return NextResponse.json({ received: true })
}

async function completeCheckout(
  checkoutSession: Stripe.Checkout.Session,
  origin: string
) {
  const metadata = checkoutSession.metadata

  if (metadata === null) {
    throw new Error(
      `Metadata was null in checkout session ${checkoutSession.id}`
    )
  }

  const cart = Array.from({ length: parseInt(metadata.numItems) }).map(
    (_v, i) => {
      const cartItem = metadata[`cart.${i}`]
      return JSON.parse(cartItem) as CartItem
    }
  )

  const orderDetails = await saveOrderToDb(checkoutSession, cart)
  if (orderDetails.alreadyAccessed) return

  await sendOrderConfirmationEmail(
    checkoutSession,
    orderDetails.orderId,
    cart,
    origin
  )

  console.log(
    `[Order webhook] Updating stock for order ID ${orderDetails.orderId}`
  )
  await updateStock(cart)

  const usedSharedSlots = checkoutSession.metadata?.usedSharedSlots
  if (usedSharedSlots) {
    await updateSharedSlots(JSON.parse(usedSharedSlots))
  }
}

/**
 * For the purposes of this sample, this case is omitted, but things that should be done are:
 * - Mark down in our DB that the order did not actually succeed
 * - Send the customer an email that their payment did not go through
 * - Roll back any decreased stock and shared slots
 */
async function handlePaymentFailed() {
  console.warn('Payment failed')
}
