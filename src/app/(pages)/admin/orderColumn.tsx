import Link from 'next/link'

import { ROUTES } from '@/constants/routes'
import { OrderData } from '@/models/api/admin/orderData'
import { Currency } from '@/models/currency'
import { OrderStatus } from '@/models/db/order'
import { variationToString } from '@/utils/cart'
import { formatDate } from '@/utils/formatters'

import styles from './styles.module.scss'

const STRIPE_TRANSACTION_URL_PREFIX = 'https://dashboard.stripe.com/payments/'

type Props = {
  status: OrderStatus
  orders: OrderData[]
  currency: Currency
}

export const OrderColumn = ({ status, orders, currency }: Props) => {
  return (
    <div className={styles.orderColumn}>
      <section className={styles.status}>
        {status} ({orders.length})
      </section>
      <section className={styles.ordersContainer}>
        {orders.map((o) => (
          <article key={o._id} className={styles.order}>
            <header>Order #{o._id}</header>
            <div className={styles.body}>
              <div>
                <b>Stripe transaction ID:</b>{' '}
                <a
                  href={`${STRIPE_TRANSACTION_URL_PREFIX}${o.stripeTransactionId}`}
                  target="_blank"
                >
                  {o.stripeTransactionId}
                </a>
              </div>
              <div>
                <b>Order date:</b> {formatDate(o.createdAt)}
              </div>
              <div className={styles.items}>
                {o.items.map((item, i) => (
                  <div key={i} className={styles.item}>
                    <Link
                      href={ROUTES.product(item.product.slug)}
                      className={styles.name}
                    >
                      {item.product.fullName} × {item.quantity}
                    </Link>
                    <div className={styles.variationsList}>
                      {item.variations?.map((variation, i) => (
                        <div key={i}>
                          {
                            variationToString(
                              variation,
                              currency,
                              item.product.primaryVariant!,
                              item.product.subVariants
                            ) as string
                          }
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
