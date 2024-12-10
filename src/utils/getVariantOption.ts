import {
  ExtendedVariantOption,
  ProductStock,
  SimpleVariantOption,
  Variant,
  VariantOption,
  VariantType,
} from '@/models/db/product'

/** Only returns the option if it is /not/ a string. */
export function getVariantOption(
  variant: Variant,
  savedValueInCart: string | any
): SimpleVariantOption | ExtendedVariantOption | undefined {
  const option = getAnyVariantOption(variant, savedValueInCart)
  return typeof option === 'string' ? undefined : option
}

export function isVariantOptionPaid(
  option: SimpleVariantOption | ExtendedVariantOption
) {
  return 'price' in option
}

/** Returns the variant option based on the saved value, even if it is a string. */
export function getAnyVariantOption(
  variant: Variant,
  savedValueInCart: string | any
): string | SimpleVariantOption | ExtendedVariantOption | undefined {
  return variant.type === VariantType.Form
    ? variant.options[0]
    : variant.options.find((o) =>
        typeof o === 'string'
          ? o === savedValueInCart
          : o.name === savedValueInCart
      )
}

/**
 * Returns the stock of a given variant option.
 * Note that this only checks up to ONE subvariant level. If further levels are needed, this will need to be edited.
 */
export function getVariantOptionStock(
  stock: ProductStock | undefined,
  option: VariantOption,
  isPrimaryVariant: boolean,
  primaryOptionName: string | undefined
) {
  const optionIsComplex = typeof option === 'object'

  if (typeof stock === 'object') {
    const optionName = optionIsComplex ? option.name : option

    if (isPrimaryVariant) {
      const stockForVariant = stock[optionName]
      if (typeof stockForVariant === 'number') return stockForVariant
      return Object.values(stockForVariant).reduce<number>(
        (res, amount) => res + (amount as number),
        0
      )
    }

    if (primaryOptionName === undefined) {
      return -1
    }

    return (
      (stock[primaryOptionName] as { [key: string]: number })[optionName] ?? -1
    )
  }

  return stock ?? -1
}
