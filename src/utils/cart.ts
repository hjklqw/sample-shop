import { specialVariantIds } from '@/constants/specialIds'
import { CartItemVariation } from '@/models/cart'
import { Currency } from '@/models/currency'
import { Variant, VariantType } from '@/models/db/product'
import { getVariantOption, isVariantOptionPaid } from '@/utils/getVariantOption'

import { getVariationPriceText } from '@/components/variationPriceText'

/**
 * Transforms variation data saved in cart into a string.
 * Will return as a list of strings instead of a single string if `returnAsList` is true.
 */
export function variationToString(
  variation: CartItemVariation,
  /** If undefined, price data will not be added. */
  currency: Currency | undefined,
  primaryVariant: Variant,
  subVariants: Variant[] | undefined,
  options?: {
    renderFormData?: boolean
    returnAsList?: boolean
  }
) {
  const {
    [specialVariantIds.quantity]: quantity,
    [primaryVariant.id]: primaryVariantValue,
    ...rest
  } = variation

  const baseText = getBaseVariantText(
    primaryVariant,
    primaryVariantValue,
    currency,
    quantity
  )

  const otherVariations = Object.entries(rest)
  if (!otherVariations.length) {
    return options?.returnAsList ? [baseText] : baseText
  }

  if (!subVariants) {
    console.error(
      "[variationToString] No subvariants--can't find variant for non-primary variations in cart item variation",
      variation
    )
    return ''
  }

  const trailingText = getSubVariantText(
    otherVariations,
    subVariants,
    !!options?.renderFormData,
    currency
  )

  return options?.returnAsList
    ? [baseText, ...trailingText]
    : `${baseText} • ${trailingText.join(', ')}`
}

function variantValueToString(
  value: any,
  formFieldNames?: { [fieldKey: string]: string }
) {
  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }

  // Variant values will only be objects if they're a form.
  // This currently only supports one level of form object and assumes that they're all strings.
  // Is sufficient for the current use cases, but can be expanded in the future if needed.
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([fieldKey, fieldValue]) => {
        const fieldName = formFieldNames?.[fieldKey] || fieldKey
        return `${fieldName}: ${fieldValue}`
      })
      .join(', ')
  }

  // This should never be reached
  return '[Todo]'
}

/** Returns "{primary value} x {quantity}" */
function getBaseVariantText(
  primaryVariant: Variant,
  primaryVariantValue: string,
  currency: Currency | undefined,
  quantity: number
) {
  const option = getVariantOption(primaryVariant, primaryVariantValue)
  const extraPriceText =
    currency && option && isVariantOptionPaid(option)
      ? getVariationPriceText(option.price, currency, true)
      : ''
  const baseText = `${primaryVariantValue}${extraPriceText} × ${quantity}`

  return baseText
}

/**
 * Returns a list of strings describing the choices of all non-quantity subvariants.
 * Formatting depends on type, variant name, etc.
 */
function getSubVariantText(
  otherVariations: [string, any][],
  subVariants: Variant[],
  renderFormData: boolean,
  currency: Currency | undefined
) {
  return otherVariations.map(([id, value]) => {
    const subVariant = subVariants.find((v) => v.id === id)!
    const name = subVariant.name

    const option = getVariantOption(subVariant, value)
    const extraPriceText =
      currency && option && isVariantOptionPaid(option)
        ? getVariationPriceText(option.price, currency, true)
        : ''

    if (
      subVariant.type === VariantType.Toggle &&
      subVariant.options.length === 2
    ) {
      return variantValueToString(value)
    }

    const variantIsBoolean = name.endsWith('?')
    if (variantIsBoolean) {
      const baseBooleanName = `${name.substring(
        0,
        name.length - 1
      )}${extraPriceText}`

      if (subVariant.type === VariantType.Form) {
        return renderFormData
          ? `${baseBooleanName} (${variantValueToString(
              value,
              subVariant.formFieldNames
            )})`
          : baseBooleanName
      }

      return `${baseBooleanName}: ${variantValueToString(value)}`
    }

    return `${name}: ${variantValueToString(
      value,
      subVariant.formFieldNames
    )}${extraPriceText}`
  })
}
