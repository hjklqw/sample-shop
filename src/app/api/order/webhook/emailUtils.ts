import { ROUTES } from '@/constants/routes'
import { specialVariantIds } from '@/constants/specialIds'
import { Cart } from '@/models/cart'
import { ProductDocument, Products } from '@/models/db/product'
import { variationToString } from '@/utils/cart'
import { sendEmail } from '@/utils/email'
import { getVariantOption } from '@/utils/getVariantOption'

type EmailTemplateProps = {
  id: string
  needsCustomData: boolean
  serviceUsed: boolean
  mixedPreorderAndRegularItems: boolean
  items: {
    name: string
    quantity: number
    isPreorder: boolean
    details: string
    productUrl: string
    imagePath: string
  }[]
}

export async function sendSuccessEmail({
  orderId,
  cart,
  origin,
  toEmail,
}: {
  orderId: string
  cart: Cart
  origin: string | null
  toEmail: string
}) {
  const host = origin || process.env.NEXT_PUBlIC_HOST

  const productIds = cart.map((item) => item.productId)
  const products = await Products.find(
    { _id: { $in: productIds } },
    '_id slug fullName isPreorderItem primaryVariant subVariants emailImageId'
  ).lean<ProductDocument[]>()

  let requiresContact = false
  let serviceUsed = false

  const items = cart.map((item) => {
    const details: string[][] = []
    const product = products.find((p) => p._id.toString() === item.productId)!

    if (item.variations) {
      item.variations.forEach((variation) => {
        if (!requiresContact && !serviceUsed) {
          Object.entries(variation).forEach(([id, value]) => {
            if (id == specialVariantIds.quantity) return false
            const isPrimaryVariant = id === product.primaryVariant?.id

            const variant = isPrimaryVariant
              ? product.primaryVariant
              : product.subVariants?.find((s) => s.id === id)
            if (!variant) return false

            if (variant.isService) {
              serviceUsed = true
            }

            const option = getVariantOption(variant, value)
            if (option?.requiresContact) {
              requiresContact = true
            }
          })
        }

        const variationDetails = variationToString(
          variation,
          undefined,
          product.primaryVariant!,
          product.subVariants,
          {
            renderFormData: true,
            returnAsList: true,
          }
        ) as string[]
        details.push(variationDetails)
      })
    }

    return {
      name: product.fullName,
      quantity: item.quantity,
      isPreorder: !!product.isPreorderItem,
      details: details.length ? detailsToHtml(details) : '-',
      productUrl: `${host}${ROUTES.product(product.slug)}`,
      imagePath: `https://i.imgur.com/${product.emailImageId}.png`,
    }
  })

  console.log('[Order] Sending success email to', toEmail)

  await sendEmail(
    process.env.EMAILJS_ORDER_CONFIRMATION_TEMPLATE_ID!,
    toEmail,
    {
      id: orderId,
      needsCustomData: requiresContact,
      serviceUsed,
      mixedPreorderAndRegularItems:
        items.some((item) => item.isPreorder) &&
        items.some((item) => !item.isPreorder),
      items,
    } satisfies EmailTemplateProps
  )
}

function detailsToHtml(details: string[][]): string {
  return details
    .map((variantions) => {
      const [firstVariation, ...otherVariations] = variantions
      const firstVariationHtml =
        otherVariations.length > 0
          ? `<p class="firstVariant">${firstVariation}</p>`
          : `<p>${firstVariation}</p>`
      const contents = otherVariations?.map((v) => `<p>${v}</p>`).join('') || ''
      return `<div class="details">${firstVariationHtml}${contents}</div>`
    })
    .join('')
}
