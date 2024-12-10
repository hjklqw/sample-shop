import { NextResponse } from 'next/server'

import { AdminOrderData } from '@/models/api/admin/orderData'
import { OrderStatus, Orders } from '@/models/db/order'
import { buildApiError } from '@/utils/buildApiError'
import { connectToDb } from '@/utils/mongodb'

export async function GET() {
  try {
    await connectToDb()
    const orders = await Orders.find(
      {},
      '_id stripeTransactionId items status createdAt'
    )
      .populate('items.product', 'slug fullName primaryVariant subVariants')
      .sort([['createdAt', -1]])

    const grouped: AdminOrderData = orders.reduce(
      (res, o) => {
        res[o.status || OrderStatus.RECEIVED].push(o)
        return res
      },
      {
        [OrderStatus.RECEIVED]: [],
        [OrderStatus.PROCESSING]: [],
        [OrderStatus.PACKED]: [],
        [OrderStatus.SHIPPED]: [],
      }
    )

    return NextResponse.json<AdminOrderData>(grouped)
  } catch (error: any) {
    return buildApiError(error)
  }
}
