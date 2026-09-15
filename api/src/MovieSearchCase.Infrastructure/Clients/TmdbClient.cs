using System.Globalization;
using System.Net;
using System.Net.Http.Json;
using MovieSearchCase.Domain.Entities;
using MovieSearchCase.Domain.Exceptions;
using MovieSearchCase.Domain.Interfaces.Clients;

namespace MovieSearchCase.Infrastructure.Clients;

public class TmdbClient : ITmdbClient
{
    private readonly HttpClient _httpClient;

    public TmdbClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IReadOnlyList<Movie>> GetTrendingMoviesAsync(CancellationToken cancellationToken)
    {
        TmdbPagedResponse<TmdbMovie>? response;

        try
        {
            response = await _httpClient.GetFromJsonAsync<TmdbPagedResponse<TmdbMovie>>(
                "trending/movie/week",
                cancellationToken);
        }
        catch (HttpRequestException)
        {
            throw new MovieException(
                MovieException.ExceptionTitle,
                ErrorType.UpstreamServiceUnavailable,
                "TMDB did not return trending movies.");
        }

        if (response is null)
        {
            throw new MovieException(
                MovieException.ExceptionTitle,
                ErrorType.UpstreamServiceUnavailable,
                "TMDB returned an empty trending movies response.");
        }

        return response.Results.Select(TmdbMovieMapper.ToDomainModel).ToList();
    }

    // TODO(candidate): implement TMDB's /search/movie?query={query}&page={page} here,
    // following the same try/catch + mapping pattern as GetTrendingMoviesAsync above.
    public async Task<PagedResponse<Movie>> SearchMoviesAsync(string query, int page, CancellationToken cancellationToken)
    {
        TmdbPagedResponse<TmdbMovie>? response;

        try
        {
            response = await _httpClient.GetFromJsonAsync<TmdbPagedResponse<TmdbMovie>>(
                $"search/movie?query={Uri.EscapeDataString(query)}&page={page}",
                cancellationToken);
        }
        catch (HttpRequestException)
        {
            throw new MovieException(
                MovieException.ExceptionTitle,
                ErrorType.UpstreamServiceUnavailable,
                "TMDB did not return trending movies.");
        }

        if (response is null)
        {
            throw new MovieException(
                MovieException.ExceptionTitle,
                ErrorType.UpstreamServiceUnavailable,
                "TMDB returned an empty trending movies response.");
        }

        return new PagedResponse<Movie>
        {
            Results = response.Results.Select(TmdbMovieMapper.ToDomainModel).ToList(),
            Page = response.Page,
            TotalPages = response.TotalPages,
            TotalResults = response.TotalResults,
        };
    }

    public async Task<MovieDetails> GetMovieDetailsAsync(int id, CancellationToken cancellationToken)
    {
        TmdbMovieDetails? details;

        try
        {
            details = await _httpClient.GetFromJsonAsync<TmdbMovieDetails>($"movie/{id}", cancellationToken);
        }
        catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            throw new MovieException(
                MovieException.ExceptionTitle,
                ErrorType.EntityNotFound,
                $"No movie found with id {id}.");
        }
        catch (HttpRequestException)
        {
            throw new MovieException(
                MovieException.ExceptionTitle,
                ErrorType.UpstreamServiceUnavailable,
                "TMDB did not return movie details.");
        }

        if (details is null)
        {
            throw new MovieException(
                MovieException.ExceptionTitle,
                ErrorType.UpstreamServiceUnavailable,
                "TMDB returned an empty movie details response.");
        }

        string? trailerKey = null;

        try
        {
            var videos = await _httpClient.GetFromJsonAsync<TmdbVideosResponse>($"movie/{id}/videos", cancellationToken);

            trailerKey = videos?.Results
                .Where(video => video.Site == "YouTube" && video.Type == "Trailer")
                .OrderByDescending(video => video.Official)
                .Select(video => video.Key)
                .FirstOrDefault();
        }
        catch (HttpRequestException)
        {
        }

        return new MovieDetails
        {
            Id = details.Id,
            Title = details.Title,
            Overview = details.Overview,
            PosterPath = details.PosterPath,
            BackdropPath = details.BackdropPath,
            VoteAverage = details.VoteAverage,
            ReleaseDate = details.ReleaseDate == null ? null : DateOnly.Parse(details.ReleaseDate),
            RuntimeMinutes = details.Runtime,
            Genres = details.Genres.Select(genre => genre.Name).ToList(),
            TrailerKey = trailerKey,
        };
    }
}
