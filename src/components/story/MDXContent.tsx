import { MDXProvider } from '@mdx-js/react';
import {
  ComponentType,
  ReactNode
} from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
  };

  return <MDXProvider components={components}>{children}</MDXProvider>;
}
