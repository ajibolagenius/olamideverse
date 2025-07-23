import { useState, useEffect, useCallback } from 'react';

interface Track {
    id: string;
    title: string;
    artist: string;
    albumArt?: string;
    audioUrl?: string;
    duration: number;
}

interface PlayerState {
    currentTrack: Track | null;
    isPlaying: boolean;
    volume: number;
    progress: number;
    duration: number;
}

export function usePlayer() {
    const [state, setState] = useState<PlayerState>({
        currentTrack: null,
        isPlaying: false,
        volume: 0.8,
        progress: 0,
        duration: 0,
    });

    // This is a placeholder for Howler.js implementation
    // In a real implementation, we would use Howler.js to handle audio playback

    const play = useCallback((track: Track) => {
        setState((prev) => ({
            ...prev,
            currentTrack: track,
            isPlaying: true,
            progress: 0,
            duration: track.duration,
        }));
    }, []);

    const pause = useCallback(() => {
        setState((prev) => ({
            ...prev,
            isPlaying: false,
        }));
    }, []);

    const resume = useCallback(() => {
        setState((prev) => ({
            ...prev,
            isPlaying: true,
        }));
    }, []);

    const stop = useCallback(() => {
        setState((prev) => ({
            ...prev,
            isPlaying: false,
            progress: 0,
        }));
    }, []);

    const setVolume = useCallback((volume: number) => {
        setState((prev) => ({
            ...prev,
            volume: Math.max(0, Math.min(1, volume)),
        }));
    }, []);

    const seek = useCallback((progress: number) => {
        setState((prev) => ({
            ...prev,
            progress: Math.max(0, Math.min(prev.duration, progress)),
        }));
    }, []);

    // Simulate progress updates
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (state.isPlaying) {
            interval = setInterval(() => {
                setState((prev) => {
                    const newProgress = prev.progress + 1;

                    if (newProgress >= prev.duration) {
                        return {
                            ...prev,
                            isPlaying: false,
                            progress: 0,
                        };
                    }

                    return {
                        ...prev,
                        progress: newProgress,
                    };
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [state.isPlaying]);

    return {
        ...state,
        play,
        pause,
        resume,
        stop,
        setVolume,
        seek,
        togglePlayback: () => {
            if (state.isPlaying) {
                pause();
            } else {
                resume();
            }
        },
    };
}
