'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Lyrics, LyricLine } from '@/types/models';

interface LyricsDisplayProps {
    lyrics: Lyrics | null;
    currentTime: number;
    isPlaying: boolean;
    onSeek?: (time: number) => void;
    className?: string;
    showAttribution?: boolean;
}

export default function LyricsDisplay({
    lyrics,
    currentTime,
    isPlaying,
    onSeek,
    className = '',
    showAttribution = true,
}: LyricsDisplayProps) {
    const [currentLineIndex, setCurrentLineIndex] = useState<number>(-1);
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const [userScrollTimeout, setUserScrollTimeout] = useState<NodeJS.Timeout | null>(null);
    const [currentLineAnnouncement, setCurrentLineAnnouncement] = useState<string>('');
    const [autoScrollStatus, setAutoScrollStatus] = useState<string>('');

    const containerRef = useRef<HTMLDivElement>(null);
    const linesRef = useRef<(HTMLDivElement | null)[]>([]);
    const previousLineRef = useRef<number>(-1);
    const prefersReducedMotion = useReducedMotion();

    // Find the current lyric line based on current time
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

    // Update current line index when time changes
    useEffect(() => {
        const newLineIndex = findCurrentLine(currentTime);
        if (newLineIndex !== currentLineIndex) {
            setCurrentLineIndex(newLineIndex);

            // Announce current line for screen readers
            if (newLineIndex >= 0 && lyrics?.synced?.[newLineIndex] && isPlaying) {
                const lineText = lyrics.synced[newLineIndex].text.trim();
                setCurrentLineAnnouncement(lineText ? `Now playing: ${lineText}` : 'Instrumental break');
            }
        }
    }, [currentTime, findCurrentLine, currentLineIndex, lyrics, isPlaying]);

    // Auto-scroll to current line when it changes
    useEffect(() => {
        if (currentLineIndex === previousLineRef.current || !isPlaying) return;

        const currentLineElement = linesRef.current[currentLineIndex];

        // Auto-scroll to current line if auto-scrolling is enabled
        if (isAutoScrolling && containerRef.current && currentLineElement && currentLineIndex >= 0) {
            const container = containerRef.current;
            const lineElement = currentLineElement;
            const containerHeight = container.clientHeight;
            const lineTop = lineElement.offsetTop;
            const lineHeight = lineElement.clientHeight;

            // Calculate scroll position to center the current line
            const scrollTop = lineTop - (containerHeight / 2) + (lineHeight / 2);

            // Smooth scroll to the current line (respect reduced motion preference)
            container.scrollTo({
                top: Math.max(0, scrollTop),
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        }

        previousLineRef.current = currentLineIndex;
    }, [currentLineIndex, isPlaying, isAutoScrolling, prefersReducedMotion]);

    // Handle manual scrolling - disable auto-scroll temporarily
    const handleScroll = useCallback(() => {
        if (userScrollTimeout) {
            clearTimeout(userScrollTimeout);
        }

        if (isAutoScrolling) {
            setIsAutoScrolling(false);
            setAutoScrollStatus('Auto-scroll paused');
        }

        // Re-enable auto-scroll after 3 seconds of no manual scrolling
        const timeout = setTimeout(() => {
            setIsAutoScrolling(true);
            setAutoScrollStatus('');
        }, 3000);

        setUserScrollTimeout(timeout);
    }, [userScrollTimeout, isAutoScrolling]);

    // Handle line click for seeking
    const handleLineClick = useCallback((line: LyricLine, index: number) => {
        if (onSeek) {
            onSeek(line.startTime);
            setCurrentLineIndex(index);
        }
    }, [onSeek]);

    // Handle keyboard navigation between lyrics lines
    const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
        if (!lyrics?.synced) return;

        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                handleLineClick(lyrics.synced[index], index);
                break;
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = Math.min(index + 1, lyrics.synced.length - 1);
                linesRef.current[nextIndex]?.focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = Math.max(index - 1, 0);
                linesRef.current[prevIndex]?.focus();
                break;
            case 'Home':
                e.preventDefault();
                linesRef.current[0]?.focus();
                break;
            case 'End':
                e.preventDefault();
                linesRef.current[lyrics.synced.length - 1]?.focus();
                break;
        }
    }, [handleLineClick, lyrics]);

    // Skip to current line function
    const skipToCurrentLine = useCallback(() => {
        if (currentLineIndex >= 0 && linesRef.current[currentLineIndex]) {
            linesRef.current[currentLineIndex]?.focus();
            linesRef.current[currentLineIndex]?.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'center'
            });
        }
    }, [currentLineIndex, prefersReducedMotion]);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (userScrollTimeout) {
                clearTimeout(userScrollTimeout);
            }
        };
    }, [userScrollTimeout]);

    // Reset refs when lyrics change
    useEffect(() => {
        linesRef.current = [];
        setCurrentLineIndex(-1);
        previousLineRef.current = -1;
        setCurrentLineAnnouncement('');
        setAutoScrollStatus('');
    }, [lyrics]);

    if (!lyrics) {
        return (
            <div
                className={`flex items-center justify-center h-64 text-gray-500 dark:text-gray-400 ${className}`}
                role="status"
                aria-label="No lyrics available for this track"
            >
                <div className="text-center">
                    <svg
                        className="w-12 h-12 mx-auto mb-4 opacity-50"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm">No lyrics available</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            {/* Live regions for screen reader announcements */}
            <div className="sr-only" aria-live="polite" aria-atomic="true" id="current-line-announcer">
                {currentLineAnnouncement}
            </div>

            <div className="sr-only" aria-live="polite">
                {autoScrollStatus}
            </div>

            {/* Skip to current line button */}
            {currentLineIndex >= 0 && lyrics?.synced && (
                <button
                    className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-3 py-1 rounded z-10 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={skipToCurrentLine}
                >
                    Skip to current line
                </button>
            )}

            {/* Lyrics container */}
            <div
                ref={containerRef}
                className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
                onScroll={handleScroll}
                role="region"
                aria-label="Interactive song lyrics with synchronized highlighting"
                aria-describedby="lyrics-instructions current-line-announcer"
            >
                <div className="p-4 space-y-2">
                    <AnimatePresence>
                        {lyrics.synced && lyrics.synced.length > 0 ? (
                            // Synchronized lyrics
                            lyrics.synced.map((line, index) => (
                                <motion.div
                                    key={`${lyrics.id}-${index}`}
                                    ref={(el) => {
                                        linesRef.current[index] = el;
                                    }}
                                    initial={prefersReducedMotion ? { opacity: 0.6 } : { opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: currentLineIndex === index ? 1 : 0.6,
                                        y: prefersReducedMotion ? 0 : 0,
                                        scale: prefersReducedMotion ? 1 : (currentLineIndex === index ? 1.05 : 1),
                                    }}
                                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
                                    transition={prefersReducedMotion ?
                                        { duration: 0.1 } :
                                        {
                                            duration: 0.3,
                                            delay: index * 0.05,
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30
                                        }
                                    }
                                    className={`
                                        cursor-pointer transition-all duration-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
                                        ${currentLineIndex === index
                                            ? 'text-blue-900 dark:text-blue-100 bg-blue-50 dark:bg-blue-900/50 font-semibold border-l-4 border-blue-700 dark:border-blue-300 shadow-sm'
                                            : 'text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                        }
                                        ${line.text.trim() === '' ? 'h-6' : ''}
                                    `}
                                    onClick={() => handleLineClick(line, index)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Lyric line: "${line.text.trim() || 'Instrumental break'}". Click to seek to ${Math.floor(line.startTime / 60)}:${String(Math.floor(line.startTime % 60)).padStart(2, '0')}`}
                                    aria-current={currentLineIndex === index ? 'true' : undefined}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                >
                                    {line.text.trim() || '\u00A0'}
                                </motion.div>
                            ))
                        ) : (
                            // Static lyrics (no sync data)
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed"
                                role="text"
                                aria-label="Song lyrics (static, no time synchronization available)"
                            >
                                {lyrics.text}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Auto-scroll indicator */}
            <AnimatePresence>
                {!isAutoScrolling && (
                    <motion.div
                        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
                        className="absolute top-2 right-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 px-3 py-1 rounded-full text-xs font-medium"
                        role="status"
                        aria-label="Auto-scroll is currently paused"
                    >
                        Auto-scroll paused
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Attribution */}
            {showAttribution && lyrics.source && (
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                    Lyrics provided by {lyrics.source}
                </div>
            )}

            {/* Comprehensive keyboard shortcuts help */}
            <div className="sr-only" id="lyrics-instructions">
                Interactive lyrics display. Click on any line to seek to that time in the song.
                Keyboard navigation: Use Up and Down arrow keys to navigate between lines.
                Press Home to go to first line, End to go to last line.
                Press Enter or Space to seek to the selected line&#39;s time.
                Current line is highlighted and announced automatically during playback.
                Auto-scroll can be paused by manually scrolling and will resume after 3 seconds.
            </div>
        </div>
    );
}
