import {Form, NavLink, Outlet, redirect} from 'react-router';
import {requireAdmin} from '~/lib/admin';

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  requireAdmin(context);
  return null;
}

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  const {session} = context;
  if (request.method === 'POST') {
    session.unset('admin_authenticated');
    session.unset('admin_authenticated_at');
    return redirect('/admin/login');
  }
  return {};
}

export default function AdminLayout() {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-14 py-28 min-h-screen bg-brand-bg-light dark:bg-brand-bg-dark transition-colors duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">

        {/* Admin Navigation Sidebar */}
        <aside className="lg:col-span-1 border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-brand-surface-light dark:bg-brand-surface-dark flex flex-col gap-6 transition-colors duration-200 shadow-sm">
          {/* Header card */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-accent dark:bg-brand-accent-light text-brand-bg-light dark:text-brand-bg-dark flex items-center justify-center font-marcellus text-xs font-semibold tracking-wider flex-shrink-0">
              U
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-marcellus text-sm text-black dark:text-white truncate font-medium">
                Admin Console
              </span>
              <span className="font-work text-[9px] text-green-600 dark:text-green-400 font-semibold uppercase tracking-wider">
                • Authenticated
              </span>
            </div>
          </div>

          <div className="h-[1px] bg-black/5 dark:bg-white/5 w-full hidden lg:block" />

          {/* Nav links */}
          <nav className="hidden lg:flex flex-col gap-1 w-full" aria-label="Admin Navigation">
            <AdminNavLink to="/admin" label="Dashboard" end />
            <AdminNavLink to="/admin/designs" label="Designs Registry" />
            <AdminNavLink to="/admin/products" label="Garment Catalog" />
            <AdminNavLink to="/admin/review" label="QA & Publishing" />
            <AdminNavLink to="/admin/setup" label="System Setup" />
          </nav>

          {/* Mobile Navigation Links */}
          <nav className="flex lg:hidden overflow-x-auto whitespace-nowrap scrollbar-none gap-1 border-t border-b border-black/5 dark:border-white/5 py-3 -mx-6 px-6" aria-label="Mobile Admin Navigation">
            <AdminNavLink to="/admin" label="Dashboard" end />
            <AdminNavLink to="/admin/designs" label="Designs" />
            <AdminNavLink to="/admin/products" label="Garments" />
            <AdminNavLink to="/admin/review" label="QA & Publish" />
            <AdminNavLink to="/admin/setup" label="Setup" />
          </nav>

          <div className="h-[1px] bg-black/5 dark:bg-white/5 w-full hidden lg:block" />

          {/* Sign Out */}
          <Form method="POST" className="w-full">
            <button
              type="submit"
              className="w-full py-3 rounded-xl border border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 font-work text-[10px] tracking-wider uppercase font-semibold transition-all cursor-pointer"
            >
              Exit Console
            </button>
          </Form>
        </aside>

        {/* Console Outlet */}
        <main className="lg:col-span-3 border border-black/5 dark:border-white/5 rounded-2xl p-8 bg-brand-surface-light dark:bg-brand-surface-dark transition-colors duration-200 shadow-sm min-h-[460px]">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

function AdminNavLink({to, label, end = false}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({isActive}) =>
        `font-work text-[11px] tracking-wider uppercase px-4 py-3 rounded-lg font-light transition-all flex-shrink-0 ${
          isActive
            ? 'bg-brand-accent/5 dark:bg-brand-accent-light/5 text-brand-accent dark:text-brand-accent-light font-semibold'
            : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

/** @typedef {import('./+types/admin').Route} Route */
/** @typedef {ReturnType<typeof useLoaderData<typeof loader>>} LoaderReturnData */
