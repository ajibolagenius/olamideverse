'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { StoryChapter } from '@/types/models';
import { MDXContent } from '@/components/story';
import { MediaGallery } from '@/components/story/media';

interface ChapterRendererProps {
  chapter: StoryChapter;
  isActive: boolean;
}

export default function ChapterRenderer({ chapter, isActive }: ChapterRendererProps) {
  if (!isActive) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={chapter.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg overflow-hidden"
      >
        {/* Chapter Header */}
        <header className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {chapter.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Chapter {chapter.position}</span>
              <span>•</span>
              <span>~5 min read</span>
              <span>•</span>
              <time dateTime={chapter.updatedAt}>
                {new Date(chapter.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          </motion.div>
        </header>

        {/* Chapter Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="px-8 py-8"
        >
          <div className="prose dark:prose-invert max-w-none">
            <MDXContent>
              <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
            </MDXContent>
          </div>
        </motion.div>

        {/* Chapter Media */}
        {chapter.media && chapter.media.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="px-8 py-6 bg-gray-50 dark:bg-secondary-900 border-t border-gray-200 dark:border-gray-700"
          >
            <MediaGallery
              media={chapter.media}
              title="Related Media"
              showThumbnails={chapter.media.length > 1}
            />
          </motion.section>
        )}

        {/* Chapter Footer */}
        <footer className="px-8 py-4 bg-gray-50 dark:bg-secondary-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Last updated: {new Date(chapter.updatedAt).toLocaleDateString()}
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-white dark:bg-secondary-800 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors">
                Share Chapter
              </button>
              <button className="px-3 py-1 text-xs bg-white dark:bg-secondary-800 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors">
                Print
              </button>
            </div>
          </div>
        </footer>
      </motion.article>
    </AnimatePresence>
  );
}
