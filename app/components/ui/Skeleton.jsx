/**
 * Accessible Skeleton component for loading states.
 * Uses Tailwind v4 animate-pulse with subtle surface backdrop.
 * @param {React.HTMLAttributes<HTMLDivElement>} props
 */
export function Skeleton({className = '', ...props}) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-muted/60 dark:bg-muted/40 ${className}`}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col gap-3">
      <Skeleton className="aspect-[4/5] w-full rounded-[14px]" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function ProductGridSkeleton({count = 4}) {
  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({length: count}).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
