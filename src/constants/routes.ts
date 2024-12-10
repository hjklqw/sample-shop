export const ROUTES = {
  home: '/',
  products: '/products',
  collections: '/collections',
  category: (slug: string) => `/category/${slug}`,
  links: '/links',
  cart: '/cart',
  order: (id: string) => `/order?success=${id}`,
  collection: (slug: string) => `/collection/${slug}`,
  product: (slug: string) => `/product/${slug}`,
  api: {
    homepage: '/api/homepage',
    collection: (slug: string) => `/api/collection/${slug}`,
    collectionsList: '/api/collection',
    category: (slug: string) => `/api/category/${slug}`,
    checkout: '/api/checkout',
    product: (slug: string) => `/api/products/${slug}`,
    productsList: (options?: { ids?: string[]; forCart?: boolean }) => {
      let base = '/api/products'
      if (options && Object.keys(options).length > 0) {
        base += '?'
      }
      if (options?.ids) {
        base += options.ids
          .map((id, index) => (index > 0 ? `&ids=${id}` : `ids=${id}`))
          .join('')
      }
      if (options?.forCart) {
        if (!base.endsWith('?')) base += '&'
        base += 'forCart=true'
      }
      return base
    },
    productsForCartMigration: '/api/cartMigration',
    getOrder: (checkoutSessionId: string) =>
      `/api/order?checkoutSessionId=${checkoutSessionId}`,
    admin: {
      orders: '/api/admin/orders',
    },
  },
}
