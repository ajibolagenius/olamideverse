/**
 * YouTube API client
 */

import { AxiosInstance } from 'axios';
import { createApiClient, get } from '../apiClient';

// YouTube API base URL
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// YouTube API key
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';

// YouTube API client instance
let youtubeClient: AxiosInstance | null = null;

/**
 * Gets the YouTube API client
 * @returns The YouTube API client
 */
export function getYouTubeClient(): AxiosInstance {
    if (!youtubeClient) {
        youtubeClient = createApiClient(YOUTUBE_API_BASE_URL);
    }

    return youtubeClient;
}

/**
 * Makes a GET request to the YouTube API
 * @param endpoint The API endpoint
 * @param params Optional query parameters
 * @returns A promise that resolves to the response data
 */
export async function youtubeGet<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const client = getYouTubeClient();

    // Add the API key to the parameters
    const queryParams = {
        key: YOUTUBE_API_KEY,
        ...params,
    };

    return get<T>(client, endpoint, { params: queryParams });
}
