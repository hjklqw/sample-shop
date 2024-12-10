'use client'

import { useEffect, useMemo, useState } from 'react'

import { GetAmountLeftFunc } from '../models'

import { specialVariantIds } from '@/constants/specialIds'
import { CartItemVariation } from '@/models/cart'
import { Variant } from '@/models/db/product'
import { getAnyVariantOption } from '@/utils/getVariantOption'

import { QuantityInput } from '@/components/quantityInput'

import styles from './styles.module.scss'

type Props = {
  tempCartVariation: CartItemVariation | undefined
  primaryVariant: Variant
  getAmountLeft: GetAmountLeftFunc
  updateQuantity: (amount: number) => void
}

export const QuantityVariant = ({
  tempCartVariation,
  primaryVariant,
  getAmountLeft,
  updateQuantity,
}: Props) => {
  const [isDisabled, setDisabled] = useState<boolean>()
  const [maxQuantity, setMaxQuantity] = useState<number | undefined>()
  const [defaultQuantity, setDefaultQuantity] = useState<number>(1)

  useEffect(() => {
    const selectedPrimaryOptionValue = tempCartVariation?.[primaryVariant.id]

    if (selectedPrimaryOptionValue) {
      setDisabled(false)

      const option = getAnyVariantOption(
        primaryVariant,
        selectedPrimaryOptionValue
      )

      if (option) {
        const amountLeft = getAmountLeft(option)
        const defaultQuantity =
          tempCartVariation[specialVariantIds.quantity] || 1
        setMaxQuantity(amountLeft === -1 ? undefined : amountLeft)
        setDefaultQuantity(defaultQuantity)
      } else {
        setMaxQuantity(undefined)
        setDefaultQuantity(1)
      }
    } else {
      setMaxQuantity(undefined)
      setDisabled(true)
      setDefaultQuantity(1)
    }
  }, [getAmountLeft, primaryVariant, tempCartVariation])

  return (
    <article className={styles.variant}>
      <label>
        <span className={`${styles.variantName} ${styles.quantityLabel}`}>
          Quantity
        </span>
        <QuantityInput
          max={maxQuantity ?? 100}
          onChange={(newQuantity) => updateQuantity(newQuantity)}
          defaultQuantity={defaultQuantity}
          isDisabled={isDisabled}
          hideMaximum={isDisabled}
        />
      </label>
    </article>
  )
}
