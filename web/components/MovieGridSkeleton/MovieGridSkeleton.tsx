export interface MovieGridSkeletonProps {
  count?: number;
}

export function MovieGridSkeleton({ count = 12 }: MovieGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="aspect-[2/3] w-full animate-pulse rounded-lg bg-surface" />
      ))}
    </div>
  );
}