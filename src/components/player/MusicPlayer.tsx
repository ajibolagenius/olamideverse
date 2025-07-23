import { useState, useEffect } from 'react';
import Image from 'next/image';

interface MusicPlayerProps {
    trackUrl?: string;
    trackTitle?: string;
    artistName?: string;
    albumArt?: string;
}

export default function MusicPlayer({
    trackTitle = 'No track selected',
    artistName = 'Unknown artist',
    albumArt,
}: MusicPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.8);

    // This is a placeholder for Howler.js implementation
    // In a real implementation, we would use Howler.js to handle audio playback

    const togglePlayback = () => {
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProgress(parseFloat(e.target.value));
    };

    // Simulate progress updates
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isPlaying) {
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        setIsPlaying(false);
                        return 0;
                    }
                    return prev + 0.5;
                });
            }, 500);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying]);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-secondary-200 dark:border-secondary-800 p-4 z-40">
            <div className="container mx-auto flex items-center">
                {/* Album Art */}
                <div className="w-12 h-12 bg-secondary-200 dark:bg-secondary-800 rounded overflow-hidden mr-4">
                    {albumArt ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={albumArt}
                                alt={`${trackTitle} album art`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary-400">
                            🎵
                        </div>
                    )}
                </div>

                {/* Track Info */}
                <div className="mr-6 flex-grow max-w-[200px]">
                    <div className="truncate font-medium">{trackTitle}</div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-400 truncate">{artistName}</div>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center space-x-4">
                    <button className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
                        ⏮️
                    </button>

                    <button
                        onClick={togglePlayback}
                        className="p-2 rounded-full bg-primary text-white hover:bg-primary-600 transition-colors"
                    >
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>

                    <button className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
                        ⏭️
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="flex-grow mx-6">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleProgressChange}
                        className="w-full accent-primary"
                    />
                </div>

                {/* Volume Control */}
                <div className="flex items-center space-x-2">
                    <button className="p-1 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
                        🔊
                    </button>

                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 accent-primary"
                    />
                </div>
            </div>
        </div>
    );
}
