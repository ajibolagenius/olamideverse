import { useState, useMemo } from 'react';
import type { Album } from '@/types/models';

// FilterOption type used for filter dropdowns
type _FilterOption = {
    label: string;
    value: string;
}

export function useAlbumFilters(albums: Album[]) {
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    const [selectedEra, setSelectedEra] = useState<string>('');
    const [selectedMood, setSelectedMood] = useState<string>('');

    // Extract unique years from albums
    const years = useMemo(() => {
        const uniqueYears = new Set<string>();

        albums.forEach(album => {
            const year = new Date(album.releaseDate).getFullYear().toString();
            uniqueYears.add(year);
        });

        return Array.from(uniqueYears)
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map(year => ({ label: year, value: year }));
    }, [albums]);

    // Extract unique genres from albums
    const genres = useMemo(() => {
        const uniqueGenres = new Set<string>();

        albums.forEach(album => {
            const genreList = album.metadata.genre as string[] || [];
            genreList.forEach(genre => uniqueGenres.add(genre));
        });

        return Array.from(uniqueGenres)
            .sort()
            .map(genre => ({ label: genre, value: genre }));
    }, [albums]);

    // Extract unique eras from albums
    const eras = useMemo(() => {
        const uniqueEras = new Set<string>();

        albums.forEach(album => {
            const era = album.metadata.era as string;
            if (era) uniqueEras.add(era);
        });

        return Array.from(uniqueEras)
            .sort()
            .map(era => ({ label: era, value: era }));
    }, [albums]);

    // Extract unique moods from albums
    const moods = useMemo(() => {
        const uniqueMoods = new Set<string>();

        albums.forEach(album => {
            const moodList = album.metadata.mood as string[] || [];
            moodList.forEach(mood => uniqueMoods.add(mood));
        });

        return Array.from(uniqueMoods)
            .sort()
            .map(mood => ({ label: mood, value: mood }));
    }, [albums]);

    // Filter albums based on selected filters
    const filteredAlbums = useMemo(() => {
        return albums.filter(album => {
            // Filter by year
            if (selectedYear && new Date(album.releaseDate).getFullYear().toString() !== selectedYear) {
                return false;
            }

            // Filter by genre
            if (selectedGenre && !(album.metadata.genre as string[] || []).includes(selectedGenre)) {
                return false;
            }

            // Filter by era
            if (selectedEra && album.metadata.era !== selectedEra) {
                return false;
            }

            // Filter by mood
            if (selectedMood && !(album.metadata.mood as string[] || []).includes(selectedMood)) {
                return false;
            }

            return true;
        });
    }, [albums, selectedYear, selectedGenre, selectedEra, selectedMood]);

    return {
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
    };
}

export default useAlbumFilters;
