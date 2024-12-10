import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'

import { SharedComponentProps } from '../models'
import { updateSharedSlots } from '../selector'
import { useTempCartItem } from '../useTempCartItem'
import { useAtom } from 'jotai'

import { specialVariantIds } from '@/constants/specialIds'
import { CartItem, CartItemVariation } from '@/models/cart'
import { VariantType } from '@/models/db/product'
import {
  GetSlotAmountFunc,
  SetSlotUsageFunc,
} from '@/utils/hooks/useSharedSlots'

import { CartIconButtons } from '@/components/cartIconButtons'

import styles from './styles.module.scss'

import { UpdateVariationModal } from './updateVariationModal'
import { cartAtom } from '@/state/atoms/cart'

type Props = SharedComponentProps & {
  productId: string
  getSlotAmount: GetSlotAmountFunc
  setSlotUsage: SetSlotUsageFunc
}

/**
 * A cart that is /just/ for the current product.
 * Used for products with variations.
 */
export const ProductVariationCart = ({
  productId,
  checkoutItemId,
  primaryVariant,
  subVariants,
  currency,
  getSlotAmount,
  setSlotUsage,
  productName,
  checkoutItemPluralName,
  stock,
}: Props) => {
  const [cart, setCart] = useAtom(cartAtom)

  const [currEditingVariation, setCurrEditingVariation] =
    useState<CartItemVariation>()
  const [currEditingVariationIndex, setCurrEditingVariationIndex] =
    useState<number>(-1)

  const tempCartItemProps = useTempCartItem(
    productId,
    checkoutItemId,
    currEditingVariation || {},
    currEditingVariation?.[specialVariantIds.quantity]
  )

  useEffect(
    () => {
      tempCartItemProps.resetTempCartItem()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currEditingVariation]
  )

  const cartItem = useMemo(
    () => cart.find((item) => item.productId === productId),
    [cart, productId]
  )

  function renderFormData(
    form: any,
    formFieldNames: { [fieldKey: string]: string }
  ): React.ReactNode {
    const formEntries = Object.entries(form)
    const lastFormEntryIndex = formEntries.length - 1
    return (
      <>
        {formEntries.map(([id, value], i) => {
          const name = formFieldNames[id]
          let code = null
          if (typeof value === 'string') {
            code = (
              <span key={id}>
                {name}: {value}
              </span>
            )
          } else {
            code = (
              <span key={id}>
                {name}: ({renderFormData(value, formFieldNames)})
              </span>
            )
          }
          return i < lastFormEntryIndex ? (
            <Fragment key={id}>{code} • </Fragment>
          ) : (
            code
          )
        })}
      </>
    )
  }

  function renderVariantData(variantData: CartItemVariation) {
    const {
      [primaryVariant.id]: primaryValue,
      [specialVariantIds.quantity]: quantity,
      ...otherVariantData
    } = variantData

    return (
      <>
        <span className={styles.primaryVariantData}>
          {primaryValue} × {quantity}
        </span>
        {Object.entries(otherVariantData).map(([id, value]) => {
          const subVariant = subVariants!.find((s) => s.id === id)!
          if (subVariant.type === VariantType.Form) {
            return (
              <span key={id}>
                <span className={styles.subVariantName}>{subVariant.name}</span>
                <br />
                <span className={styles.subVariantData}>
                  {renderFormData(value, subVariant.formFieldNames!)}
                </span>
              </span>
            )
          }
          return <span key={id}>{value}</span>
        })}
      </>
    )
  }

  function onEditVariationClicked(variation: CartItemVariation, index: number) {
    setCurrEditingVariation(variation)
    setCurrEditingVariationIndex(index)
  }

  const updateCartItemVariation = useCallback(
    (updatedCartItem: (oldItem: CartItem) => CartItem) => {
      setCart((cart) => {
        // Find this again just in case anything changed
        const cartItemIndex = cart.findIndex(
          (item) => item.productId === productId
        )

        const cartItem = cart[cartItemIndex]
        const newCartItem = updatedCartItem(cartItem)

        // Remove the cart item entirely if no variations were chosen
        if (newCartItem.variations?.length === 0) {
          return [
            ...cart.slice(0, cartItemIndex),
            ...cart.slice(cartItemIndex + 1),
          ]
        }

        return [
          ...cart.slice(0, cartItemIndex),
          newCartItem,
          ...cart.slice(cartItemIndex + 1),
        ]
      })
    },
    [productId, setCart]
  )

  function onRemoveVariationClicked(
    variation: CartItemVariation,
    index: number
  ) {
    updateCartItemVariation((oldItem) => {
      const variation = oldItem.variations![index]
      return {
        ...oldItem,
        quantity: oldItem.quantity - variation.quantity,
        variations: [
          ...oldItem.variations!.slice(0, index),
          ...oldItem.variations!.slice(index + 1),
        ],
      }
    })

    updateSharedSlots(
      {
        ...tempCartItemProps.tempCartItem,
        quantity: 0,
        variation,
      },
      primaryVariant,
      subVariants,
      setSlotUsage
    )
  }

  const onUpdateVariation = useCallback(() => {
    updateCartItemVariation((oldItem) => {
      setCurrEditingVariation(undefined)
      return {
        ...oldItem,
        variations: [
          ...oldItem.variations!.slice(0, currEditingVariationIndex),
          {
            ...tempCartItemProps.tempCartItem.variation,
            [specialVariantIds.quantity]:
              tempCartItemProps.tempCartItem.quantity,
          },
          ...oldItem.variations!.slice(currEditingVariationIndex + 1),
        ],
      }
    })

    updateSharedSlots(
      tempCartItemProps.tempCartItem,
      primaryVariant,
      subVariants,
      setSlotUsage
    )
  }, [
    currEditingVariationIndex,
    primaryVariant,
    setSlotUsage,
    subVariants,
    tempCartItemProps.tempCartItem,
    updateCartItemVariation,
  ])

  const modal = useMemo(() => {
    if (currEditingVariation === undefined) return

    return (
      <UpdateVariationModal
        checkoutItemId={checkoutItemId}
        cartItemVariation={currEditingVariation}
        onUpdateClicked={onUpdateVariation}
        onCancelClicked={() => setCurrEditingVariation(undefined)}
        primaryVariant={primaryVariant}
        subVariants={subVariants}
        {...tempCartItemProps}
        currency={currency}
        getSlotAmount={getSlotAmount}
        setSlotUsage={setSlotUsage}
        productName={productName}
        checkoutItemPluralName={checkoutItemPluralName}
        stock={stock}
      />
    )
  }, [
    currEditingVariation,
    checkoutItemId,
    onUpdateVariation,
    primaryVariant,
    subVariants,
    tempCartItemProps,
    currency,
    getSlotAmount,
    setSlotUsage,
    productName,
    checkoutItemPluralName,
    stock,
  ])

  return (
    <section className={styles.productVariationsCartSection}>
      <header>Your selections</header>
      {cartItem?.variations ? (
        <div className={styles.cartItemContainer}>
          {cartItem.variations.map((v, i) => (
            <div key={i} className={styles.cartItem}>
              <div className={styles.dataColumn}>{renderVariantData(v)}</div>
              <div className={styles.buttonsColumn}>
                <CartIconButtons
                  onEditClicked={() => onEditVariationClicked(v, i)}
                  onRemoveClicked={() => onRemoveVariationClicked(v, i)}
                  editAltText="Edit item"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.emptyCartMessage}>
          You haven&apos;t added any{' '}
          {checkoutItemPluralName.toLocaleLowerCase()} to cart yet!
        </p>
      )}
      {modal}
    </section>
  )
}
