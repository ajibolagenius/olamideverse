import { useState, useEffect, useCallback } from 'react';
import { howlerPlayer } from '@/lib/player/howlerPlayer';
import type { Track } from '@/types/models';
import { MusicSource, musicService } from '@/lib/api/music/musicService';

interface PlayerState {
    currentTrack: Track | null;
    isPlaying: boolean;
    volume: number;
    progress: number;
    duration: number;
    source: MusicSource;
}

export function usePlayer() {
    const [state, setState] = useState<PlayerState>({
        currentTrack: null,
        isPlaying: false,
        volume: 0.8,
        progress: 0,
        duration: 0,
        source: MusicSource.SPOTIFY,
    });

    // Set up event listeners for the Howler player
    useEffect(() => {
        // Set up event handlers
        howlerPlayer.onPlay(() => {
            setState(prev => ({ ...prev, isPlaying: true }));
        });

        howlerPlayer.onPause(() => {
            setState(prev => ({ ...prev, isPlaying: false }));
        });

        howlerPlayer.onStop(() => {
            setState(prev => ({ ...prev, isPlaying: false, progress: 0 }));
        });

        howlerPlayer.onEnd(() => {
            setState(prev => ({ ...prev, isPlaying: false, progress: 0 }));
        });

        howlerPlayer.onProgress((progress) => {
            setState(prev => ({ ...prev, progress }));
        });

        // Set initial volume
        howlerPlayer.setVolume(state.volume);

        // Clean up event handlers
        return () => {
            // Set empty callbacks instead of null
            howlerPlayer.onPlay(() => { });
            howlerPlayer.onPause(() => { });
            howlerPlayer.onStop(() => { });
            howlerPlayer.onEnd(() => { });
            howlerPlayer.onProgress(() => { });
        };
    }, [state.volume]);

    const play = useCallback((track: Track, source: MusicSource = MusicSource.SPOTIFY) => {
        // Load and play the track
        howlerPlayer.load(track);
        howlerPlayer.play();

        // Update state
        setState(prev => ({
            ...prev,
            currentTrack: track,
            isPlaying: true,
            progress: 0,
            duration: track.duration,
            source,
        }));
    }, []);

    const pause = useCallback(() => {
        howlerPlayer.pause();
    }, []);

    const resume = useCallback(() => {
        howlerPlayer.play();
    }, []);

    const stop = useCallback(() => {
        howlerPlayer.stop();
    }, []);

    const setVolume = useCallback((volume: number) => {
        const normalizedVolume = Math.max(0, Math.min(1, volume));
        howlerPlayer.setVolume(normalizedVolume);
        setState(prev => ({ ...prev, volume: normalizedVolume }));
    }, []);

    const seek = useCallback((progress: number) => {
        howlerPlayer.seek(progress);
        setState(prev => ({ ...prev, progress }));
    }, []);

    /**
     * Get the embed URL for the current track
     * @returns Embed URL for the current track
     */
    const getEmbedUrl = useCallback(() => {
        if (!state.currentTrack) return '';
        return musicService.getTrackEmbedUrl(state.currentTrack.id, state.source);
    }, [state.currentTrack, state.source]);

    /**
     * Get the YouTube video ID for a track
     * @param track Track to get video for
     * @returns Promise resolving to YouTube video ID or null if not found
     */
    const getYouTubeVideo = useCallback(async (track: Track): Promise<string | null> => {
        const artist = track.metadata?.artist?.toString() || '';
        return musicService.getTrackVideo(track.title, artist);
    }, []);

    /**
     * Get lyrics for the current track
     * @returns Promise resolving to lyrics or null if not found
     */
    const getLyrics = useCallback(async () => {
        if (!state.currentTrack) return null;
        const artist = state.currentTrack.metadata?.artist?.toString() || '';
        return musicService.getLyrics(state.currentTrack.title, artist);
    }, [state.currentTrack]);

    return {
        ...state,
        play,
        pause,
        resume,
        stop,
        setVolume,
        seek,
        getEmbedUrl,
        getYouTubeVideo,
        getLyrics,
        togglePlayback: () => {
            if (state.isPlaying) {
                pause();
            } else {
                resume();
            }
        },
    };
}
