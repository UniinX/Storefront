# UniinX Storefront

The production Shopify Hydrogen storefront for UniinX, deployed to Shopify Oxygen.

## Runtime

- Node.js 24
- Shopify Hydrogen and Oxygen
- React Router 7
- Vite
- npm lockfile installs

## Local development

Install dependencies and link the checkout to the UniinX Hydrogen storefront:

```bash
npm ci
npx shopify hydrogen link
npm run dev
```

Local secrets belong in `.env`, which is ignored by Git. Do not commit storefront tokens or deployment credentials.

## Release validation

Run the complete release gate locally:

```bash
npm run ci
```

This runs the test suite, ESLint, GraphQL code generation, and the production Oxygen build.

## Oxygen deployment

The project is linked to the Shopify Hydrogen storefront `uniinx`.

Deploy the current commit to production:

```bash
npm run deploy
```

Deploy to the Oxygen preview environment:

```bash
npm run deploy:preview
```

## GitHub CI/CD

`.github/workflows/oxygen-deployment-1000166069.yml` validates pull requests and pushes. Push events deploy only after tests, lint, and the production build succeed.

Add this encrypted repository Actions secret before enabling automated deployment:

```text
OXYGEN_DEPLOYMENT_TOKEN_1000166069
```

The workflow exposes it to Shopify CLI as `SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN`. Generate the token from the Hydrogen storefront's Oxygen deployment settings or connect the repository through Shopify's GitHub integration.

## Oxygen environment variables

Shopify provisions the standard Storefront API and Customer Account variables when the Hydrogen storefront is created. Configure these application-specific values for the production and preview environments as needed:

```text
ADMIN_PASSCODE
SHOPIFY_TEST_MODE
```

`SESSION_SECRET` must also be present; Shopify normally provisions it for Oxygen environments.
