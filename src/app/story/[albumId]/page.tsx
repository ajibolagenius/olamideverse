'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

import { Album, StoryChapter } from '@/types/models';
import { StoryNavigation, ChapterRenderer } from '@/components/story';
import { getAlbumById } from '@/lib/api/albums';
import { getStoryChaptersByAlbum } from '@/lib/api/stories';

interface AlbumStoryPageProps {
  params: Promise<{
    albumId: string;
  }>;
}

export default function AlbumStoryPage({ params }: AlbumStoryPageProps) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [chapters, setChapters] = useState<StoryChapter[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbumStory = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const [albumData, chaptersData] = await Promise.all([
          getAlbumById(resolvedParams.albumId),
          getStoryChaptersByAlbum(resolvedParams.albumId)
        ]);

        if (!albumData) {
          notFound();
        }

        setAlbum(albumData);
        setChapters(chaptersData.sort((a, b) => a.position - b.position));
      } catch (err) {
        setError('Failed to load album story');
        console.error('Error fetching album story:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumStory();
  }, [params]);

  const currentChapter = chapters[currentChapterIndex];
  const isFirstChapter = currentChapterIndex === 0;
  const isLastChapter = currentChapterIndex === chapters.length - 1;

  const navigateToChapter = (index: number) => {
    if (index >= 0 && index < chapters.length) {
      setCurrentChapterIndex(index);
    }
  };

  const nextChapter = () => navigateToChapter(currentChapterIndex + 1);
  const previousChapter = () => navigateToChapter(currentChapterIndex - 1);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
          <div className="h-64 bg-gray-300 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Story Not Found</h1>
        <p className="text-gray-600 mb-4">{error || 'This album story could not be found.'}</p>
        <Link 
          href="/story" 
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          ← Back to Story Mode
        </Link>
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{album.title} Story</h1>
        <p className="text-gray-600 mb-4">The story for this album is coming soon.</p>
        <Link 
          href="/story" 
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          ← Back to Story Mode
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-900 dark:to-primary-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-secondary-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/story"
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5 mr-1" />
                Story Mode
              </Link>
              <div className="text-sm text-gray-500">/</div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {album.title}
              </h1>
            </div>
            
            {/* Chapter Navigation */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {currentChapterIndex + 1} of {chapters.length}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Chapter Navigation Sidebar */}
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-1/4">
              <div className="sticky top-24">
                <StoryNavigation
                  chapters={chapters}
                  currentChapterIndex={currentChapterIndex}
                  onChapterSelect={navigateToChapter}
                  albumTitle={album.title}
                />
              </div>
            </aside>

            {/* Chapter Content */}
            <div className="lg:w-3/4">
              <ChapterRenderer
                chapter={currentChapter}
                isActive={true}
              />

              {/* Chapter Navigation */}
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={previousChapter}
                  disabled={isFirstChapter}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isFirstChapter
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white dark:bg-secondary-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 shadow-md'
                  }`}
                >
                  <ChevronLeftIcon className="w-5 h-5 mr-2" />
                  Previous
                </button>

                <div className="flex space-x-2">
                  {chapters.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => navigateToChapter(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentChapterIndex
                          ? 'bg-primary'
                          : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to chapter ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextChapter}
                  disabled={isLastChapter}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isLastChapter
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white dark:bg-secondary-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-secondary-700 shadow-md'
                  }`}
                >
                  Next
                  <ChevronRightIcon className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
