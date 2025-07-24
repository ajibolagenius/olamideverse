'use client';

import React, { useEffect, useRef } from 'react';
import { useMusicApi } from '@/hooks/useMusicApi';
import { useAlbumFilters } from '@/hooks/useAlbumFilters';
import { pageTransitions, performanceUtils } from '@/lib/animations';
import AlbumCard from './AlbumCard';
import AlbumFilters from './AlbumFilters';

export const AlbumGrid: React.FC = () => {
    const { useAlbums } = useMusicApi();
    const { data: albums = [], isLoading, error } = useAlbums();
    const gridRef = useRef<HTMLDivElement>(null);

    const {
        years,
        genres,
        eras,
        moods,
        selectedYear,
        selectedGenre,
        selectedEra,
        selectedMood,
        setSelectedYear,
        setSelectedGenre,
        setSelectedEra,
        setSelectedMood,
        filteredAlbums,
    } = useAlbumFilters(albums);

    // Animate grid items when they load or filter changes
    useEffect(() => {
        const grid = gridRef.current;
        if (!grid || isLoading || filteredAlbums.length === 0) return;

        const albumCards = grid.querySelectorAll('.album-card-container');

        performanceUtils.conditionalAnimate(() => {
            pageTransitions.staggerIn(
                Array.from(albumCards) as HTMLElement[],
                performanceUtils.getOptimalDuration(0.6),
                0.1
            );
        });
    }, [filteredAlbums, isLoading]);

    if (isLoading) {
        return (
            <div className="w-full">
                <div data-testid="loading-grid" className="animate-pulse grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="bg-secondary-100 dark:bg-secondary-800 rounded-lg aspect-square"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full text-center py-8">
                <p className="text-red-500">Failed to load albums. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <AlbumFilters
                years={years}
                genres={genres}
                eras={eras}
                moods={moods}
                selectedYear={selectedYear}
                selectedGenre={selectedGenre}
                selectedEra={selectedEra}
                selectedMood={selectedMood}
                onYearChange={setSelectedYear}
                onGenreChange={setSelectedGenre}
                onEraChange={setSelectedEra}
                onMoodChange={setSelectedMood}
            />

            {filteredAlbums.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg">No albums match your filters. Try adjusting your criteria.</p>
                    <button
                        onClick={() => {
                            setSelectedYear('');
                            setSelectedGenre('');
                            setSelectedEra('');
                            setSelectedMood('');
                        }}
                        className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                    {filteredAlbums.map((album) => (
                        <div
                            key={album.id}
                            className="album-card-container"
                            style={{ opacity: 0, transform: 'translateY(30px)' }}
                        >
                            <AlbumCard album={album} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AlbumGrid;
