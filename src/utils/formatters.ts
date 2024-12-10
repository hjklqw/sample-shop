import { Currency } from '@/models/currency'
import { PriceTier } from '@/models/db/checkoutItem'

export function formatPrice(
  priceTier: PriceTier | number,
  currency: Currency,
  quantity: number = 1,
  /** Use as little decimal places as possible. */
  simpleMode?: boolean
) {
  const priceDollars =
    typeof priceTier === 'number'
      ? priceTier * quantity
      : priceTier[currency] * quantity
  const formatted = new Intl.NumberFormat(
    currency === 'CAD' ? 'en-CA' : 'en-US',
    {
      style: 'currency',
      currency,
    }
  ).format(priceDollars)
  if (simpleMode) {
    let fixed = formatted
    if (fixed.endsWith('0')) fixed = fixed.substring(0, fixed.length - 1)
    if (fixed.endsWith('0')) fixed = fixed.substring(0, fixed.length - 2)
    return fixed
  }
  return formatted
}

const DATE_FORMATTER = new Intl.DateTimeFormat('default', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export function formatDate(date: string | number | Date) {
  const d =
    typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  return DATE_FORMATTER.format(d)
}
