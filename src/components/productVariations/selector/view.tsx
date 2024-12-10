'use client'

import { useCallback } from 'react'

import { GetAmountLeftFunc, SubComponentProps } from '../models'

import {
  ExtendedVariantOption,
  SimpleVariantOption,
  Variant,
  VariantOption,
  VariantType,
} from '@/models/db/product'
import { getVariantOptionStock } from '@/utils/getVariantOption'
import {
  GetSlotAmountFunc,
  SetSlotUsageFunc,
} from '@/utils/hooks/useSharedSlots'

import { AddToCartButton } from '@/components/addToCartButton'

import styles from './styles.module.scss'

import { ButtonList } from './buttonList'
import { VariantForm } from './form'
import { QuantityVariant } from './quantity'
import { Toggle } from './toggle'
import { updateSharedSlots } from './utils'

type Props = SubComponentProps & {
  isUpdateMode?: boolean
  getSlotAmount: GetSlotAmountFunc
  setSlotUsage: SetSlotUsageFunc
}

/** A sidebar allowing users to customize the variations. */
export const ProductVariantSelector = ({
  primaryVariant,
  subVariants,
  currency,
  updateQuantity,
  updateVariation,
  replaceVariation,
  resetTempCartItem,
  tempCartItem,
  isUpdateMode,
  getSlotAmount,
  setSlotUsage,
  productName,
  stock,
}: Props) => {
  /** Returns -1 if there is an infinite amount left. */
  const getAmountLeft: (isPrimaryVariant: boolean) => GetAmountLeftFunc =
    useCallback(
      (isPrimaryVariant: boolean) => (option: VariantOption) => {
        if (typeof option === 'object' && option.sharedSlotId) {
          return getSlotAmount(option.sharedSlotId)
        }

        const primaryOption: VariantOption =
          tempCartItem.variation?.[primaryVariant.id]
        const primaryOptionName =
          typeof primaryOption === 'string'
            ? primaryOption
            : primaryOption?.name

        return getVariantOptionStock(
          stock,
          option,
          isPrimaryVariant,
          primaryOptionName
        )
      },
      [getSlotAmount, primaryVariant.id, stock, tempCartItem.variation]
    )

  const renderOptions = useCallback(
    (variant: Variant, isPrimaryVariant: boolean) => {
      const data = tempCartItem.variation![variant.id]
      const getAmountLeftFunc = getAmountLeft(isPrimaryVariant)

      switch (variant.type) {
        case VariantType.ButtonList:
          return (
            <ButtonList
              options={variant.options}
              currency={currency}
              variantId={variant.id}
              updateVariation={updateVariation}
              data={data}
              getAmountLeft={getAmountLeftFunc}
            />
          )
        case VariantType.Toggle:
          return (
            <Toggle
              options={variant.options}
              currency={currency}
              variantId={variant.id}
              updateVariation={updateVariation}
              data={data}
              getAmountLeft={getAmountLeftFunc}
            />
          )
        case VariantType.Form:
          return (
            <VariantForm
              variant={variant}
              currency={currency}
              updateVariation={updateVariation}
              replaceVariation={replaceVariation}
              data={data}
              getAmountLeft={getAmountLeftFunc}
            />
          )
      }
    },
    [
      tempCartItem.variation,
      currency,
      updateVariation,
      getAmountLeft,
      replaceVariation,
    ]
  )

  function renderVariant(v: Variant, isPrimaryVariant: boolean) {
    const isFormType = v.type === VariantType.Form
    return (
      <article
        key={v.id}
        className={`${styles.variant} ${isFormType ? styles.form : ''}`}
      >
        {!isFormType && <span className={styles.variantName}>{v.name}</span>}
        {renderOptions(v, isPrimaryVariant)}
      </article>
    )
  }

  const isPrimaryVariantEmpty =
    tempCartItem.variation![primaryVariant.id] === undefined

  const onAddToCartCompleted = useCallback(() => {
    updateSharedSlots(tempCartItem, primaryVariant, subVariants, setSlotUsage)

    resetTempCartItem()
  }, [
    tempCartItem,
    primaryVariant,
    subVariants,
    setSlotUsage,
    resetTempCartItem,
  ])

  return (
    <section className={styles.productVariationsSelectionSection}>
      {!isUpdateMode && (
        <header>Get your {productName.toLocaleLowerCase()} here!</header>
      )}
      <div className={styles.primaryVariantContainer}>
        {renderVariant(primaryVariant, true)}
        <QuantityVariant
          tempCartVariation={tempCartItem.variation}
          primaryVariant={primaryVariant}
          getAmountLeft={getAmountLeft(true)}
          updateQuantity={updateQuantity}
        />
      </div>
      {subVariants && (
        <div
          className={`${styles.subVariantContainer} ${
            isPrimaryVariantEmpty ? styles.disabled : ''
          }`}
        >
          {subVariants.map((v) => renderVariant(v, false))}
        </div>
      )}
      {!isUpdateMode && (
        <AddToCartButton
          item={tempCartItem}
          onAddCompleted={onAddToCartCompleted}
        />
      )}
    </section>
  )
}
