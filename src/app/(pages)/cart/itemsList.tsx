'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ROUTES } from '@/constants/routes'
import { Cart } from '@/models/cart'
import { Currency } from '@/models/currency'
import { variationToString } from '@/utils/cart'

import { CartIconButtons } from '@/components/cartIconButtons'
import { ProductPrice } from '@/components/price'
import { QuantityInput } from '@/components/quantityInput'

import styles from './styles.module.scss'

import { CartProduct } from './models'
import { RemoveItemDialog } from './removeItemDialog'

type Props = {
  products: CartProduct[]
  currency: Currency
  setCart: (newCart: (oldCart: Cart) => Cart) => void
}

// Because `products` is a reversed version of `cart`, we use `.find()` to get the right product to edit
// rather than relying on indices. This /is/ a bit slower, but the speed is negligible in the scope of this small amount of products,
// and is a lot more robust as well.
export const CartItemsList = ({ products, currency, setCart }: Props) => {
  const [showRemoveItemDialog, setShowRemoveItemDialog] =
    useState<boolean>(false)
  const [currEditingProductId, setCurrEditingProductId] = useState<string>()

  const router = useRouter()

  function onCancelDialogClicked() {
    setShowRemoveItemDialog(false)
    setCurrEditingProductId(undefined)
  }

  function onRemoveItemFromDialogClicked() {
    removeItem(currEditingProductId!)
    onCancelDialogClicked()
  }

  function removeItem(productId: string) {
    setCart((items) => {
      const index = items.findIndex((item) => item.productId === productId)
      return [...items.slice(0, index), ...items.slice(index + 1)]
    })
  }

  function onEditVariationFromDialogClicked() {
    const productSlug = products.find(
      (p) => p._id === currEditingProductId
    )!.slug
    editVariation(productSlug)
  }

  function editVariation(productSlug: string) {
    router.push(ROUTES.product(productSlug))
  }

  function updateItemQuantity(productId: string, newQuantity: number) {
    setCart((items) => {
      const index = items.findIndex((item) => item.productId === productId)
      const item = items[index]
      return [
        ...items.slice(0, index),
        { ...item, quantity: newQuantity },
        ...items.slice(index + 1),
      ]
    })
  }

  if (products.length === 0) {
    return <p>Your cart is empty!</p>
  }

  return (
    <section className={styles.productsList}>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const editQuantityInPlace = p.primaryVariant === undefined
            return (
              <tr key={p._id}>
                <td className={styles.product}>
                  <div className={styles.image}>
                    <Link href={ROUTES.product(p.slug)}>
                      <Image
                        src={`/products/${p.slug}/0.png`}
                        alt={p.name}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </Link>
                  </div>
                  <div className={styles.data}>
                    {p.isPreorderItem && (
                      <span className={styles.preorderLabel}>PREORDER</span>
                    )}
                    <Link href={ROUTES.product(p.slug)}>
                      <span className={styles.productName}>{p.fullName}</span>
                    </Link>
                    <div className={styles.variationsList}>
                      {p.variations?.map((variation, i) => (
                        <div className={styles.variation} key={i}>
                          {
                            variationToString(
                              variation,
                              currency,
                              p.primaryVariant!,
                              p.subVariants
                            ) as string
                          }
                        </div>
                      ))}
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.quantityCell}>
                    {editQuantityInPlace ? (
                      <QuantityInput
                        defaultQuantity={p.quantity}
                        max={p.stock as number}
                        onChange={(newQuantity) =>
                          updateItemQuantity(p._id, newQuantity)
                        }
                        className={styles.quantityInput}
                      />
                    ) : (
                      <span>{p.quantity}</span>
                    )}
                    <CartIconButtons
                      hideEditButton={editQuantityInPlace}
                      editAltText="Edit the quantity per-design"
                      onEditClicked={() => editVariation(p.slug)}
                      onRemoveClicked={() => {
                        setCurrEditingProductId(p._id)
                        if (
                          p.primaryVariantName &&
                          (p.variations?.length || 0) > 1
                        ) {
                          setShowRemoveItemDialog(true)
                        } else {
                          removeItem(p._id)
                        }
                      }}
                    />
                  </div>
                </td>
                <td>
                  <ProductPrice
                    currency={currency}
                    prices={p.allPrices}
                    quantity={p.quantity}
                    checkoutItemQuantity={p.checkoutItemQuantity}
                    sale={p.sale}
                    className={styles.priceCell}
                    specialVariantDiscount={p.specialVariantDiscount}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {currEditingProductId && (
        <RemoveItemDialog
          isOpen={showRemoveItemDialog}
          onEditVariationClicked={onEditVariationFromDialogClicked}
          onRemoveAllClicked={onRemoveItemFromDialogClicked}
          onCancelClicked={onCancelDialogClicked}
        />
      )}
    </section>
  )
}
