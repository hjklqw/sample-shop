export interface ClientSharedSlot {
  amount: number
  usage: {
    [productId: string]: {
      primaryVariant?: {
        [optionName: string]: number
      }
      subVariants?: {
        [variantId: string]: {
          [optionName: string]: {
            [primaryVariantValue: string]: number
          }
        }
      }
    }
  }
}

export interface ClientSharedSlots {
  [id: string]: ClientSharedSlot
}
