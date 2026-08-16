import {createContext, useContext, useEffect, useState} from 'react';

const WishlistContext = createContext(null);
const WISHLIST_STORAGE_KEY = 'uniinx_wishlist_v1';

export function WishlistProvider({children}) {
  const [wishlist, setWishlist] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load wishlist from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage:', e);
    }
  }, [wishlist, isLoaded]);

  const toggleWishlist = (product) => {
    if (!product || !product.id) return;
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      const newItem = {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage || product.image,
        priceRange: product.priceRange || product.price,
        addedAt: new Date().toISOString(),
      };
      return [...prev, newItem];
    });
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlist.some((item) => item.id === productId);
  };

  const removeWishlist = (productId) => {
    if (!productId) return;
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        count: wishlist.length,
        toggleWishlist,
        isInWishlist,
        removeWishlist,
        clearWishlist,
        isLoaded,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    return {
      wishlist: [],
      count: 0,
      toggleWishlist: () => {},
      isInWishlist: () => false,
      removeWishlist: () => {},
      clearWishlist: () => {},
      isLoaded: true,
    };
  }
  return context;
}
