import { specialVariantIds } from '@/constants/specialIds'
import { Cart } from '@/models/cart'
import { ProductDocument, Products } from '@/models/db/product'
import { getVariantOptionStock } from '@/utils/getVariantOption'

export async function updateStock(cart: Cart) {
  const productIds = cart.map((item) => item.productId)
  const products = await Products.find(
    { _id: { $in: productIds } },
    '_id stock primaryVariant subVariants'
  ).lean<ProductDocument[]>()

  type UpdateDataForProductWithVariants = {
    path: string
    newStock: number
  }[]

  const newStocks: {
    [productId: string]: number | UpdateDataForProductWithVariants
  } = {}

  try {
    cart.forEach((item) => {
      const product = products.find((p) => p._id.toString() === item.productId)
      if (product === undefined) return

      const productId = product._id.toString()

      if (product.stock === undefined) {
        console.log(
          `[updateStock] No stock set for ${product._id}; stock will not be updated for this product.`
        )
        return
      }

      if (!item.variations) {
        newStocks[productId] = (product.stock as number) - item.quantity
        return
      }

      item.variations.forEach((variation) => {
        const variationChoices = Object.entries(variation)
        const hasSubvariantChoices = variationChoices.length > 2

        variationChoices.forEach(([id, value]) => {
          if (id === specialVariantIds.quantity) return

          const isPrimaryVariant = id === product.primaryVariant?.id
          if (isPrimaryVariant && hasSubvariantChoices) return

          const variant = isPrimaryVariant
            ? product.primaryVariant
            : product.subVariants?.find((s) => s.id === id)
          if (!variant) return

          const option = variant.options.find((o) =>
            typeof o === 'string' ? o === value : o.name === value
          )
          if (!option) return

          const primaryOptionName = isPrimaryVariant
            ? value
            : variation[product.primaryVariant!.id]

          const data = {
            path: isPrimaryVariant
              ? primaryOptionName
              : `${primaryOptionName}.${value}`,
            newStock:
              getVariantOptionStock(
                product.stock,
                option,
                isPrimaryVariant,
                primaryOptionName
              ) - variation[specialVariantIds.quantity],
          }

          if (productId in newStocks) {
            ;(newStocks[productId] as UpdateDataForProductWithVariants).push(
              data
            )
          } else {
            newStocks[productId] = [data]
          }
        })
      })
    })
  } catch (error) {
    console.error(`[updateStock] Failed to create newStocks`, cart, error)
    return
  }

  try {
    const stockUpdateQueries = Object.entries(newStocks).map(
      ([productId, data]) => {
        if (typeof data === 'number') {
          return {
            updateOne: {
              filter: { _id: productId },
              update: { stock: data },
            },
          }
        }

        const update = data.reduce((res, d) => {
          const newKvp = {
            [`stock.${d.path}`]: d.newStock,
          }
          return { ...res, ...newKvp }
        }, {})
        return {
          updateOne: {
            filter: { _id: productId },
            update,
          },
        }
      }
    )
    await Products.bulkWrite(stockUpdateQueries)
  } catch (error) {
    console.error(`[updateStock] Failed to update stock for cart`, cart, error)
  }
}
