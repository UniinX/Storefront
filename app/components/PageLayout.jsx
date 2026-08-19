import {useLocation, useNavigation} from 'react-router';
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';

/**
 * @param {PageLayoutProps}
 */
export function PageLayout({
  cart,
  children = null,
  language,
  isLoggedIn,
  megaMenuProducts,
  megaMenuCollections,
}) {
  const {pathname} = useLocation();
  const navigation = useNavigation();
  const reduceMotion = useReducedMotion();
  // React Router's loaders run on the server, so there's a real network gap
  // between clicking a link and the new route being ready to mount. Without
  // this, nothing on screen changes during that gap — the fade only plays
  // once the new page already has data, which reads as a stall followed by
  // a hard cut rather than a transition. Dimming the instant a navigation
  // starts gives immediate feedback that something is happening.
  const isNavigating = navigation.state !== 'idle';

  return (
    <Aside.Provider>
      <Header
        cart={cart}
        language={language}
        isLoggedIn={isLoggedIn}
        megaMenuProducts={megaMenuProducts}
        megaMenuCollections={megaMenuCollections}
      />
      <AnimatePresence mode="sync">
        <motion.main
          key={pathname}
          initial={{opacity: 0, y: reduceMotion ? 0 : 10}}
          animate={{
            opacity: isNavigating ? 0.5 : 1,
            y: 0,
          }}
          exit={{opacity: 0, y: reduceMotion ? 0 : -10}}
          transition={{
            duration: reduceMotion ? 0.15 : isNavigating ? 0.2 : 0.32,
            ease: [0.16, 0.84, 0.32, 1],
          }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer language={language} isLoggedIn={isLoggedIn} />
    </Aside.Provider>
  );
}

/**
 * @typedef {Object} PageLayoutProps
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {React.ReactNode} [children]
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
