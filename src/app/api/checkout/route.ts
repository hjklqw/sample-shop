import { cookies, headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { ROUTES } from '@/constants/routes'
import { stripeAllowedCountries } from '@/constants/stripeAllowedCountries'
import { Cart } from '@/models/cart'
import { Currency, PossibleUserCountry } from '@/models/currency'
import { CheckoutItems } from '@/models/db/checkoutItem'
import { ProductDocument, Products } from '@/models/db/product'
import { SharedSlotDocument, SharedSlots } from '@/models/db/sharedSlot'
import { stripe } from '@/utils/getApiStripe'

import { buildLineItems, buildShippingOptions } from './utils'

export async function POST(req: NextRequest) {
  const origin = (await headers()).get('origin')
  const formData = await req.formData()

  const isFreeShippingAvailable = JSON.parse(
    formData.get('isFreeShippingAvailable')?.toString() || 'false'
  )

  const countryData = formData.get('country')?.toString()
  const country = countryData
    ? JSON.parse(countryData)
    : ({
        isCanada: false,
        isUs: true,
        isInternational: false,
      } as PossibleUserCountry)

  const currencyData = formData.get('currency')?.toString()
  const currency = (currencyData || 'USD') as Currency

  console.log(`[Checkout] Currency ${currency}, Country:`, country)

  const cart = formData
    .getAll('product')
    .map((p) => JSON.parse(p.toString())) as Cart
  const productsIds = cart.map((item) => item.productId)

  const cookieStore = await cookies()

  try {
    const [products, sharedSlots] = await Promise.all([
      Products.find(
        { _id: { $in: productsIds } },
        'stripeId sale price.byQuantity primaryVariant subVariants checkoutItem'
      )
        .populate('checkoutItem', undefined, CheckoutItems)
        .lean<ProductDocument[]>(),
      SharedSlots.find({}, '_id amount').lean<SharedSlotDocument[]>(),
    ])

    const { usedSharedSlots, lineItems } = buildLineItems(
      products,
      currency,
      cart,
      sharedSlots
    )

    const shippingOptions = buildShippingOptions(
      products,
      currency,
      country,
      isFreeShippingAvailable
    )

    console.log(
      '[Checkout] Shipping options:',
      shippingOptions.map((o) => o.shipping_rate)
    )

    const session = await stripe.checkout.sessions.create({
      // @ts-ignore
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}${ROUTES.order('{CHECKOUT_SESSION_ID}')}`,
      cancel_url: `${origin}${ROUTES.cart}?cancelled=true`,
      automatic_tax: { enabled: true },
      shipping_address_collection: {
        allowed_countries: stripeAllowedCountries,
      },
      shipping_options: shippingOptions,
      phone_number_collection: {
        enabled: country.isInternational,
      },
      metadata: {
        numItems: cart.length,
        ...cart.reduce(
          (res, item, i) => ({ ...res, [`cart.${i}`]: JSON.stringify(item) }),
          {}
        ),
        usedSharedSlots:
          Object.keys(usedSharedSlots).length > 0
            ? JSON.stringify(usedSharedSlots)
            : undefined,
      },
    })

    cookieStore.delete('error')

    return NextResponse.redirect(session.url!, { status: 303 })
  } catch (error: any) {
    console.error(error)
    cookieStore.set({
      name: 'error',
      value: typeof error === 'string' ? error : 'An unknown error occurred!',
    })
    return NextResponse.redirect(`${origin}${ROUTES.cart}?error=true`)
  }
}
