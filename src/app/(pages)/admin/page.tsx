import { Metadata } from 'next'

import { ROUTES } from '@/constants/routes'
import { AdminOrderData } from '@/models/api/admin/orderData'
import { OrderStatus } from '@/models/db/order'
import { fetchApi } from '@/utils/fetchApi'
import { useApiError } from '@/utils/hooks/useError'
import { getUserCurrency } from '@/utils/userLocation'

import { SimplePageHeader } from '@/components/pageHeaders/simple'

import styles from './styles.module.scss'

import { OrderColumn } from './orderColumn'

export const metadata: Metadata = {
  title: 'Admin',
}

export default async function AdminPage() {
  const res = await fetchApi<AdminOrderData>(
    ROUTES.api.admin.orders,
    'orders',
    {
      next: { revalidate: 60 },
    }
  )

  const error = useApiError(res, true)
  if (error) return error

  const currency = getUserCurrency()

  return (
    <div className={styles.wrapper}>
      <SimplePageHeader text="Admin" />
      <p>
        This page is only here for preview purposes! Lists all orders and their
        statuses.
      </p>

      <section className={styles.orderTable}>
        {Object.entries(res.data!).map(([status, orders]) => (
          <OrderColumn
            key={status}
            status={status as OrderStatus}
            orders={orders}
            currency={currency}
          />
        ))}
      </section>
    </div>
  )
}
