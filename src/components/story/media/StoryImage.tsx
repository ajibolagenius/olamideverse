'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  ArrowsPointingOutIcon 
} from '@heroicons/react/24/outline';

interface StoryImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export default function StoryImage({
  src,
  alt,
  caption,
  width = 800,
  height = 450,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw'
}: StoryImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    document.body.style.overflow = 'unset';
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeFullscreen();
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openFullscreen();
    }
  };

  if (hasError) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-gray-500 text-sm">?</span>
          </div>
          <p className="text-sm text-gray-500">Image could not be loaded</p>
          {caption && (
            <p className="text-xs text-gray-400 mt-1">{caption}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <figure className={`group relative ${className}`}>
        <div
          ref={imageRef}
          className="relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 cursor-pointer"
          onClick={openFullscreen}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={`View ${alt} in fullscreen`}
        >
          {/* Loading skeleton */}
          {!isLoaded && (
            <div 
              className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-gray-600"
              style={{ aspectRatio: `${width}/${height}` }}
            />
          )}

          {/* Main image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes={sizes}
              priority={priority}
              className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105"
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading={priority ? 'eager' : 'lazy'}
            />
          </motion.div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="bg-white/90 dark:bg-black/90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <MagnifyingGlassIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </motion.div>
          </div>

          {/* Expand icon */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 dark:bg-black/90 rounded-full p-2">
              <ArrowsPointingOutIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            </div>
          </div>
        </div>

        {/* Caption */}
        {caption && (
          <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {caption}
          </figcaption>
        )}
      </figure>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeFullscreen}
          onKeyDown={(e) => e.key === 'Escape' && closeFullscreen()}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen image view"
        >
          {/* Close button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            aria-label="Close fullscreen"
          >
            <XMarkIcon className="w-6 h-6 text-white" />
          </button>

          {/* Fullscreen image */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="object-contain max-w-full max-h-[90vh] w-auto h-auto"
              priority
            />
            
            {caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-center">
                <p className="text-sm">{caption}</p>
              </div>
            )}
          </motion.div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm">
            Press ESC to close
          </div>
        </motion.div>
      )}
    </>
  );
}
