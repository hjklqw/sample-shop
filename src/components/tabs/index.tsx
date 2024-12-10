'use client'

import { useState } from 'react'

import { freeShippingMinTotal } from '@/constants/stripeShippingOptions'
import { PriceTier } from '@/models/db/checkoutItem'
import { ProductFaqEntry, ProductTimelineEntry } from '@/models/db/product'
import { getUserCurrency } from '@/utils/userLocation'

import styles from './styles.module.scss'

import { productDescriptionComponents } from './description'
import { FaqTab } from './faq'
import { ReturnsExchangesTab } from './returnsExchanges'
import { ShippingTab } from './shipping'
import { TimelineTab } from './timeline'

type Props = {
  slug: string
  isPreorderItem: boolean | undefined
  isFreeShippingAvailable: boolean
  isLocalPickupAvailable: boolean
  price: PriceTier
  timeline: ProductTimelineEntry[] | undefined
  faq: ProductFaqEntry[] | undefined
  className?: string
}

const tabs = [
  'Description',
  'Timeline',
  'Shipping',
  'Returns & Exchanges',
  'FAQ',
]

export const ProductTabs = ({
  slug,
  isPreorderItem,
  isFreeShippingAvailable,
  isLocalPickupAvailable,
  price,
  timeline,
  faq,
  className,
}: Props) => {
  const [currTab, setCurrTab] = useState<string>(tabs[0])
  const currency = getUserCurrency()

  const DescriptionComponent = productDescriptionComponents[slug]

  return (
    <section className={`${styles.tabs} ${className || ''}`}>
      <nav className={styles.tabNav}>
        {tabs.map((t) => {
          if (t === 'Timeline' && (!isPreorderItem || timeline === undefined))
            return null
          if (t === 'FAQ' && faq === undefined) return null
          return (
            <span
              key={t}
              onClick={() => setCurrTab(t)}
              className={currTab === t ? styles.selected : undefined}
            >
              {t}
            </span>
          )
        })}
      </nav>

      <section className={styles.tabContents}>
        {currTab === 'Description' && <DescriptionComponent />}
        {currTab === 'Shipping' && (
          <ShippingTab
            isPreorderItem={isPreorderItem}
            isFreeShippingAvailable={isFreeShippingAvailable}
            isLocalPickupAvailable={isLocalPickupAvailable}
            productPriceIsUnderMinShippingTotal={
              price[currency] < freeShippingMinTotal[currency]
            }
            currency={currency}
          />
        )}
        {currTab === 'Returns & Exchanges' && (
          <ReturnsExchangesTab isPreorderItem={isPreorderItem} />
        )}
        {currTab === 'Timeline' && <TimelineTab timeline={timeline!} />}
        {currTab === 'FAQ' && <FaqTab faq={faq!} />}
      </section>
    </section>
  )
}
