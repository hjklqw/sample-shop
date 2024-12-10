'use client'

import Link from 'next/link'

import { useAtomValue } from 'jotai'

import { ROUTES } from '@/constants/routes'
import { buildClassName } from '@/utils/classNames'

import styles from './styles.module.scss'

import { CartIcon } from './icons/cartIcon'
import { cartAtom } from '@/state/atoms/cart'

type Props = {
  className?: string
}

export const HeaderCartButton = ({ className }: Props) => {
  const cart = useAtomValue(cartAtom)

  const numItems = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <Link href={ROUTES.cart} className={styles.cartButton}>
      {numItems > 0 && (
        <span className={buildClassName(styles.numItemsIndicator, className)}>
          {numItems}
        </span>
      )}
      <CartIcon />
    </Link>
  )
}
