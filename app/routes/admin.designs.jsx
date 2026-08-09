import {useLoaderData, Link} from 'react-router';
import {listDesignMetaobjects, requireAdmin} from '~/lib/admin';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Designs Registry'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  requireAdmin(context);
  const {env} = context;
  let designs = [];
  let schemaMissing = false;
  try {
    designs = await listDesignMetaobjects(env);
  } catch (e) {
    console.error('Failed listing designs:', e);
    if (e instanceof Error && e.message === 'DESIGN_SCHEMA_MISSING') {
      schemaMissing = true;
    }
  }
  return {designs, schemaMissing};
}

export default function AdminDesigns() {
  /** @type {LoaderReturnData} */
  const {designs, schemaMissing} = useLoaderData();

  return (
    <div className="flex flex-col gap-8 animate-fade-in text-black dark:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-marcellus text-2xl uppercase">
            Designs Registry
          </h3>
          <p className="font-work text-xs text-black/50 dark:text-white/40 mt-1">
            Browse and manage linguistic templates stored as Shopify Metaobjects.
          </p>
        </div>
        {!schemaMissing && (
          <Link
            to="/admin/designs/new"
            className="w-fit px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-work text-[10px] tracking-wider uppercase font-semibold hover:opacity-90 cursor-pointer shadow-md transition-all whitespace-nowrap"
          >
            Upload New Design
          </Link>
        )}
      </div>

      {schemaMissing && (
        <div className="p-6 rounded-2xl border border-yellow-500/25 bg-yellow-500/5 text-yellow-800 dark:text-yellow-400 font-work text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-semibold uppercase tracking-wider block mb-1">
              ⚠️ Design Schema Missing
            </span>
            <p>The Design metaobject definition must be initialized in your store database before registry templates can be retrieved or saved.</p>
          </div>
          <Link
            to="/admin/setup"
            className="px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-[9px] tracking-wider uppercase whitespace-nowrap shadow-sm hover:opacity-90"
          >
            Run Setup Utility
          </Link>
        </div>
      )}

      <div className="w-full h-[1px] bg-black/10 dark:bg-white/10" />

      {/* Grid of designs */}
      {!designs.length ? (
        <div className="py-12 border border-dashed border-black/10 dark:border-white/10 rounded-2xl text-center flex flex-col items-center">
          <span className="font-work text-xs text-black/40 dark:text-white/40 mb-4">
            No designs registered in Shopify.
          </span>
          <Link
            to="/admin/designs/new"
            className="px-5 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-work text-[9px] tracking-wider uppercase font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            Create Your First Design
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {designs.map((design) => (
            <div
              key={design.id}
              className="border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-brand-surface-light dark:bg-brand-surface-dark flex gap-4 transition-all duration-200"
            >
              {/* Artwork Preview */}
              <div className="w-20 h-20 rounded-xl border border-black/5 dark:border-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center bg-white dark:bg-black">
                {design.artwork_url ? (
                  <img
                    src={design.artwork_url}
                    alt={design.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="font-work text-[8px] text-black/25 dark:text-white/25">Mockup</span>
                )}
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-marcellus text-sm text-black dark:text-white font-medium truncate">
                      {design.name}
                    </span>
                    <span className="font-work text-[8px] bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded uppercase tracking-wider font-semibold">
                      {design.language}
                    </span>
                  </div>
                  {design.short_description && (
                    <p className="font-work text-[10px] text-black/50 dark:text-white/40 line-clamp-2 mt-1">
                      {design.short_description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-black/5 dark:border-white/5 pt-2 mt-2">
                  <span className="font-work text-[9px] text-black/40 dark:text-white/30 truncate">
                    By {design.designer || 'Unknown'} · {design.internal_code}
                  </span>
                  <span className={`font-work text-[8px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
                    design.status === 'Approved'
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                      : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {design.status || 'Draft'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** @typedef {import('./+types/admin.designs').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
