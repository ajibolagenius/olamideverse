'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  SwatchIcon,
  PhotoIcon,
  DocumentArrowDownIcon,
  ShareIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface AudiogramTemplate {
  id: string;
  name: string;
  preview: string;
  backgroundColor: string;
  waveformColor: string;
  textColor: string;
  accentColor: string;
}

interface AudiogramGeneratorProps {
  audioBlob: Blob;
  trackTitle: string;
  artistName: string;
  startTime: number;
  endTime: number;
  onShare?: (audiogramBlob: Blob) => void;
  className?: string;
}

const templates: AudiogramTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    preview: '/images/templates/classic.jpg',
    backgroundColor: '#1F2937',
    waveformColor: '#10B981',
    textColor: '#FFFFFF',
    accentColor: '#FF5500'
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    preview: '/images/templates/vibrant.jpg',
    backgroundColor: '#7C3AED',
    waveformColor: '#FBBF24',
    textColor: '#FFFFFF',
    accentColor: '#EF4444'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    preview: '/images/templates/minimal.jpg',
    backgroundColor: '#FFFFFF',
    waveformColor: '#374151',
    textColor: '#111827',
    accentColor: '#059669'
  },
  {
    id: 'neon',
    name: 'Neon',
    preview: '/images/templates/neon.jpg',
    backgroundColor: '#0F0F23',
    waveformColor: '#00FFFF',
    textColor: '#FFFFFF',
    accentColor: '#FF00FF'
  }
];

export default function AudiogramGenerator({
  audioBlob,
  trackTitle,
  artistName,
  startTime,
  endTime,
  onShare,
  className = ''
}: AudiogramGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [customText, setCustomText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  // Create audio URL from blob
  const audioUrl = URL.createObjectURL(audioBlob);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      generateWaveformFromBlob();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      URL.revokeObjectURL(audioUrl);
    };
  }, [audioBlob, audioUrl]);

  const generateWaveformFromBlob = async () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const rawData = audioBuffer.getChannelData(0);
      const samples = 100; // Bars for visualization
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
      
      const maxValue = Math.max(...filteredData);
      const normalizedData = filteredData.map(value => (value / maxValue) * 0.8 + 0.1);
      
      setWaveformData(normalizedData);
      await audioContext.close();
    } catch (error) {
      console.error('Error generating waveform:', error);
      // Fallback dummy data
      const dummyData = Array.from({ length: 100 }, () => Math.random() * 0.6 + 0.2);
      setWaveformData(dummyData);
    }
  };

  const generateAudiogramFrame = (progress: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas || !waveformData.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = selectedTemplate.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Title and artist
    ctx.textAlign = 'center';
    ctx.fillStyle = selectedTemplate.textColor;
    
    // Title
    ctx.font = 'bold 32px Arial';
    ctx.fillText(trackTitle, width / 2, 80);
    
    // Artist
    ctx.font = '24px Arial';
    ctx.fillStyle = selectedTemplate.accentColor;
    ctx.fillText(`by ${artistName}`, width / 2, 120);

    // Custom text
    if (customText) {
      ctx.font = '18px Arial';
      ctx.fillStyle = selectedTemplate.textColor;
      ctx.fillText(customText, width / 2, height - 60);
    }

    // Waveform visualization
    const waveformY = height / 2 + 20;
    const waveformHeight = 120;
    const barWidth = (width - 100) / waveformData.length;
    const centerY = waveformY + waveformHeight / 2;

    waveformData.forEach((value, index) => {
      const barHeight = value * waveformHeight;
      const x = 50 + index * barWidth;
      const y = centerY - barHeight / 2;
      
      // Determine if this bar should be highlighted based on progress
      const barProgress = index / waveformData.length;
      const isActive = progress > 0 && barProgress <= progress;
      
      ctx.fillStyle = isActive ? selectedTemplate.accentColor : selectedTemplate.waveformColor;
      ctx.fillRect(x, y, Math.max(barWidth - 2, 1), barHeight);
    });

    // Progress indicator
    if (progress > 0) {
      const progressX = 50 + (progress * (width - 100));
      ctx.fillStyle = selectedTemplate.accentColor;
      ctx.beginPath();
      ctx.arc(progressX, centerY, 8, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Timestamp
    const currentTimeText = formatTime(startTime + (progress * (endTime - startTime)));
    const totalTimeText = formatTime(endTime - startTime);
    
    ctx.font = '16px Arial';
    ctx.fillStyle = selectedTemplate.textColor;
    ctx.textAlign = 'left';
    ctx.fillText(currentTimeText, 50, waveformY + waveformHeight + 30);
    ctx.textAlign = 'right';
    ctx.fillText(totalTimeText, width - 50, waveformY + waveformHeight + 30);

    // Branding
    ctx.font = '14px Arial';
    ctx.fillStyle = selectedTemplate.accentColor;
    ctx.textAlign = 'center';
    ctx.fillText('OlamideVerse', width / 2, height - 20);
  };

  const generateStaticAudiogram = async () => {
    setIsGenerating(true);
    
    try {
      // Generate static frame
      generateAudiogramFrame(0.5); // Show progress at 50%
      
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      setGeneratedBlob(blob);
      
    } catch (error) {
      console.error('Error generating audiogram:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAudiogram = () => {
    if (!generatedBlob) return;

    const url = URL.createObjectURL(generatedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trackTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_audiogram.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareAudiogram = () => {
    if (generatedBlob && onShare) {
      onShare(generatedBlob);
    }
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Generate frame based on audio progress
  useEffect(() => {
    if (isPlaying && duration > 0) {
      const progress = currentTime / duration;
      generateAudiogramFrame(progress);
    }
  }, [currentTime, isPlaying, duration, selectedTemplate, waveformData, customText]);

  // Initial frame generation
  useEffect(() => {
    if (waveformData.length > 0) {
      generateAudiogramFrame(0);
    }
  }, [waveformData, selectedTemplate, customText]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Audio element */}
      <audio ref={audioRef} src={audioUrl} />

      {/* Template Selection */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Choose Template
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((template) => (
            <motion.button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-3 rounded-lg border-2 transition-all ${
                selectedTemplate.id === template.id
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}
            >
              <div 
                className="w-full h-20 rounded-md mb-2"
                style={{ backgroundColor: template.backgroundColor }}
              >
                <div className="h-full flex items-center justify-center">
                  <div 
                    className="w-8 h-1 rounded"
                    style={{ backgroundColor: template.waveformColor }}
                  />
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {template.name}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom Text */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Custom Message
        </h3>
        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Add a custom message (optional)"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-secondary-700 text-gray-900 dark:text-white"
          maxLength={100}
        />
        <div className="text-sm text-gray-500 mt-1">
          {customText.length}/100 characters
        </div>
      </div>

      {/* Preview Canvas */}
      <div className="bg-white dark:bg-secondary-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Preview
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={togglePlayback}
              className="flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full hover:bg-primary-600 transition-colors"
            >
              {isPlaying ? (
                <PauseIcon className="w-5 h-5" />
              ) : (
                <PlayIcon className="w-5 h-5 ml-0.5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="max-w-full h-auto border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>

        {/* Generation Controls */}
        <div className="flex items-center justify-center space-x-4">
          <motion.button
            onClick={generateStaticAudiogram}
            disabled={isGenerating || !waveformData.length}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <SwatchIcon className="w-5 h-5" />
            <span>{isGenerating ? 'Generating...' : 'Generate Audiogram'}</span>
          </motion.button>

          {generatedBlob && (
            <>
              <motion.button
                onClick={downloadAudiogram}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
                <span>Download</span>
              </motion.button>

              <motion.button
                onClick={shareAudiogram}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <ShareIcon className="w-5 h-5" />
                <span>Share</span>
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          How to create your audiogram:
        </h4>
        <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>1. Choose a visual template that matches your style</li>
          <li>2. Add a custom message (optional)</li>
          <li>3. Preview your audiogram with the play button</li>
          <li>4. Click "Generate Audiogram" to create the final image</li>
          <li>5. Download or share your audiogram on social media</li>
        </ol>
      </div>
    </div>
  );
}
