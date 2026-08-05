import {useState, useEffect} from 'react';
import {useLocation} from 'react-router';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';
import {BottomNav} from '~/components/BottomNav';
import {useLanguage} from '~/hooks/useLanguage.js';

/**
 * @param {PageLayoutProps}
 */
export function PageLayout({cart, children = null}) {
  const {language, changeLanguage} = useLanguage();
  const [theme, setTheme] = useState('light');
  const {pathname} = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <Aside.Provider>
      <Header
        cart={cart}
        language={language}
        onLanguageChange={changeLanguage}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main style={{paddingTop: pathname === '/' ? 0 : 80}}>{children}</main>
      <Footer language={language} onLanguageChange={changeLanguage} />
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
