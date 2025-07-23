import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Albums | OlamideVerse',
    description: 'Browse Olamide\'s complete discography with interactive album experiences.',
};

export default function AlbumsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Albums</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Album grid will be populated here */}
                <div className="bg-secondary-100 dark:bg-secondary-800 rounded-lg p-4 aspect-square flex items-center justify-center">
                    Album placeholder
                </div>
                <div className="bg-secondary-100 dark:bg-secondary-800 rounded-lg p-4 aspect-square flex items-center justify-center">
                    Album placeholder
                </div>
                <div className="bg-secondary-100 dark:bg-secondary-800 rounded-lg p-4 aspect-square flex items-center justify-center">
                    Album placeholder
                </div>
                <div className="bg-secondary-100 dark:bg-secondary-800 rounded-lg p-4 aspect-square flex items-center justify-center">
                    Album placeholder
                </div>
            </div>
        </div>
    );
}
