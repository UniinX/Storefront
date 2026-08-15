import {createContext, useContext, useState} from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from '~/components/ui/sheet.jsx';

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 * @param {{
 *   children?: React.ReactNode;
 *   type: AsideType;
 *   heading: React.ReactNode;
 * }}
 */
export function Aside({children, heading, type}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  return (
    <Sheet open={expanded} onOpenChange={(open) => !open && close()}>
      <SheetContent className="bottom-0 right-0 top-0 w-[min(100vw,32rem)] rounded-none p-0">
        <header className="flex min-h-16 items-center justify-between border-b border-border px-5 sm:px-7">
          <SheetTitle className="text-sm font-semibold uppercase tracking-[0.14em]">
            {heading}
          </SheetTitle>
          <SheetClose asChild>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full text-2xl hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              aria-label="Close"
            >
              &times;
            </button>
          </SheetClose>
        </header>
        <main className="h-[calc(100dvh-4rem)] overflow-y-auto p-5 sm:p-7">
          {children}
        </main>
      </SheetContent>
    </Sheet>
  );
}

const AsideContext = createContext(null);

Aside.Provider = function AsideProvider({children}) {
  const [type, setType] = useState('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}

/** @typedef {'search' | 'cart' | 'mobile' | 'closed'} AsideType */
/**
 * @typedef {{
 *   type: AsideType;
 *   open: (mode: AsideType) => void;
 *   close: () => void;
 * }} AsideContextValue
 */

/** @typedef {import('react').ReactNode} ReactNode */
