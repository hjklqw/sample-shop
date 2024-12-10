import Stripe from 'stripe'

import { Cart } from '@/models/cart'

import { sendSuccessEmail } from './emailUtils'

export async function sendOrderConfirmationEmail(
  checkoutSession: Stripe.Checkout.Session,
  orderId: string,
  cart: Cart,
  origin: string
) {
  const customerEmail = getCustomerEmail(checkoutSession, orderId)

  try {
    await sendSuccessEmail({ orderId, cart, origin, toEmail: customerEmail })
  } catch (error) {
    throw new Error(
      `[Send order email] Failed to send email to ${customerEmail} with order ID ${orderId}`,
      { cause: error }
    )
  }
}

function getCustomerEmail(
  checkoutSession: Stripe.Checkout.Session,
  orderId: string
) {
  if (checkoutSession.customer_email) {
    return checkoutSession.customer_email
  }

  const detailsEmail = checkoutSession.customer_details?.email

  if (detailsEmail) {
    return detailsEmail
  }

  throw new Error(
    `[Send order email] Unable to get customer email for order ID ${orderId}!`
  )
}
