# UniinX Storefront

Responsive ecommerce storefront for UniinX, built with Shopify Hydrogen and
React Router.

## What is included

- Dynamic Shopify catalog, collection, product, search, cart, and account flows
- Responsive layouts for desktop, tablet, and mobile browsers
- Accessible navigation, dialogs, sheets, and accordions using Radix Primitives
- Semantic design tokens and reusable shadcn-style UI components
- Server rendering and deployment support through Shopify Oxygen

## Technology

- Shopify Hydrogen
- React and React Router
- Vite and Tailwind CSS
- Radix Primitives
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

## Quality checks

Run the complete validation gate:

```bash
npm run ci
```

Individual commands are also available:

```bash
npm test
npm run lint
npm run build
```

## Project structure

```text
app/
  components/   Shared storefront and UI components
  lib/          Catalog, theme, and application utilities
  routes/       React Router storefront routes
  styles/       Semantic tokens and global styles
public/         Static public assets
```

Reusable primitives live in `app/components/ui`, while the semantic color,
spacing, typography, motion, and responsive values live in
`app/styles/tokens.css`.

## Deployment

Deployments are performed by authorized maintainers through the configured
CI/CD environment. Deployment credentials, environment variable names,
storefront identifiers, workflow identifiers, and production URLs are
intentionally not documented in this public file.

## Security

- Never commit `.env` files, access tokens, customer data, or deployment keys.
- Do not place secrets in client-visible variables or source code.
- Share operational configuration only through approved private channels.
- Report suspected credential exposure privately to a project maintainer.
