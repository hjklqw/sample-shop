'use client'

import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'

import { buildClassNames } from '@/utils/classNames'

import styles from './styles.module.scss'

type Props = {
  defaultQuantity: number
  max?: number
  onChange?: (newQuantity: number) => void
  className?: string
  isDisabled?: boolean
  hideMaximum?: boolean
}

export const QuantityInput = ({
  defaultQuantity,
  max = 50,
  onChange: customOnChange,
  className,
  isDisabled,
  hideMaximum,
}: Props) => {
  const [quantity, setQuantity] = useState<number>(defaultQuantity)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setQuantity(defaultQuantity)
  }, [defaultQuantity])

  const setNewQuantity = useCallback(
    (stringValue: string) => {
      const value = parseInt(stringValue)
      if (!Number.isNaN(value)) {
        const newValue = value <= max ? value : max
        setQuantity(newValue)
        customOnChange?.(newValue)
      }
    },
    [max, customOnChange]
  )

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setNewQuantity(e.target.value)
    },
    [setNewQuantity]
  )

  function onButtonClick(isUp: boolean) {
    const input = ref.current
    if (!input) return
    isUp ? input.stepUp() : input.stepDown()
    setNewQuantity(input.value)
  }

  if (max === 1) {
    return '1 (Last one!)'
  }

  return (
    <div
      className={buildClassNames(styles.quantityInput, className, {
        [styles.maximumHidden]: !!hideMaximum,
      })}
    >
      <button
        type="button"
        onClick={() => onButtonClick(false)}
        disabled={isDisabled}
      >
        -
      </button>
      <input
        ref={ref}
        type="number"
        value={quantity}
        onChange={onChange}
        min={1}
        max={max}
        disabled={isDisabled}
      />
      {!hideMaximum && <span className={styles.max}>Maximum: {max}</span>}
      <button
        type="button"
        onClick={() => onButtonClick(true)}
        disabled={isDisabled}
      >
        +
      </button>
    </div>
  )
}
