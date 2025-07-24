import { useEffect, useState, useCallback } from 'react';
import { audioAnalyzer, type AudioAnalysisData } from '@/lib/audio/audioAnalyzer';
import { howlerPlayer } from '@/lib/player/howlerPlayer';
import type { Track } from '@/types/models';

interface UseAudioAnalyzerOptions {
    track?: Track | null;
    isPlaying?: boolean;
    enabled?: boolean;
}

export function useAudioAnalyzer({ track, isPlaying = false, enabled = true }: UseAudioAnalyzerOptions) {
    const [analysisData, setAnalysisData] = useState<AudioAnalysisData | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Connect to audio source
    const connectToAudio = useCallback(async () => {
        if (!track || !enabled) return;

        try {
            setError(null);

            // Try to connect to Howler's audio element
            const currentHowl = (howlerPlayer as any).howl;
            if (currentHowl) {
                await audioAnalyzer.connectToHowler(currentHowl);
                setIsConnected(true);
            } else {
                // Fallback: create a temporary audio element for analysis
                const audio = new Audio();
                audio.crossOrigin = 'anonymous';
                audio.src = track.audioUrl || '';

                await audioAnalyzer.connectToAudioElement(audio);
                setIsConnected(true);
            }
        } catch (err) {
            console.error('Failed to connect audio analyzer:', err);
            setError(err instanceof Error ? err.message : 'Failed to connect audio analyzer');
            setIsConnected(false);
        }
    }, [track, enabled]);

    // Start/stop analysis based on playing state
    useEffect(() => {
        if (!isConnected || !enabled) return;

        if (isPlaying) {
            audioAnalyzer.startAnalysis((data: AudioAnalysisData) => {
                setAnalysisData(data);
            });
        } else {
            audioAnalyzer.stopAnalysis();
            setAnalysisData(null);
        }

        return () => {
            audioAnalyzer.stopAnalysis();
        };
    }, [isPlaying, isConnected, enabled]);

    // Connect when track changes
    useEffect(() => {
        connectToAudio();

        return () => {
            audioAnalyzer.stopAnalysis();
            setIsConnected(false);
            setAnalysisData(null);
        };
    }, [connectToAudio]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            audioAnalyzer.dispose();
        };
    }, []);

    return {
        analysisData,
        isConnected,
        error,
        isSupported: typeof AudioContext !== 'undefined' || typeof (window as any)?.webkitAudioContext !== 'undefined'
    };
}
