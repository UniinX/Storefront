import {useLoaderData, Link} from 'react-router';
import {adminQueryAll, listDesignMetaobjects, requireAdmin} from '~/lib/admin';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Admin Dashboard'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  requireAdmin(context);
  const {env} = context;

  // Retrieve designs count
  let designsCount = 0;
  let schemaMissing = false;
  try {
    const designs = await listDesignMetaobjects(env);
    designsCount = designs.length;
  } catch (e) {
    console.error('Failed listing designs for count:', e);
    if (e instanceof Error && e.message === 'DESIGN_SCHEMA_MISSING') {
      schemaMissing = true;
    }
  }

  // Retrieve products for stats
  let products = [];
  const publicationId = env.SHOPIFY_STOREFRONT_PUBLICATION_ID;
  try {
    products = await adminQueryAll(
      `/* GraphQL */
      query GetAdminProducts($after: String${publicationId ? ', $publicationId: ID!' : ''}) {
        products(first: 100, after: $after, query: "tag:uniinx-admin-created") {
          nodes {
            id
            status
            ${publicationId ? 'publishedOnPublication(publicationId: $publicationId)' : ''}
            metafields(first: 10, keys: ["custom.qikink_status", "custom.catalog_status"]) {
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
    console.error('Failed fetching products for stats:', e);
  }

  // Calculate statistics
  const stats = {
    designsCount,
    totalProducts: products.length,
    awaitingQikink: 0,
    awaitingQA: 0,
    published: 0,
  };

  for (const prod of products) {
    if (prod.status === 'ACTIVE' && prod.publishedOnPublication) {
      stats.published++;
      continue;
    }

    const metafields = {};
    for (const mf of prod.metafields?.nodes ?? []) {
      metafields[mf.key] = mf.value;
    }

    const qikinkStatus = metafields.qikink_status || 'Not Mapped';
    const catalogStatus = metafields.catalog_status || 'Draft';

    if (qikinkStatus !== 'Mapped' && qikinkStatus !== 'Tested') {
      stats.awaitingQikink++;
    }

    if (catalogStatus === 'QA Pending') {
      stats.awaitingQA++;
    }
  }

  return {stats, schemaMissing, shopDomain: env.PUBLIC_STORE_DOMAIN, publicationConfigured: Boolean(publicationId)};
}

export default function AdminDashboard() {
  /** @type {LoaderReturnData} */
  const {stats, schemaMissing, shopDomain, publicationConfigured} = useLoaderData();

  return (
    <div className="flex flex-col gap-10 animate-fade-in text-black dark:text-white">
      {/* Banner */}
      <div>
        <span className="font-work text-xs tracking-[0.2em] text-brand-accent dark:text-brand-accent-light uppercase mb-2 block">
          Operational Center
        </span>
        <h2 className="font-marcellus text-3xl md:text-4xl uppercase font-light">
          Admin Dashboard
        </h2>
        <p className="font-work text-xs text-black/50 dark:text-white/40 mt-1">
          Monitor your design releases, variant publishing status, and product configurations.
        </p>
      </div>

      {schemaMissing && (
        <div className="p-6 rounded-2xl border border-yellow-500/25 bg-yellow-500/5 text-yellow-800 dark:text-yellow-400 font-work text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-semibold uppercase tracking-wider block mb-1">
              ⚠️ Admin Setup Incomplete
            </span>
            <p>Unable to retrieve Design metaobject definition type. Initialization is required before registration can begin.</p>
          </div>
          <Link
            to="/admin/setup"
            className="px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-[9px] tracking-wider uppercase whitespace-nowrap shadow-sm hover:opacity-90"
          >
            Run Setup Utility
          </Link>
        </div>
      )}
      {!publicationConfigured && (
        <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-yellow-700 dark:text-yellow-400 font-work text-xs">
          Storefront publication is not configured; active Shopify products are not counted as published.
        </div>
      )}

      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10" />

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard value={stats.designsCount} label="Active Designs" />
        <StatCard value={stats.awaitingQikink} label="Awaiting Qikink" />
        <StatCard value={stats.awaitingQA} label="Awaiting QA" />
        <StatCard value={stats.published} label="Published Products" />
      </div>

      {/* Quick Actions Panel */}
      <div className="flex flex-col gap-4">
        <h4 className="font-work text-xs tracking-wider uppercase text-black/50 dark:text-white/40">
          Quick Actions
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            to="/admin/designs/new"
            className="p-5 border border-black/5 dark:border-white/5 rounded-xl bg-black/[0.01] dark:bg-white/[0.01] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] text-left transition-all flex flex-col gap-1"
          >
            <span className="font-marcellus text-xs uppercase tracking-wider text-black dark:text-white font-medium">
              Upload Design
            </span>
            <span className="font-work text-[10px] text-black/45 dark:text-white/45">
              Add naming, descriptions, and mockups.
            </span>
          </Link>

          <Link
            to="/admin/products/new"
            className="p-5 border border-black/5 dark:border-white/5 rounded-xl bg-black/[0.01] dark:bg-white/[0.01] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] text-left transition-all flex flex-col gap-1"
          >
            <span className="font-marcellus text-xs uppercase tracking-wider text-black dark:text-white font-medium">
              Create Product
            </span>
            <span className="font-work text-[10px] text-black/45 dark:text-white/45">
              Configure one color product, its family, and size variants.
            </span>
          </Link>

          <a
            href={`https://${shopDomain}/admin`}
            target="_blank"
            rel="noreferrer"
            className="p-5 border border-black/5 dark:border-white/5 rounded-xl bg-black/[0.01] dark:bg-white/[0.01] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] text-left transition-all flex flex-col gap-1"
          >
            <span className="font-marcellus text-xs uppercase tracking-wider text-black dark:text-white font-medium">
              Open Shopify Admin →
            </span>
            <span className="font-work text-[10px] text-black/45 dark:text-white/45">
              Review published drafts and variant inventory.
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

function StatCard({value, label}) {
  return (
    <div className="border border-black/5 dark:border-white/5 rounded-xl p-5 bg-black/[0.005] dark:bg-white/[0.005]">
      <span className="font-marcellus text-3xl font-light text-black dark:text-white block mb-1">
        {value}
      </span>
      <span className="font-work text-[9px] tracking-wider text-black/40 dark:text-white/30 uppercase block font-semibold">
        {label}
      </span>
    </div>
  );
}

/** @typedef {import('./+types/admin._index').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
