/**
 * YouTube API functions for videos
 */

import { youtubeGet } from './client';

/**
 * YouTube video object
 */
export interface YouTubeVideo {
    id: string;
    snippet: {
        title: string;
        description: string;
        publishedAt: string;
        thumbnails: {
            default: { url: string; width: number; height: number };
            medium: { url: string; width: number; height: number };
            high: { url: string; width: number; height: number };
            standard?: { url: string; width: number; height: number };
            maxres?: { url: string; width: number; height: number };
        };
        channelTitle: string;
        channelId: string;
    };
    contentDetails: {
        duration: string;
        dimension: string;
        definition: string;
    };
}

/**
 * Gets a video by ID
 * @param id The YouTube video ID
 * @returns A promise that resolves to the video
 */
export async function getVideo(id: string): Promise<{ items: YouTubeVideo[] }> {
    return youtubeGet<{ items: YouTubeVideo[] }>('/videos', {
        part: 'snippet,contentDetails',
        id,
    });
}

/**
 * Gets several videos by ID
 * @param ids The YouTube video IDs
 * @returns A promise that resolves to the videos
 */
export async function getVideos(ids: string[]): Promise<{ items: YouTubeVideo[] }> {
    return youtubeGet<{ items: YouTubeVideo[] }>('/videos', {
        part: 'snippet,contentDetails',
        id: ids.join(','),
    });
}

/**
 * Searches for videos
 * @param query The search query
 * @param maxResults The maximum number of videos to return (default: 10, max: 50)
 * @returns A promise that resolves to the search results
 */
export async function searchVideos(
    query: string,
    maxResults: number = 10
): Promise<{
    items: {
        id: {
            kind: string;
            videoId: string;
        };
        snippet: {
            title: string;
            description: string;
            publishedAt: string;
            thumbnails: {
                default: { url: string; width: number; height: number };
                medium: { url: string; width: number; height: number };
                high: { url: string; width: number; height: number };
            };
            channelTitle: string;
            channelId: string;
        };
    }[];
}> {
    return youtubeGet<{
        items: {
            id: {
                kind: string;
                videoId: string;
            };
            snippet: {
                title: string;
                description: string;
                publishedAt: string;
                thumbnails: {
                    default: { url: string; width: number; height: number };
                    medium: { url: string; width: number; height: number };
                    high: { url: string; width: number; height: number };
                };
                channelTitle: string;
                channelId: string;
            };
        }[];
    }>('/search', {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults,
    });
}

/**
 * Gets a playlist by ID
 * @param id The YouTube playlist ID
 * @returns A promise that resolves to the playlist
 */
export async function getPlaylist(id: string): Promise<{
    items: {
        id: string;
        snippet: {
            title: string;
            description: string;
            publishedAt: string;
            thumbnails: {
                default: { url: string; width: number; height: number };
                medium: { url: string; width: number; height: number };
                high: { url: string; width: number; height: number };
                standard?: { url: string; width: number; height: number };
                maxres?: { url: string; width: number; height: number };
            };
            channelTitle: string;
            channelId: string;
        };
        contentDetails: {
            itemCount: number;
        };
    }[];
}> {
    return youtubeGet<{
        items: {
            id: string;
            snippet: {
                title: string;
                description: string;
                publishedAt: string;
                thumbnails: {
                    default: { url: string; width: number; height: number };
                    medium: { url: string; width: number; height: number };
                    high: { url: string; width: number; height: number };
                    standard?: { url: string; width: number; height: number };
                    maxres?: { url: string; width: number; height: number };
                };
                channelTitle: string;
                channelId: string;
            };
            contentDetails: {
                itemCount: number;
            };
        }[];
    }>('/playlists', {
        part: 'snippet,contentDetails',
        id,
    });
}

/**
 * Gets playlist items
 * @param playlistId The YouTube playlist ID
 * @param maxResults The maximum number of items to return (default: 50, max: 50)
 * @param pageToken The page token for pagination
 * @returns A promise that resolves to the playlist items
 */
export async function getPlaylistItems(
    playlistId: string,
    maxResults: number = 50,
    pageToken?: string
): Promise<{
    items: {
        id: string;
        snippet: {
            title: string;
            description: string;
            publishedAt: string;
            thumbnails: {
                default: { url: string; width: number; height: number };
                medium: { url: string; width: number; height: number };
                high: { url: string; width: number; height: number };
                standard?: { url: string; width: number; height: number };
                maxres?: { url: string; width: number; height: number };
            };
            channelTitle: string;
            channelId: string;
            position: number;
            resourceId: {
                kind: string;
                videoId: string;
            };
        };
        contentDetails: {
            videoId: string;
            startAt: string;
            endAt: string;
        };
    }[];
    nextPageToken?: string;
    prevPageToken?: string;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
}> {
    return youtubeGet<{
        items: {
            id: string;
            snippet: {
                title: string;
                description: string;
                publishedAt: string;
                thumbnails: {
                    default: { url: string; width: number; height: number };
                    medium: { url: string; width: number; height: number };
                    high: { url: string; width: number; height: number };
                    standard?: { url: string; width: number; height: number };
                    maxres?: { url: string; width: number; height: number };
                };
                channelTitle: string;
                channelId: string;
                position: number;
                resourceId: {
                    kind: string;
                    videoId: string;
                };
            };
            contentDetails: {
                videoId: string;
                startAt: string;
                endAt: string;
            };
        }[];
        nextPageToken?: string;
        prevPageToken?: string;
        pageInfo: {
            totalResults: number;
            resultsPerPage: number;
        };
    }>('/playlistItems', {
        part: 'snippet,contentDetails',
        playlistId,
        maxResults,
        pageToken,
    });
}
