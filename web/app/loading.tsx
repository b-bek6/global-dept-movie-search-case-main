import { MovieGridSkeleton } from "~/components/MovieGridSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <div className="flex flex-col gap-4">
        <div className="h-8 w-64 animate-pulse rounded bg-surface" />
        <div className="h-10 w-full max-w-md animate-pulse rounded-md bg-surface" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="h-6 w-48 animate-pulse rounded bg-surface" />
        <MovieGridSkeleton count={12}/>
      </div>
    </main>
  );
}
