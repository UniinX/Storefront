# UniinX Storefront

[![Deploy to Oxygen](https://github.com/UniinX/Storefront/actions/workflows/oxygen-deployment-1000166069.yml/badge.svg)](https://github.com/UniinX/Storefront/actions/workflows/oxygen-deployment-1000166069.yml)
[![Wiki](https://img.shields.io/badge/docs-wiki-blue)](https://github.com/UniinX/Storefront/wiki)

UniinX is an Indian streetwear and lifestyle brand built around typography and native scripts. This repository is its production storefront: a responsive, server-rendered ecommerce experience built on **Shopify Hydrogen** and **React Router**, deployed to **Shopify Oxygen**.

## Documentation

This README covers the basics. For anything deeper — architecture, the product taxonomy data model, how the mega menu works, the internal admin console, testing conventions, deployment — see the **[project wiki](https://github.com/UniinX/Storefront/wiki)**.

## What is included

- Dynamic Shopify catalog, collection, product, search, cart, and account flows
- A member account area, including a client-side wishlist
- An internal `/admin` console for managing product designs, garment families, and catalog publishing against the Shopify Admin API
- Responsive layouts for desktop, tablet, and mobile browsers
- Accessible navigation, dialogs, sheets, and accordions using Radix Primitives
- Semantic design tokens and reusable shadcn-style UI components
- Server rendering and deployment support through Shopify Oxygen

## Technology

- Shopify Hydrogen
- React and React Router
- Vite and Tailwind CSS
- Radix Primitives
- Framer Motion
- Vitest and Testing Library

## Requirements

- Node.js 22 or 24
- npm
- Authorized access to the project's development environment configuration

## Local development

Install dependencies:

```bash
npm ci
```

Obtain the development environment configuration through the team's approved
secret-sharing process and store it in a local `.env` file. Environment files
and credentials must never be committed.

Start the development server:

```bash
npm run dev
```

See the wiki's **[Getting Started](https://github.com/UniinX/Storefront/wiki/Getting-Started)** page for the full environment variable list and what the `/admin` console additionally needs.

## Quality checks

Run the complete validation gate:

```bash
npm run ci
```

Individual commands are also available:

```bash
npm test               # Vitest
npm run lint            # ESLint
npm run build            # Production build (with GraphQL codegen)
npm run codegen          # Regenerate storefrontapi.generated.d.ts only
```

## Project structure

```text
app/
  components/   Shared storefront and UI components
    ds/         Design-system primitives used for product rendering
    ui/         Radix-based low-level primitives (accordion, sheet, button, ...)
    product/    PDP/PLP components (Configurator, ProductInfo, CatalogFilters, ...)
  context/      App-wide React context (e.g. wishlist)
  lib/          Catalog, admin, and other framework-agnostic utilities
  routes/       React Router file-based routes, including the internal /admin console
  styles/       Semantic design tokens and global styles
public/         Static public assets
```

Reusable primitives live in `app/components/ui`, while the semantic color,
spacing, typography, motion, and responsive values live in
`app/styles/tokens.css`. Product-facing logic that isn't purely presentational
(parsing, filtering, search-query building) belongs in `app/lib`, not scattered
across components — see the wiki's **[Architecture](https://github.com/UniinX/Storefront/wiki/Architecture)**
page.

## Deployment

Deployments run automatically on Shopify Oxygen via GitHub Actions on every
push to `main`. Deployment credentials, environment variable names, storefront
identifiers, and production URLs are intentionally not documented in this
public file — see the wiki's **[Deployment](https://github.com/UniinX/Storefront/wiki/Deployment)**
page for what is safe to document publicly.

## Security

- Never commit `.env` files, access tokens, customer data, or deployment keys.
- Do not place secrets in client-visible variables or source code.
- Share operational configuration only through approved private channels.
- Report suspected credential exposure privately to a project maintainer.

## Contributing

- Run `npm run ci` before opening a pull request — it's the same gate CI runs.
- New logic in `app/lib` should be test-driven: write the failing test first.
- If you're touching hover/CSS-positioning behavior, verify in an actual
  browser, not just the test suite — see the wiki's
  **[Testing](https://github.com/UniinX/Storefront/wiki/Testing)** page for why.
