'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpenIcon, 
  MusicalNoteIcon, 
  PhotoIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Album, StoryChapter } from '@/types/models';

interface RelatedItem {
  id: string;
  type: 'album' | 'story' | 'media' | 'track';
  title: string;
  subtitle?: string;
  imageUrl?: string;
  url: string;
  description?: string;
  tags?: string[];
}

interface RelatedContentProps {
  currentId: string;
  currentType: 'album' | 'story' | 'media' | 'track';
  title?: string;
  maxItems?: number;
  className?: string;
}

export default function RelatedContent({
  currentId,
  currentType,
  title = 'Related Content',
  maxItems = 6,
  className = ''
}: RelatedContentProps) {
  const [relatedItems, setRelatedItems] = useState<RelatedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedContent = async () => {
      setLoading(true);
      
      // Mock related content generation
      const mockRelated: RelatedItem[] = [
        {
          id: 'ybnl-mafia-family',
          type: 'album',
          title: 'YBNL Mafia Family',
          subtitle: 'Debut Album',
          imageUrl: '/images/albums/ybnl-mafia-family.jpg',
          url: '/albums/ybnl-mafia-family',
          description: 'The groundbreaking debut that started it all',
          tags: ['Hip-Hop', 'Afrobeats', '2012']
        },
        {
          id: 'baddest-guy-story',
          type: 'story',
          title: 'The Making of Baddest Guy Ever Liveth',
          subtitle: 'Album Story',
          imageUrl: '/images/stories/baddest-guy-story.jpg',
          url: '/story/baddest-guy-ever-liveth',
          description: 'Behind the scenes of Olamide\'s sophomore masterpiece',
          tags: ['Story Mode', 'Production', '2013']
        },
        {
          id: 'street-ni-story',
          type: 'story',
          title: 'Street OT Origins',
          subtitle: 'Story Chapter',
          imageUrl: '/images/stories/street-ot.jpg',
          url: '/story/street-ot-origins',
          description: 'How street culture influenced Olamide\'s music',
          tags: ['Culture', 'Street', 'Influence']
        },
        {
          id: 'lagos-sessions',
          type: 'media',
          title: 'Lagos Studio Sessions',
          subtitle: 'Photo Gallery',
          imageUrl: '/images/media/lagos-sessions.jpg',
          url: '/media/lagos-sessions',
          description: 'Exclusive photos from recording sessions',
          tags: ['Photography', 'Studio', 'Behind the Scenes']
        },
        {
          id: 'wo-track',
          type: 'track',
          title: 'Wo',
          subtitle: 'Hit Single',
          imageUrl: '/images/tracks/wo-cover.jpg',
          url: '/albums/the-glory/wo',
          description: 'The track that dominated the charts',
          tags: ['Single', 'Chart-topper', '2017']
        },
        {
          id: 'pheelz-collaboration',
          type: 'story',
          title: 'The Pheelz Partnership',
          subtitle: 'Producer Feature',
          imageUrl: '/images/stories/pheelz-collab.jpg',
          url: '/story/pheelz-partnership',
          description: 'The legendary producer-artist relationship',
          tags: ['Collaboration', 'Production', 'Partnership']
        }
      ];

      // Filter out current item and limit results
      const filtered = mockRelated
        .filter(item => item.id !== currentId)
        .slice(0, maxItems);

      setRelatedItems(filtered);
      setLoading(false);
    };

    fetchRelatedContent();
  }, [currentId, currentType, maxItems]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'album': return MusicalNoteIcon;
      case 'story': return BookOpenIcon;
      case 'media': return PhotoIcon;
      case 'track': return MusicalNoteIcon;
      default: return SparklesIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'album': return 'bg-blue-500';
      case 'story': return 'bg-green-500';
      case 'media': return 'bg-purple-500';
      case 'track': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (relatedItems.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <SparklesIcon className="w-6 h-6 mr-2 text-primary" />
          {title}
        </h3>
        <span className="text-sm text-gray-500">
          {relatedItems.length} recommendation{relatedItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedItems.map((item, index) => {
          const Icon = getTypeIcon(item.type);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Link href={item.url}>
                <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Icon className="w-12 h-12 text-primary/50" />
                      </div>
                    )}
                    
                    {/* Type Badge */}
                    <div className="absolute top-3 left-3">
                      <div className={`${getTypeColor(item.type)} text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1`}>
                        <Icon className="w-3 h-3" />
                        <span className="capitalize">{item.type}</span>
                      </div>
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200 line-clamp-1">
                          {item.title}
                        </h4>
                        {item.subtitle && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        className="text-gray-400 group-hover:text-primary transition-colors duration-200"
                      >
                        <ArrowRightIcon className="w-5 h-5" />
                      </motion.div>
                    </div>

                    {item.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded-full">
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* View More Link */}
      <div className="text-center mt-8">
        <Link
          href="/explore"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
        >
          <span>Explore More Content</span>
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}
