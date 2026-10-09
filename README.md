# SHAWTYSLAYZ — Finale storefront concept

A polished front-end ecommerce concept built with Next.js 16 App Router, React 19, TypeScript, Motion, Tailwind CSS, `next/image`, and locally bundled Archivo / DM Sans fonts.

## Run locally

```sh
npm install
npm run dev
```

Open the local address printed by Next.js. Useful verification commands:

```sh
npm run lint
npm run typecheck
npm run build
```

For a production-style preview, run `npm run start` after building.

## What is implemented

- Editorial SHAWTYSLAYZ homepage with desktop and mobile layouts
- Product quick-shop drawer with gallery, fit/fabric/care info, size selection, and price
- Cart with size-aware line items, quantities, totals, and delivery preview
- Two-step “Find Your Pair” shopping flow
- Search across products, colours, categories, and moods
- Checkout preview with delivery details, payment choice, and order confirmation
- Cash-on-delivery and online-payment UI states
- Sizing, shipping, exchange/return, order-help, privacy, terms, and contact panels
- Mobile navigation and accessible focus trapping for overlays
- Community/Instagram editorial section without fabricated customer reviews
- Purposeful motion only for drawers, hero entry, and subtle product interactions
- Native-feeling page scrolling rather than heavy smooth-scroll effects

## Prototype boundaries

This is still a front-end commercial concept, not a live transactional store. The checkout flow deliberately does **not** submit an order, store personal information on a server, or process payment credentials.

Product prices and the Rs. 250 delivery fee are sample values used to make the commerce flow realistic. Replace them with the owner’s confirmed catalogue and courier pricing before launch. Likewise, replace the sample sizing guidance with exact garment measurements and connect the final exchange/return policy.

The current image set is concept/demo imagery. Replace any image that does not precisely represent the product customers will receive.

Before commercial launch, connect:

- product/inventory source or CMS
- persistent cart/customer session if required
- real checkout backend
- payment gateway / cash-on-delivery order creation
- courier/shipping rates and fulfillment status
- order confirmation through email, SMS, or WhatsApp
- analytics and conversion tracking
- final privacy policy, terms, and exchange/return policy

The site remains excluded from search indexing while it is a concept preview.
