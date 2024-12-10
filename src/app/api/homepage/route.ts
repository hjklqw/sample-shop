import { NextResponse } from 'next/server'

import { newArrivalsCollectionId } from '@/constants/specialIds'
import { HomepageData } from '@/models/api/homepageData'
import { listedCollectionSelector } from '@/models/collection'
import { Categories, CategoryDocument } from '@/models/db/category'
import { CheckoutItems } from '@/models/db/checkoutItem'
import { Products } from '@/models/db/product'
import { SetDocument, Sets } from '@/models/db/set'
import { ListedProduct, listedProductSelector } from '@/models/product'
import { buildApiError } from '@/utils/buildApiError'
import { buildListedCollections } from '@/utils/buildListedCollection'
import { buildListProduct } from '@/utils/buildListedProduct'
import { connectToDb } from '@/utils/mongodb'

export async function GET() {
  try {
    await connectToDb()

    const [collections, newArrivalsCollection, categories] = await Promise.all([
      Sets.find(
        { _id: { $ne: newArrivalsCollectionId } },
        listedCollectionSelector
      ).lean<SetDocument[]>(),
      Sets.findById(newArrivalsCollectionId, '_id name slug products')
        .populate({
          path: 'products',
          select: listedProductSelector,
          model: Products,
          populate: {
            path: 'checkoutItem',
            model: CheckoutItems,
            populate: {
              path: 'category',
              model: Categories,
              select: 'name slug',
            },
          },
        })
        .lean<SetDocument>(),
      Categories.find({}, '_id name slug').lean<CategoryDocument[]>(),
    ])

    /*const categoryIds = newArrivalsCollection?.products.map(p => p.checkoutItem.category)!
    const categoriesOfNewArrivalProducts = await Categories.find({ _id: { $in: categoryIds } })*/

    const newArrivals: ListedProduct[] =
      newArrivalsCollection?.products
        .map((p) => buildListProduct(p))
        .filter((p) => p !== null) || []

    return NextResponse.json<HomepageData>({
      newArrivals,
      collections: buildListedCollections(collections),
      categories,
    })
  } catch (error: any) {
    return buildApiError(error)
  }
}
