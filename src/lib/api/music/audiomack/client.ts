import { apiCache } from '../cache';

interface AudiomackTrack {
    id: string;
    title: string;
    artist: string;
    album: string;
    url: string;
    imageUrl: string;
    streamUrl: string;
    duration: number;
    playCount: number;
    favoriteCount: number;
}

interface AudiomackAlbum {
    id: string;
    title: string;
    artist: string;
    url: string;
    imageUrl: string;
    releaseDate: string;
    tracks: AudiomackTrack[];
}

class AudiomackClient {
    private baseUrl = 'https://api.audiomack.com/v1';
    private clientId: string | null = null;

    constructor() {
        // In a real implementation, we would load the client ID from environment variables
        this.clientId = process.env.NEXT_PUBLIC_AUDIOMACK_CLIENT_ID || '';
    }

    /**
     * Search for tracks on Audiomack
     * @param query Search query
     * @param limit Maximum number of results to return
     * @returns Promise resolving to search results
     */
    public async searchTracks(query: string, limit = 10): Promise<AudiomackTrack[]> {
        const cacheKey = `audiomack:search:tracks:${query}:${limit}`;

        return apiCache.getOrSet(cacheKey, async () => {
            try {
                // In a real implementation, we would fetch from Audiomack API
                // For now, we'll just return mock data
                return [
                    {
                        id: 'audiomack-track-id-1',
                        title: 'WO!!',
                        artist: 'Olamide',
                        album: 'Lagos Nawa',
                        url: 'https://audiomack.com/olamide/song/wo',
                        imageUrl: '/images/placeholders/wo-cover.jpg',
                        streamUrl: '/audio/placeholders/wo-stream.mp3',
                        duration: 225,
                        playCount: 1000000,
                        favoriteCount: 50000,
                    },
                    {
                        id: 'audiomack-track-id-2',
                        title: 'Science Student',
                        artist: 'Olamide',
                        album: 'Lagos Nawa',
                        url: 'https://audiomack.com/olamide/song/science-student',
                        imageUrl: '/images/placeholders/science-student-cover.jpg',
                        streamUrl: '/audio/placeholders/science-student-stream.mp3',
                        duration: 252,
                        playCount: 900000,
                        favoriteCount: 45000,
                    },
                ];
            } catch (error) {
                console.error('Error searching Audiomack tracks:', error);
                return [];
            }
        });
    }

    /**
     * Search for albums on Audiomack
     * @param query Search query
     * @param limit Maximum number of results to return
     * @returns Promise resolving to search results
     */
    public async searchAlbums(query: string, limit = 10): Promise<AudiomackAlbum[]> {
        const cacheKey = `audiomack:search:albums:${query}:${limit}`;

        return apiCache.getOrSet(cacheKey, async () => {
            try {
                // In a real implementation, we would fetch from Audiomack API
                // For now, we'll just return mock data
                return [
                    {
                        id: 'audiomack-album-id-1',
                        title: 'Lagos Nawa',
                        artist: 'Olamide',
                        url: 'https://audiomack.com/olamide/album/lagos-nawa',
                        imageUrl: '/images/placeholders/lagos-nawa-cover.jpg',
                        releaseDate: '2017-11-17',
                        tracks: [
                            {
                                id: 'audiomack-track-id-1',
                                title: 'WO!!',
                                artist: 'Olamide',
                                album: 'Lagos Nawa',
                                url: 'https://audiomack.com/olamide/song/wo',
                                imageUrl: '/images/placeholders/wo-cover.jpg',
                                streamUrl: '/audio/placeholders/wo-stream.mp3',
                                duration: 225,
                                playCount: 1000000,
                                favoriteCount: 50000,
                            },
                            {
                                id: 'audiomack-track-id-2',
                                title: 'Science Student',
                                artist: 'Olamide',
                                album: 'Lagos Nawa',
                                url: 'https://audiomack.com/olamide/song/science-student',
                                imageUrl: '/images/placeholders/science-student-cover.jpg',
                                streamUrl: '/audio/placeholders/science-student-stream.mp3',
                                duration: 252,
                                playCount: 900000,
                                favoriteCount: 45000,
                            },
                        ],
                    },
                    {
                        id: 'audiomack-album-id-2',
                        title: 'Carpe Diem',
                        artist: 'Olamide',
                        url: 'https://audiomack.com/olamide/album/carpe-diem',
                        imageUrl: '/images/placeholders/carpe-diem-cover.jpg',
                        releaseDate: '2020-10-08',
                        tracks: [
                            {
                                id: 'audiomack-track-id-3',
                                title: 'Triumphant',
                                artist: 'Olamide',
                                album: 'Carpe Diem',
                                url: 'https://audiomack.com/olamide/song/triumphant',
                                imageUrl: '/images/placeholders/triumphant-cover.jpg',
                                streamUrl: '/audio/placeholders/triumphant-stream.mp3',
                                duration: 198,
                                playCount: 800000,
                                favoriteCount: 40000,
                            },
                            {
                                id: 'audiomack-track-id-4',
                                title: 'Loading',
                                artist: 'Olamide',
                                album: 'Carpe Diem',
                                url: 'https://audiomack.com/olamide/song/loading',
                                imageUrl: '/images/placeholders/loading-cover.jpg',
                                streamUrl: '/audio/placeholders/loading-stream.mp3',
                                duration: 210,
                                playCount: 850000,
                                favoriteCount: 42500,
                            },
                        ],
                    },
                ];
            } catch (error) {
                console.error('Error searching Audiomack albums:', error);
                return [];
            }
        });
    }

    /**
     * Get an album by artist and title
     * @param artist Artist name
     * @param title Album title
     * @returns Promise resolving to album or null if not found
     */
    public async getAlbum(artist: string, title: string): Promise<AudiomackAlbum | null> {
        const cacheKey = `audiomack:album:${artist}:${title}`;

        return apiCache.getOrSet(cacheKey, async () => {
            try {
                const albums = await this.searchAlbums(`${artist} ${title}`);
                return albums.length > 0 ? albums[0] : null;
            } catch (error) {
                console.error(`Error fetching Audiomack album ${title} by ${artist}:`, error);
                return null;
            }
        });
    }

    /**
     * Get a track by artist and title
     * @param artist Artist name
     * @param title Track title
     * @returns Promise resolving to track or null if not found
     */
    public async getTrack(artist: string, title: string): Promise<AudiomackTrack | null> {
        const cacheKey = `audiomack:track:${artist}:${title}`;

        return apiCache.getOrSet(cacheKey, async () => {
            try {
                const tracks = await this.searchTracks(`${artist} ${title}`);
                return tracks.length > 0 ? tracks[0] : null;
            } catch (error) {
                console.error(`Error fetching Audiomack track ${title} by ${artist}:`, error);
                return null;
            }
        });
    }

    /**
     * Get embed HTML for a track
     * @param trackUrl Audiomack track URL
     * @returns HTML string for embedding
     */
    public getTrackEmbedHtml(trackUrl: string): string {
        return `<iframe src="https://audiomack.com/embed/song/${trackUrl}" scrolling="no" width="100%" height="252" scrollbars="no" frameborder="0"></iframe>`;
    }

    /**
     * Get embed HTML for an album
     * @param albumUrl Audiomack album URL
     * @returns HTML string for embedding
     */
    public getAlbumEmbedHtml(albumUrl: string): string {
        return `<iframe src="https://audiomack.com/embed/album/${albumUrl}" scrolling="no" width="100%" height="400" scrollbars="no" frameborder="0"></iframe>`;
    }
}

// Export a singleton instance
export const audiomackClient = new AudiomackClient();
