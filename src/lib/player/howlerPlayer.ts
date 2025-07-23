import { Howl } from 'howler';

interface Track {
    id: string;
    title: string;
    artist: string;
    audioUrl?: string;
}

class HowlerPlayer {
    private howl: Howl | null = null;
    private currentTrack: Track | null = null;
    private onPlayCallback: (() => void) | null = null;
    private onPauseCallback: (() => void) | null = null;
    private onStopCallback: (() => void) | null = null;
    private onEndCallback: (() => void) | null = null;
    private onProgressCallback: ((progress: number) => void) | null = null;

    constructor() {
        this.setupHowlEvents = this.setupHowlEvents.bind(this);
    }

    private setupHowlEvents(howl: Howl) {
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
    }

    private progressInterval: NodeJS.Timeout | null = null;

    private startProgressTracking() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }

        this.progressInterval = setInterval(() => {
            if (this.howl && this.onProgressCallback) {
                const progress = this.howl.seek() as number;
                this.onProgressCallback(progress);
            }
        }, 1000);
    }

    private stopProgressTracking() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    public load(track: Track) {
        if (!track.audioUrl) {
            console.error('No audio URL provided for track:', track);
            return;
        }

        // Stop current track if playing
        this.stop();

        // Create new Howl instance
        this.howl = new Howl({
            src: [track.audioUrl],
            html5: true,
            preload: true,
        });

        this.setupHowlEvents(this.howl);
        this.currentTrack = track;
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
        if (this.howl) {
            this.howl.seek(position);
        }
    }

    public setVolume(volume: number) {
        if (this.howl) {
            this.howl.volume(volume);
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

    public getCurrentTrack(): Track | null {
        return this.currentTrack;
    }

    public onPlay(callback: () => void) {
        this.onPlayCallback = calack, s
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
}

// Export a singleton instance
export const howlerPlayer = new HowlerPlayer();
