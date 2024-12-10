export type CartItemVariation = { [id: string]: any }

export interface CartItem {
  productId: string
  quantity: number
  variations?: CartItemVariation[]
  checkoutItemId: string
}

/** Used as an auxiliary to store configurations before adding to cart. */
export type TempCartItem = Omit<CartItem, 'variations'> & {
  variation?: CartItemVariation
}

export type Cart = CartItem[]
