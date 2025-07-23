/**
 * Genius API client
 */

import { AxiosInstance } from 'axios';
import { createApiClient, get } from '../apiClient';
import { apiConfig } from '@/lib/config';

// Genius API base URL
const GENIUS_API_BASE_URL = 'https://api.genius.com';

// Genius API access token
const GENIUS_ACCESS_TOKEN = apiConfig.genius.accessToken;

// Genius API client instance
let geniusClient: AxiosInstance | null = null;

/**
 * Gets the Genius API client
 * @returns The Genius API client
 */
export function getGeniusClient(): AxiosInstance {
    if (!geniusClient) {
        geniusClient = createApiClient(GENIUS_API_BASE_URL, {
            Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`,
        });
    }

    return geniusClient;
}

/**
 * Makes a GET request to the Genius API
 * @param endpoint The API endpoint
 * @param params Optional query parameters
 * @returns A promise that resolves to the response data
 */
export async function geniusGet<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const client = getGeniusClient();
    return get<T>(client, endpoint, { params });
}
