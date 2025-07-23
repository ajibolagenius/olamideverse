import { MDXProvider } from '@mdx-js/react';
import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Props for the MDXContent component
 */
interface MDXContentProps {
    children: ReactNode;
}

/**
 * MDXContent component for rendering MDX content with custom components
 */
export default function MDXContent({ children }: MDXContentProps) {
    // Define components inline to avoid TypeScript issues
    const components = {
        // Basic HTML elements
        h1: (props: any) => <h1 className="text-3xl font-bold mb-4" {...props} />,
        h2: (props: any) => <h2 className="text-2xl font-bold mb-3" {...props} />,
        h3: (props: any) => <h3 className="text-xl font-bold mb-2" {...props} />,
        p: (props: any) => <p className="mb-4" {...props} />,
        a: (props: any) => {
            // Handle links properly
            if (props.href && !props.href.startsWith('http')) {
                return <Link href={props.href} className="text-blue-500 hover:underline">{props.children}</Link>;
            }
            return <a className="text-blue-500 hover:underline" {...props} />;
        },
        ul: (props: any) => <ul className="list-disc pl-5 mb-4" {...props} />,
        ol: (props: any) => <ol className="list-decimal pl-5 mb-4" {...props} />,
        li: (props: any) => <li className="mb-1" {...props} />,
        blockquote: (props: any) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />
        ),
        img: (props: any) => (
            <div className="my-4">
                <Image
                    src={props.src}
                    alt={props.alt || 'Image'}
                    width={props.width || 800}
                    height={props.height || 450}
                    className="rounded-lg"
                />
                {props.caption && <p className="text-sm text-gray-500 mt-1">{props.caption}</p>}
            </div>
        ),

        // Custom components for story mode
        AlbumCard: (props: any) => (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4">
                <h3 className="text-xl font-bold">{props.title}</h3>
                <p className="text-sm text-gray-500">{props.releaseDate}</p>
                {props.coverArt && (
                    <Image
                        src={props.coverArt}
                        alt={`${props.title} cover art`}
                        width={300}
                        height={300}
                        className="rounded-lg my-2"
                    />
                )}
                <p>{props.description}</p>
            </div>
        ),
        TrackHighlight: (props: any) => (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4 border-l-4 border-blue-500">
                <h4 className="font-bold">{props.title}</h4>
                <p>{props.children}</p>
            </div>
        ),
        Quote: (props: any) => (
            <blockquote className="border-l-4 border-yellow-500 pl-4 py-2 my-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-r-lg">
                <p className="italic">{props.children}</p>
                {props.author && <p className="text-right font-bold mt-2">— {props.author}</p>}
            </blockquote>
        ),
        Timeline: (props: any) => (
            <div className="border-l-2 border-gray-300 pl-4 my-4 space-y-4">
                {props.children}
            </div>
        ),
        TimelineEvent: (props: any) => (
            <div className="relative">
                <div className="absolute -left-6 w-4 h-4 rounded-full bg-blue-500"></div>
                <h4 className="font-bold">{props.date}</h4>
                <p>{props.children}</p>
            </div>
        ),
    };

    return <MDXProvider components={components}>{children}</MDXProvider>;
}
