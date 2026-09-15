"use client";

import { useState } from "react";
import { searchMoviesAction } from "~/lib/action";
import { MovieCard } from "~/components/MovieCard";
import type { Movie } from "~/types/movie";
import { MovieGridSkeleton } from "~/components/MovieGridSkeleton";

type Status = "loading" | "error" | "success";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [results, setResults] = useState<Movie[]>([]);
  const [status, setStatus] = useState<Status>();

  // TODO(candidate): wire this up to lib/api.ts's searchMovies() and render results
  // (with pagination) instead of just logging. See lib/api.ts and app/page.tsx.
  async function runSearch(searchQuery: string, searchPage: number) {
    setStatus("loading");
    try {
      const data = await searchMoviesAction(searchQuery, searchPage);
      setResults(data.results);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setSubmittedQuery(searchQuery);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) return;
    runSearch(query, 1);
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
        <label htmlFor="movie-search" className="sr-only">
          Search for a movie
        </label>
        <input
          id="movie-search"
          type="search"
          name="query"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for a movie…"
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-brand-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"
        >
          Search
        </button>
      </form>

      {status === "loading" &&
        <div role="status">
          <MovieGridSkeleton count={6} />
        </div>}
      {status === "error" && (
        <div role="alert" className="flex flex-col items-start gap-2">
          <p className="text-sm text-foreground">We couldn&apos;t complete that search.</p>
          <p className="text-sm text-muted">It might be slow, down, or unreachable right now.</p>
          <button
            type="button"
            onClick={() => runSearch(submittedQuery, page)}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"
          >
            Try again
          </button>
        </div>
      )}
      {status === "success" && results.length === 0 && (
        <p role="status" className="text-sm text-muted">No results for “{submittedQuery}”.</p>
      )}
      {status === "success" && results.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => runSearch(submittedQuery, page - 1)}
              className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-muted">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => runSearch(submittedQuery, page + 1)}
              className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
