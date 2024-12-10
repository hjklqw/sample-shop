import { ExclusiveIcon } from '@/app/product/[slug]/icons/ExclusiveIcon'
import { freeShippingMinTotal } from '@/constants/stripeShippingOptions'
import { Currency } from '@/models/currency'
import { formatPrice } from '@/utils/formatters'
import { SectionHeader } from '../pageHeaders/section'
import { CustomsIcon } from './icons/CustomsIcon'
import { FreeShippingIcon } from './icons/FreeShippingIcon'
import { TrackedShippingIcon } from './icons/TrackedShippingIcon'
import { TrackingIcon } from './icons/TrackingIcon'
import { WithPreordersIcon } from './icons/WithPreordersIcon'

type Props = {
  isPreorderItem: boolean | undefined
  isFreeShippingAvailable: boolean
  isLocalPickupAvailable: boolean
  productPriceIsUnderMinShippingTotal: boolean
  currency: Currency
}

export const ShippingTab = ({
  isPreorderItem,
  isFreeShippingAvailable,
  isLocalPickupAvailable,
  productPriceIsUnderMinShippingTotal,
  currency,
}: Props) => {
  const isCanada = currency === 'CAD'

  return (
    <>
      {isPreorderItem && (
        <p>
          This is a pre-order item, meaning it will <i>not</i> be shipped until
          the date outlined in the Timeline tab.
        </p>
      )}

      <p>
        Shipping will be from Canada, with worldwide destinations all available.
      </p>

      {isFreeShippingAvailable && (
        <>
          <SectionHeader
            icon={<ExclusiveIcon strokeWidth={0.05} />}
            text="Free shipping"
            simple
          />
          <p>✨ FREE ✨ lettermail shipping is available for this item!</p>
          {productPriceIsUnderMinShippingTotal && (
            <p>
              Please note that to qualify for this, your cart must total{' '}
              <b>
                {formatPrice(freeShippingMinTotal, currency)} {currency}
              </b>{' '}
              or over.
            </p>
          )}

          <p>Here are the delivery estimates for free lettermail shipping:</p>

          <ul>
            <li>
              <b>Canada</b>: 2-4 business days
            </li>
            <li>
              <b>US</b>: 3-4 business days
            </li>
            <li>
              <b>International</b>: Up to 7 business days
            </li>
          </ul>

          <SectionHeader
            icon={<TrackedShippingIcon strokeWidth={1.05} />}
            text="Tracked shipping"
            simple
          />
        </>
      )}

      <p>The following flat fees are applied for all tracked orders:</p>

      <ul>
        <li>
          <b>US and Canada</b>: {isCanada ? '$10 CAD' : '$7.5 USD'}
        </li>
        <li>
          <b>International</b>: $14.55 USD
        </li>
      </ul>

      {!isPreorderItem && (
        <p>
          I usually ship as soon as I get an order (same-day!), but depending on
          the time and weather, you can expect that it will take <b>0-3 days</b>{' '}
          before your item is taken to the post office.
        </p>
      )}

      <p>
        Once an item is dispatched, you&apos;ll get an email with a tracking
        number{isFreeShippingAvailable && " (if free shipping wasn't used)"}.
        The delivery estimates
        {isFreeShippingAvailable && ' for tracked shipping'} are as follows:
      </p>

      <ul>
        <li>
          <b>Canada</b>: 4-6 business days
        </li>
        <li>
          <b>US</b>: 3-6 business days
        </li>
        <li>
          <b>International</b>: 10-27 business days
        </li>
      </ul>

      {isLocalPickupAvailable && (
        <>
          <SectionHeader
            text="Free local pickup"
            icon={<FreeShippingIcon strokeWidth={0.9} />}
            simple
          />
          <p>
            Canadian shipping is unfortunately pretty wild; it takes me $10 to
            ship a sticker to my <i>own</i> address. The flat prices listed
            above denote the average, rather than the maximum.
          </p>
          <p>
            So if you live in Calgary or will be visiting around the shipment
            date written on the timeline, I&apos;m willing to offer free pickup
            within the city. This option will be selectable at checkout.
            Depending on the number of people using this option, I&apos;ll
            either email you, or make some sort of poll to arrange times and
            locations.
          </p>
          <p>
            Note that this option will show up for everyone all over the world.
            Please only select it if you will use it!
          </p>
        </>
      )}

      <SectionHeader text="Tracking" icon={<TrackingIcon />} simple />
      <p>
        Once a package has been sent out, it and its location is out of my
        control; I will definitely try my best to assist with any lost packages,
        but tracked shipping will always be recommended for peace of mind.
        Please make sure your address is correct!
      </p>

      <SectionHeader
        text="Customs"
        icon={<CustomsIcon strokeWidth={0.1} />}
        simple
      />
      <p>
        Import fees, such as taxes, VAT, and other country-dependent costs, are{' '}
        <i>not</i> included in the product amount or flat shipping fees, and may
        apply to buyers outside of Canada.
      </p>

      <SectionHeader
        text={
          isPreorderItem
            ? 'Getting this with non-preorder items?'
            : 'Getting this with preorder items?'
        }
        icon={<WithPreordersIcon />}
        simple
      />
      <p>
        <b>All items in the same order will be shipped together.</b> This means
        that regular items will <i>not</i> be shipped until the preorder ones
        are ready as well; so if you would like to get the regular items first,
        then please make a separate order for them.
      </p>
    </>
  )
}
