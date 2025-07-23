/**
 * Spotify API functions for tracks
 */

import { spotifyGet } from './client';
import { SpotifyTrack } from './albums';

/**
 * Gets a track by ID
 * @param id The Spotify track ID
 * @returns A promise that resolves to the track
 */
export async function getTrack(id: string): Promise<SpotifyTrack> {
    return spotifyGet<SpotifyTrack>(`/tracks/${id}`);
}

/**
 * Gets several tracks by ID
 * @param ids The Spotify track IDs
 * @returns A promise that resolves to the tracks
 */
export async function getTracks(ids: string[]): Promise<{ tracks: SpotifyTrack[] }> {
    return spotifyGet<{ tracks: SpotifyTrack[] }>('/tracks', {
        ids: ids.join(','),
    });
}

/**
 * Gets audio features for a track
 * @param id The Spotify track ID
 * @returns A promise that resolves to the audio features
 */
export async function getAudioFeatures(id: string): Promise<{
    id: string;
    duration_ms: number;
    tempo: number;
    key: number;
    mode: number;
    time_signature: number;
    acousticness: number;
    danceability: number;
    energy: number;
    instrumentalness: number;
    liveness: number;
    loudness: number;
    speechiness: number;
    valence: number;
}> {
    return spotifyGet<{
        id: string;
        duration_ms: number;
        tempo: number;
        key: number;
        mode: number;
        time_signature: number;
        acousticness: number;
        danceability: number;
        energy: number;
        instrumentalness: number;
        liveness: number;
        loudness: number;
        speechiness: number;
        valence: number;
    }>(`/audio-features/${id}`);
}

/**
 * Gets audio features for several tracks
 * @param ids The Spotify track IDs
 * @returns A promise that resolves to the audio features
 */
export async function getMultipleAudioFeatures(ids: string[]): Promise<{
    audio_features: {
        id: string;
        duration_ms: number;
        tempo: number;
        key: number;
        mode: number;
        time_signature: number;
        acousticness: number;
        danceability: number;
        energy: number;
        instrumentalness: number;
        liveness: number;
        loudness: number;
        speechiness: number;
        valence: number;
    }[];
}> {
    return spotifyGet<{
        audio_features: {
            id: string;
            duration_ms: number;
            tempo: number;
            key: number;
            mode: number;
            time_signature: number;
            acousticness: number;
            danceability: number;
            energy: number;
            instrumentalness: number;
            liveness: number;
            loudness: number;
            speechiness: number;
            valence: number;
        }[];
    }>('/audio-features', {
        ids: ids.join(','),
    });
}

/**
 * Gets audio analysis for a track
 * @param id The Spotify track ID
 * @returns A promise that resolves to the audio analysis
 */
export async function getAudioAnalysis(id: string): Promise<any> {
    return spotifyGet<any>(`/audio-analysis/${id}`);
}

/**
 * Searches for tracks
 * @param query The search query
 * @param limit The maximum number of tracks to return (default: 20, max: 50)
 * @param offset The index of the first track to return (default: 0)
 * @returns A promise that resolves to the search results
 */
export async function searchTracks(
    query: string,
    limit: number = 20,
    offset: number = 0
): Promise<{
    tracks: {
        items: SpotifyTrack[];
        total: number;
        limit: number;
        offset: number;
    };
}> {
    return spotifyGet<{
        tracks: {
            items: SpotifyTrack[];
            total: number;
            limit: number;
            offset: number;
        };
    }>('/search', {
        q: query,
        type: 'track',
        limit,
        offset,
    });
}
