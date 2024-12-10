This is a clone of a live, low traffic, small-business e-commerce site that has taken and fulfilled real orders! It's integrated with Stripe as its payment processor, but handles all product info in its DB. This gives us maximum flexibility to do whatever we want; for example, this shop allows bulk discounts when you purchase multiple of the same item type (something that is unsupported by Stripe), even when across different products, and allows for variations that can be a dropdown, list of buttons, a toggle, or even a form.

**Note:** The live preview uses Stripe's Test mode to ensure that no real transactions will be processed. If you would like to test the payment flow, please use these [test card numbers](https://docs.stripe.com/testing) from Stripe's documentation.

# How things are setup

## Technologies

- React and Next.js 15 for a serverless architecture
- Jotai for state management (originally implemented with Recoil)
- MongoDB with Mongoose to store all shop data, including products and orders
- Stripe as the payment processor
- EmailJS for custom-coded order confirmation emails
- Mailchimp for mailing list subscriptions
- A public CDN for images to use in emails
- Google Analytics for site metrics
- Vercel for deployment

## Features

- Full-featured unique variation types (dropdown, list of buttons, toggles, and forms with custom data)
- Fully custom, component-based product descriptions
- Preorder support
- Bulk discount support
- Multi-level and type discount support, like sales on top of bulk discounts, with exact values as well as percentages
- Multi-currency support (eg. pricing per currency)
- Service-based variant support
- Free shipping when over a certain amount
- Fully responsive UI
- An [admin page](https://shop.michellepoon.ca/admin) to easily view orders

## User and internal flow

- Products are loaded from the DB and displayed to the user.
- When the buyer adds or removes something to cart, this is tracked in state. (Note: there are no user accounts in this shop)
- On the Cart page, prices are calculated client-side for display purposes. (Prices are re-calculated server side at checkout, so there is no security issue here)
- The product IDs, variations selected, and quantities of cart items are sent to the API at checkout, as well as the buyer's currency and country to determine shipping costs.
- Buyers are redirected to Stripe's checkout page; this is the only time Stripe comes into play in this app.
- A webhook checks that payment had actually succeeded. Their order is added to the DB, and a confirmation email is sent to them.
- Upon successful checkout, buyers are redirected to an order confirmation page.
  - If checkout was unsuccessful, they are redirected to the cart with an appropriate error message.

## Project architecture

### Directory structure

`/app` - Contains all the page routes, structured as Next.js requires.
`/components` - All share components that are used in multiple places throughout the app.
`/constants` - Same as above, but for constants.
`/models` - Stores types (interfaces, enums, etc.) that are used by the database, state, and expected api responses. These are also shared; types that are local to a certain component will be written in that component.
`/pageContents` - Essentially strips out what's inside the app directory for a cleaner browsing experience. This is currently mainly for more complex pages, where there are multiple sub-folders, icons, etc., but should technically be used for all pages to clean up the app directory and leave it only responsible for routing.
`/state` - Contains all state-related atoms and providers.
`/utils` - Shared utility functions used in multiple places. It is currently not split between API, client, and independent utils, but the filenames and/or JSDoc comments make clear where they are intended to be used.

### Database notes

There are two collections that may not have super clear role differences at first: `checkoutItem` and `product`.

Products are self-explanatory; they are a record of all the data associated with any single product on the site, including name, images, metadata, and etc. However, prices are _not_ set within each product--they are instead set in the product's associated Checkout Item.

A Checkout Item refers to what users see when they check out via Stripe's hosted page. Each checkout item is directly correlated with a Stripe product.

Why not just link individual DB products to Stripe products?

- Non-redundant definition of pricing for the same item type: A pattern commonly seen in small businesses, especially art-related ones, is that each item of the same type follows the exact same pricing and discount pattern. For example, all small prints are $x, large prints are $y, keychains are $a for 1 and $b for 2, and so on.
- This also allows for volume discounts based on type, another practice commonly seen in art shops, like in the keychain example above.
- This simplifies the setup on Stripe as well; instead of defining multiple items like "Red pillow", "Blue pillow", etc., you can simply define a single "Pillow" product, and keep track of the variant and any associated metadata yourself.

# Running locally

## Setup accounts and packages

1. Register for the following accounts, and add their keys to `.env`: Stripe, Mongo, EmailJs, and Mailchimp.
2. Setup collections on Mongo according to the models inside the `/src/models/db` directory
3. Follow the instructions in the below section to add products
4. Create a template on EmailJs using the provided `emailJsTemplate.html`, and add that template's ID to `.env`
5. Create a webhook on Stripe listening to the `completed` and `payment_failed` Checkout events, and point it to `https://shop.michellepoon.ca/api/order/webhook`
   a. Install the [Stripe CLI](https://docs.stripe.com/stripe-cli) to test this locally.
   b. Login with the command line (`stripe login`), then run the command `stripe listen --forward-to localhost:3000/api/order/webhook`, and paste the signing secret into `.env` (`STRIPE_WEBHOOK_SECRET`)
6. Run `pnpm i` to install the project
7. Run `pnpm dev` to launch the project

## Adding a new product

1. If the product type does not yet exist, add a new entry to the `checkoutItems` collection, and add the name of that entry to Stripe as a product there. Set to 'one-off' payment and $0 as the price (prices are determined by the DB).
2. Add a product to the `products` collection with the above checkoutItem and Stripe product's IDs
3. Add images for this product in `/public/products` by creating a folder with the product's slug. `0.png` will be the cover image for the product; all other images will serve as extra listing photos.
4. Add a thumbnail image for this product in a public CDN like Imgur, which is used in this project, and copy the image's ID to the product's `emailImageId` property.
5. Add a description component for this product in `/components/tabs/description`. Make sure to add the new component in the dynamic exports of `index.ts`, keyed by the slug of the product you had written in its DB entry.

# Design decisions

### Why MongoDB?

This was at first simply because I already had code for integrating MongoDB with React and Next.js, but as the project grew, it became clear that the JSON nature of MongoDB was very well suited to handling complex data structures such as variants. There is also a very low amount of in-document searching going on, making this a performant solution. While this all _could_ be done in a relational database, it would've been very complex and would require many joins to display a single product.

### Why Mailchimp when you already have EmailJs? (Or vice-versa)

Mailchimp was used in an older project for taking newsletter subscriptions. I decided to stick with it for ease of use, as well as the auto-onboarding flow for welcoming users and its audience management capabilities.

That said, anything beyond that would require a paid account. It also does not allow fully custom HTML emails, which are significantly more useful when sending order confirmation emails; thus, I decided to go with EmailJS for those, as it is a free solution that satisfies developer needs.

Basically, all of the decisions made in this project comes down to pricing and developer capabilities. For a low-traffic, small business site, the free tier of all the integrated services are more than sufficient. And because the code is not tightly coupled to any of those services, they can be replaced and upgraded as needed as the business grows.

### Why this rather lengthy flow for adding a product vs using a CMS like Sanity?

In short: pricing, freedom, and understanding of the person who runs this shop (eg. me, a developer).

The current flow allows me to add a theoretically infinite number of products, completely free of charge, and with all the metadata and customizations that I want, integrated type-safe and seamlessly into the app without needing any workarounds. As the shop has a small number of products and does not receive frequent updates, it is significantly better to allow myself complete control of every aspect of how I want the shop to be run. This includes component-based descriptions--something that would not be possible with a CMS--and specifying whether, when, how much, and with which currencies a certain type of product will receive bulk discounts with.

If this shop is to be maintained by a non-developer, then an admin portal will be created to greatly simplify the process of adding products. Component-based descriptions will be instead used as templates with rich-text support.
