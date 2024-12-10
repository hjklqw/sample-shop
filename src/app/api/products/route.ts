import { NextRequest, NextResponse } from 'next/server'

import { ProductDocument } from '@/models/db/product'
import { ListedProduct, ListedProductForCart } from '@/models/product'
import { buildApiError } from '@/utils/buildApiError'
import { buildListProduct } from '@/utils/buildListedProduct'
import { connectToDb } from '@/utils/mongodb'

import { makeDbQuery } from './utils'

type ReturnValue = ListedProduct[] | ListedProductForCart[]

export async function GET(request: NextRequest) {
  const queryParams = request.nextUrl.searchParams
  const ids = queryParams.getAll('ids')
  const isForCart = queryParams.get('forCart') === 'true'

  try {
    await connectToDb()

    const dbQueryResult = await makeDbQuery(ids)

    // Ensure the products are in an array that is ordered to the passed in IDs, if available
    const dbProducts = (() => {
      if (Array.isArray(dbQueryResult)) {
        if (ids.length === 0) return dbQueryResult
        const idMap: { [id: string]: ProductDocument } = dbQueryResult.reduce(
          (res, p) => ({ ...res, [p._id]: p }),
          {}
        )
        const orderedProducts = ids.map((id) => idMap[id])
        return isForCart ? orderedProducts.reverse() : orderedProducts
      }
      return [dbQueryResult]
    })()

    if (dbProducts === null) {
      return NextResponse.json(
        { error: 'No products retrieved!' },
        { status: 500 }
      )
    }

    const products: ReturnValue = dbProducts
      .map((p) => {
        if (!p) return null

        const baseProduct = buildListProduct(p)

        if (isForCart) {
          const cartProduct: ListedProductForCart = {
            ...baseProduct,
            allPrices: p.checkoutItem.price.byQuantity,
            primaryVariant: p.primaryVariant,
            subVariants: p.subVariants,
            stock: p.stock,
          }
          return cartProduct
        }

        return baseProduct
      })
      .filter((p) => p !== null)

    return NextResponse.json<ReturnValue>(products)
  } catch (error: any) {
    return buildApiError(error)
  }
}
