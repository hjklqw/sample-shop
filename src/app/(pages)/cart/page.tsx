import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Suspense } from 'react'

import { Loader } from '@/components/loader'

import { CartPageMain } from './main'

export const metadata: Metadata = {
  title: 'Cart',
}

export default async function CartPage() {
  const cookieStore = await cookies()
  const error = cookieStore.get('error')?.value
  return (
    <Suspense fallback={<Loader />}>
      <CartPageMain error={error} />
    </Suspense>
  )
}
