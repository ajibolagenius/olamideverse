'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  BookOpenIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { StoryChapter } from '@/types/models';

interface StoryNavigationProps {
  chapters: StoryChapter[];
  currentChapterIndex: number;
  onChapterSelect: (index: number) => void;
  albumTitle: string;
}

export default function StoryNavigation({ 
  chapters, 
  currentChapterIndex, 
  onChapterSelect,
  albumTitle 
}: StoryNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={toggleExpanded}
          className="w-full flex items-center justify-between text-left"
          aria-expanded={isExpanded}
          aria-controls="chapter-list"
        >
          <div className="flex items-center space-x-3">
            <BookOpenIcon className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-bold text-lg">{albumTitle}</h3>
              <p className="text-sm text-gray-500">
                {chapters.length} chapter{chapters.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Chapter List */}
      <motion.div
        id="chapter-list"
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <nav className="p-2 space-y-1">
          {chapters.map((chapter, index) => {
            const isCurrent = index === currentChapterIndex;
            const isCompleted = index < currentChapterIndex;
            
            return (
              <motion.button
                key={chapter.id}
                onClick={() => onChapterSelect(index)}
                className={`w-full text-left px-3 py-3 rounded-md transition-all duration-200 group ${
                  isCurrent
                    ? 'bg-primary text-white shadow-md'
                    : isCompleted
                    ? 'text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 border-l-2 border-green-500'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                whileHover={{ x: isCurrent ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-3">
                  {/* Chapter Number/Status */}
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    isCurrent
                      ? 'bg-white text-primary'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  
                  {/* Chapter Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {chapter.title}
                    </div>
                    <div className={`text-xs mt-1 flex items-center space-x-2 ${
                      isCurrent ? 'text-white/80' : 'text-gray-500'
                    }`}>
                      <span className="flex items-center">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        ~5 min read
                      </span>
                      {chapter.relatedAlbumId && (
                        <span className="flex items-center">
                          <UserGroupIcon className="w-3 h-3 mr-1" />
                          Album Story
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </nav>

        {/* Progress Bar */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentChapterIndex + 1) / chapters.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentChapterIndex + 1) / chapters.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-secondary-900">
        <div className="flex space-x-2">
          <Link
            href="/story"
            className="flex-1 px-3 py-2 text-sm text-center text-gray-600 dark:text-gray-300 bg-white dark:bg-secondary-800 rounded-md hover:bg-gray-100 dark:hover:bg-secondary-700 transition-colors"
          >
            ← All Stories
          </Link>
          <button className="flex-1 px-3 py-2 text-sm text-center text-white bg-primary rounded-md hover:bg-primary-600 transition-colors">
            Share Story
          </button>
        </div>
      </div>
    </div>
  );
}
