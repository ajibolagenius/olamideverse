/**
 * Genius API functions for songs and lyrics
 */

import { geniusGet } from './client';
import axios from 'axios';

/**
 * Genius song object
 */
export interface GeniusSong {
    id: number;
    title: string;
    url: string;
    album: {
        id: number;
        name: string;
    };
    featured_artists: {
        id: number;
        name: string;
    }[];
    primary_artist: {
        id: number;
        name: string;
    };
    song_art_image_url: string;
    release_date: string;
}

/**
 * Searches for songs
 * @param query The search query
 * @returns A promise that resolves to the search results
 */
export async function searchSongs(query: string): Promise<{
    response: {
        hits: {
            type: string;
            result: GeniusSong;
        }[];
    };
}> {
    return geniusGet<{
        response: {
            hits: {
                type: string;
                result: GeniusSong;
            }[];
        };
    }>('/search', {
        q: query,
    });
}

/**
 * Gets a song by ID
 * @param id The Genius song ID
 * @returns A promise that resolves to the song
 */
export async function getSong(id: number): Promise<{
    response: {
        song: GeniusSong;
    };
}> {
    return geniusGet<{
        response: {
            song: GeniusSong;
        };
    }>(`/songs/${id}`);
}

/**
 * Gets lyrics for a song
 * @param url The Genius song URL
 * @returns A promise that resolves to the lyrics
 */
export async function getLyrics(url: string): Promise<string> {
    try {
        // Fetch the HTML of the Genius song page
        const response = await axios.get(url);
        const html = response.data;

        // Extract the lyrics from the HTML
        // This is a simple implementation and may break if Genius changes their HTML structure
        const lyricsRegex = /<div class="lyrics">(.+?)<\/div>/s;
        const match = html.match(lyricsRegex);

        if (match && match[1]) {
            // Clean up the lyrics
            return match[1]
                .replace(/<br\s*\/?>/g, '\n') // Replace <br> tags with newlines
                .replace(/<[^>]+>/g, '') // Remove HTML tags
                .trim();
        }

        // If the regex doesn't match, try an alternative approach
        const alternativeLyricsRegex = /<div data-lyrics-container[^>]*>(.+?)<\/div>/s;
        const alternativeMatch = html.match(alternativeLyricsRegex);

        if (alternativeMatch && alternativeMatch[1]) {
            // Clean up the lyrics
            return alternativeMatch[1]
                .replace(/<br\s*\/?>/g, '\n') // Replace <br> tags with newlines
                .replace(/<[^>]+>/g, '') // Remove HTML tags
                .trim();
        }

        throw new Error('Could not extract lyrics from the Genius page');
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        throw new Error('Failed to fetch lyrics');
    }
}

/**
 * Gets lyrics for a song by artist and title
 * @param artist The artist name
 * @param title The song title
 * @returns A promise that resolves to the lyrics
 */
export async function getLyricsByArtistAndTitle(artist: string, title: string): Promise<string> {
    try {
        // Search for the song
        const searchResults = await searchSongs(`${artist} ${title}`);

        // Find the best match
        const bestMatch = searchResults.response.hits.find(hit => {
            const result = hit.result;
            const artistMatch = result.primary_artist.name.toLowerCase().includes(artist.toLowerCase());
            const titleMatch = result.title.toLowerCase().includes(title.toLowerCase());
            return artistMatch && titleMatch;
        });

        if (!bestMatch) {
            throw new Error(`Could not find lyrics for "${title}" by ${artist}`);
        }

        // Get the lyrics
        return getLyrics(bestMatch.result.url);
    } catch (error) {
        console.error('Error fetching lyrics by artist and title:', error);
        throw new Error(`Failed to fetch lyrics for "${title}" by ${artist}`);
    }
}
