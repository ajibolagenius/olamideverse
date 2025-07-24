'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '@/hooks/usePlayer';
import { useLyrics } from '@/hooks/useLyrics';
import LyricsDisplay from './LyricsDisplay';
import dynamic from 'next/dynamic';

const WaveformVisualizer = dynamic(() => import('./WaveformVisualizer'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-24 text-gray-500">Loading visualizer...</div>
});

const ThreeJsVisualizer = dynamic(() => import('./ThreeJsVisualizer'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-48 text-gray-500">Loading 3D visualizer...</div>
});
import type { Track } from '@/types/models';
import styles from './MusicPlayer.module.css';

interface MusicPlayerProps {
    track?: Track;
    onNext?: () => void;
    onPrevious?: () => void;
    className?: string;
    showMiniPlayer?: boolean;
    onToggleExpanded?: () => void;
    showLyrics?: boolean;
}

export default function MusicPlayer({
    track,
    onNext,
    onPrevious,
    className = '',
    showMiniPlayer = false,
    onToggleExpanded,
    showLyrics = false,
}: MusicPlayerProps) {
    const {
        currentTrack,
        isPlaying,
        volume,
        progress,
        duration,
        play,
        setVolume,
        seek,
        togglePlayback,
    } = usePlayer();

    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [isExpanded, setIsExpanded] = useState(!showMiniPlayer);
    const [showLyricsPanel, setShowLyricsPanel] = useState(showLyrics);
    const [showVisualizer, setShowVisualizer] = useState(false);
    const [visualizerType, setVisualizerType] = useState<'waveform' | '3d'>('waveform');
    const progressBarRef = useRef<HTMLInputElement>(null);
    const volumeSliderRef = useRef<HTMLInputElement>(null);

    // Format time in MM:SS format
    const formatTime = useCallback((seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    // Enhanced progress bar handling with smooth animations
    const handleProgressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newProgress = parseFloat(e.target.value);
        seek(newProgress);
    }, [seek]);

    // Enhanced volume control with smooth animations
    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
    }, [setVolume]);

    // Enhanced skip controls with animation feedback
    const handlePrevious = useCallback(() => {
        if (onPrevious) {
            onPrevious();
        }
    }, [onPrevious]);

    const handleNext = useCallback(() => {
        if (onNext) {
            onNext();
        }
    }, [onNext]);

    // Keyboard shortcuts for player control
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.target instanceof HTMLInputElement) return; // Don't interfere with input fields

        switch (e.code) {
            case 'Space':
                e.preventDefault();
                togglePlayback();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (e.shiftKey) {
                    // Skip to previous track
                    handlePrevious();
                } else {
                    // Seek backward 10 seconds
                    seek(Math.max(0, progress - 10));
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (e.shiftKey) {
                    // Skip to next track
                    handleNext();
                } else {
                    // Seek forward 10 seconds
                    seek(Math.min(duration, progress + 10));
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                setVolume(Math.min(1, volume + 0.1));
                break;
            case 'ArrowDown':
                e.preventDefault();
                setVolume(Math.max(0, volume - 0.1));
                break;
            case 'KeyM':
                e.preventDefault();
                setVolume(volume > 0 ? 0 : 0.8);
                break;
        }
    }, [togglePlayback, handlePrevious, handleNext, seek, progress, duration, setVolume, volume]);

    // Add keyboard event listeners
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Toggle expanded/mini player mode
    const handleToggleExpanded = useCallback(() => {
        setIsExpanded(!isExpanded);
        onToggleExpanded?.();
    }, [isExpanded, onToggleExpanded]);

    // Play track when prop changes
    useEffect(() => {
        if (track && track.id !== currentTrack?.id) {
            play(track);
        }
    }, [track, currentTrack, play]);

    const displayTrack = currentTrack || track;

    // Fetch lyrics for the current track
    const { lyrics, isLoading: lyricsLoading } = useLyrics({
        track: displayTrack || null,
        enabled: showLyricsPanel,
    });

    if (!displayTrack) {
        return null;
    }

    // Mini player view for compact display
    if (showMiniPlayer && !isExpanded) {
        return (
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`fixed bottom-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-3 z-50 ${className}`}
            >
                <div className="flex items-center space-x-3">
                    {/* Mini Album Art */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        onClick={handleToggleExpanded}
                        className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                    >
                        {displayTrack.metadata?.coverArt ? (
                            <div className="relative w-full h-full">
                                <Image
                                    src={displayTrack.metadata.coverArt as string}
                                    alt={`${displayTrack.title} album art`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </motion.div>

                    {/* Mini Play Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={togglePlayback}
                        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                        <AnimatePresence mode="wait">
                            {isPlaying ? (
                                <motion.svg
                                    key="pause"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </motion.svg>
                            ) : (
                                <motion.svg
                                    key="play"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </motion.svg>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </motion.div>
        );
    }

    return (
        <>
            {/* Keyboard shortcuts instructions for screen readers */}
            <div className="sr-only" id="player-instructions">
                Music player keyboard shortcuts: Space to play/pause, Left/Right arrows to seek,
                Shift+Left/Right for previous/next track, Up/Down arrows for volume, M to mute
            </div>

            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 p-4 z-40 ${className}`}
                role="region"
                aria-label="Music player"
                aria-describedby="player-instructions"
            >
                <div className="container mx-auto">
                    {/* Progress Bar - Top */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>{formatTime(progress)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                        <div className="relative">
                            <input
                                ref={progressBarRef}
                                type="range"
                                min="0"
                                max={duration}
                                value={progress}
                                onChange={handleProgressChange}
                                className={`w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer ${styles.slider} ${styles.progressSlider}`}
                                style={{
                                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(progress / duration) * 100}%, #e5e7eb ${(progress / duration) * 100}%, #e5e7eb 100%)`
                                }}
                                aria-label={`Track progress: ${formatTime(progress)} of ${formatTime(duration)}`}
                                aria-valuemin={0}
                                aria-valuemax={duration}
                                aria-valuenow={progress}
                                aria-valuetext={`${formatTime(progress)} of ${formatTime(duration)}`}
                                role="slider"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {/* Track Info */}
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                            {/* Album Art */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="w-14 h-14 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0"
                            >
                                {displayTrack.metadata?.coverArt ? (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={displayTrack.metadata.coverArt as string}
                                            alt={`${displayTrack.title} album art`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </motion.div>

                            <div className="min-w-0 flex-1" role="status" aria-live="polite" aria-label="Now playing">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="truncate font-semibold text-gray-900 dark:text-white"
                                >
                                    {displayTrack.title}
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-sm text-gray-700 dark:text-gray-300 truncate"
                                >
                                    {String(displayTrack.metadata?.artist || 'Olamide')}
                                </motion.div>
                            </div>
                        </div>

                        {/* Playback Controls */}
                        <div className="flex items-center space-x-2 mx-8" role="group" aria-label="Playback controls">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePrevious}
                                disabled={!onPrevious}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Previous track"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                                </svg>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={togglePlayback}
                                className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg"
                                aria-label={isPlaying ? 'Pause' : 'Play'}
                            >
                                <AnimatePresence mode="wait">
                                    {isPlaying ? (
                                        <motion.svg
                                            key="pause"
                                            initial={{ scale: 0, rotate: -90 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            exit={{ scale: 0, rotate: 90 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            className="w-6 h-6"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </motion.svg>
                                    ) : (
                                        <motion.svg
                                            key="play"
                                            initial={{ scale: 0, rotate: -90 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            exit={{ scale: 0, rotate: 90 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            className="w-6 h-6"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </motion.svg>
                                    )}
                                </AnimatePresence>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNext}
                                disabled={!onNext}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Next track"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
                                </svg>
                            </motion.button>
                        </div>

                        {/* Volume Control */}
                        <div className="flex items-center space-x-2 relative">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label={`Volume ${Math.round(volume * 100)}%`}
                            >
                                {volume === 0 ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                ) : volume < 0.5 ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </motion.button>

                            <AnimatePresence>
                                {showVolumeSlider && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700"
                                    >
                                        <input
                                            ref={volumeSliderRef}
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={volume}
                                            onChange={handleVolumeChange}
                                            className={`w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer ${styles.slider} ${styles.volumeSlider}`}
                                            style={{
                                                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
                                            }}
                                            aria-label={`Volume: ${Math.round(volume * 100)}%`}
                                            aria-valuemin={0}
                                            aria-valuemax={1}
                                            aria-valuenow={volume}
                                            aria-valuetext={`${Math.round(volume * 100)}%`}
                                            role="slider"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Lyrics Toggle Button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowLyricsPanel(!showLyricsPanel)}
                                className={`p-2 rounded-full transition-colors ${showLyricsPanel
                                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                aria-label={showLyricsPanel ? 'Hide lyrics' : 'Show lyrics'}
                                disabled={lyricsLoading}
                            >
                                {lyricsLoading ? (
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </motion.button>

                            {/* Visualizer Toggle Button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowVisualizer(!showVisualizer)}
                                className={`p-2 rounded-full transition-colors ${showVisualizer
                                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                aria-label={showVisualizer ? 'Hide visualizer' : 'Show visualizer'}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                                </svg>
                            </motion.button>

                            {/* Visualizer Type Toggle (when visualizer is shown) */}
                            <AnimatePresence>
                                {showVisualizer && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setVisualizerType(visualizerType === 'waveform' ? '3d' : 'waveform')}
                                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        aria-label={`Switch to ${visualizerType === 'waveform' ? '3D' : 'waveform'} visualizer`}
                                    >
                                        {visualizerType === 'waveform' ? (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                                            </svg>
                                        )}
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Lyrics Panel */}
                <AnimatePresence>
                    {showLyricsPanel && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="border-t border-gray-200 dark:border-gray-800 bg-white/98 dark:bg-gray-900/98 backdrop-blur-sm"
                        >
                            <div className="container mx-auto">
                                <LyricsDisplay
                                    lyrics={lyrics}
                                    currentTime={progress}
                                    isPlaying={isPlaying}
                                    onSeek={seek}
                                    className="max-h-80"
                                    showAttribution={true}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Visualizer Panel */}
                <AnimatePresence>
                    {showVisualizer && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20 backdrop-blur-sm"
                        >
                            <div className="container mx-auto p-4">
                                <div className="flex items-center justify-center space-x-4">
                                    {visualizerType === 'waveform' ? (
                                        <WaveformVisualizer
                                            track={displayTrack}
                                            isPlaying={isPlaying}
                                            width={600}
                                            height={120}
                                            showFrequencyBars={true}
                                            color="#8b5cf6"
                                            onVisualizationClick={(position) => {
                                                const seekTime = position * duration;
                                                seek(seekTime);
                                            }}
                                        />
                                    ) : (
                                        <ThreeJsVisualizer
                                            track={displayTrack}
                                            isPlaying={isPlaying}
                                            width={300}
                                            height={200}
                                            showParticles={true}
                                            color="#8b5cf6"
                                            rotationSpeed={0.02}
                                        />
                                    )}
                                </div>

                                {/* Visualizer Info */}
                                <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                                    {visualizerType === 'waveform'
                                        ? 'Click on the waveform to seek to that position'
                                        : '3D album disc visualization with audio-reactive effects'
                                    }
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}
