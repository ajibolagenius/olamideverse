import { spotifyClient } from './spotify';
import { geniusClient } from './genius';
import { apiCache } from './cache';

interface Album {
    id: string;
    title: string;
    artist: string;
    releaseDate: string;
    coverArt: string;
    tracks: Track[];
}

interface Track {
    id: string;
    title: string;
    artist: string;
    duration: number;
    audioUrl?: string;
}

interface Lyrics {
    text: string;
    synced: Array<{
        text: string;
        startTime: number;
        endTime: number;
    }>;
}

class MusicService {
    /**
     * Get all albums by Olamide
     */
    public async getAlbums(): Promise<Album[]> {
        const cacheKey = 'music-service:albums';

        return apiCache.getOrSet(cacheKey, async () => {
            try {
                const artist = await spotifyClient.searchArtist('Olamide');
                const spotifyAlbums = await spotifyClient.getArtistAlbums(artist.id);

                // Transform Spotify albums to our format
                return Promise.all(
                    spotifyAlbums.map(async (album) => {
                        const fullAlbum = await spotifyClient.getAlbum(album.id);

                        return {
                            id: album.id,
                            title: album.name,
                            artist: 'Olamide',
                            releaseDate: album.release_date,
                            coverArt: album.images[0]?.url || '',
                            tracks: fullAlbum.tracks.items.map((track) => ({
                                id: track.id,
                                title: track.name,
                                artist: 'Olamide',
                                duration: Math.floor(track.duration_ms / 1000),
                                audioUrl: track.preview_url,
                            })),
                        };
                    })
                );
            } catch (error) {
                console.error('Error fetching albums:', error);
                return [];
            }
        });
    }

    /**
     * Get a specific album by ID
     */
    public async getAlbum(albumId: string): Promise<Album | null> {
        const cacheKey = `music-service:album:${albumId}`;

        return apiCache.getOrSet(cacheKey, async () => {
            try {
                const spotifyAlbum = await spotifyClient.getAlbum(albumId);

                return {
                    id: spotifyAlbum.id,
                    title: spotifyAlbum.name,
                    artist: 'Olamide',
                    releaseDate: spotifyAlbum.release_date,
                    coverArt: spotifyAlbum.images[0]?.url || '',
                    tracks: spotifyAlbum.tracks.items.map((track) => ({
                        id: track.id,
                        title: track.name,
                        artist: 'Olamide',
                        duration: Math.floor(track.duration_ms / 1000),
                        audioUrl: track.preview_url,
                    })),
                };
            } catch (error) {
                console.error(`Error fetching album ${albumId}:`, error);
                return null;
            }
        });
    }

    /**
     * Get a specific track by ID
     */
    public async getTrack(trackId: string): Promise<Track | null> {
        const cacheKey = `music-service:track:${trackId}`;

        return apiCache.getOrSet(cacheKey, async () => {
            try {
                const spotifyTrack = await spotifyClient.getTrack(trackId);

                return {
                    id: spotifyTrack.id,
                    title: spotifyTrack.name,
                    artist: spotifyTrack.artists[0]?.name || 'Olamide',
                    duration: Math.floor(spotifyTrack.duration_ms / 1000),
                    audioUrl: spotifyTrack.preview_url,
                };
            } catch (error) {
                console.error(`Error fetching track ${trackId}:`, error);
                return null;
            }
        });
    }

    /**
     * Get lyrics for a track
     */
    public async getLyrics(trackTitle: string, artistName: string): Promise<Lyrics | null> {
        const cacheKey = `music-service:lyrics:${artistName}:${trackTitle}`;

        return apiCache.getOrSet(cacheKey, async () => {
            try {
                const song = await geniusClient.searchSong(trackTitle, artistName);
                const lyrics = await geniusClient.getLyrics(song.id);

                return {
                    text: lyrics.lyrics,
                    synced: lyrics.syncedLyrics,
                };
            } catch (error) {
                console.error(`Error fetching lyrics for ${trackTitle} by ${artistName}:`, error);
                return null;
            }
        });
    }
}

// Export a singleton instance
export const musicService = new MusicService();
