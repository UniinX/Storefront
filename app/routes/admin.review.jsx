import {Form, useLoaderData, useNavigation, useActionData} from 'react-router';
import {adminQuery, adminQueryAll, publishProductToStorefront, requireAdmin} from '~/lib/admin';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'QA & Publishing'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  requireAdmin(context);
  const {env} = context;
  let products = [];
  let loadError = null;
  const publicationId = env.SHOPIFY_STOREFRONT_PUBLICATION_ID;

  try {
    products = await adminQueryAll(
      `/* GraphQL */
      query GetReviewProducts($after: String${publicationId ? ', $publicationId: ID!' : ''}) {
        products(first: 100, after: $after, query: "tag:uniinx-admin-created") {
          nodes {
            id
            title
            description
            status
            handle
            featuredMedia { ... on MediaImage { image { altText } } }
            seo { title description }
            options { name values }
            ${publicationId ? 'publishedOnPublication(publicationId: $publicationId)' : ''}
            variants(first: 100) {
              nodes {
                id
                sku
                price
                inventoryQuantity
              }
            }
            productFamily: metafield(namespace: "custom", key: "product_family") {
              value
              reference {
                ... on Metaobject { id familyProducts: field(key: "products") { value } }
              }
            }
            metafields(first: 20, keys: [
              "custom.fit",
              "custom.material",
              "custom.size_guide",
              "custom.language",
              "custom.garment_type",
              "custom.design_story",
              "custom.design_reference",
              "custom.family_value",
              "custom.color",
              "custom.qikink_status",
              "custom.catalog_status"
            ]) {
              nodes {
                key
                value
              }
            }
          }
          pageInfo {hasNextPage endCursor}
        }
      }
      `,
      publicationId ? {publicationId} : {},
      env,
      (response) => response?.data?.products,
    );
  } catch (e) {
    console.error('Failed fetching review products:', e);
    loadError = e instanceof Error ? e.message : String(e);
  }

  return {products, loadError, publicationConfigured: Boolean(publicationId)};
}

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  requireAdmin(context);
  const {env} = context;
  const formData = await request.formData();

  const productId = formData.get('productId')?.toString();
  const actionType = formData.get('actionType')?.toString();

  if (!productId) {
    return {error: 'Missing product ID.'};
  }

  const setMetafields = async (entries) => {
    const mutation = `/* GraphQL */
      mutation SetReviewMetafield($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const metafields = entries.map(([key, value]) => ({
        ownerId: productId,
        namespace: 'custom',
        key,
        value,
        type: 'single_line_text_field',
      }));
    const response = await adminQuery(mutation, {metafields}, env);
    const errors = response?.data?.metafieldsSet?.userErrors;
    if (errors?.length) {
      throw new Error(errors.map(({message}) => message).join('; '));
    }
    return response;
  };

  try {
    switch (actionType) {
      case 'QIKINK_MAPPED':
        await setMetafields([
          ['qikink_status', 'Mapped'],
          ['catalog_status', 'QA Pending'],
        ]);
        break;

      case 'QIKINK_TESTED':
        await setMetafields([['qikink_status', 'Tested']]);
        break;

      case 'QA_APPROVE':
        await setMetafields([['catalog_status', 'Ready']]);
        break;

      case 'PUBLISH': {
        const qaResponse = await adminQuery(
          `/* GraphQL */
            query ValidateProductForPublication($id: ID!) {
              product(id: $id) {
                id description status
                featuredMedia { ... on MediaImage { image { altText } } }
                seo { title description }
                options { name }
                variants(first: 100) { nodes { sku inventoryQuantity } }
                metafields(first: 20, keys: [
                  "custom.catalog_status", "custom.qikink_status", "custom.size_guide",
                  "custom.fit", "custom.material", "custom.language", "custom.garment_type",
                  "custom.design_reference", "custom.family_value", "custom.color"
                ]) { nodes { key value } }
                productFamily: metafield(namespace: "custom", key: "product_family") {
                  value
                  reference { ... on Metaobject { products: field(key: "products") { value } } }
                }
              }
            }
          `,
          {id: productId},
          env,
        );
        const product = qaResponse?.data?.product;
        if (!product) throw new Error('Product was not found.');
        const values = Object.fromEntries((product.metafields?.nodes ?? []).map(({key, value}) => [key, value]));
        let familyProducts = [];
        try { familyProducts = JSON.parse(product.productFamily?.reference?.products?.value || '[]'); } catch { /* handled below */ }
        const blockers = [
          !product.description && 'description',
          !product.featuredMedia && 'product image',
          product.featuredMedia && !product.featuredMedia.image?.altText && 'image alt text',
          (!product.seo?.title || !product.seo?.description) && 'SEO title/description',
          product.options?.some(({name}) => name.toLowerCase() === 'color') && 'color-as-product-family migration',
          product.variants?.nodes?.some(({sku, inventoryQuantity}) => !sku || !(inventoryQuantity > 0)) && 'SKU/inventory',
          !product.productFamily?.value && 'Product Family reference',
          product.productFamily?.value && !familyProducts.includes(productId) && 'Product Family membership',
          (!values.family_value && !values.color) && 'family value/color',
          (!values.design_reference || !values.language || !values.garment_type || !values.fit || !values.material || !values.size_guide) && 'required metafields',
          values.qikink_status !== 'Tested' && 'Qikink test',
          values.catalog_status !== 'Ready' && 'QA approval',
        ].filter(Boolean);
        if (blockers.length) throw new Error(`Publishing blocked. Complete: ${blockers.join(', ')}.`);
        await publishProductToStorefront(productId, env);
        break;
      }

      default:
        return {error: 'Unsupported review action.'};
    }

    return {success: true};
  } catch (error) {
    return {error: error instanceof Error ? error.message : String(error)};
  }
}

export default function AdminReview() {
  /** @type {LoaderReturnData} */
  const {products, loadError, publicationConfigured} = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const familyValueCounts = new Map();
  for (const product of products) {
    const familyId = product.productFamily?.value;
    const value = product.metafields?.nodes?.find(({key}) => key === 'family_value')?.value
      || product.metafields?.nodes?.find(({key}) => key === 'color')?.value;
    if (familyId && value) {
      const key = `${familyId}:${value.toLowerCase()}`;
      familyValueCounts.set(key, (familyValueCounts.get(key) || 0) + 1);
    }
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in text-black dark:text-white">
      {/* Header */}
      <div>
        <h3 className="font-marcellus text-2xl uppercase">
          QA & Publishing Checklist
        </h3>
        <p className="font-work text-xs text-black/50 dark:text-white/40 mt-1">
          Review details, update Qikink mappings, verify test orders, and publish active products.
        </p>
      </div>

      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10" />

      {!publicationConfigured && (
        <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-yellow-700 dark:text-yellow-400 font-work text-xs">
          Storefront publication is not configured. Set SHOPIFY_STOREFRONT_PUBLICATION_ID before products can be marked live.
        </div>
      )}
      {loadError && <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 font-work text-xs">Shopify review data could not be loaded: {loadError}</div>}

      {actionData?.error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 font-work text-xs font-light">
          {actionData.error}
        </div>
      )}

      {/* Review items */}
      {!products.length ? (
        <div className="py-12 border border-dashed border-black/10 dark:border-white/10 rounded-2xl text-center">
          <span className="font-work text-xs text-black/40 dark:text-white/40">
            {loadError ? 'Review data unavailable. Resolve the Shopify API error above and retry.' : 'No products registered for review.'}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {products.map((product) => {
            const metafields = {};
            for (const mf of product.metafields?.nodes ?? []) {
              metafields[mf.key] = mf.value;
            }

            const fit = metafields.fit || '';
            const material = metafields.material || '';
            const sizeGuide = metafields.size_guide || '';
            const qikinkStatus = metafields.qikink_status || 'Not Mapped';
            const catalogStatus = metafields.catalog_status || 'Draft';
            const familyProducts = (() => {
              try { return JSON.parse(product.productFamily?.reference?.familyProducts?.value || '[]'); } catch { return []; }
            })();

            // Validations checklist
            const warnings = [];
            if (!product.description) warnings.push('Missing description content.');
            if (!product.featuredMedia) warnings.push('Missing product image.');
            if (product.featuredMedia && !product.featuredMedia.image?.altText) warnings.push('Product image is missing alt text.');
            if (!product.variants?.nodes?.length) warnings.push('No size variants created.');
            if (product.options?.some(({name}) => name.toLowerCase() === 'color')) warnings.push('Color must be a separate family product, not a variant option.');
            if (product.variants?.nodes?.some(({inventoryQuantity}) => !(inventoryQuantity > 0))) warnings.push('One or more variants have no available inventory.');
            if (!product.productFamily?.value) warnings.push('Missing custom.product_family reference.');
            if (product.productFamily?.value && !familyProducts.includes(product.id)) warnings.push('Product Family does not include this product in its products list.');
            if (!metafields.family_value && !metafields.color) warnings.push('Missing family value/color metafield.');
            const familyValue = metafields.family_value || metafields.color;
            if (product.productFamily?.value && familyValue && familyValueCounts.get(`${product.productFamily.value}:${familyValue.toLowerCase()}`) > 1) {
              warnings.push('Family value/color is duplicated within this Product Family.');
            }
            if (!metafields.language || !metafields.garment_type || !metafields.fit || !metafields.material) warnings.push('Required merchandising metafields are incomplete.');
            if (!metafields.design_reference) warnings.push('Missing design metaobject reference.');
            if (!product.seo?.title || !product.seo?.description) warnings.push('SEO title or description is missing.');
            if (!sizeGuide) warnings.push('Missing sizing guide operational metafield.');
            if (qikinkStatus !== 'Mapped' && qikinkStatus !== 'Tested') {
              warnings.push('Product is not mapped in Qikink.');
            }

            const canPublish =
              warnings.length === 0 &&
              catalogStatus === 'Ready' &&
              (product.status === 'DRAFT' || (product.status === 'ACTIVE' && !product.publishedOnPublication)) &&
              publicationConfigured;

            return (
              <div
                key={product.id}
                className="border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-brand-surface-light dark:bg-brand-surface-dark flex flex-col gap-5 shadow-sm"
              >
                {/* Title & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-marcellus text-base font-medium">
                      {product.title}
                    </h4>
                    <span className="font-work text-[9px] text-black/45 dark:text-white/40">
                      ID: {product.id.split('/').pop()} · Options: {product.variants?.nodes?.length} Variants
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-work text-[8px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
                      product.status === 'ACTIVE'
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {product.status}
                    </span>
                    <span className="font-work text-[8px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      Qikink: {qikinkStatus}
                    </span>
                    <span className="font-work text-[8px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/40">
                      Catalog: {catalogStatus}
                    </span>
                  </div>
                </div>

                {/* Warnings Section */}
                {warnings.length > 0 && (
                  <div className="p-4 rounded-xl border border-yellow-500/15 bg-yellow-500/5 text-yellow-700 dark:text-yellow-400 font-work text-[10px] flex flex-col gap-1">
                    <span className="font-semibold uppercase tracking-wider block mb-1">
                      ⚠️ Review Warnings
                    </span>
                    {warnings.map((w) => (
                      <span key={w}>• {w}</span>
                    ))}
                  </div>
                )}

                {/* Actions row */}
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-black/5 dark:border-white/5">
                  
                  {/* Mark mapped */}
                  {qikinkStatus === 'Not Mapped' && (
                    <Form method="POST">
                      <input type="hidden" name="productId" value={product.id} />
                      <input type="hidden" name="actionType" value="QIKINK_MAPPED" />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-work text-[9px] tracking-wider uppercase font-semibold rounded-full hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                      >
                        Mark Mapped
                      </button>
                    </Form>
                  )}

                  {/* Mark tested */}
                  {qikinkStatus === 'Mapped' && (
                    <Form method="POST">
                      <input type="hidden" name="productId" value={product.id} />
                      <input type="hidden" name="actionType" value="QIKINK_TESTED" />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-work text-[9px] tracking-wider uppercase font-semibold rounded-full hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                      >
                        Mark Tested
                      </button>
                    </Form>
                  )}

                  {/* QA Approval */}
                  {catalogStatus === 'QA Pending' && qikinkStatus === 'Tested' && (
                    <Form method="POST">
                      <input type="hidden" name="productId" value={product.id} />
                      <input type="hidden" name="actionType" value="QA_APPROVE" />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-green-600 text-white font-work text-[9px] tracking-wider uppercase font-semibold rounded-full hover:bg-green-700 transition-all cursor-pointer disabled:opacity-50"
                      >
                        Approve QA
                      </button>
                    </Form>
                  )}

                  {/* Publish */}
                  {canPublish && (
                    <Form method="POST">
                      <input type="hidden" name="productId" value={product.id} />
                      <input type="hidden" name="actionType" value="PUBLISH" />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-brand-accent dark:bg-brand-accent-light text-brand-bg-light dark:text-brand-bg-dark font-work text-[9px] tracking-wider uppercase font-bold rounded-full hover:opacity-95 transition-all cursor-pointer disabled:opacity-50 shadow-sm animate-pulse"
                      >
                        Publish to Storefront
                      </button>
                    </Form>
                  )}

                  {product.status === 'ACTIVE' && product.publishedOnPublication && (
                    <span className="font-work text-[10px] text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider">
                      ✓ Published to the configured Storefront
                    </span>
                  )}
                  {product.status === 'ACTIVE' && !product.publishedOnPublication && (
                    <span className="font-work text-[10px] text-yellow-600 dark:text-yellow-400 font-semibold uppercase tracking-wider">
                      Active in Shopify, not confirmed live on Storefront
                    </span>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** @typedef {import('./+types/admin.review').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
