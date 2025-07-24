'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMusicApi } from '@/hooks/useMusicApi';
import { usePlayer } from '@/hooks/usePlayer';
import type { Track } from '@/types/models';

export default function AlbumDetailPage() {
    const params = useParams();
    const albumId = params.id as string;
    const { useAlbum } = useMusicApi();
    const { data: album, isLoading, error } = useAlbum(albumId);
    const { play } = usePlayer();
    const [_currentTrackIndex, _setCurrentTrackIndex] = useState<number>(0);

    const _handlePlayTrack = (track: Track, index: number) => {
        play(track);
        _setCurrentTrackIndex(index);
    };

    const _handleNext = () => {
        if (album && album.tracks.length > 0) {
            const nextIndex = (_currentTrackIndex + 1) % album.tracks.length;
            const nextTrack = album.tracks.find(t => t.position === nextIndex + 1);
            if (nextTrack) {
                _handlePlayTrack(nextTrack, nextIndex);
            }
        }
    };

    const _handlePrevious = () => {
        if (album && album.tracks.length > 0) {
            const prevIndex = _currentTrackIndex === 0 ? album.tracks.length - 1 : _currentTrackIndex - 1;
            const prevTrack = album.tracks.find(t => t.position === prevIndex + 1);
            if (prevTrack) {
                _handlePlayTrack(prevTrack, prevIndex);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 w-48 bg-secondary-100 dark:bg-secondary-800 rounded mb-8"></div>
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-1/3 aspect-square bg-secondary-100 dark:bg-secondary-800 rounded"></div>
                        <div className="w-full md:w-2/3">
                            <div className="h-8 w-3/4 bg-secondary-100 dark:bg-secondary-800 rounded mb-4"></div>
                            <div className="h-4 w-1/2 bg-secondary-100 dark:bg-secondary-800 rounded mb-8"></div>
                            <div className="space-y-4">
                                {[...Array(8)].map((_, index) => (
                                    <div key={index} className="h-12 bg-secondary-100 dark:bg-secondary-800 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !album) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Album</h1>
                    <p className="mb-6">We couldn&#39;t load the album details. Please try again later.</p>
                    <Link href="/albums" className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
                        Back to Albums
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="container mx-auto px-4 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mb-6">
                <Link
                    href="/albums"
                    className="inline-flex items-center text-primary-500 hover:text-primary-600 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Albums
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <motion.div
                    className="w-full md:w-1/3"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl">
                        <Image
                            src={album.coverArtUrl}
                            alt={`${album.title} album cover`}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="mt-6 space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold">Release Date</h2>
                            <p>{new Date(album.releaseDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                        </div>

                        {album.metadata.recordLabel && (
                            <div>
                                <h2 className="text-lg font-semibold">Label</h2>
                                <p>{album.metadata.recordLabel}</p>
                            </div>
                        )}

                        {album.metadata.producer && (
                            <div>
                                <h2 className="text-lg font-semibold">Producers</h2>
                                <p>{Array.isArray(album.metadata.producer)
                                    ? album.metadata.producer.join(', ')
                                    : album.metadata.producer}
                                </p>
                            </div>
                        )}

                        {album.metadata.genre && (
                            <div>
                                <h2 className="text-lg font-semibold">Genres</h2>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {Array.isArray(album.metadata.genre) && album.metadata.genre.map((genre, index) => (
                                        <span key={index} className="px-3 py-1 bg-secondary-100 dark:bg-secondary-800 rounded-full text-sm">
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {album.metadata.mood && (
                            <div>
                                <h2 className="text-lg font-semibold">Moods</h2>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {Array.isArray(album.metadata.mood) && album.metadata.mood.map((mood, index) => (
                                        <span key={index} className="px-3 py-1 bg-secondary-100 dark:bg-secondary-800 rounded-full text-sm">
                                            {mood}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    className="w-full md:w-2/3"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h1 className="text-4xl font-bold mb-2">{album.title}</h1>
                    <p className="text-lg text-secondary-600 dark:text-secondary-400 mb-6">
                        {album.metadata.era && `${album.metadata.era} Era`}
                    </p>

                    <div className="mb-8">
                        <p className="text-lg">{album.description}</p>
                    </div>

                    <h2 className="text-2xl font-bold mb-4">Tracklist</h2>
                    <div className="space-y-2">
                        {album.tracks.length > 0 ? (
                            album.tracks
                                .sort((a, b) => a.position - b.position)
                                .map((track) => (
                                    <motion.div
                                        key={track.id}
                                        className="bg-white dark:bg-secondary-900 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className="text-xl font-semibold w-8">{track.position}.</span>
                                                <div>
                                                    <h3 className="font-medium">{track.title}</h3>
                                                    {track.features && track.features.length > 0 && (
                                                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                                                            feat. {track.features.map(artist => artist.name).join(', ')}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-secondary-500 dark:text-secondary-400 text-sm">
                                                    {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                                                </span>
                                                <button
                                                    className="ml-4 p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                                                    aria-label={`Play ${track.title}`}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                        ) : (
                            <p className="text-center py-4 text-secondary-500 dark:text-secondary-400">
                                No tracks available for this album.
                            </p>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
