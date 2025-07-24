/**
 * Audio Analysis Utility for OlamideVerse
 * Provides real-time audio analysis for visualizations
 */

export interface AudioAnalysisData {
    frequencyData: Uint8Array;
    waveformData: Uint8Array;
    volume: number;
    bass: number;
    mid: number;
    treble: number;
    peak: number;
    rms: number;
}

export class AudioAnalyzer {
    private audioContext: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private source: MediaElementAudioSourceNode | null = null;
    private frequencyData: Uint8Array | null = null;
    private waveformData: Uint8Array | null = null;
    private isInitialized = false;
    private animationFrame: number | null = null;
    private onDataCallback: ((data: AudioAnalysisData) => void) | null = null;

    constructor() {
        this.initializeAudioContext = this.initializeAudioContext.bind(this);
        this.analyze = this.analyze.bind(this);
    }

    /**
     * Initialize the audio context and analyzer
     */
    private async initializeAudioContext(): Promise<void> {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

            // Create analyzer node
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048; // Higher resolution for better visualization
            this.analyser.smoothingTimeConstant = 0.8;
            this.analyser.minDecibels = -90;
            this.analyser.maxDecibels = -10;

            // Initialize data arrays
            const bufferLength = this.analyser.frequencyBinCount;
            this.frequencyData = new Uint8Array(bufferLength);
            this.waveformData = new Uint8Array(bufferLength);

            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize audio context:', error);
            throw new Error('Audio analysis not supported in this browser');
        }
    }

    /**
     * Connect to an audio element for analysis
     */
    public async connectToAudioElement(audioElement: HTMLAudioElement): Promise<void> {
        if (!this.isInitialized) {
            await this.initializeAudioContext();
        }

        if (!this.audioContext || !this.analyser) {
            throw new Error('Audio context not initialized');
        }

        try {
            // Resume audio context if suspended (required by some browsers)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            // Create source from audio element
            if (!this.source) {
                this.source = this.audioContext.createMediaElementSource(audioElement);
                this.source.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);
            }
        } catch (error) {
            console.error('Failed to connect to audio element:', error);
            throw new Error('Failed to connect audio analyzer');
        }
    }

    /**
     * Connect to Howler.js audio for analysis
     * Note: This requires accessing the underlying audio element from Howler
     */
    public async connectToHowler(howl: any): Promise<void> {
        // Try to get the audio element from Howler
        const audioElement = howl._sounds?.[0]?._node;
        if (audioElement && audioElement instanceof HTMLAudioElement) {
            await this.connectToAudioElement(audioElement);
        } else {
            console.warn('Could not connect to Howler audio element for analysis');
        }
    }

    /**
     * Start real-time audio analysis
     */
    public startAnalysis(callback: (data: AudioAnalysisData) => void): void {
        this.onDataCallback = callback;
        this.analyze();
    }

    /**
     * Stop audio analysis
     */
    public stopAnalysis(): void {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        this.onDataCallback = null;
    }

    /**
     * Perform audio analysis and call callback with data
     */
    private analyze(): void {
        if (!this.analyser || !this.frequencyData || !this.waveformData || !this.onDataCallback) {
            return;
        }

        // Get frequency and waveform data
        this.analyser.getByteFrequencyData(this.frequencyData);
        this.analyser.getByteTimeDomainData(this.waveformData);

        // Calculate audio metrics
        const analysisData = this.calculateAudioMetrics(this.frequencyData, this.waveformData);

        // Call callback with analysis data
        this.onDataCallback(analysisData);

        // Schedule next analysis
        this.animationFrame = requestAnimationFrame(this.analyze);
    }

    /**
     * Calculate various audio metrics from frequency and waveform data
     */
    private calculateAudioMetrics(frequencyData: Uint8Array, waveformData: Uint8Array): AudioAnalysisData {
        const length = frequencyData.length;

        // Calculate overall volume (RMS)
        let sum = 0;
        let peak = 0;
        for (let i = 0; i < length; i++) {
            const value = frequencyData[i];
            sum += value * value;
            peak = Math.max(peak, value);
        }
        const rms = Math.sqrt(sum / length);
        const volume = rms / 255;

        // Calculate frequency band averages
        const bassEnd = Math.floor(length * 0.1); // ~0-250Hz
        const midEnd = Math.floor(length * 0.5);  // ~250Hz-2.5kHz
        // Treble is from midEnd to length        // ~2.5kHz-22kHz

        let bassSum = 0;
        let midSum = 0;
        let trebleSum = 0;

        for (let i = 0; i < bassEnd; i++) {
            bassSum += frequencyData[i];
        }
        for (let i = bassEnd; i < midEnd; i++) {
            midSum += frequencyData[i];
        }
        for (let i = midEnd; i < length; i++) {
            trebleSum += frequencyData[i];
        }

        const bass = (bassSum / bassEnd) / 255;
        const mid = (midSum / (midEnd - bassEnd)) / 255;
        const treble = (trebleSum / (length - midEnd)) / 255;

        return {
            frequencyData: new Uint8Array(frequencyData),
            waveformData: new Uint8Array(waveformData),
            volume,
            bass,
            mid,
            treble,
            peak: peak / 255,
            rms: rms / 255
        };
    }

    /**
     * Get current audio analysis data without starting continuous analysis
     */
    public getCurrentAnalysis(): AudioAnalysisData | null {
        if (!this.analyser || !this.frequencyData || !this.waveformData) {
            return null;
        }

        this.analyser.getByteFrequencyData(this.frequencyData);
        this.analyser.getByteTimeDomainData(this.waveformData);

        return this.calculateAudioMetrics(this.frequencyData, this.waveformData);
    }

    /**
     * Check if audio analysis is supported
     */
    public static isSupported(): boolean {
        return !!(window.AudioContext || (window as any).webkitAudioContext);
    }

    /**
     * Clean up resources
     */
    public dispose(): void {
        this.stopAnalysis();

        if (this.source) {
            this.source.disconnect();
            this.source = null;
        }

        if (this.analyser) {
            this.analyser.disconnect();
            this.analyser = null;
        }

        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
            this.audioContext = null;
        }

        this.frequencyData = null;
        this.waveformData = null;
        this.isInitialized = false;
    }
}

// Export singleton instance
export const audioAnalyzer = new AudioAnalyzer();
