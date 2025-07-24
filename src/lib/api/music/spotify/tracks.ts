import { apiCache } from '../cache';

interface SpotifyTrack {
    id: string;
    name: string;
    duration_ms: number;
    preview_url: string | null;
    album: {
        id: string;
        name: string;
        images: Array<{
            url: string;
            height?: number;
            width?: number;
        }>;
    };
    artists: Array<{
        id: string;
        name: string;
    }>;
}

interface SpotifyAlbumWithTracks {
    id: string;
    name: string;
    release_date: string;
    images: Array<{
        url: string;
        height?: number;
        width?: number;
    }>;
    tracks: {
        items: SpotifyTrack[];
    };
}

class SpotifyTracksAPI {
    private token: string | null = null;

    constructor() {
        // In a real implementation, we would get the token from a token manager
        this.token = 'mock-token';
    }

    public async getAlbum(albumId: string): Promise<SpotifyAlbumWithTracks> {
        const cacheKey = `spotify:album:${albumId}`;

        return apiCache.getOrSet<SpotifyAlbumWithTracks>(cacheKey, async () => {
            // In a real implementation, we would fetch from Spotify API
            // For now, we'll just return mock data
            return {
                id: albumId,
                name: albumId === 'uy-scuti' ? 'UY Scuti' : 'Carpe Diem',
                release_date: albumId === 'uy-scuti' ? '2021-06-18' : '2020-10-08',
                images: [{ url: `/images/placeholders/${albumId}.jpg` }],
                tracks: {
                    items: [
                        {
                            id: `${albumId}-track-1`,
                            name: 'Track 1',
                            duration_ms: 180000,
                            preview_url: '/audio/placeholders/preview.mp3',
                            album: {
                                id: albumId,
                                name: albumId === 'uy-scuti' ? 'UY Scuti' : 'Carpe Diem',
                                images: [{ url: `/images/placeholders/${albumId}.jpg` }],
                            },
                            artists: [
                                {
                                    id: 'artist-id',
                                    name: 'Olamide',
                                },
                            ],
                        },
                        {
                            id: `${albumId}-track-2`,
                            name: 'Track 2',
                            duration_ms: 210000,
                            preview_url: '/audio/placeholders/preview.mp3',
                            album: {
                                id: albumId,
                                name: albumId === 'uy-scuti' ? 'UY Scuti' : 'Carpe Diem',
                                images: [{ url: `/images/placeholders/${albumId}.jpg` }],
                            },
                            artists: [
                                {
                                    id: 'artist-id',
                                    name: 'Olamide',
                                },
                            ],
                        },
                    ],
                },
            };
        });
    }

    public async getTrack(trackId: string): Promise<SpotifyTrack> {
        const cacheKey = `spotify:track:${trackId}`;

        return apiCache.getOrSet<SpotifyTrack>(cacheKey, async () => {
            // In a real implementation, we would fetch from Spotify API
            // For now, we'll just return mock data
            return {
                id: trackId,
                name: 'Track Name',
                duration_ms: 180000,
                preview_url: '/audio/placeholders/preview.mp3',
                album: {
                    id: 'album-id',
                    name: 'Album Name',
                    images: [{ url: '/images/placeholders/album.jpg' }],
                },
                artists: [
                    {
                        id: 'artist-id',
                        name: 'Olamide',
                    },
                ],
            };
        });
    }
}

// Export a singleton instance
export const spotifyTracksAPI = new SpotifyTracksAPI();
