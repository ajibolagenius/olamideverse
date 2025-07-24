'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlayIcon,
  PauseIcon,
  ScissorsIcon,
  ArrowPathIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';

interface AudioSnippetSelectorProps {
  audioUrl: string;
  onSnippetSelect: (startTime: number, endTime: number, audioBlob: Blob) => void;
  maxDuration?: number;
  className?: string;
}

export default function AudioSnippetSelector({
  audioUrl,
  onSnippetSelect,
  maxDuration = 30, // 30 seconds max
  className = ''
}: AudioSnippetSelectorProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(15);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize audio and generate waveform
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setEndTime(Math.min(maxDuration, audio.duration));
      generateWaveform();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(startTime);
      audio.currentTime = startTime;
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl, startTime, maxDuration]);

  // Generate waveform visualization
  const generateWaveform = async () => {
    setIsLoading(true);
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const rawData = audioBuffer.getChannelData(0);
      const samples = 200; // Number of bars in waveform
      const blockSize = Math.floor(rawData.length / samples);
      const filteredData = [];
      
      for (let i = 0; i < samples; i++) {
        let blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[blockStart + j]);
        }
        filteredData.push(sum / blockSize);
      }
      
      // Normalize the data
      const maxValue = Math.max(...filteredData);
      const normalizedData = filteredData.map(value => (value / maxValue));
      
      setWaveformData(normalizedData);
      await audioContext.close();
    } catch (error) {
      console.error('Error generating waveform:', error);
      // Generate dummy waveform data as fallback
      const dummyData = Array.from({ length: 200 }, () => Math.random() * 0.8 + 0.1);
      setWaveformData(dummyData);
    }
    
    setIsLoading(false);
  };

  // Draw waveform on canvas
  useEffect(() => {
    if (!waveformData.length || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const barWidth = width / waveformData.length;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw waveform bars
    waveformData.forEach((value, index) => {
      const barHeight = value * height * 0.8;
      const x = index * barWidth;
      const y = (height - barHeight) / 2;
      
      const time = (index / waveformData.length) * duration;
      const isInSelection = time >= startTime && time <= endTime;
      const isCurrentPosition = Math.abs(time - currentTime) < (duration / waveformData.length);
      
      // Set bar color
      if (isCurrentPosition && isPlaying) {
        ctx.fillStyle = '#FF5500'; // Primary color for current position
      } else if (isInSelection) {
        ctx.fillStyle = '#10B981'; // Green for selection
      } else {
        ctx.fillStyle = '#D1D5DB'; // Gray for unselected
      }
      
      ctx.fillRect(x, y, Math.max(barWidth - 1, 1), barHeight);
    });

    // Draw selection overlay
    const selectionStart = (startTime / duration) * width;
    const selectionEnd = (endTime / duration) * width;
    
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.fillRect(selectionStart, 0, selectionEnd - selectionStart, height);

    // Draw selection handles
    ctx.fillStyle = '#10B981';
    ctx.fillRect(selectionStart - 2, 0, 4, height);
    ctx.fillRect(selectionEnd - 2, 0, 4, height);

  }, [waveformData, startTime, endTime, currentTime, duration, isPlaying]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.currentTime = startTime;
      audio.play();
      setIsPlaying(true);
      
      // Stop at end time
      const checkEndTime = () => {
        if (audio.currentTime >= endTime) {
          audio.pause();
          setIsPlaying(false);
          audio.currentTime = startTime;
        } else if (isPlaying) {
          requestAnimationFrame(checkEndTime);
        }
      };
      requestAnimationFrame(checkEndTime);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const clickTime = (x / canvas.width) * duration;

    if (!isSelecting) {
      setStartTime(clickTime);
      setEndTime(Math.min(clickTime + maxDuration, duration));
      setIsSelecting(true);
    } else {
      if (clickTime < startTime) {
        setStartTime(clickTime);
      } else {
        setEndTime(Math.min(clickTime, startTime + maxDuration));
      }
      setIsSelecting(false);
    }
  };

  const generateSnippet = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      // Create audio context for processing
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Calculate sample positions
      const sampleRate = audioBuffer.sampleRate;
      const startSample = Math.floor(startTime * sampleRate);
      const endSample = Math.floor(endTime * sampleRate);
      const length = endSample - startSample;

      // Create new buffer for snippet
      const snippetBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        length,
        sampleRate
      );

      // Copy audio data
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel);
        const snippetData = snippetBuffer.getChannelData(channel);
        
        for (let i = 0; i < length; i++) {
          snippetData[i] = channelData[startSample + i];
        }
      }

      // Convert to blob
      const length_samples = snippetBuffer.length;
      const numberOfChannels = snippetBuffer.numberOfChannels;
      const buffer = new ArrayBuffer(44 + length_samples * numberOfChannels * 2);
      const view = new DataView(buffer);

      // WAV file header
      const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(0, 'RIFF');
      view.setUint32(4, 36 + length_samples * numberOfChannels * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, numberOfChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * numberOfChannels * 2, true);
      view.setUint16(32, numberOfChannels * 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, length_samples * numberOfChannels * 2, true);

      // Convert samples to 16-bit PCM
      const offset = 44;
      for (let i = 0; i < length_samples; i++) {
        for (let channel = 0; channel < numberOfChannels; channel++) {
          const sample = Math.max(-1, Math.min(1, snippetBuffer.getChannelData(channel)[i]));
          view.setInt16(offset + (i * numberOfChannels + channel) * 2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        }
      }

      const audioBlob = new Blob([buffer], { type: 'audio/wav' });
      
      await audioContext.close();
      onSnippetSelect(startTime, endTime, audioBlob);
      
    } catch (error) {
      console.error('Error generating audio snippet:', error);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const resetSelection = () => {
    setStartTime(0);
    setEndTime(Math.min(maxDuration, duration));
    setIsSelecting(false);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      setCurrentTime(0);
    }
  };

  return (
    <div className={`bg-white dark:bg-secondary-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Select Audio Snippet
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <SpeakerWaveIcon className="w-4 h-4" />
          <span>Max {maxDuration}s</span>
        </div>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Waveform Canvas */}
      <div className="relative mb-4">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="animate-pulse text-gray-500">Loading waveform...</div>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          width={800}
          height={120}
          className="w-full h-30 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-crosshair"
          onClick={handleCanvasClick}
          style={{ maxWidth: '100%', height: '120px' }}
        />
        
        {/* Selection Info */}
        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          {formatTime(startTime)} - {formatTime(endTime)} ({formatTime(endTime - startTime)})
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlayback}
            disabled={isLoading}
            className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPlaying ? (
              <PauseIcon className="w-5 h-5" />
            ) : (
              <PlayIcon className="w-5 h-5 ml-0.5" />
            )}
          </button>
          
          <button
            onClick={resetSelection}
            className="flex items-center space-x-1 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            <span className="text-sm">Reset</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            Duration: {formatTime(endTime - startTime)}
          </div>
          
          <motion.button
            onClick={generateSnippet}
            disabled={isLoading || endTime - startTime < 1}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ScissorsIcon className="w-4 h-4" />
            <span>Create Snippet</span>
          </motion.button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-500 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
        <p><strong>Instructions:</strong></p>
        <ul className="mt-1 space-y-1">
          <li>• Click on the waveform to set start time</li>
          <li>• Click again to set end time (max {maxDuration} seconds)</li>
          <li>• Use the play button to preview your selection</li>
          <li>• Click "Create Snippet" to generate your audiogram</li>
        </ul>
      </div>
    </div>
  );
}
