import {Link, useLoaderData} from 'react-router';
import {
  AccountPageHeader,
  AccountPanel,
  AccountPanelLabel,
  accountPrimaryButton,
  accountSecondaryButton,
} from '~/components/account/AccountUI.jsx';
import {ProductCard} from '~/components/ProductCard.jsx';
import {Reveal, StaggerContainer, StaggerItem} from '~/components/motion/Reveal.jsx';
import {useWishlist} from '~/context/WishlistContext.jsx';

export const meta = () => [{title: 'Wishlist | UniinX'}];

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  const {customerAccount} = context;
  return {isLoggedIn: await customerAccount.isLoggedIn()};
}

export default function Wishlist() {
  const {isLoggedIn} = useLoaderData();
  const {wishlist, count, clearWishlist} = useWishlist();

  return (
    <div className="min-h-screen bg-white px-4 pt-20 pb-12 sm:px-8 sm:pt-24 sm:pb-16 lg:px-[60px] lg:pt-28 lg:pb-20">
      <div className="mx-auto max-w-[1280px] space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <AccountPageHeader
            eyebrow="Wishlist"
            title={`Saved Favorites (${count})`}
            description="Items you have saved to your personal collection. Easily transfer them to your cart when ready."
          />
          {count > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="self-start text-xs font-semibold uppercase tracking-wider text-black/50 hover:text-black sm:self-auto"
            >
              Clear Wishlist
            </button>
          )}
        </div>

        {!isLoggedIn && (
          <Reveal>
            <AccountPanel className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <AccountPanelLabel>Saved on this device</AccountPanelLabel>
                <p className="mt-2 max-w-lg text-sm text-black/60">
                  Your wishlist is saved right here in this browser. Sign in
                  to keep it synced across your phone, laptop, and every
                  device you shop from.
                </p>
              </div>
              <Link
                to={`/account/login?return_to=${encodeURIComponent('/wishlist')}`}
                className={`${accountSecondaryButton} shrink-0`}
              >
                Sign in to sync
              </Link>
            </AccountPanel>
          </Reveal>
        )}

        {count === 0 ? (
          <Reveal variant="card">
            <AccountPanel className="flex flex-col items-center justify-center py-16 text-center">
              <div className="grid size-16 place-items-center rounded-full bg-black/[0.04]">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-black/40"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <AccountPanelLabel className="mt-6">Collection empty</AccountPanelLabel>
              <h3 className="mt-2 text-xl font-medium tracking-tight">Your wishlist is currently empty</h3>
              <p className="mt-2 max-w-sm text-sm text-black/50">
                Save your favorite garments while browsing by clicking the heart icon on any product.
              </p>
              <Link
                to="/collections/all"
                className={`${accountPrimaryButton} mt-6 inline-flex items-center gap-2`}
              >
                Explore Catalog →
              </Link>
            </AccountPanel>
          </Reveal>
        ) : (
          <StaggerContainer className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}

/** @typedef {import('./+types/wishlist').Route} Route */
