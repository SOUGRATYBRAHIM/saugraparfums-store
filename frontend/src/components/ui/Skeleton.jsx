/**
 * Skeleton — shows while content is loading.
 * Usage: <Skeleton className="h-64 w-full" />
 */
export default function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-72 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  )
}
