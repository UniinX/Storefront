import {Link, useLocation} from 'react-router';
import {resolveCollectionTheme, uniqueThemeNames} from '~/lib/collectionTheme.js';

const PAGINATION_PARAMS = ['cursor', 'direction', 'after', 'before'];

export function ThemeSwipeBar({themes, activeTheme = '', includeAll = true}) {
  const {pathname, search} = useLocation();
  const names = uniqueThemeNames(themes);

  return (
    <nav aria-label="Switch collection theme" className="min-w-0">
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 py-1 scrollbar-none sm:gap-3">
        {includeAll ? (
          <ThemeLink
            label="All themes"
            theme=""
            active={!activeTheme}
            pathname={pathname}
            search={search}
          />
        ) : null}
        {names.map((theme) => (
          <ThemeLink
            key={theme}
            label={theme}
            theme={theme}
            active={activeTheme.toLowerCase() === theme.toLowerCase()}
            pathname={pathname}
            search={search}
          />
        ))}
      </div>
    </nav>
  );
}

function ThemeLink({label, theme, active, pathname, search}) {
  const palette = resolveCollectionTheme(theme || 'UniinX');
  const params = new URLSearchParams(search);
  for (const key of PAGINATION_PARAMS) params.delete(key);
  if (theme) params.set('theme', theme);
  else params.delete('theme');
  const query = params.toString();

  return (
    <Link
      to={`${pathname}${query ? `?${query}` : ''}`}
      preventScrollReset
      prefetch="intent"
      aria-current={active ? 'page' : undefined}
      className={`group flex min-h-12 shrink-0 snap-start items-center gap-3 rounded-full border px-3.5 pr-5 text-xs font-semibold transition-[background-color,color,border-color,transform] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${active ? 'border-black bg-black text-white' : 'border-black/10 bg-white/88 text-black backdrop-blur-md hover:border-black/35'}`}
    >
      <span
        aria-hidden="true"
        className="size-6 rounded-full border border-black/10"
        style={{background: palette.hero}}
      />
      {label}
    </Link>
  );
}

export default ThemeSwipeBar;
