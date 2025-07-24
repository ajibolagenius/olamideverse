'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpenIcon, 
  SparklesIcon, 
  MusicalNoteIcon as MusicNoteIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';
import { Album } from '@/types/models';
import { AlbumStoryCard } from '@/components/story';
import { getAlbumsWithStories } from '@/lib/api/albums';
import { getStoryChaptersByAlbum } from '@/lib/api/stories';

export default function StoryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [chapterCounts, setChapterCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbumsWithStories = async () => {
      try {
        setLoading(true);
        const albumsData = await getAlbumsWithStories();
        setAlbums(albumsData);

        // Fetch chapter counts for each album
        const counts: Record<string, number> = {};
        await Promise.all(
          albumsData.map(async (album) => {
            const chapters = await getStoryChaptersByAlbum(album.id);
            counts[album.id] = chapters.length;
          })
        );
        setChapterCounts(counts);
      } catch (error) {
        console.error('Error fetching albums with stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumsWithStories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-900 dark:to-primary-900">
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 rounded mb-4 w-2/3"></div>
            <div className="h-6 bg-gray-300 rounded mb-8 w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-300 rounded-xl h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-900 dark:to-primary-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="bg-primary/10 p-3 rounded-full mr-4"
              >
                <BookOpenIcon className="w-8 h-8 text-primary" />
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                Story Mode
              </h1>
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
            >
              Dive deep into the stories behind Olamide&apos;s music, exploring the cultural context, 
              artistic vision, and impact of his legendary albums.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500"
            >
              <div className="flex items-center space-x-2">
                <SparklesIcon className="w-4 h-4" />
                <span>Rich storytelling</span>
              </div>
              <div className="flex items-center space-x-2">
                <MusicNoteIcon className="w-4 h-4" />
                <span>Behind-the-scenes insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpenIcon className="w-4 h-4" />
                <span>Cultural context</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full"
          />
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1, 0.9, 1]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/5 rounded-full"
          />
        </div>
      </section>

      {/* Album Stories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Album Stories
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Explore the stories behind each album, from conception to creation
              </p>
            </div>
            
            <div className="hidden md:flex items-center text-sm text-gray-500">
              <span>{albums.length} album{albums.length !== 1 ? 's' : ''} available</span>
            </div>
          </motion.div>

          {albums.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album, index) => (
                <AlbumStoryCard
                  key={album.id}
                  album={album}
                  chapterCount={chapterCounts[album.id] || 0}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-center py-16"
            >
              <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Stories Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We&apos;re working on bringing you the complete stories behind Olamide&apos;s discography.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white/50 dark:bg-secondary-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Discover More About Olamide&apos;s Legacy
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Explore the complete discography, dive into the music, and experience 
              the cultural impact of one of Nigeria&apos;s greatest artists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/albums"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
              >
                Browse Albums
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </motion.a>
              <motion.a
                href="/media"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 bg-white dark:bg-secondary-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-secondary-700 transition-colors font-medium border border-gray-200 dark:border-gray-600"
              >
                Media Gallery
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
