import { TempCartItem } from '@/models/cart'
import { Currency } from '@/models/currency'
import { ProductStock, Variant, VariantOption } from '@/models/db/product'

export type KvpOrString = { [dataKey: string]: any } | string

export type BaseUpdateVariationFunc = (
  variantId: string,
  kvp: KvpOrString
) => void

export type UpdateVariationFunc = (kvp: KvpOrString) => void

export type ReplaceVariationFunc = (
  variantId: string,
  newValue: any | undefined
) => void

export type SharedComponentProps = {
  checkoutItemId: string
  primaryVariant: Variant
  subVariants?: Variant[]
  currency: Currency
  productName: string
  checkoutItemPluralName: string
  stock: ProductStock | undefined
}

export type GetAmountLeftFunc = (option: VariantOption) => number

export type SubComponentProps = SharedComponentProps & {
  tempCartItem: TempCartItem
  updateVariation: BaseUpdateVariationFunc
  replaceVariation: ReplaceVariationFunc
  updateQuantity: (amount: number) => void
  resetTempCartItem: () => void
}
