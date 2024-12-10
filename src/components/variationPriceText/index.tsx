import { Currency } from '@/models/currency'
import { VariantOptionPriceData, VariantPriceType } from '@/models/db/product'
import { formatPrice } from '@/utils/formatters'

type Props = {
  data: VariantOptionPriceData
  currency: Currency
}

/**
 * Returns either +$x or just $x depending on the variant price type.
 * If `wrapWithParanthesis` is true, a space is added before as well.
 */
export function getVariationPriceText(
  data: VariantOptionPriceData,
  currency: Currency,
  wrapWithParanthesis?: boolean
) {
  const value = data.value[currency]
  const isPercentage = data.type === VariantPriceType.AdditivePercentage
  const priceText = isPercentage
    ? `${Math.abs(value) * 100}%`
    : formatPrice(data.value, currency, 1, true)
  let finalText = priceText
  if (isPercentage) {
    finalText = value > 0 ? `+${priceText}` : `${priceText} off`
  } else if (data.type === VariantPriceType.Additive) {
    finalText = `${value > 0 ? '+' : ''}${priceText}`
  }
  return wrapWithParanthesis ? ` (${finalText})` : finalText
}

/** Tiny component to render out the additive or exact price of a variation option. */
export const VariationPriceText = ({ data, currency }: Props) => {
  const text = getVariationPriceText(data, currency)
  return <>&nbsp;({text})</>
}
