import { PriceTier } from '@/models/db/checkoutItem'

export const stripeShippingOptions = {
  free: {
    // This distinction is needed due to the way stripe handles shipping rates
    domestic: 'shr_1QUINlKNoOw5XqN0UCQDNAqZ',
    us: 'shr_1QUIOpKNoOw5XqN06M9IHzEv',
    localPickup: 'shr_1QUIOUKNoOw5XqN0pVg6lGH0',
  },
  tracked: {
    domestic: 'shr_1QUIPoKNoOw5XqN0ilLegrUq',
    us: 'shr_1QUIPzKNoOw5XqN0cEbmWajP',
    international: 'shr_1QUIQNKNoOw5XqN0t58rEria',
  },
}

export const freeShippingMinTotal: PriceTier = {
  CAD: 9,
  USD: 6.5,
}
