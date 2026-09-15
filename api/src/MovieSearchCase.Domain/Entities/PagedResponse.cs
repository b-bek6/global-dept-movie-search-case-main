namespace MovieSearchCase.Domain.Entities;

public class PagedResponse<T>
{
    public required IReadOnlyList<T> Results { get; init; }
    public required int Page { get; init; }
    public required int TotalPages { get; init; }
    public required int TotalResults { get; init; }
}