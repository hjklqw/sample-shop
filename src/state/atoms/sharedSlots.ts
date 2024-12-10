import { atomWithStorage } from 'jotai/utils'

import { ClientSharedSlots } from '@/models/clientSharedSlots'

export const sharedSlotsAtom = atomWithStorage<ClientSharedSlots>(
  'mp-sample-shop.sharedSlots',
  {}
)
