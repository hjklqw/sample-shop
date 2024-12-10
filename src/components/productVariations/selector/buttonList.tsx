import { useCallback, useEffect, useState } from 'react'

import { BaseUpdateVariationFunc, GetAmountLeftFunc } from '../models'

import { Currency } from '@/models/currency'
import { VariantOption } from '@/models/db/product'
import { isVariantOptionPaid } from '@/utils/getVariantOption'

import { VariationPriceText } from '@/components/variationPriceText'

import styles from './styles.module.scss'

import { AmountLeftMessage } from './amountLeftMessage'

type Props = {
  options: VariantOption[]
  currency: Currency
  variantId: string
  updateVariation: BaseUpdateVariationFunc
  data: string
  getAmountLeft: GetAmountLeftFunc
  className?: string
}
export type ButtonListProps = Props

export const ButtonList = ({
  options,
  currency,
  variantId,
  updateVariation,
  data,
  getAmountLeft,
  className,
}: Props) => {
  const [selectedButton, setSelectedButton] = useState<string>('')

  useEffect(() => {
    setSelectedButton(data ?? '')
  }, [data])

  const selectOption = useCallback(
    (name: string) => {
      updateVariation(variantId, name)
      setSelectedButton(name)
    },
    [updateVariation, variantId]
  )

  return (
    <div className={`${styles.buttonList} ${className || ''}`}>
      {options.map((o, i) => {
        const optionIsComplex = typeof o === 'object'
        const optionName = optionIsComplex ? o.name : o
        const amountLeft = getAmountLeft(o)

        return (
          <button
            key={i}
            type="button"
            onClick={() => selectOption(optionName)}
            className={
              optionName === selectedButton ? styles.selected : undefined
            }
            disabled={amountLeft === 0}
          >
            {optionName}
            {optionIsComplex && isVariantOptionPaid(o) && (
              <VariationPriceText data={o.price} currency={currency} />
            )}
            <AmountLeftMessage
              amountLeft={amountLeft}
              type={
                optionIsComplex && (o.sharedSlotId || o.slots)
                  ? 'slot'
                  : undefined
              }
              className={styles.amountLeftMessage}
            />
          </button>
        )
      })}
    </div>
  )
}
