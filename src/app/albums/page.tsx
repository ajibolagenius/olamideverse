import { Metadata } from 'next';
import { AlbumGrid } from '@/components/ui/AlbumGrid';

export const metadata: Metadata = {
    title: 'Albums | OlamideVerse',
    description: 'Browse Olamide\'s complete discography with interactive album experiences.',
};

export default function AlbumsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Albums</h1>
            <AlbumGrid />
        </div>
    );
}
