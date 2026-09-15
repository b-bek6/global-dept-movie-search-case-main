namespace MovieSearchCase.WebApi.Models.Movies;

public record MovieSearchResult
{
    public required IReadOnlyList<Movie> Results { get; init; }
    public required int Page { get; init; }
    public required int TotalPages { get; init; }
    public required int TotalResults { get; init; }
}