import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Media Gallery | OlamideVerse',
    description: 'Browse videos, interviews, and other media content featuring Olamide.',
};

export default function MediaPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Media Gallery</h1>

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Video grid will be populated here */}
                    <div className="bg-secondary-100 dark:bg-secondary-800 rounded-lg p-4 aspect-video flex items-center justify-center">
                        Video placeholder
                    </div>
                    <div className="bg-secondary-100 dark:bg-secondary-800 rounded-lg p-4 aspect-video flex items-center justify-center">
                        Video placeholder
                    </div>
                    <div className="bg-secondary-100 dark:bg-secondary-800 rounded-lg p-4 aspect-video flex items-center justify-center">
                        Video placeholder
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Interviews</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Interview grid will be populated here */}
                    <div className="bg-secondary-100 dark:bg-secondary-800 rounded-lg p-4 aspect-video flex items-center justify-center">
                        Interview placeholder
                    </div>
                    <div className="bg-secondary-100 dark:bg-secondary-800 rounded-lg p-4 aspect-video flex items-center justify-center">
                        Interview placeholder
                    </div>
                    <div className="bg-secondary-100 dark:bg-secondary-800 rounded-lg p-4 aspect-video flex items-center justify-center">
                        Interview placeholder
                    </div>
                </div>
            </div>
        </div>
    );
}
