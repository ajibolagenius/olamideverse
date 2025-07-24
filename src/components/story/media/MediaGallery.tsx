'use client';

import { useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  XMarkIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';
import { MediaElement } from '@/types/models';
import { StoryImage, StoryVideo, StoryEmbed } from './';

import 'keen-slider/keen-slider.min.css';

interface MediaGalleryProps {
  media: MediaElement[];
  title?: string;
  className?: string;
  autoPlay?: boolean;
  showThumbnails?: boolean;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9';
}

export default function MediaGallery({
  media,
  title,
  className = '',
  autoPlay = false,
  showThumbnails = true,
  aspectRatio = '16:9'
}: MediaGalleryProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    loop: true,
    mode: 'free-snap',
    slides: {
      perView: 1,
      spacing: 16,
    },
    breakpoints: {
      '(min-width: 768px)': {
        slides: {
          perView: media.length > 2 ? 1.2 : 1,
          spacing: 20,
        },
      },
      '(min-width: 1024px)': {
        slides: {
          perView: media.length > 3 ? 1.5 : 1,
          spacing: 24,
        },
      },
    },
  });

  const [thumbnailRef, thumbnailInstanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      perView: 4,
      spacing: 8,
    },
    breakpoints: {
      '(min-width: 768px)': {
        slides: {
          perView: 6,
          spacing: 12,
        },
      },
      '(min-width: 1024px)': {
        slides: {
          perView: 8,
          spacing: 16,
        },
      },
    },
  });

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setIsFullscreen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setFullscreenIndex(0);
    document.body.style.overflow = 'unset';
  };

  const goToSlide = (index: number) => {
    instanceRef.current?.moveToIdx(index);
    thumbnailInstanceRef.current?.moveToIdx(index);
  };

  const nextSlide = () => {
    instanceRef.current?.next();
  };

  const prevSlide = () => {
    instanceRef.current?.prev();
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

  const renderMediaItem = (item: MediaElement, index: number, isFullscreen = false) => {
    const commonProps = {
      key: item.id,
      caption: item.caption,
      className: isFullscreen ? 'h-full' : getAspectStyle(),
    };

    switch (item.type) {
      case 'image':
        return (
          <div
            onClick={() => !isFullscreen && openFullscreen(index)}
            className={`relative cursor-pointer ${!isFullscreen ? 'group' : ''}`}
          >
            <StoryImage
              src={item.url}
              alt={item.caption || `Media item ${index + 1}`}
              {...commonProps}
              priority={index === 0}
            />
            {!isFullscreen && (
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 dark:bg-black/90 rounded-full p-2">
                  <ArrowsPointingOutIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </div>
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <StoryVideo
            src={item.url}
            poster={item.metadata?.poster as string}
            autoPlay={autoPlay && index === currentSlide}
            {...commonProps}
          />
        );

      case 'embed':
        return (
          <StoryEmbed
            url={item.url}
            type={(item.metadata?.embedType as any) || 'youtube'}
            title={item.metadata?.title as string}
            aspectRatio={aspectRatio}
            autoPlay={autoPlay && index === currentSlide}
            {...commonProps}
          />
        );

      default:
        return (
          <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center ${getAspectStyle()}`}>
            <p className="text-gray-500">Unsupported media type</p>
          </div>
        );
    }
  };

  if (media.length === 0) {
    return null;
  }

  if (media.length === 1) {
    return (
      <div className={`${className}`}>
        {title && (
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {title}
          </h3>
        )}
        {renderMediaItem(media[0], 0)}
      </div>
    );
  }

  return (
    <>
      <div className={`${className}`}>
        {title && (
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {title}
          </h3>
        )}

        {/* Main gallery */}
        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {media.map((item, index) => (
              <div key={item.id} className="keen-slider__slide">
                {renderMediaItem(item, index)}
              </div>
            ))}
          </div>

          {/* Navigation arrows */}
          {loaded && instanceRef.current && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous slide"
              >
                <ChevronLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next slide"
              >
                <ChevronRightIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </>
          )}

          {/* Slide indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {media.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-primary w-6'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail navigation */}
        {showThumbnails && media.length > 1 && (
          <div className="mt-6">
            <div ref={thumbnailRef} className="keen-slider">
              {media.map((item, index) => (
                <div
                  key={`thumb-${item.id}`}
                  className="keen-slider__slide cursor-pointer"
                  onClick={() => goToSlide(index)}
                >
                  <div className={`relative rounded-lg overflow-hidden aspect-video ${
                    index === currentSlide
                      ? 'ring-2 ring-primary'
                      : 'opacity-70 hover:opacity-100'
                  } transition-all`}>
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.caption || `Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-xs text-gray-500 capitalize">
                          {item.type}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4"
            onClick={closeFullscreen}
          >
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label="Close fullscreen"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-full max-h-full w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {renderMediaItem(media[fullscreenIndex], fullscreenIndex, true)}
            </motion.div>

            {/* Fullscreen navigation */}
            {media.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenIndex(prev => prev > 0 ? prev - 1 : media.length - 1);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenIndex(prev => prev < media.length - 1 ? prev + 1 : 0);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3"
                >
                  <ChevronRightIcon className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm">
              {fullscreenIndex + 1} of {media.length} • Press ESC to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
