import { Stripe, loadStripe } from '@stripe/stripe-js'

let stripe: Stripe | null

export async function getClientStripe() {
  if (!stripe) {
    stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripe!
}
