import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Story Mode | OlamideVerse',
    description: 'Explore the stories behind Olamide&apos;s albums and career.',
};

export default function StoryPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Story Mode</h1>
            <div className="prose dark:prose-invert max-w-none">
                <p className="text-xl">
                    Dive deep into the stories behind Olamide&apos;s music, exploring the cultural context, artistic vision, and impact of his work.
                </p>

                <div className="my-8 bg-secondary-100 dark:bg-secondary-800 rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Select an Album to Explore</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Story mode album selection will be populated here */}
                        <div className="bg-background rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
                            Album story placeholder
                        </div>
                        <div className="bg-background rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
                            Album story placeholder
                        </div>
                        <div className="bg-background rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow">
                            Album story placeholder
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
