import { NextRequest, NextResponse } from 'next/server'

import { ApiError } from '@/models/api/apiResponse'
import { ProductData } from '@/models/api/productData'
import { CheckoutItems } from '@/models/db/checkoutItem'
import {
  ProductDocument,
  ProductTimelineEventType,
  Products,
} from '@/models/db/product'
import { SetDocument, Sets } from '@/models/db/set'
import { SharedSlotDocument, SharedSlots } from '@/models/db/sharedSlot'
import { DynamicRouteProps } from '@/models/page'
import { buildApiError } from '@/utils/buildApiError'
import { connectToDb } from '@/utils/mongodb'

export async function GET(_req: NextRequest, { params }: DynamicRouteProps) {
  try {
    await connectToDb()
    const { slug } = await params

    const [product, sharedSlots] = await Promise.all([
      Products.findOne({ slug })
        .populate('set', '_id slug name products', Sets)
        .populate('checkoutItem', undefined, CheckoutItems)
        .lean<ProductDocument>(),
      SharedSlots.find({}, '_id amount').lean<SharedSlotDocument[]>(),
    ])

    if (product === null) {
      return NextResponse.json<ApiError>({
        error: "A product with that slug doesn't exist!",
        isUserError: true,
      })
    }

    // Ensure that all timeline elements have an EventType
    if (product.timeline) {
      product.timeline = product.timeline.map((entry) => {
        if (entry.eventType) return entry
        return { ...entry, eventType: ProductTimelineEventType.MAIN }
      })
    }

    if (product.set) {
      product.set = {
        _id: product.set._id,
        slug: product.set.slug,
        name: product.set.name,
        numOtherCollectionProducts:
          (product.set as unknown as SetDocument).products.length - 1,
      }
    }

    if (!product.checkoutItem.namePlural) {
      product.checkoutItem.namePlural = `${product.checkoutItem.name}s`
    }

    return NextResponse.json<ProductData>({
      product,
      sharedSlots,
    })
  } catch (error: any) {
    return buildApiError(error)
  }
}
