'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpenIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Album } from '@/types/models';

interface AlbumStoryCardProps {
  album: Album;
  chapterCount?: number;
  index?: number;
}

export default function AlbumStoryCard({ 
  album, 
  chapterCount = 0, 
  index = 0 
}: AlbumStoryCardProps) {
  const releaseYear = new Date(album.releaseDate).getFullYear();
  const estimatedReadTime = chapterCount * 5; // 5 minutes per chapter

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link href={`/story/${album.id}`}>
        <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:shadow-2xl">
          {/* Album Cover */}
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={album.coverArtUrl}
              alt={`${album.title} album cover`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Story Badge */}
            <div className="absolute top-4 left-4">
              <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                <BookOpenIcon className="w-3 h-3" />
                <span>Story Mode</span>
              </div>
            </div>

            {/* Chapter Count */}
            {chapterCount > 0 && (
              <div className="absolute top-4 right-4">
                <div className="bg-white/90 dark:bg-secondary-800/90 backdrop-blur-sm text-gray-900 dark:text-white px-2 py-1 rounded-full text-xs font-medium">
                  {chapterCount} chapter{chapterCount !== 1 ? 's' : ''}
                </div>
              </div>
            )}

            {/* Hover Content */}
            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-white">
                <div className="flex items-center space-x-4 text-sm">
                  {estimatedReadTime > 0 && (
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>~{estimatedReadTime} min</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{releaseYear}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors duration-200">
              {album.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {album.description}
            </p>

            {/* Metadata */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{releaseYear}</span>
                <span>•</span>
                <span>{album.metadata.totalTracks} tracks</span>
              </div>
              
              {chapterCount > 0 ? (
                <div className="text-primary font-medium text-sm flex items-center space-x-1">
                  <span>Read Story</span>
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </div>
              ) : (
                <div className="text-gray-400 text-sm">
                  Coming Soon
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
