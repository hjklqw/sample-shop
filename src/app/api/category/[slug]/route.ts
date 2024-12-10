import { NextRequest, NextResponse } from 'next/server'

import { ApiError } from '@/models/api/apiResponse'
import { CategoryData } from '@/models/api/categoryData'
import { Categories, CategoryDocument } from '@/models/db/category'
import { CheckoutItems } from '@/models/db/checkoutItem'
import { ProductDocument, Products } from '@/models/db/product'
import { DynamicRouteProps } from '@/models/page'
import { ListedProduct, listedProductSelector } from '@/models/product'
import { buildApiError } from '@/utils/buildApiError'
import { buildListProduct } from '@/utils/buildListedProduct'
import { connectToDb } from '@/utils/mongodb'

export async function GET(_req: NextRequest, { params }: DynamicRouteProps) {
  try {
    await connectToDb()

    const { slug } = await params
    const category = await Categories.findOne<CategoryDocument>({
      slug,
    }).lean<CategoryDocument>()

    if (category === null) {
      return NextResponse.json<ApiError>({
        error: "A category with that slug doesn't exist!",
        isUserError: true,
      })
    }

    const projection: { [field: string]: any } = listedProductSelector
      .split(' ')
      .reduce((res, selector) => ({ ...res, [selector]: 1 }), {})
    projection.checkoutItem = {
      $toObjectId: '$checkoutItem',
    }

    const productsInCategory = await Products.aggregate<ProductDocument>([
      { $project: projection },
      {
        $lookup: {
          from: 'checkoutItems',
          localField: 'checkoutItem',
          foreignField: '_id',
          as: 'checkoutItem',
          pipeline: [{ $match: { category: category._id.toString() } }],
        },
      },
      {
        $unwind: '$checkoutItem',
      },
    ])

    const products: ListedProduct[] =
      productsInCategory
        .map((p) => buildListProduct(p))
        .filter((p) => p !== null) || []

    return NextResponse.json<CategoryData>({ ...category, products })
  } catch (error: any) {
    return buildApiError(error)
  }
}
