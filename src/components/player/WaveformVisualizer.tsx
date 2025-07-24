'use client';

import { useRef, useCallback } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import { motion } from 'framer-motion';
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer';
import type { Track } from '@/types/models';

interface WaveformVisualizerProps {
    track?: Track | null;
    isPlaying?: boolean;
    width?: number;
    height?: number;
    className?: string;
    showFrequencyBars?: boolean;
    color?: string;
    backgroundColor?: string;
    onVisualizationClick?: (position: number) => void;
}

export default function WaveformVisualizer({
    track,
    isPlaying = false,
    width = 400,
    height = 100,
    className = '',
    showFrequencyBars = true,
    color = '#3b82f6',
    backgroundColor = 'transparent',
    onVisualizationClick
}: WaveformVisualizerProps) {
    const stageRef = useRef<any>(null);
    const { analysisData, isConnected: isAnalyzerConnected, error } = useAudioAnalyzer({
        track,
        isPlaying,
        enabled: true
    });

    // Convert hex color to RGB for Konva
    const hexToRgb = useCallback((hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 59, g: 130, b: 246 }; // Default blue
    }, []);

    const colorRgb = hexToRgb(color);

    // Generate waveform visualization data
    const generateWaveformPoints = useCallback(() => {
        if (!analysisData) {
            // Generate static waveform for demo
            const points: number[] = [];
            const segments = 50;
            for (let i = 0; i < segments; i++) {
                const x = (i / segments) * width;
                const amplitude = Math.sin(i * 0.2) * 0.3 + Math.sin(i * 0.1) * 0.2;
                const y = height / 2 + amplitude * (height / 4);
                points.push(x, y);
            }
            return points;
        }

        const waveformData = analysisData.waveformData;
        const points: number[] = [];
        const step = Math.floor(waveformData.length / width);

        for (let i = 0; i < width; i++) {
            const dataIndex = i * step;
            if (dataIndex < waveformData.length) {
                const amplitude = (waveformData[dataIndex] - 128) / 128;
                const y = height / 2 + amplitude * (height / 4);
                points.push(i, y);
            }
        }

        return points;
    }, [analysisData, width, height]);

    // Generate frequency bars data
    const generateFrequencyBars = useCallback(() => {
        if (!analysisData) {
            // Generate static bars for demo
            const bars: Array<{ x: number; height: number; opacity: number }> = [];
            const barCount = 32;
            const barWidth = width / barCount;

            for (let i = 0; i < barCount; i++) {
                const barHeight = Math.random() * (height * 0.6) + (height * 0.1);
                bars.push({
                    x: i * barWidth,
                    height: barHeight,
                    opacity: 0.3 + Math.random() * 0.4
                });
            }
            return bars;
        }

        const frequencyData = analysisData.frequencyData;
        const bars: Array<{ x: number; height: number; opacity: number }> = [];
        const barCount = Math.min(64, frequencyData.length / 4);
        const barWidth = width / barCount;
        const step = Math.floor(frequencyData.length / barCount);

        for (let i = 0; i < barCount; i++) {
            const dataIndex = i * step;
            if (dataIndex < frequencyData.length) {
                const amplitude = frequencyData[dataIndex] / 255;
                const barHeight = amplitude * height * 0.8;
                bars.push({
                    x: i * barWidth,
                    height: barHeight,
                    opacity: 0.3 + amplitude * 0.7
                });
            }
        }

        return bars;
    }, [analysisData, width, height]);

    // Handle click on visualization
    const handleStageClick = useCallback((e: any) => {
        if (!onVisualizationClick) return;

        const stage = e.target.getStage();
        const pointerPosition = stage.getPointerPosition();
        const position = pointerPosition.x / width;
        onVisualizationClick(position);
    }, [onVisualizationClick, width]);

    const waveformPoints = generateWaveformPoints();
    const frequencyBars = generateFrequencyBars();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`relative ${className}`}
            style={{ width, height }}
        >
            {/* Background */}
            {backgroundColor !== 'transparent' && (
                <div
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundColor }}
                />
            )}

            {/* Konva Stage */}
            <Stage
                ref={stageRef}
                width={width}
                height={height}
                onClick={handleStageClick}
                className="cursor-pointer"
            >
                <Layer>
                    {/* Background rect for click handling */}
                    <Rect
                        x={0}
                        y={0}
                        width={width}
                        height={height}
                        fill="transparent"
                    />

                    {/* Frequency bars */}
                    {showFrequencyBars && frequencyBars.map((bar, index) => (
                        <Rect
                            key={`freq-bar-${index}`}
                            x={bar.x}
                            y={height - bar.height}
                            width={Math.max(1, width / frequencyBars.length - 1)}
                            height={bar.height}
                            fill={`rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, ${bar.opacity})`}
                            cornerRadius={1}
                        />
                    ))}

                    {/* Waveform line */}
                    <Line
                        points={waveformPoints}
                        stroke={color}
                        strokeWidth={2}
                        lineCap="round"
                        lineJoin="round"
                        tension={0.3}
                        opacity={0.8}
                    />

                    {/* Center line */}
                    <Line
                        points={[0, height / 2, width, height / 2]}
                        stroke={color}
                        strokeWidth={1}
                        opacity={0.2}
                        dash={[5, 5]}
                    />
                </Layer>
            </Stage>

            {/* Overlay information */}
            {analysisData && (
                <div className="absolute top-2 right-2 text-xs text-gray-500 dark:text-gray-400 bg-black/20 rounded px-2 py-1">
                    <div>Vol: {Math.round(analysisData.volume * 100)}%</div>
                    <div>Bass: {Math.round(analysisData.bass * 100)}%</div>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-100/50 dark:bg-red-800/50 rounded-lg">
                    <div className="text-sm text-red-600 dark:text-red-400">
                        Visualizer error: {error}
                    </div>
                </div>
            )}

            {/* Loading state */}
            {!isAnalyzerConnected && !error && track && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Initializing visualizer...
                    </div>
                </div>
            )}

            {/* No audio state */}
            {!track && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/30 dark:bg-gray-800/30 rounded-lg">
                    <div className="text-sm text-gray-400 dark:text-gray-500">
                        No audio loaded
                    </div>
                </div>
            )}
        </motion.div>
    );
}
