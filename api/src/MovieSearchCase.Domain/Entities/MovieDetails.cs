namespace MovieSearchCase.Domain.Entities;

public class MovieDetails
{
    public required int Id { get; init; }

    public required string Title { get; init; }

    public string? Overview { get; init; }

    public string? PosterPath { get; init; }

    public string? BackdropPath { get; init; }

    public double VoteAverage { get; init; }

    public DateOnly? ReleaseDate { get; init; }

    public int? RuntimeMinutes { get; init; }

    public IReadOnlyList<string> Genres { get; init; } = [];

    public string? TrailerKey { get; init; }
}
