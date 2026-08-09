import {useLoaderData, Link} from 'react-router';
import {adminQueryAll, requireAdmin} from '~/lib/admin';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Garment Catalog'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  requireAdmin(context);
  const {env} = context;
  let products = [];
  let loadError = null;

  try {
    products = await adminQueryAll(
      `/* GraphQL */
      query GetAdminCatalogProducts($after: String) {
        products(first: 100, after: $after, query: "tag:uniinx-admin-created") {
          nodes {
            id
            title
            status
            vendor
            productType
            metafields(first: 10, keys: ["custom.qikink_status", "custom.catalog_status", "custom.family_value", "custom.color"]) {
              nodes {
                key
                value
              }
            }
            productFamily: metafield(namespace: "custom", key: "product_family") {
              reference { ... on Metaobject { id displayName handle } }
            }
          }
          pageInfo {hasNextPage endCursor}
        }
      }
      `,
      {},
      env,
      (response) => response?.data?.products,
    );
  } catch (e) {
    console.error('Failed fetching catalog products:', e);
    loadError = e instanceof Error ? e.message : String(e);
  }

  return {products, loadError};
}

export default function AdminProducts() {
  /** @type {LoaderReturnData} */
  const {products, loadError} = useLoaderData();

  return (
    <div className="flex flex-col gap-8 animate-fade-in text-black dark:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-marcellus text-2xl uppercase">
            Garment Catalog
          </h3>
          <p className="font-work text-xs text-black/50 dark:text-white/40 mt-1">
            Browse and manage created garments pending Qikink mapping and QA reviews.
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="w-fit px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-work text-[10px] tracking-wider uppercase font-semibold hover:opacity-90 cursor-pointer shadow-md transition-all whitespace-nowrap"
        >
          Create Garment Product
        </Link>
      </div>

      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10" />

      {loadError && <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 font-work text-xs">Shopify catalog could not be loaded: {loadError}</div>}

      {/* Product List */}
      {!products.length ? (
        <div className="py-12 border border-dashed border-black/10 dark:border-white/10 rounded-2xl text-center flex flex-col items-center">
          <span className="font-work text-xs text-black/40 dark:text-white/40 mb-4">
            {loadError ? 'Catalog unavailable. Resolve the Shopify API error above and retry.' : 'No products created from this admin console yet.'}
          </span>
          <Link
            to="/admin/products/new"
            className="px-5 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-work text-[9px] tracking-wider uppercase font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            Create Your First Garment
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {products.map((product) => {
            const metafields = {};
            for (const mf of product.metafields?.nodes ?? []) {
              metafields[mf.key] = mf.value;
            }

            const qikinkStatus = metafields.qikink_status || 'Not Mapped';
            const catalogStatus = metafields.catalog_status || 'Draft';

            return (
              <div
                key={product.id}
                className="border border-black/5 dark:border-white/5 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-surface-light dark:bg-brand-surface-dark transition-all duration-200"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-marcellus text-base text-black dark:text-white font-medium">
                    {product.title}
                  </span>
                  <span className="font-work text-[10px] text-black/45 dark:text-white/40">
                    Type: {product.productType || 'Unassigned'} · Vendor: {product.vendor}
                  </span>
                  <span className="font-work text-[10px] text-black/45 dark:text-white/40">
                    Family: {product.productFamily?.reference?.displayName || 'Unassigned'} · Value: {metafields.family_value || metafields.color || 'Unassigned'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`font-work text-[8px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
                    product.status === 'ACTIVE'
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                      : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                  }`}>
                    Shopify: {product.status}
                  </span>
                  <span className={`font-work text-[8px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400`}>
                    Qikink: {qikinkStatus}
                  </span>
                  <span className={`font-work text-[8px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/40`}>
                    Catalog: {catalogStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** @typedef {import('./+types/admin.products').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
