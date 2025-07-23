import { apiCache } from '../cache';

interface SpotifyArtist {
    id: string;
    name: string;
    images: Array<{
        url: string;
        height?: number;
        width?: number;
    }>;
    genres?: string[];
    popularity?: number;
    followers?: {
        total: number;
    };
}

interface SpotifyAlbum {
    id: string;
    name: string;
    release_date: string;
    images: Array<{
        url: string;
        height?: number;
        width?: number;
    }>;
    album_type?: 'album' | 'single' | 'compilation';
    total_tracks?: number;
}

class SpotifyArtistsAPI {
    private token: string | null = null;

    constructor() {
        // In a real implementation, we would get the token from a token manager
        this.token = 'mock-token';
    }

    public async searchArtist(query: string): Promise<SpotifyArtist> {
        const cacheKey = `spotify:search:artist:${query}`;

        return apiCache.getOrSet<SpotifyArtist>(cacheKey, async () => {
            // In a real implementation, we would fetch from Spotify API
            // For now, we'll just return mock data
            return {
                name: 'Olamide',
                id: 'spotify-artist-id',
                images: [{ url: 'https://example.com/artist.jpg' }],
                genres: ['afrobeats', 'nigerian hip hop'],
                popularity: 75,
                followers: {
                    total: 1000000
                }
            };
        });
    }

    public async getArtistAlbums(artistId: string): Promise<SpotifyAlbum[]> {
        const cacheKey = `spotify:artist:${artistId}:albums`;

        return apiCache.getOrSet<SpotifyAlbum[]>(cacheKey, async () => {
            // In a real implementation, we would fetch from Spotify API
            // For now, we'll just return mock data
            return [
                {
                    id: 'uy-scuti',
                    name: 'UY Scuti',
                    release_date: '2021-06-18',
                    images: [{ url: 'https://example.com/uy-scuti.jpg' }],
                    album_type: 'album',
                    total_tracks: 10
                },
                {
                    id: 'carpe-diem',
                    name: 'Carpe Diem',
                    release_date: '2020-10-08',
                    images: [{ url: 'https://example.com/carpe-diem.jpg' }],
                    album_type: 'album',
                    total_tracks: 12
                },
            ];
        });
    }
}

// Export a singleton instance
export const spotifyArtistsAPI = new SpotifyArtistsAPI();
