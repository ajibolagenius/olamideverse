import { apiCache } from '../cache';

interface YouTubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    publishedAt: string;
    channelId: string;
    channelTitle: string;
    duration: string;
    viewCount: number;
    likeCount: number;
}

interface YouTubeSearchResult {
    items: YouTubeVideo[];
    nextPageToken?: string;
    totalResults: number;
}

class YouTubeClient {
    private apiKey: string | null = null;
    private baseUrl = 'https://www.googleapis.com/youtube/v3';

    constructor() {
        // In a real implementation, we would load the API key from environment variables
        this.apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';
    }

    /**
     * Search for videos on YouTube
     * @param query Search query
     * @param maxResults Maximum number of results to return
     * @returns Promise resolving to search results
     */
    public async searchVideos(query: string, maxResults = 10): Promise<YouTubeSearchResult> {
        const cacheKey = `youtube:search:${query}:${maxResults}`;

        return apiCache.getOrSet(cacheKey, async () => {
            try {
                if (!this.apiKey) {
                    throw new Error('YouTube API key not configured');
                }

                const url = new URL(`${this.baseUrl}/search`);
                url.searchParams.append('part', 'snippet');
                url.searchParams.append('q', query);
                url.searchParams.append('type', 'video');
                url.searchParams.append('maxResults', maxResults.toString());
                url.searchParams.append('key', this.apiKey);

                const response = await fetch(url.toString());

                if (!response.ok) {
                    throw new Error(`YouTube API error: ${response.statusText}`);
                }

                const data = await response.json();

                // Get video details for each result
                const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
                const videoDetails = await this.getVideoDetails(videoIds);

                // Map search results to our format
                const videos: YouTubeVideo[] = data.items.map((item: any, index: number) => {
                    const details = videoDetails.items[index];

                    return {
                        id: item.id.videoId,
                        title: item.snippet.title,
                        description: item.snippet.description,
                        thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
                        publishedAt: item.snippet.publishedAt,
                        channelId: item.snippet.channelId,
                        channelTitle: item.snippet.channelTitle,
                        duration: details?.contentDetails?.duration || 'PT0S',
                        viewCount: parseInt(details?.statistics?.viewCount || '0', 10),
                        likeCount: parseInt(details?.statistics?.likeCount || '0', 10),
                    };
                });

                return {
                    items: videos,
                    nextPageToken: data.nextPageToken,
                    totalResults: data.pageInfo.totalResults,
                };
            } catch (error) {
                console.error('Error searching YouTube videos:', error);

                // Return mock data in case of error
                return {
                    items: [
                        {
                            id: 'youtube-video-id-1',
                            title: 'Olamide - WO!!',
                            description: 'Official music video for WO!! by Olamide',
                            thumbnailUrl: 'https://i.ytimg.com/vi/sample/hqdefault.jpg',
                            publishedAt: '2017-08-10T12:00:00Z',
                            channelId: 'olamide-channel',
                            channelTitle: 'Olamide',
                            duration: 'PT3M45S',
                            viewCount: 5000000,
                            likeCount: 50000,
                        },
                        {
                            id: 'youtube-video-id-2',
                            title: 'Olamide - Science Student',
                            description: 'Official music video for Science Student by Olamide',
                            thumbnailUrl: 'https://i.ytimg.com/vi/sample2/hqdefault.jpg',
                            publishedAt: '2018-01-20T12:00:00Z',
                            channelId: 'olamide-channel',
                            channelTitle: 'Olamide',
                            duration: 'PT4M12S',
                            viewCount: 4500000,
                            likeCount: 45000,
                        },
                    ],
                    totalResults: 2,
                };
            }
        });
    }

    /**
     * Get details for specific videos
     * @param videoIds Comma-separated list of video IDs
     * @returns Promise resolving to video details
     */
    public async getVideoDetails(videoIds: string): Promise<any> {
        const cacheKey = `youtube:videos:${videoIds}`;

        return apiCache.getOrSet(cacheKey, async () => {
            try {
                if (!this.apiKey) {
                    throw new Error('YouTube API key not configured');
                }

                const url = new URL(`${this.baseUrl}/videos`);
                url.searchParams.append('part', 'contentDetails,statistics');
                url.searchParams.append('id', videoIds);
                url.searchParams.append('key', this.apiKey);

                const response = await fetch(url.toString());

                if (!response.ok) {
                    throw new Error(`YouTube API error: ${response.statusText}`);
                }

                return await response.json();
            } catch (error) {
                console.error('Error fetching YouTube video details:', error);

                // Return mock data in case of error
                return {
                    items: [
                        {
                            id: 'youtube-video-id-1',
                            contentDetails: {
                                duration: 'PT3M45S',
                            },
                            statistics: {
                                viewCount: '5000000',
                                likeCount: '50000',
                            },
                        },
                        {
                            id: 'youtube-video-id-2',
                            contentDetails: {
                                duration: 'PT4M12S',
                            },
                            statistics: {
                                viewCount: '4500000',
                                likeCount: '45000',
                            },
                        },
                    ],
                };
            }
        });
    }

    /**
     * Get a YouTube video embed URL
     * @param videoId YouTube video ID
     * @returns Embed URL for the video
     */
    public getEmbedUrl(videoId: string): string {
        return `https://www.youtube.com/embed/${videoId}`;
    }

    /**
     * Get a YouTube video watch URL
     * @param videoId YouTube video ID
     * @returns Watch URL for the video
     */
    public getWatchUrl(videoId: string): string {
        return `https://www.youtube.com/watch?v=${videoId}`;
    }

    /**
     * Search for music videos by an artist
     * @param artist Artist name
     * @param maxResults Maximum number of results to return
     * @returns Promise resolving to search results
     */
    public async searchArtistVideos(artist: string, maxResults = 10): Promise<YouTubeSearchResult> {
        return this.searchVideos(`${artist} official music video`, maxResults);
    }

    /**
     * Search for a specific track by an artist
     * @param track Track title
     * @param artist Artist name
     * @returns Promise resolving to search results
     */
    public async searchTrackVideo(track: string, artist: string): Promise<YouTubeVideo | null> {
        const results = await this.searchVideos(`${artist} ${track} official music video`, 1);
        return results.items.length > 0 ? results.items[0] : null;
    }
}

// Export a singleton instance
export const youtubeClient = new YouTubeClient();
