import { render, screen, fireEvent } from '@testing-library/react';
import MusicPlayer from '../MusicPlayer';

describe('MusicPlayer', () => {
    it('renders the player with default values', () => {
        render(<MusicPlayer />);

        expect(screen.getByText('No track selected')).toBeInTheDocument();
        expect(screen.getByText('Unknown artist')).toBeInTheDocument();
    });

    it('renders the player with provided track information', () => {
        render(
            <MusicPlayer
                trackTitle="Test Track"
                artistName="Test Artist"
            />
        );

        expect(screen.getByText('Test Track')).toBeInTheDocument();
        expect(screen.getByText('Test Artist')).toBeInTheDocument();
    });

    it('toggles play/pause when the play button is clicked', () => {
        render(<MusicPlayer />);

        // Initial state should be paused
        const playButton = screen.getByText('▶️');

        // Click to play
        fireEvent.click(playButton);

        // Should now be playing
        expect(screen.getByText('⏸️')).toBeInTheDocument();

        // Click to pause
        fireEvent.click(screen.getByText('⏸️'));

        // Should be paused again
        expect(screen.getByText('▶️')).toBeInTheDocument();
    });
});
