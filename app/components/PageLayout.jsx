import {useLocation} from 'react-router';
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
  const reduceMotion = useReducedMotion();

  return (
    <Aside.Provider>
      <Header
        cart={cart}
        language={language}
        isLoggedIn={isLoggedIn}
        megaMenuProducts={megaMenuProducts}
        megaMenuCollections={megaMenuCollections}
      />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{opacity: 0, y: reduceMotion ? 0 : 8}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: reduceMotion ? 0 : -8}}
          transition={{duration: reduceMotion ? 0.15 : 0.28, ease: [0.16, 0.84, 0.32, 1]}}
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
