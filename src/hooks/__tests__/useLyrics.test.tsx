import { renderHook, act } from '@testing-library/react';
import { useLyricsDisplay } from '../useLyrics';
import type { Lyrics } from '@/types/models';

const mockLyrics: Lyrics = {
    id: 'test-lyrics-1',
    trackId: 'test-track-1',
    text: 'Test lyrics text',
    synced: [
        { text: 'First line', startTime: 0, endTime: 4 },
        { text: 'Second line', startTime: 4, endTime: 8 },
        { text: 'Third line', startTime: 8, endTime: 12 },
    ],
    source: 'Genius',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
};

describe('useLyricsDisplay', () => {
    it('finds current line based on time', () => {
        const { result } = renderHook(() => useLyricsDisplay(mockLyrics, 6));

        expect(result.current.currentLineIndex).toBe(1); // Second line (4-8s)
    });

    it('handles time before first line', () => {
        const { result } = renderHook(() => useLyricsDisplay(mockLyrics, -1));

        expect(result.current.currentLineIndex).toBe(-1);
    });

    it('handles time after last line', () => {
        const { result } = renderHook(() => useLyricsDisplay(mockLyrics, 15));

        expect(result.current.currentLineIndex).toBe(2); // Last line index
    });

    it('handles null lyrics', () => {
        const { result } = renderHook(() => useLyricsDisplay(null, 5));

        expect(result.current.currentLineIndex).toBe(-1);
    });

    it('provides auto-scroll functionality', () => {
        const { result } = renderHook(() => useLyricsDisplay(mockLyrics, 0));

        expect(result.current.isAutoScrollEnabled).toBe(true);
        expect(typeof result.current.handleUserInteraction).toBe('function');
    });

    it('resets state when lyrics change', () => {
        const { result, rerender } = renderHook(
            ({ lyrics }) => useLyricsDisplay(lyrics, 6),
            { initialProps: { lyrics: mockLyrics } }
        );

        expect(result.current.currentLineIndex).toBe(1);

        // Change lyrics
        const newLyrics: Lyrics = {
            ...mockLyrics,
            id: 'new-lyrics',
            synced: [
                { text: 'New first line', startTime: 0, endTime: 5 },
                { text: 'New second line', startTime: 5, endTime: 10 },
            ],
        };

        rerender({ lyrics: newLyrics });

        expect(result.current.currentLineIndex).toBe(1); // Should find new current line
    });
});
