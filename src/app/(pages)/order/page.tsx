import { Loader } from '@/components/loader'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { OrderPageContents } from './contents'

export const metadata: Metadata = {
  title: 'Thank you!',
  description: 'Thank you for your order!',
}

export default function OrderPage() {
  return (
    <Suspense fallback={<Loader />}>
      <OrderPageContents />
    </Suspense>
  )
}
