import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MusicPlayer from '../MusicPlayer';
import { usePlayer } from '@/hooks/usePlayer';
import type { Track } from '@/types/models';
import { MusicSource } from '@/lib/api/music/musicService';

// Mock the usePlayer hook
jest.mock('@/hooks/usePlayer');
const mockUsePlayer = usePlayer as jest.MockedFunction<typeof usePlayer>;

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: React.ComponentProps<'button'>) => <button {...props}>{children}</button>,
        svg: ({ children, ...props }: React.ComponentProps<'svg'>) => <svg {...props}>{children}</svg>,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useSpring: (value: number) => ({ get: () => value }),
    useTransform: (spring: unknown, input: number[], output: number[]) => ({ get: () => output[1] }),
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
    return function MockImage({ src, alt, ...props }: React.ComponentProps<'img'>) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={src} alt={alt} {...props} />;
    };
});

const mockTrack: Track = {
    id: 'test-track-1',
    albumId: 'test-album-1',
    title: 'Test Track',
    duration: 180,
    audioUrl: 'https://example.com/test-track.mp3',
    position: 1,
    metadata: {
        artist: 'Test Artist',
        coverArt: 'https://example.com/cover.jpg',
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
};

const defaultPlayerState = {
    currentTrack: mockTrack,
    isPlaying: false,
    volume: 0.8,
    progress: 0,
    duration: 180,
    source: MusicSource.SPOTIFY,
    isLoading: false,
    isBuffering: false,
    error: null,
    play: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
    stop: jest.fn(),
    setVolume: jest.fn(),
    seek: jest.fn(),
    skip: jest.fn(),
    crossfade: jest.fn(),
    clearError: jest.fn(),
    togglePlayback: jest.fn(),
    getEmbedUrl: jest.fn(),
    getYouTubeVideo: jest.fn(),
    getLyrics: jest.fn(),
    isLoaded: true,
    canPlay: true,
    hasError: false,
};

describe('MusicPlayer', () => {
    beforeEach(() => {
        mockUsePlayer.mockReturnValue(defaultPlayerState);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the music player with track information', () => {
        render(<MusicPlayer track={mockTrack} />);

        expect(screen.getByText('Test Track')).toBeInTheDocument();
        expect(screen.getByText('Test Artist')).toBeInTheDocument();
        expect(screen.getByLabelText('Play')).toBeInTheDocument();
    });

    it('shows play button when not playing', () => {
        render(<MusicPlayer track={mockTrack} />);

        const playButton = screen.getByLabelText('Play');
        expect(playButton).toBeInTheDocument();
    });

    it('shows pause button when playing', () => {
        mockUsePlayer.mockReturnValue({
            ...defaultPlayerState,
            isPlaying: true,
        });

        render(<MusicPlayer track={mockTrack} />);

        const pauseButton = screen.getByLabelText('Pause');
        expect(pauseButton).toBeInTheDocument();
    });

    it('calls togglePlayback when play/pause button is clicked', () => {
        const mockTogglePlayback = jest.fn();
        mockUsePlayer.mockReturnValue({
            ...defaultPlayerState,
            togglePlayback: mockTogglePlayback,
        });

        render(<MusicPlayer track={mockTrack} />);

        const playButton = screen.getByLabelText('Play');
        fireEvent.click(playButton);

        expect(mockTogglePlayback).toHaveBeenCalledTimes(1);
    });

    it('calls onNext when next button is clicked', () => {
        const mockOnNext = jest.fn();
        render(<MusicPlayer track={mockTrack} onNext={mockOnNext} />);

        const nextButton = screen.getByLabelText('Next track');
        fireEvent.click(nextButton);

        expect(mockOnNext).toHaveBeenCalledTimes(1);
    });

    it('calls onPrevious when previous button is clicked', () => {
        const mockOnPrevious = jest.fn();
        render(<MusicPlayer track={mockTrack} onPrevious={mockOnPrevious} />);

        const previousButton = screen.getByLabelText('Previous track');
        fireEvent.click(previousButton);

        expect(mockOnPrevious).toHaveBeenCalledTimes(1);
    });

    it('updates progress when progress bar is changed', () => {
        const mockSeek = jest.fn();
        mockUsePlayer.mockReturnValue({
            ...defaultPlayerState,
            seek: mockSeek,
        });

        render(<MusicPlayer track={mockTrack} />);

        const progressBar = screen.getByLabelText('Track progress');
        fireEvent.change(progressBar, { target: { value: '90' } });

        expect(mockSeek).toHaveBeenCalledWith(90);
    });

    it('updates volume when volume slider is changed', async () => {
        const mockSetVolume = jest.fn();
        mockUsePlayer.mockReturnValue({
            ...defaultPlayerState,
            setVolume: mockSetVolume,
        });

        render(<MusicPlayer track={mockTrack} />);

        // Click volume button to show slider
        const volumeButton = screen.getByLabelText('Volume 80%');
        fireEvent.click(volumeButton);

        await waitFor(() => {
            const volumeSlider = screen.getByLabelText('Volume control');
            fireEvent.change(volumeSlider, { target: { value: '0.5' } });

            expect(mockSetVolume).toHaveBeenCalledWith(0.5);
        });
    });

    it('renders mini player when showMiniPlayer is true', () => {
        render(<MusicPlayer track={mockTrack} showMiniPlayer={true} />);

        // Mini player should have a more compact layout with just album art and play button
        expect(screen.getByLabelText('Play')).toBeInTheDocument();
        expect(screen.getByAltText('Test Track album art')).toBeInTheDocument();
    });

    it('disables next/previous buttons when callbacks are not provided', () => {
        render(<MusicPlayer track={mockTrack} />);

        const nextButton = screen.getByLabelText('Next track');
        const previousButton = screen.getByLabelText('Previous track');

        expect(nextButton).toBeDisabled();
        expect(previousButton).toBeDisabled();
    });

    it('formats time correctly', () => {
        mockUsePlayer.mockReturnValue({
            ...defaultPlayerState,
            progress: 90, // 1:30
            duration: 180, // 3:00
        });

        render(<MusicPlayer track={mockTrack} />);

        expect(screen.getByText('1:30')).toBeInTheDocument();
        expect(screen.getByText('3:00')).toBeInTheDocument();
    });
});
