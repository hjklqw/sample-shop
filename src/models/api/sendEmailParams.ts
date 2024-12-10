import { Cart } from '../cart'
import { Currency } from '../currency'

export interface SendEmailParams {
  orderId: string
  cart: Cart
  currency: Currency
  customerEmail: string
}
