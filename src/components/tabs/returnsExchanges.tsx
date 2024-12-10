import { SectionHeader } from '../pageHeaders/section'

type Props = {
  isPreorderItem: boolean | undefined
}

export const ReturnsExchangesTab = ({ isPreorderItem }: Props) => {
  return (
    <>
      {isPreorderItem && (
        <>
          <SectionHeader text="Preorder-specific" simple />
          <p>
            As this is a pre-order item, you <i>will</i> be able to edit or
            cancel your order at any time before the end of the campaign. You
            must contact me in order to make these changes however; due to the
            payment preprocessor I&apos;m using, it is unfortunately not
            possible to edit transactions directly.
          </p>
          <ul>
            <li>
              If you want to add items that have free shipping (including items
              that are not part of this pre-order), you can just checkout again
              as normal.
            </li>
            <li>
              If you want to add items that <i>don&apos;t</i> have free
              shipping, and you already paid for shipping in your previous
              transaction, just let me know what you want using any of the
              contact methods in the site footer. The required payment will be
              made using Ko-fi or Paypal afterwards.
            </li>
            <li>
              If you want to remove items or cancel entirely, just let me know
              and I&apos;ll issue a refund.
            </li>
          </ul>
          <p>
            Note that any service-based addons, like custom colours and
            accessories, can <i>not</i> be refunded once work has started.
          </p>
          <SectionHeader text="General" simple />
        </>
      )}

      <p>
        Generally, because this is a small-scale project with crazy Canadian
        shipping fees, I am unable to offer refunds or exchanges for any reason.
      </p>
      <p>
        The only exception to this is if the item is damaged due to negligence
        on packaging (as in, the protection I gave was insufficient for a
        reasonably rough transit, not if the post office threw it around or
        someone ran off with it); in that case, I will be happy to offer a
        refund on the price of the product based on the level of damage.
      </p>
    </>
  )
}
