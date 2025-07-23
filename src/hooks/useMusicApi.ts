import { useQuery } from '@tanstack/react-query';
import { musicService, MusicSource } from '@/lib/api/music/musicService';
import { getMockAlbums, getMockAlbumById, getMockTrackById } from '@/lib/api/music/mockData';

export function useMusicApi() {
    /**
     * Hook for fetching all albums
     * @param source Music source to fetch from
     * @returns Query result with albums
     */
    function useAlbums(source?: MusicSource) {
        return useQuery({
            queryKey: ['albums', source],
            queryFn: async () => {
                try {
                    // Try to fetch from the music service
                    return await musicService.getAlbums(source);
                } catch (error) {
                    console.error('Error fetching albums from API, falling back to mock data:', error);
                    // Fall back to mock data
                    return getMockAlbums();
                }
            },
        });
    }

    /**
     * Hook for fetching a specific album
     * @param albumId Album ID
     * @param source Music source to fetch from
     * @returns Query result with album
     */
    function useAlbum(albumId: string, source?: MusicSource) {
        return useQuery({
            queryKey: ['album', albumId, source],
            queryFn: async () => {
                try {
                    // Try to fetch from the music service
                    const album = await musicService.getAlbum(albumId, source);
                    return album;
                } catch (error) {
                    console.error(`Error fetching album ${albumId} from API, falling back to mock data:`, error);
                    // Fall back to mock data
                    return getMockAlbumById(albumId);
                }
            },
            enabled: !!albumId,
        });
    }

    /**
     * Hook for fetching a specific track
     * @param trackId Track ID
     * @param source Music source to fetch from
     * @returns Query result with track
     */
    function useTrack(trackId: string, source?: MusicSource) {
        return useQuery({
            queryKey: ['track', trackId, source],
            queryFn: async () => {
                try {
                    // Try to fetch from the music service
                    const track = await musicService.getTrack(trackId, source);
                    return track;
                } catch (error) {
                    console.error(`Error fetching track ${trackId} from API, falling back to mock data:`, error);
                    // Fall back to mock data
                    return getMockTrackById(trackId);
                }
            },
            enabled: !!trackId,
        });
    }

    /**
     * Hook for searching tracks
     * @param query Search query
     * @param source Music source to search in
     * @returns Query result with tracks
     */
    function useTrackSearch(query: string, source?: MusicSource) {
        return useQuery({
            queryKey: ['search', 'tracks', query, source],
            queryFn: async () => {
                try {
                    return await musicService.searchTracks(query, source);
                } catch (error) {
                    console.error(`Error searching tracks for "${query}":`, error);
                    return [];
                }
            },
            enabled: !!query,
        });
    }

    /**
     * Hook for fetching lyrics for a track
     * @param trackTitle Track title
     * @param artistName Artist name
     * @returns Query result with lyrics
     */
    function useLyrics(trackTitle: string, artistName: string) {
        return useQuery({
            queryKey: ['lyrics', trackTitle, artistName],
            queryFn: async () => {
                try {
                    return await musicService.getLyrics(trackTitle, artistName);
                } catch (error) {
                    console.error(`Error fetching lyrics for "${trackTitle}" by ${artistName}:`, error);
                    return null;
                }
            },
            enabled: !!(trackTitle && artistName),
        });
    }

    return {
        useAlbums,
        useAlbum,
        useTrack,
        useTrackSearch,
        useLyrics,
        MusicSource,
    };
}
