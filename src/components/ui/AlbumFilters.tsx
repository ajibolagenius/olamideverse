'use client';

import React from 'react';

interface FilterOption {
    label: string;
    value: string;
}

interface AlbumFiltersProps {
    years: FilterOption[];
    genres: FilterOption[];
    eras: FilterOption[];
    moods: FilterOption[];
    selectedYear: string;
    selectedGenre: string;
    selectedEra: string;
    selectedMood: string;
    onYearChange: (year: string) => void;
    onGenreChange: (genre: string) => void;
    onEraChange: (era: string) => void;
    onMoodChange: (mood: string) => void;
}

export const AlbumFilters: React.FC<AlbumFiltersProps> = ({
    years,
    genres,
    eras,
    moods,
    selectedYear,
    selectedGenre,
    selectedEra,
    selectedMood,
    onYearChange,
    onGenreChange,
    onEraChange,
    onMoodChange,
}) => {
    return (
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:flex-wrap md:items-center md:gap-4 mb-6">
            <div className="flex flex-col">
                <label htmlFor="year-filter" className="text-sm font-medium mb-1">Year</label>
                <select
                    id="year-filter"
                    value={selectedYear}
                    onChange={(e) => onYearChange(e.target.value)}
                    className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">All Years</option>
                    {years.map((year) => (
                        <option key={year.value} value={year.value}>
                            {year.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col">
                <label htmlFor="genre-filter" className="text-sm font-medium mb-1">Genre</label>
                <select
                    id="genre-filter"
                    value={selectedGenre}
                    onChange={(e) => onGenreChange(e.target.value)}
                    className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">All Genres</option>
                    {genres.map((genre) => (
                        <option key={genre.value} value={genre.value}>
                            {genre.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col">
                <label htmlFor="era-filter" className="text-sm font-medium mb-1">Era</label>
                <select
                    id="era-filter"
                    value={selectedEra}
                    onChange={(e) => onEraChange(e.target.value)}
                    className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">All Eras</option>
                    {eras.map((era) => (
                        <option key={era.value} value={era.value}>
                            {era.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col">
                <label htmlFor="mood-filter" className="text-sm font-medium mb-1">Mood</label>
                <select
                    id="mood-filter"
                    value={selectedMood}
                    onChange={(e) => onMoodChange(e.target.value)}
                    className="bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">All Moods</option>
                    {moods.map((mood) => (
                        <option key={mood.value} value={mood.value}>
                            {mood.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default AlbumFilters;
