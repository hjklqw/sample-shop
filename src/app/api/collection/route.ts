import { newArrivalsCollectionId } from '@/constants/specialIds'
import { ListedCollection, listedCollectionSelector } from '@/models/collection'
import { SetDocument, Sets } from '@/models/db/set'
import { buildApiError } from '@/utils/buildApiError'
import { buildListedCollections } from '@/utils/buildListedCollection'
import { connectToDb } from '@/utils/mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectToDb()

    const collections = await Sets.find<SetDocument>(
      { _id: { $ne: newArrivalsCollectionId } },
      listedCollectionSelector
    )

    return NextResponse.json<ListedCollection[]>(
      buildListedCollections(collections)
    )
  } catch (error: any) {
    return buildApiError(error)
  }
}
