'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlayIcon, 
  PauseIcon, 
  SpeakerWaveIcon, 
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon
} from '@heroicons/react/24/outline';

interface StoryVideoProps {
  src: string;
  poster?: string;
  caption?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export default function StoryVideo({
  src,
  poster,
  caption,
  autoPlay = false,
  loop = false,
  muted = true,
  controls = true,
  className = '',
  width = 800,
  height = 450
}: StoryVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setHasError(true);
      setIsLoaded(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * duration;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (hasError) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-gray-500 text-sm">!</span>
          </div>
          <p className="text-sm text-gray-500">Video could not be loaded</p>
          {caption && (
            <p className="text-xs text-gray-400 mt-1">{caption}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <figure className={`group relative ${className}`}>
      <div className="relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
        {/* Loading skeleton */}
        {!isLoaded && (
          <div 
            className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-gray-600 flex items-center justify-center"
            style={{ aspectRatio: `${width}/${height}` }}
          >
            <div className="w-16 h-16 bg-gray-400 dark:bg-gray-500 rounded-full flex items-center justify-center">
              <PlayIcon className="w-8 h-8 text-gray-600 dark:text-gray-400 ml-1" />
            </div>
          </div>
        )}

        {/* Video element */}
        <motion.video
          ref={videoRef}
          width={width}
          height={height}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          className="w-full h-auto object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <source src={src} type="video/mp4" />
          <source src={src.replace('.mp4', '.webm')} type="video/webm" />
          Your browser does not support the video tag.
        </motion.video>

        {/* Custom controls overlay */}
        {controls && isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Play/Pause button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                onClick={togglePlay}
                className="bg-white/20 hover:bg-white/30 rounded-full p-4 transition-colors backdrop-blur-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <PauseIcon className="w-8 h-8 text-white" />
                ) : (
                  <PlayIcon className="w-8 h-8 text-white ml-1" />
                )}
              </motion.button>
            </div>

            {/* Control bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* Progress bar */}
              <div 
                className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-3"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Control buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-primary transition-colors"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <PauseIcon className="w-5 h-5" />
                    ) : (
                      <PlayIcon className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-primary transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <SpeakerXMarkIcon className="w-5 h-5" />
                    ) : (
                      <SpeakerWaveIcon className="w-5 h-5" />
                    )}
                  </button>

                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-primary transition-colors"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {isFullscreen ? (
                    <ArrowsPointingInIcon className="w-5 h-5" />
                  ) : (
                    <ArrowsPointingOutIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Caption */}
      {caption && (
        <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
