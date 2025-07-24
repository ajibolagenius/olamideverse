import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { musicService } from '@/lib/api/music/musicService';
import type { Track, Lyrics } from '@/types/models';

interface UseLyricsOptions {
    track: Track | null;
    enabled?: boolean;
    refetchOnWindowFocus?: boolean;
}

interface UseLyricsReturn {
    lyrics: Lyrics | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
    hasLyrics: boolean;
    hasSyncedLyrics: boolean;
}

export function useLyrics({
    track,
    enabled = true,
    refetchOnWindowFocus = false
}: UseLyricsOptions): UseLyricsReturn {
    const [previousTrackId, setPreviousTrackId] = useState<string | null>(null);

    // Generate query key based on track info
    const queryKey = track
        ? ['lyrics', track.title, track.metadata?.artist || 'Unknown'] as const
        : ['lyrics', 'no-track'] as const;

    // Fetch lyrics using React Query
    const {
        data: lyrics,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey,
        queryFn: async () => {
            if (!track) return null;

            const artist = track.metadata?.artist?.toString() || 'Unknown';
            return musicService.getLyrics(track.title, artist);
        },
        enabled: enabled && !!track,
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
        refetchOnWindowFocus,
        retry: (failureCount, error) => {
            // Don't retry if it's a 404 (lyrics not found)
            if (error && 'status' in error && error.status === 404) {
                return false;
            }
            // Retry up to 2 times for other errors
            return failureCount < 2;
        },
    });

    // Reset when track changes
    useEffect(() => {
        if (track?.id !== previousTrackId) {
            setPreviousTrackId(track?.id || null);
        }
    }, [track?.id, previousTrackId]);

    // Memoized computed values
    const hasLyrics = useCallback(() => {
        return !!(lyrics?.text || (lyrics?.synced && lyrics.synced.length > 0));
    }, [lyrics]);

    const hasSyncedLyrics = useCallback(() => {
        return !!(lyrics?.synced && lyrics.synced.length > 0);
    }, [lyrics]);

    return {
        lyrics: lyrics || null,
        isLoading,
        error: error as Error | null,
        refetch,
        hasLyrics: hasLyrics(),
        hasSyncedLyrics: hasSyncedLyrics(),
    };
}

/**
 * Hook for managing lyrics display state and interactions
 */
export function useLyricsDisplay(lyrics: Lyrics | null, currentTime: number) {
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
    const [userInteractionTimeout, setUserInteractionTimeout] = useState<NodeJS.Timeout | null>(null);

    // Find current line based on time
    const findCurrentLine = useCallback((time: number): number => {
        if (!lyrics?.synced || lyrics.synced.length === 0) return -1;

        for (let i = 0; i < lyrics.synced.length; i++) {
            const line = lyrics.synced[i];
            if (time >= line.startTime && time < line.endTime) {
                return i;
            }
        }

        // If we're past the last line, return the last line index
        const lastLine = lyrics.synced[lyrics.synced.length - 1];
        if (time >= lastLine.endTime) {
            return lyrics.synced.length - 1;
        }

        return -1;
    }, [lyrics]);

    // Calculate current line index
    const currentLineIndex = findCurrentLine(currentTime);

    // Handle user interaction (disable auto-scroll temporarily)
    const handleUserInteraction = useCallback(() => {
        if (userInteractionTimeout) {
            clearTimeout(userInteractionTimeout);
        }

        setIsAutoScrollEnabled(false);

        // Re-enable auto-scroll after 3 seconds
        const timeout = setTimeout(() => {
            setIsAutoScrollEnabled(true);
        }, 3000);

        setUserInteractionTimeout(timeout);
    }, [userInteractionTimeout]);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (userInteractionTimeout) {
                clearTimeout(userInteractionTimeout);
            }
        };
    }, [userInteractionTimeout]);

    // Reset state when lyrics change
    useEffect(() => {
        setIsAutoScrollEnabled(true);
        if (userInteractionTimeout) {
            clearTimeout(userInteractionTimeout);
            setUserInteractionTimeout(null);
        }
    }, [lyrics, userInteractionTimeout]);

    return {
        currentLineIndex,
        isAutoScrollEnabled,
        handleUserInteraction,
        findCurrentLine,
    };
}

/**
 * Hook for lyrics search and management
 */
export function useLyricsSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Lyrics[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const searchLyrics = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            // In a real implementation, we would search through lyrics
            // For now, we'll just return empty results
            setSearchResults([]);
        } catch (error) {
            console.error('Error searching lyrics:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const clearSearch = useCallback(() => {
        setSearchQuery('');
        setSearchResults([]);
    }, []);

    return {
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        searchLyrics,
        clearSearch,
    };
}
