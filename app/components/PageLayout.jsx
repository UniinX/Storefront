import {useState} from 'react';
import {useLocation} from 'react-router';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';
import {BottomNav} from '~/components/BottomNav';
import {SignInModal} from '~/components/SignInModal';

/**
 * @param {PageLayoutProps}
 */
export function PageLayout({cart, children = null, language, onLanguageChange, isLoggedIn}) {
  const {pathname} = useLocation();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [signInReturnTo, setSignInReturnTo] = useState('/account');
  const openSignIn = (returnTo = pathname) => {
    setSignInReturnTo(returnTo);
    setIsSignInOpen(true);
  };

  return (
    <Aside.Provider>
      <Header
        cart={cart}
        language={language}
        onLanguageChange={onLanguageChange}
        isLoggedIn={isLoggedIn}
        onSignIn={openSignIn}
      />
      <main style={{paddingTop: pathname === '/' ? 0 : 80}}>{children}</main>
      <Footer
        language={language}
        onLanguageChange={onLanguageChange}
        isLoggedIn={isLoggedIn}
        onSignIn={openSignIn}
      />
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        returnTo={signInReturnTo}
        language={language}
      />
      {/* On mobile PDP, the sticky buy bar (MobileBuyBar) is the bottom action
          bar — a persistent tab bar underneath it would overlap it. */}
      {!pathname.startsWith('/products/') && <BottomNav cart={cart} />}
    </Aside.Provider>
  );
}

/**
 * @typedef {Object} PageLayoutProps
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {React.ReactNode} [children]
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
