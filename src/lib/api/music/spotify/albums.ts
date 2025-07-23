/**
 * Spotify API functions for albums
 */

import { spotifyGet } from './client';

/**
 * Spotify album object
 */
export interface SpotifyAlbum {
    id: string;
    name: string;
    release_date: string;
    images: {
        url: string;
        height: number;
        width: number;
    }[];
    artists: {
        id: string;
        name: string;
    }[];
    tracks: {
        items: SpotifyTrack[];
        total: number;
    };
    total_tracks: number;
    external_urls: {
        spotify: string;
    };
}

/**
 * Spotify track object
 */
export interface SpotifyTrack {
    id: string;
    name: string;
    duration_ms: number;
    track_number: number;
    preview_url: string | null;
    external_urls: {
        spotify: string;
    };
}

/**
 * Gets an album by ID
 * @param id The Spotify album ID
 * @returns A promise that resolves to the album
 */
export async function getAlbum(id: string): Promise<SpotifyAlbum> {
    return spotifyGet<SpotifyAlbum>(`/albums/${id}`);
}

/**
 * Gets several albums by ID
 * @param ids The Spotify album IDs
 * @returns A promise that resolves to the albums
 */
export async function getAlbums(ids: string[]): Promise<{ albums: SpotifyAlbum[] }> {
    return spotifyGet<{ albums: SpotifyAlbum[] }>('/albums', {
        ids: ids.join(','),
    });
}

/**
 * Gets an artist's albums
 * @param artistId The Spotify artist ID
 * @param limit The maximum number of albums to return (default: 20, max: 50)
 * @param offset The index of the first album to return (default: 0)
 * @returns A promise that resolves to the artist's albums
 */
export async function getArtistAlbums(
    artistId: string,
    limit: number = 20,
    offset: number = 0
): Promise<{
    items: SpotifyAlbum[];
    total: number;
    limit: number;
    offset: number;
}> {
    return spotifyGet<{
        items: SpotifyAlbum[];
        total: number;
        limit: number;
        offset: number;
    }>(`/artists/${artistId}/albums`, {
        limit,
        offset,
        include_groups: 'album,single,compilation',
    });
}

/**
 * Gets an album's tracks
 * @param albumId The Spotify album ID
 * @param limit The maximum number of tracks to return (default: 50, max: 50)
 * @param offset The index of the first track to return (default: 0)
 * @returns A promise that resolves to the album's tracks
 */
export async function getAlbumTracks(
    albumId: string,
    limit: number = 50,
    offset: number = 0
): Promise<{
    items: SpotifyTrack[];
    total: number;
    limit: number;
    offset: number;
}> {
    return spotifyGet<{
        items: SpotifyTrack[];
        total: number;
        limit: number;
        offset: number;
    }>(`/albums/${albumId}/tracks`, {
        limit,
        offset,
    });
}

/**
 * Searches for albums
 * @param query The search query
 * @param limit The maximum number of albums to return (default: 20, max: 50)
 * @param offset The index of the first album to return (default: 0)
 * @returns A promise that resolves to the search results
 */
export async function searchAlbums(
    query: string,
    limit: number = 20,
    offset: number = 0
): Promise<{
    albums: {
        items: SpotifyAlbum[];
        total: number;
        limit: number;
        offset: number;
    };
}> {
    return spotifyGet<{
        albums: {
            items: SpotifyAlbum[];
            total: number;
            limit: number;
            offset: number;
        };
    }>('/search', {
        q: query,
        type: 'album',
        limit,
        offset,
    });
}
