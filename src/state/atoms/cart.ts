import { atomWithStorage } from 'jotai/utils'

import { Cart } from '@/models/cart'

export const cartAtom = atomWithStorage<Cart>('mp-sample-shop.cart', [])
