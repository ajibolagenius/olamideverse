'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayIcon, ArrowTopRightOnSquareIcon as ExternalLinkIcon } from '@heroicons/react/24/outline';

interface StoryEmbedProps {
  url: string;
  type: 'youtube' | 'vimeo' | 'spotify' | 'soundcloud' | 'twitter' | 'instagram' | 'custom';
  title?: string;
  caption?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9';
  autoPlay?: boolean;
  showInfo?: boolean;
  className?: string;
}

export default function StoryEmbed({
  url,
  type,
  title,
  caption,
  aspectRatio = '16:9',
  autoPlay = false,
  showInfo = true,
  className = ''
}: StoryEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');

  useEffect(() => {
    const generateEmbedUrl = () => {
      try {
        switch (type) {
          case 'youtube': {
            const videoId = extractYouTubeId(url);
            if (!videoId) throw new Error('Invalid YouTube URL');
            return `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1&showinfo=${showInfo ? 1 : 0}`;
          }
          
          case 'vimeo': {
            const videoId = extractVimeoId(url);
            if (!videoId) throw new Error('Invalid Vimeo URL');
            return `https://player.vimeo.com/video/${videoId}?autoplay=${autoPlay ? 1 : 0}&title=${showInfo ? 1 : 0}&byline=0&portrait=0`;
          }
          
          case 'spotify': {
            const trackId = extractSpotifyId(url);
            if (!trackId) throw new Error('Invalid Spotify URL');
            return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
          }
          
          case 'soundcloud': {
            return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=${autoPlay}&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=true`;
          }
          
          case 'twitter': {
            // For Twitter embeds, we'd typically use Twitter's embed API
            // This is a simplified version
            return url;
          }
          
          case 'instagram': {
            // For Instagram embeds, we'd typically use Instagram's embed API
            return url;
          }
          
          case 'custom':
          default:
            return url;
        }
      } catch (error) {
        console.error('Error generating embed URL:', error);
        setHasError(true);
        return '';
      }
    };

    const generated = generateEmbedUrl();
    setEmbedUrl(generated);
  }, [url, type, autoPlay, showInfo]);

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const extractVimeoId = (url: string): string | null => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  };

  const extractSpotifyId = (url: string): string | null => {
    const match = url.match(/spotify\.com\/track\/([^?]+)/);
    return match ? match[1] : null;
  };

  const getAspectStyle = () => {
    const ratios = {
      '16:9': 'aspect-video',
      '4:3': 'aspect-[4/3]',
      '1:1': 'aspect-square',
      '21:9': 'aspect-[21/9]'
    };
    return ratios[aspectRatio] || 'aspect-video';
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  if (hasError) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg ${getAspectStyle()} flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <ExternalLinkIcon className="w-6 h-6 text-gray-500" />
          </div>
          <p className="text-sm text-gray-500 mb-2">Embed could not be loaded</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-600 text-sm underline"
          >
            View on {type.charAt(0).toUpperCase() + type.slice(1)}
          </a>
          {caption && (
            <p className="text-xs text-gray-400 mt-2">{caption}</p>
          )}
        </div>
      </div>
    );
  }

  // Special handling for Twitter and Instagram
  if (type === 'twitter' || type === 'instagram') {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <ExternalLinkIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {type.charAt(0).toUpperCase() + type.slice(1)} Post
            </h4>
            {title && (
              <p className="text-sm text-gray-600 dark:text-gray-300">{title}</p>
            )}
          </div>
        </div>
        
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <span>View on {type.charAt(0).toUpperCase() + type.slice(1)}</span>
          <ExternalLinkIcon className="w-4 h-4 ml-2" />
        </a>
        
        {caption && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">{caption}</p>
        )}
      </div>
    );
  }

  return (
    <figure className={`group ${className}`}>
      <div className={`relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 ${getAspectStyle()}`}>
        {/* Loading skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-400 dark:bg-gray-500 rounded-full flex items-center justify-center">
              <PlayIcon className="w-8 h-8 text-gray-600 dark:text-gray-400 ml-1" />
            </div>
          </div>
        )}

        {/* Embed iframe */}
        <motion.iframe
          src={embedUrl}
          title={title || `${type} embed`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* External link overlay for non-iframe embeds */}
        {(type === 'custom') && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/90 dark:bg-black/90 rounded-full p-3 hover:scale-110 transition-transform"
              aria-label="Open in new tab"
            >
              <ExternalLinkIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </a>
          </div>
        )}
      </div>

      {/* Caption */}
      {caption && (
        <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {caption}
        </figcaption>
      )}

      {/* Source link */}
      <div className="mt-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-xs text-gray-500 hover:text-primary transition-colors"
        >
          <span>View on {type.charAt(0).toUpperCase() + type.slice(1)}</span>
          <ExternalLinkIcon className="w-3 h-3 ml-1" />
        </a>
      </div>
    </figure>
  );
}
