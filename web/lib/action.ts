"use server";

import { searchMovies, type MovieSearchResult } from "~/lib/api";

export async function searchMoviesAction(query: string, page: number): Promise<MovieSearchResult> {
    return searchMovies(query, page);
}