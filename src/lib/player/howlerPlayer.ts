import { Howl } from 'howler';
import type { Track } from '@/types/models';

class HowlerPlayer {
    private howl: Howl | null = null;
    private currentTrack: Track | null = null;
    private onPlayCallback: (() => void) | null = null;
    private onPauseCallback: (() => void) | null = null;
    private onStopCallback: (() => void) | null = null;
    private onEndCallback: (() => void) | null = null;
    private onProgressCallback: ((progress: number) => void) | null = null;
    private onLoadCallback: (() => void) | null = null;
    private onLoadErrorCallback: ((error: Error) => void) | null = null;
    private onBufferingCallback: ((isBuffering: boolean) => void) | null = null;
    private progressInterval: NodeJS.Timeout | null = null;
    private isLoading: boolean = false;

    constructor() {
        this.setupHowlEvents = this.setupHowlEvents.bind(this);
    }

    private setupHowlEvents(howl: Howl) {
        howl.on('load', () => {
            this.isLoading = false;
            this.onLoadCallback?.();
            this.onBufferingCallback?.(false);
        });

        howl.on('loaderror', (id, error) => {
            this.isLoading = false;
            this.onLoadErrorCallback?.(new Error(`Failed to load audio: ${error}`));
            this.onBufferingCallback?.(false);
        });

        howl.on('playerror', (id, error) => {
            this.onLoadErrorCallback?.(new Error(`Playback error: ${error}`));
        });

        howl.on('play', () => {
            this.onPlayCallback?.();
            this.startProgressTracking();
        });

        howl.on('pause', () => {
            this.onPauseCallback?.();
            this.stopProgressTracking();
        });

        howl.on('stop', () => {
            this.onStopCallback?.();
            this.stopProgressTracking();
        });

        howl.on('end', () => {
            this.onEndCallback?.();
            this.stopProgressTracking();
        });

        // Handle buffering states
        howl.on('seek', () => {
            this.onBufferingCallback?.(true);
            // Clear buffering state after a short delay
            setTimeout(() => {
                this.onBufferingCallback?.(false);
            }, 500);
        });
    }

    private startProgressTracking() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }

        this.progressInterval = setInterval(() => {
            if (this.howl && this.onProgressCallback && this.howl.playing()) {
                const progress = this.howl.seek() as number;
                this.onProgressCallback(progress);
            }
        }, 250); // More frequent updates for smoother progress
    }

    private stopProgressTracking() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    public load(track: Track) {
        if (!track.audioUrl) {
            const error = new Error('No audio URL provided for track');
            this.onLoadErrorCallback?.(error);
            return;
        }

        // Stop current track if playing
        this.stop();

        this.isLoading = true;
        this.onBufferingCallback?.(true);

        // Create new Howl instance with enhanced configuration
        this.howl = new Howl({
            src: [track.audioUrl],
            html5: true,
            preload: true,
            format: this.getAudioFormat(track.audioUrl),
            volume: 0.8, // Default volume
            onload: () => {
                this.isLoading = false;
                this.onLoadCallback?.();
                this.onBufferingCallback?.(false);
            },
            onloaderror: (id, error) => {
                this.isLoading = false;
                this.onLoadErrorCallback?.(new Error(`Failed to load audio: ${error}`));
                this.onBufferingCallback?.(false);
            },
            onplayerror: (id, error) => {
                this.onLoadErrorCallback?.(new Error(`Playback error: ${error}`));
            }
        });

        this.setupHowlEvents(this.howl);
        this.currentTrack = track;
    }

    /**
     * Get audio format from URL
     * @param url Audio URL
     * @returns Audio format string
     */
    private getAudioFormat(url: string): string[] {
        const extension = url.split('.').pop()?.toLowerCase();
        if (extension === 'mp3') return ['mp3'];
        if (extension === 'wav') return ['wav'];
        if (extension === 'ogg') return ['ogg'];
        if (extension === 'aac') return ['aac'];
        if (extension === 'm4a') return ['m4a'];
        return [];
    }

    public play() {
        if (this.howl) {
            this.howl.play();
        }
    }

    public pause() {
        if (this.howl) {
            this.howl.pause();
        }
    }

    public stop() {
        if (this.howl) {
            this.howl.stop();
            this.howl.unload();
            this.howl = null;
            this.currentTrack = null;
        }
    }

    public seek(position: number) {
        if (this.howl && !this.isLoading) {
            const clampedPosition = Math.max(0, Math.min(position, this.getDuration()));
            this.howl.seek(clampedPosition);
            this.onBufferingCallback?.(true);

            // Clear buffering state after seek completes
            setTimeout(() => {
                this.onBufferingCallback?.(false);
            }, 300);
        }
    }

    public setVolume(volume: number) {
        if (this.howl) {
            const clampedVolume = Math.max(0, Math.min(1, volume));
            this.howl.volume(clampedVolume);
        }
    }

    public getDuration(): number {
        return this.howl ? this.howl.duration() : 0;
    }

    public getCurrentPosition(): number {
        return this.howl ? (this.howl.seek() as number) : 0;
    }

    public isPlaying(): boolean {
        return this.howl ? this.howl.playing() : false;
    }

    public isLoaded(): boolean {
        return this.howl ? this.howl.state() === 'loaded' : false;
    }

    public isBuffering(): boolean {
        return this.isLoading || (this.howl ? this.howl.state() === 'loading' : false);
    }

    public getCurrentTrack(): Track | null {
        return this.currentTrack;
    }

    public getVolume(): number {
        return this.howl ? this.howl.volume() : 0;
    }

    public onPlay(callback: () => void) {
        this.onPlayCallback = callback;
    }

    public onPause(callback: () => void) {
        this.onPauseCallback = callback;
    }

    public onStop(callback: () => void) {
        this.onStopCallback = callback;
    }

    public onEnd(callback: () => void) {
        this.onEndCallback = callback;
    }

    public onProgress(callback: (progress: number) => void) {
        this.onProgressCallback = callback;
    }

    public onLoad(callback: () => void) {
        this.onLoadCallback = callback;
    }

    public onLoadError(callback: (error: Error) => void) {
        this.onLoadErrorCallback = callback;
    }

    public onBuffering(callback: (isBuffering: boolean) => void) {
        this.onBufferingCallback = callback;
    }

    /**
     * Fade volume in/out for smooth transitions
     * @param targetVolume Target volume (0-1)
     * @param duration Fade duration in milliseconds
     */
    public fadeVolume(targetVolume: number, duration: number = 1000) {
        if (!this.howl) return;

        const currentVolume = this.howl.volume();
        const volumeDiff = targetVolume - currentVolume;
        const steps = 20;
        const stepSize = volumeDiff / steps;
        const stepDuration = duration / steps;

        let currentStep = 0;
        const fadeInterval = setInterval(() => {
            if (!this.howl) {
                clearInterval(fadeInterval);
                return;
            }

            currentStep++;
            const newVolume = currentVolume + (stepSize * currentStep);

            if (currentStep >= steps) {
                this.howl.volume(targetVolume);
                clearInterval(fadeInterval);
            } else {
                this.howl.volume(newVolume);
            }
        }, stepDuration);
    }

    /**
     * Crossfade between tracks
     * @param newTrack New track to play
     * @param fadeDuration Crossfade duration in milliseconds
     */
    public crossfade(newTrack: Track, fadeDuration: number = 2000) {
        if (!this.howl || !this.currentTrack) {
            this.load(newTrack);
            return;
        }

        const oldHowl = this.howl;
        const oldVolume = oldHowl.volume();

        // Fade out current track
        this.fadeVolume(0, fadeDuration / 2);

        // Load and start new track after half the fade duration
        setTimeout(() => {
            this.load(newTrack);
            if (this.howl) {
                this.howl.volume(0);
                this.play();
                this.fadeVolume(oldVolume, fadeDuration / 2);
            }

            // Stop and unload old track
            oldHowl.stop();
            oldHowl.unload();
        }, fadeDuration / 2);
    }
}

// Export a singleton instance
export const howlerPlayer = new HowlerPlayer();
