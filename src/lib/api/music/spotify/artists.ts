/**
 * Spotify API functions for artists
 */

import { spotifyGet } from './client';

/**
 * Spotify artist object
 */
export interface SpotifyArtist {
    id: string;
    name: string;
    images: {
        url: string;
        height: number;
        width: number;
    }[];
    genres: string[];
    popularity: number;
    external_urls: {
        spotify: string;
    };
}

/**
 * Gets an artist by ID
 * @param id The Spotify artist ID
 * @returns A promise that resolves to the artist
 */
export async function getArtist(id: string): Promise<SpotifyArtist> {
    return spotifyGet<SpotifyArtist>(`/artists/${id}`);
}

/**
 * Gets several artists by ID
 * @param ids The Spotify artist IDs
 * @returns A promise that resolves to the artists
 */
export async function getArtists(ids: string[]): Promise<{ artists: SpotifyArtist[] }> {
    return spotifyGet<{ artists: SpotifyArtist[] }>('/artists', {
        ids: ids.join(','),
    });
}

/**
 * Gets an artist's top tracks
 * @param artistId The Spotify artist ID
 * @param market The market (ISO 3166-1 alpha-2 country code)
 * @returns A promise that resolves to the artist's top tracks
 */
export async function getArtistTopTracks(
    artistId: string,
    market: string = 'US'
): Promise<{ tracks: any[] }> {
    return spotifyGet<{ tracks: any[] }>(`/artists/${artistId}/top-tracks`, {
        market,
    });
}

/**
 * Gets an artist's related artists
 * @param artistId The Spotify artist ID
 * @returns A promise that resolves to the artist's related artists
 */
export async function getArtistRelatedArtists(
    artistId: string
): Promise<{ artists: SpotifyArtist[] }> {
    return spotifyGet<{ artists: SpotifyArtist[] }>(`/artists/${artistId}/related-artists`);
}

/**
 * Searches for artists
 * @param query The search query
 * @param limit The maximum number of artists to return (default: 20, max: 50)
 * @param offset The index of the first artist to return (default: 0)
 * @returns A promise that resolves to the search results
 */
export async function searchArtists(
    query: string,
    limit: number = 20,
    offset: number = 0
): Promise<{
    artists: {
        items: SpotifyArtist[];
        total: number;
        limit: number;
        offset: number;
    };
}> {
    return spotifyGet<{
        artists: {
            items: SpotifyArtist[];
            total: number;
            limit: number;
            offset: number;
        };
    }>('/search', {
        q: query,
        type: 'artist',
        limit,
        offset,
    });
}
