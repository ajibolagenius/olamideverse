import { MDXProvider } from '@mdx-js/react';
import {
  ComponentType,
  ReactNode
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StoryImage, StoryVideo, StoryEmbed, MediaGallery } from './media';

/**
 * Props for the MDXContent component
 */
interface MDXContentProps {
  children: ReactNode;
}

// ✅ Custom props for specific components

interface AlbumCardProps {
  title: string;
  releaseDate: string;
  coverArt?: string;
  description?: string;
}

interface QuoteProps {
  author?: string;
  children: ReactNode;
}

interface TimelineEventProps {
  date: string;
  children: ReactNode;
}

interface ImgProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
}

interface TrackHighlightProps {
  title: string;
  children: ReactNode;
}

interface AlbumOriginProps {
  title: string;
  influences?: string[];
  productionNotes?: string;
  children: ReactNode;
}

interface FeaturedArtistProps {
  name: string;
  bio?: string;
  imageUrl?: string;
  role?: string;
  children?: ReactNode;
}

interface LyricNoteProps {
  line: string;
  interpretation: string;
  context?: string;
}

interface MediaGalleryProps {
  images?: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  videos?: Array<{
    src: string;
    poster?: string;
    caption?: string;
  }>;
  embeds?: Array<{
    url: string;
    type: string;
    title?: string;
    caption?: string;
  }>;
  title?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9';
}

// ✅ Universal MDX components map type
type MDXComponentsMap = {
  [key: string]: ComponentType<any>;
};

/**
 * MDXContent component for rendering MDX content with custom components
 */
export default function MDXContent({ children }: MDXContentProps) {
  const components: MDXComponentsMap = {
    h1: (props) => (
      <h1 className="text-3xl font-bold mb-4" id={props.id} {...props} />
    ),
    h2: (props) => (
      <h2 className="text-2xl font-bold mb-3" id={props.id} {...props} />
    ),
    h3: (props) => (
      <h3 className="text-xl font-bold mb-2" id={props.id} {...props} />
    ),
    h4: (props) => (
      <h4 className="text-lg font-bold mb-2" id={props.id} {...props} />
    ),
    p: (props) => <p className="mb-4" {...props} />,
    a: (props) => {
      const isExternal = props.href?.startsWith('http');

      if (isExternal) {
        return (
          <a
            href={props.href}
            className="text-blue-500 hover:underline focus:ring-2 focus:ring-blue-400 focus:outline-none"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          >
            {props.children}
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        );
      }

      return (
        <Link
          href={props.href || '#'}
          className="text-blue-500 hover:underline focus:ring-2 focus:ring-blue-400 focus:outline-none"
          {...props}
        >
          {props.children}
        </Link>
      );
    },
    ul: (props) => <ul className="list-disc pl-5 mb-4" {...props} />,
    ol: (props) => <ol className="list-decimal pl-5 mb-4" {...props} />,
    li: (props) => <li className="mb-1" {...props} />,
    blockquote: (props) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
    ),
    img: (props: ImgProps) => {
      if (!props.alt || props.alt === '') {
        console.warn('Image is missing alt text for accessibility');
      }

      return (
        <div className="my-4">
          <Image
            src={props.src}
            alt={props.alt || 'Image without description'}
            width={props.width || 800}
            height={props.height || 450}
            className="rounded-lg"
            loading="lazy"
          />
          {props.caption && (
            <p
              className="text-sm text-gray-500 mt-1"
              id={`caption-${props.src?.replace(/\W+/g, '-')}`}
            >
              {props.caption}
            </p>
          )}
        </div>
      );
    },

    AlbumCard: (props: AlbumCardProps) => {
      const albumId = `album-${props.title?.replace(/\s+/g, '-').toLowerCase()}`;
      return (
        <div
          className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4"
          aria-labelledby={albumId}
        >
          <h3 className="text-xl font-bold" id={albumId}>
            {props.title}
          </h3>
          <p className="text-sm text-gray-500">{props.releaseDate}</p>
          {props.coverArt && (
            <Image
              src={props.coverArt}
              alt={`${props.title} album cover`}
              width={300}
              height={300}
              className="rounded-lg my-2"
              loading="lazy"
            />
          )}
          <p>{props.description}</p>
        </div>
      );
    },

    TrackHighlight: (props: TrackHighlightProps) => {
      const trackId = `track-${props.title?.replace(/\s+/g, '-').toLowerCase()}`;
      return (
        <div
          className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4 border-l-4 border-blue-500"
          aria-labelledby={trackId}
        >
          <h4 className="font-bold" id={trackId}>
            {props.title}
          </h4>
          <p>{props.children}</p>
        </div>
      );
    },

    Quote: (props: QuoteProps) => {
      const quoteId = props.author
        ? `quote-${props.author.replace(/\s+/g, '-').toLowerCase()}`
        : undefined;
      return (
        <figure className="border-l-4 border-yellow-500 pl-4 py-2 my-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-r-lg">
          <blockquote>
            <p className="italic">{props.children}</p>
          </blockquote>
          {props.author && (
            <figcaption className="text-right font-bold mt-2" id={quoteId}>
              — {props.author}
            </figcaption>
          )}
        </figure>
      );
    },

    Timeline: (props: { children: ReactNode }) => (
      <div
        className="border-l-2 border-gray-300 pl-4 my-4 space-y-4"
        role="list"
        aria-label="Timeline of events"
      >
        {props.children}
      </div>
    ),

    TimelineEvent: (props: TimelineEventProps) => {
      const eventId = `event-${props.date.replace(/\s+/g, '-').toLowerCase()}`;
      return (
        <div className="relative" role="listitem" aria-labelledby={eventId}>
          <div
            className="absolute -left-6 w-4 h-4 rounded-full bg-blue-500"
            aria-hidden="true"
          ></div>
          <h4 className="font-bold" id={eventId}>
            {props.date}
          </h4>
          <p>{props.children}</p>
        </div>
      );
    },

    AlbumOrigin: (props: AlbumOriginProps) => {
      const originId = `origin-${props.title?.replace(/\s+/g, '-').toLowerCase()}`;
      return (
        <div
          className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 p-6 rounded-lg my-6 border-l-4 border-primary"
          aria-labelledby={originId}
        >
          <h3 className="text-2xl font-bold mb-4 text-primary" id={originId}>
            Album Origins: {props.title}
          </h3>
          
          <div className="prose dark:prose-invert max-w-none mb-4">
            {props.children}
          </div>

          {props.influences && props.influences.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Influences:</h4>
              <div className="flex flex-wrap gap-2">
                {props.influences.map((influence, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white dark:bg-secondary-800 text-sm rounded-full border border-gray-200 dark:border-gray-600"
                  >
                    {influence}
                  </span>
                ))}
              </div>
            </div>
          )}

          {props.productionNotes && (
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-md border border-gray-200 dark:border-gray-600">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Production Notes:</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{props.productionNotes}</p>
            </div>
          )}
        </div>
      );
    },

    FeaturedArtist: (props: FeaturedArtistProps) => {
      const artistId = `artist-${props.name?.replace(/\s+/g, '-').toLowerCase()}`;
      return (
        <div
          className="bg-accent-50 dark:bg-accent-900/20 p-6 rounded-lg my-4 border border-accent-200 dark:border-accent-700"
          aria-labelledby={artistId}
        >
          <div className="flex items-start space-x-4">
            {props.imageUrl && (
              <div className="flex-shrink-0">
                <Image
                  src={props.imageUrl}
                  alt={`${props.name} profile`}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="text-xl font-bold text-accent-700 dark:text-accent-300" id={artistId}>
                  {props.name}
                </h4>
                {props.role && (
                  <span className="px-2 py-1 bg-accent-100 dark:bg-accent-800 text-accent-700 dark:text-accent-300 text-xs rounded-full">
                    {props.role}
                  </span>
                )}
              </div>
              {props.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{props.bio}</p>
              )}
              {props.children && (
                <div className="prose dark:prose-invert max-w-none text-sm">
                  {props.children}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    },

    LyricNote: (props: LyricNoteProps) => {
      const noteId = `lyric-${props.line?.substring(0, 20).replace(/\s+/g, '-').toLowerCase()}`;
      return (
        <div
          className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg my-4 border-l-4 border-yellow-400"
          aria-labelledby={noteId}
        >
          <blockquote className="italic text-gray-700 dark:text-gray-300 mb-3 border-l-2 border-yellow-300 pl-3">
            "{props.line}"
          </blockquote>
          <div>
            <h5 className="font-semibold text-gray-900 dark:text-white mb-1" id={noteId}>
              Interpretation:
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{props.interpretation}</p>
            {props.context && (
              <>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-1">Context:</h5>
                <p className="text-xs text-gray-500 dark:text-gray-400">{props.context}</p>
              </>
            )}
          </div>
        </div>
      );
    },

    // Rich media components
    StoryImage: (props: any) => (
      <StoryImage {...props} className="my-6" />
    ),

    StoryVideo: (props: any) => (
      <StoryVideo {...props} className="my-6" />
    ),

    StoryEmbed: (props: any) => (
      <StoryEmbed {...props} className="my-6" />
    ),

    MediaGallery: (props: MediaGalleryProps) => {
      // Convert props to MediaElement format for the gallery
      const media = [
        ...(props.images?.map(img => ({
          id: Math.random().toString(36).substr(2, 9),
          type: 'image' as const,
          url: img.src,
          caption: img.caption,
          metadata: { alt: img.alt },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })) || []),
        ...(props.videos?.map(vid => ({
          id: Math.random().toString(36).substr(2, 9),
          type: 'video' as const,
          url: vid.src,
          caption: vid.caption,
          metadata: { poster: vid.poster },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })) || []),
        ...(props.embeds?.map(embed => ({
          id: Math.random().toString(36).substr(2, 9),
          type: 'embed' as const,
          url: embed.url,
          caption: embed.caption,
          metadata: { 
            embedType: embed.type,
            title: embed.title 
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })) || []),
      ];

      return (
        <MediaGallery
          media={media}
          title={props.title}
          aspectRatio={props.aspectRatio}
          className="my-8"
        />
      );
    },
  };

  return <MDXProvider components={components}>{children}</MDXProvider>;
}
