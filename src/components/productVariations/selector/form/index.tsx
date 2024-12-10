'use client'

import dynamic from 'next/dynamic'
import {
  ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  BaseUpdateVariationFunc,
  GetAmountLeftFunc,
  KvpOrString,
  ReplaceVariationFunc,
} from '../../models'
import {
  AmountLeftMessage,
  minAmountLeftBeforeMessage,
} from '../amountLeftMessage'

import { Currency } from '@/models/currency'
import { Variant } from '@/models/db/product'
import { isVariantOptionPaid } from '@/utils/getVariantOption'

import { VariationPriceText } from '@/components/variationPriceText'

import styles from './styles.module.scss'

import { CheckmarkIcon } from './CheckmarkIcon'
import { VariationFormProps } from './models'

const variantFormComponents: {
  [id: string]: ComponentType<VariationFormProps>
} = {
  customMessage: dynamic(() => import('./byId/customMessage')),
  customImage: dynamic(() => import('./byId/customImage')),
}

type Props = {
  variant: Variant
  currency: Currency
  updateVariation: BaseUpdateVariationFunc
  replaceVariation: ReplaceVariationFunc
  data: any
  getAmountLeft: GetAmountLeftFunc
}

export const VariantForm = ({
  variant,
  currency,
  updateVariation: baseUpdateVariation,
  replaceVariation,
  data,
  getAmountLeft,
}: Props) => {
  if (
    variant.options === undefined ||
    variant.options.length === 0 ||
    typeof variant.options[0] === 'string'
  ) {
    throw new Error(
      `Invalid variant options for form ${variant.id} (${variant.name})!`
    )
  }

  const VariantFormComponent = variantFormComponents[variant.id]
  const config = variant.options[0]

  const [isChecked, setChecked] = useState<boolean>(false)
  const dataBackup = useRef()
  const justBackedUp = useRef<boolean>(false)

  useEffect(() => {
    if (data === undefined) {
      setTimeout(() => {
        setChecked(false)
        if (!justBackedUp.current) {
          dataBackup.current = undefined
        } else {
          justBackedUp.current = false
        }
      }, 10)
    } else {
      setTimeout(() => {
        setChecked(true)
      }, 10)
    }
  }, [data])

  useEffect(
    () => {
      if (isChecked === false && data !== undefined) {
        dataBackup.current = data
        justBackedUp.current = true
        replaceVariation(variant.id, undefined)
      } else if (isChecked === true && data === undefined) {
        replaceVariation(variant.id, dataBackup.current)
        dataBackup.current = undefined
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isChecked]
  )

  const updateVariation = useCallback(
    (kvp: KvpOrString) => baseUpdateVariation(variant.id, kvp),
    [baseUpdateVariation, variant.id]
  )

  const amountLeft = getAmountLeft(config)
  const isSoldOut = amountLeft === 0

  const amountLeftMessage = useMemo(() => {
    if (amountLeft === -1) return
    if (amountLeft > minAmountLeftBeforeMessage) {
      return (
        <span className={styles.xSlotsAvailableMessage}>
          ({amountLeft} slots available)
        </span>
      )
    }
    return (
      <AmountLeftMessage
        amountLeft={amountLeft}
        type={config.sharedSlotId || config.slots ? 'slot' : undefined}
        className={styles.amountLeftMessage}
      />
    )
  }, [amountLeft, config.sharedSlotId, config.slots])

  return (
    <div
      className={`${styles.variantFormContainer} ${
        isSoldOut ? styles.disabled : ''
      } `}
    >
      <div
        className={`${styles.header} ${isChecked ? styles.checked : ''}`}
        onClick={isSoldOut ? undefined : () => setChecked((v) => !v)}
      >
        <div className={styles.checkbox}>{isChecked && <CheckmarkIcon />}</div>
        <div className={styles.text}>
          <span className={styles.variantName}>
            {variant.name}
            {isSoldOut ? (
              ' [SOLD OUT]'
            ) : isVariantOptionPaid(config) ? (
              <VariationPriceText data={config.price} currency={currency} />
            ) : null}
          </span>
          {amountLeftMessage}
        </div>
      </div>
      {isChecked && !isSoldOut && (
        <VariantFormComponent data={data} updateVariation={updateVariation} />
      )}
    </div>
  )
}
