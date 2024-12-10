import { NextRequest, NextResponse } from 'next/server'

import { ApiError } from '@/models/api/apiResponse'
import { CheckoutItems } from '@/models/db/checkoutItem'
import { Products } from '@/models/db/product'
import { SetDocument, Sets } from '@/models/db/set'
import { DynamicRouteProps } from '@/models/page'
import { ListedProduct, listedProductSelector } from '@/models/product'
import { buildApiError } from '@/utils/buildApiError'
import { buildListProduct } from '@/utils/buildListedProduct'
import { connectToDb } from '@/utils/mongodb'

export async function GET(_req: NextRequest, { params }: DynamicRouteProps) {
  try {
    await connectToDb()

    const { slug } = await params
    const collection = await Sets.findOne<SetDocument>({ slug })
      .populate({
        path: 'products',
        select: listedProductSelector,
        model: Products,
        populate: {
          path: 'checkoutItem',
          model: CheckoutItems,
        },
      })
      .lean<SetDocument>()

    if (collection === null) {
      return NextResponse.json<ApiError>({
        error: "A collection with that slug doesn't exist!",
        isUserError: true,
      })
    }

    const products: ListedProduct[] =
      collection?.products
        .map((p) => buildListProduct(p))
        .filter((p) => p !== null) || []

    return NextResponse.json({ ...collection, products })
  } catch (error: any) {
    return buildApiError(error)
  }
}
