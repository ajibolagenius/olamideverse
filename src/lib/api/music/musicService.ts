import { spotifyClient } from './spotify';
import { geniusClient } from './genius';
import { youtubeClient } from './youtube';
import { audiomackClient } from './audiomack';
import { apiCache } from './cache';
import type { Album, Track, Lyrics } from '@/types/models';

/**
 * Music source types
 */
export enum MusicSource {
    SPOTIFY = 'spotify',
    YOUTUBE = 'youtube',
    AUDIOMACK = 'audiomack',
    APPLE_MUSIC = 'apple_music',
}

/**
 * Music service interface for unified access to music APIs
 */
class MusicService {
    /**
     * Get all albums by Olamide
     * @param source Preferred music source (optional)
     * @returns Promise resolving to an array of albums
     */
    public async getAlbums(source?: MusicSource): Promise<Album[]> {
        const cacheKey = `music-service:albums:${source || 'all'}`;

        return apiCache.getOrSet(cacheKey, async () => {
            try {
                // Determine which source to use
                if (source === MusicSource.AUDIOMACK) {
                    return this.getAudiomackAlbums('Olamide');
                } else {
                    // Default to Spotify
                    return this.getSpotifyAlbums('Olamide');
                }
            } catch (error) {
                console.error('Error fetching albums:', error);
                return [];
            }
        });
    }

    /**
     * Get albums from Spotify
     * @param artistName Artist name
     * @returns Promise resolving to an array of albums
     */
    private async getSpotifyAlbums(artistName: string): Promise<Album[]> {
        try {
            const artist = await spotifyClient.searchArtist(artistName);
            const spotifyAlbums = await spotifyClient.getArtistAlbums(artist.id);

            // Transform Spotify albums to our format
            return Promise.all(
                spotifyAlbums.map(async (album) => {
                    const fullAlbum = await spotifyClient.getAlbum(album.id);
                    const now = new Date().toISOString();

                    return {
                        id: album.id,
                        title: album.name,
                        releaseDate: album.release_date,
                        coverArtUrl: album.images[0]?.url || '',
                        description: `${album.name} by ${artistName}`,
                        tracks: fullAlbum.tracks.items.map((track) => ({
                            id: track.id,
                            albumId: album.id,
                            title: track.name,
                            duration: Math.floor(track.duration_ms / 1000),
                            audioUrl: track.preview_url || '',
                            position: track.track_number,
                            metadata: {
                                spotifyId: track.id,
                                artist: artistName,
                            },
                            createdAt: now,
                            updatedAt: now,
                        })),
                        metadata: {
                            spotifyId: album.id,
                            artist: artistName,
                        },
                        createdAt: now,
                        updatedAt: now,
                    };
                })
            );
        } catch (error) {
            console.error(`Error fetching Spotify albums for ${artistName}:`, error);
            return [];
        }
    }

    /**
     * Get albums from Audiomack
     * @param artistName Artist name
     * @returns Promise resolving to an array of albums
     */
    private async getAudiomackAlbums(artistName: string): Promise<Album[]> {
        try {
            const audiomackAlbums = await audiomackClient.searchAlbums(artistName);
            const now = new Date().toISOString();

            return audiomackAlbums.map(album => ({
                id: album.id,
                title: album.title,
                releaseDate: album.releaseDate,
                coverArtUrl: album.imageUrl,
                description: `${album.title} by ${album.artist}`,
                tracks: album.tracks.map((track, index) => ({
                    id: track.id,
                    albumId: album.id,
                    title: track.title,
                    duration: track.duration,
                    audioUrl: track.streamUrl,
                    position: index + 1,
                    metadata: {
                        audiomackId: track.id,
                        artist: track.artist,
                        playCount: track.playCount,
                        favoriteCount: track.favoriteCount,
                    },
                    createdAt: now,
                    updatedAt: now,
                })),
                metadata: {
                    audiomackId: album.id,
                    artist: album.artist,
                },
                createdAt: now,
                updatedAt: now,
            }));
        } catch (error) {
            console.error(`Error fetching Audiomack albums for ${artistName}:`, error);
            return [];
        }
    }

    /**
     * Get a specific album by ID
     * @param albumId Album ID
     * @param source Music source
     * @returns Promise resolving to an album or null if not found
     */
    public async getAlbum(albumId: string, source: MusicSource = MusicSource.SPOTIFY): Promise<Album | null> {
        const cacheKey = `music-service:album:${source}:${albumId}`;

        return apiCache.getOrSet(cacheKey, async () => {
            try {
                switch (source) {
                    case MusicSource.SPOTIFY:
                        return this.getSpotifyAlbum(albumId);
                    case MusicSource.AUDIOMACK:
                        // For Audiomack, we would need to implement a different approach
                        // since we don't have direct album ID lookup
                        return null;
                    default:
                        return this.getSpotifyAlbum(albumId);
                }
            } catch (error) {
                console.error(`Error fetching album ${albumId} from ${source}:`, error);
                return null;
            }
        });
    }

    /**
     * Get an album from Spotify
     * @param albumId Spotify album ID
     * @returns Promise resolving to an album or null if not found
     */
    private async getSpotifyAlbum(albumId: string): Promise<Album | null> {
        try {
            const spotifyAlbum = await spotifyClient.getAlbum(albumId);
            const now = new Date().toISOString();

            return {
                id: spotifyAlbum.id,
                title: spotifyAlbum.name,
                releaseDate: spotifyAlbum.release_date,
                coverArtUrl: spotifyAlbum.images[0]?.url || '',
                description: `${spotifyAlbum.name}`,
                tracks: spotifyAlbum.tracks.items.map((track) => ({
                    id: track.id,
                    albumId: spotifyAlbum.id,
                    title: track.name,
                    duration: Math.floor(track.duration_ms / 1000),
                    audioUrl: track.preview_url || '',
                    position: track.track_number,
                    metadata: {
                        spotifyId: track.id,
                        artist: track.artists[0]?.name || 'Unknown',
                    },
                    createdAt: now,
                    updatedAt: now,
                })),
                metadata: {
                    spotifyId: spotifyAlbum.id,
                    artist: spotifyAlbum.artists[0]?.name || 'Unknown',
                },
                createdAt: now,
                updatedAt: now,
            };
        } catch (error) {
            console.error(`Error fetching Spotify album ${albumId}:`, error);
            return null;
        }
    }

    /**
     * Get a specific track by ID
     * @param trackId Track ID
     * @param source Music source
     * @returns Promise resolving to a track or null if not found
     */
    public async getTrack(trackId: string, source: MusicSource = MusicSource.SPOTIFY): Promise<Track | null> {
        const cacheKey = `music-service:track:${source}:${trackId}`;

        return apiCache.getOrSet(cacheKey, async () => {
            try {
                switch (source) {
                    case MusicSource.SPOTIFY:
                        return this.getSpotifyTrack(trackId);
                    case MusicSource.YOUTUBE:
                        // For YouTube, we would need a different approach
                        return null;
                    case MusicSource.AUDIOMACK:
                        // For Audiomack, we would need a different approach
                        return null;
                    default:
                        return this.getSpotifyTrack(trackId);
                }
            } catch (error) {
                console.error(`Error fetching track ${trackId} from ${source}:`, error);
                return null;
            }
        });
    }

    /**
     * Get a track from Spotify
     * @param trackId Spotify track ID
     * @returns Promise resolving to a track or null if not found
     */
    private async getSpotifyTrack(trackId: string): Promise<Track | null> {
        try {
            const spotifyTrack = await spotifyClient.getTrack(trackId);
            const now = new Date().toISOString();

            return {
                id: spotifyTrack.id,
                albumId: spotifyTrack.album.id,
                title: spotifyTrack.name,
                duration: Math.floor(spotifyTrack.duration_ms / 1000),
                audioUrl: spotifyTrack.preview_url || '',
                position: 0, // We don't have this information from the track endpoint
                metadata: {
                    spotifyId: spotifyTrack.id,
                    artist: spotifyTrack.artists[0]?.name || 'Unknown',
                    album: spotifyTrack.album.name,
                },
                createdAt: now,
                updatedAt: now,
            };
        } catch (error) {
            console.error(`Error fetching Spotify track ${trackId}:`, error);
            return null;
        }
    }

    /**
     * Get lyrics for a track
     * @param trackTitle Track title
     * @param artistName Artist name
     * @returns Promise resolving to lyrics or null if not found
     */
    public async getLyrics(trackTitle: string, artistName: string): Promise<Lyrics | null> {
        const cacheKey = `music-service:lyrics:${artistName}:${trackTitle}`;

        return apiCache.getOrSet(cacheKey, async () => {
            try {
                const song = await geniusClient.searchSong(trackTitle, artistName);
                const lyrics = await geniusClient.getLyrics(song.id);
                const now = new Date().toISOString();

                return {
                    id: song.id,
                    trackId: '', // We don't have this information from Genius
                    text: lyrics.lyrics,
                    synced: lyrics.syncedLyrics.map(line => ({
                        text: line.text,
                        startTime: line.startTime,
                        endTime: line.endTime,
                    })),
                    source: 'Genius',
                    createdAt: now,
                    updatedAt: now,
                };
            } catch (error) {
                console.error(`Error fetching lyrics for ${trackTitle} by ${artistName}:`, error);
                return null;
            }
        });
    }

    /**
     * Search for tracks across all sources
     * @param query Search query
     * @param source Preferred music source (optional)
     * @returns Promise resolving to an array of tracks
     */
    public async searchTracks(query: string, source?: MusicSource): Promise<Track[]> {
        const cacheKey = `music-service:search:tracks:${source || 'all'}:${query}`;

        return apiCache.getOrSet(cacheKey, async () => {
            try {
                // Determine which source to use
                if (source === MusicSource.AUDIOMACK) {
                    const tracks = await audiomackClient.searchTracks(query);
                    const now = new Date().toISOString();

                    return tracks.map(track => ({
                        id: track.id,
                        albumId: '', // We don't have this information from the search
                        title: track.title,
                        duration: track.duration,
                        audioUrl: track.streamUrl,
                        position: 0, // We don't have this information from the search
                        metadata: {
                            audiomackId: track.id,
                            artist: track.artist,
                            album: track.album,
                            playCount: track.playCount,
                            favoriteCount: track.favoriteCount,
                        },
                        createdAt: now,
                        updatedAt: now,
                    }));
                } else if (source === MusicSource.YOUTUBE) {
                    const results = await youtubeClient.searchVideos(query);
                    const now = new Date().toISOString();

                    return results.items.map(video => ({
                        id: video.id,
                        albumId: '', // YouTube videos don't have album IDs
                        title: video.title,
                        duration: this.parseDuration(video.duration),
                        audioUrl: youtubeClient.getWatchUrl(video.id),
                        position: 0,
                        metadata: {
                            youtubeId: video.id,
                            channelId: video.channelId,
                            channelTitle: video.channelTitle,
                            viewCount: video.viewCount,
                            likeCount: video.likeCount,
                        },
                        createdAt: now,
                        updatedAt: now,
                    }));
                } else {
                    // Default to Spotify
                    // In a real implementation, we would search Spotify
                    // For now, we'll just return mock data
                    const now = new Date().toISOString();
                    return [
                        {
                            id: 'spotify-track-id-1',
                            albumId: 'spotify-album-id-1',
                            title: 'WO!!',
                            duration: 225,
                            audioUrl: '/audio/placeholders/wo-preview.mp3',
                            position: 1,
                            metadata: {
                                spotifyId: 'spotify-track-id-1',
                                artist: 'Olamide',
                                album: 'Lagos Nawa',
                            },
                            createdAt: now,
                            updatedAt: now,
                        },
                        {
                            id: 'spotify-track-id-2',
                            albumId: 'spotify-album-id-1',
                            title: 'Science Student',
                            duration: 252,
                            audioUrl: '/audio/placeholders/science-student-preview.mp3',
                            position: 2,
                            metadata: {
                                spotifyId: 'spotify-track-id-2',
                                artist: 'Olamide',
                                album: 'Lagos Nawa',
                            },
                            createdAt: now,
                            updatedAt: now,
                        },
                    ];
                }
            } catch (error) {
                console.error(`Error searching tracks for "${query}" from ${source}:`, error);
                return [];
            }
        });
    }

    /**
     * Parse ISO 8601 duration string to seconds
     * @param isoDuration ISO 8601 duration string (e.g., PT3M45S)
     * @returns Duration in seconds
     */
    private parseDuration(isoDuration: string): number {
        const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match) return 0;

        const hours = parseInt(match[1] || '0', 10);
        const minutes = parseInt(match[2] || '0', 10);
        const seconds = parseInt(match[3] || '0', 10);

        return hours * 3600 + minutes * 60 + seconds;
    }

    /**
     * Get a YouTube video for a track
     * @param trackTitle Track title
     * @param artistName Artist name
     * @returns Promise resolving to YouTube video ID or null if not found
     */
    public async getTrackVideo(trackTitle: string, artistName: string): Promise<string | null> {
        const cacheKey = `music-service:track-video:${artistName}:${trackTitle}`;

        return apiCache.getOrSet(cacheKey, async () => {
            try {
                const video = await youtubeClient.searchTrackVideo(trackTitle, artistName);
                return video ? video.id : null;
            } catch (error) {
                console.error(`Error fetching video for ${trackTitle} by ${artistName}:`, error);
                return null;
            }
        });
    }

    /**
     * Get an embed URL for a track
     * @param trackId Track ID
     * @param source Music source
     * @returns Embed URL for the track
     */
    public getTrackEmbedUrl(trackId: string, source: MusicSource): string {
        switch (source) {
            case MusicSource.SPOTIFY:
                return `https://open.spotify.com/embed/track/${trackId}`;
            case MusicSource.YOUTUBE:
                return youtubeClient.getEmbedUrl(trackId);
            case MusicSource.AUDIOMACK:
                // In a real implementation, we would need the track URL
                return `https://audiomack.com/embed/song/${trackId}`;
            default:
                return '';
        }
    }

    /**
     * Get an embed URL for an album
     * @param albumId Album ID
     * @param source Music source
     * @returns Embed URL for the album
     */
    public getAlbumEmbedUrl(albumId: string, source: MusicSource): string {
        switch (source) {
            case MusicSource.SPOTIFY:
                return `https://open.spotify.com/embed/album/${albumId}`;
            case MusicSource.YOUTUBE:
                return youtubeClient.getEmbedUrl(albumId);
            case MusicSource.AUDIOMACK:
                // In a real implementation, we would need the album URL
                return `https://audiomack.com/embed/album/${albumId}`;
            default:
                return '';
        }
    }
}

// Export a singleton instance
export const musicService = new MusicService();
