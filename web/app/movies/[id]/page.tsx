import Image from "next/image";
import { notFound } from "next/navigation";

import { ApiError, getMovieDetails } from "~/lib/api";

export const dynamic = "force-dynamic";

interface MovieDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const { id } = await params;
  const movieId = Number(id);

  if (!Number.isInteger(movieId)) {
    notFound();
  }

  let movie;

  try {
    movie = await getMovieDetails(movieId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : null;

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="relative aspect-[2/3] w-full max-w-xs shrink-0 overflow-hidden rounded-lg bg-surface">
          {movie.posterPath ? (
            <Image
              src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
              alt={movie.title}
              fill
              sizes="300px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted">
              No poster
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-semibold text-foreground">{movie.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
            {year && <span>{year}</span>}
            {movie.runtimeMinutes && <span>{movie.runtimeMinutes} min</span>}
            <span aria-label={`Rated ${movie.voteAverage.toFixed(1)} out of 10`}>
              ★ {movie.voteAverage.toFixed(1)}
            </span>
          </div>
          {movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
          {movie.overview && <p className="text-sm text-foreground">{movie.overview}</p>}
        </div>
      </div>

      {movie.trailerKey && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-medium text-foreground">Trailer</h2>
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-surface">
            <iframe
              src={`https://www.youtube.com/embed/${movie.trailerKey}`}
              title={`${movie.title} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      )}
    </main>
  );
}
