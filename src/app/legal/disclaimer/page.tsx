import { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
    title: 'Legal Disclaimer | OlamideVerse',
    description: 'Legal information and content usage notices for OlamideVerse.',
};

export default function LegalDisclaimerPage() {
    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">Legal Disclaimer</h1>

                <div className="prose dark:prose-invert max-w-none">
                    <h2>Content Usage Notice</h2>
                    <p>
                        OlamideVerse is a non-commercial fan project dedicated to celebrating and preserving Olamide's musical legacy. All music, lyrics, images, and related content are the property of Olamide, YBNL Nation, and their respective copyright holders. We do not claim ownership of any copyrighted material.
                    </p>

                    <h2>Fair Use Statement</h2>
                    <p>
                        Content on this platform is presented under fair use principles for the purposes of commentary, criticism, research, and preservation of cultural significance. We believe this constitutes fair use of any copyrighted material as provided for in section 107 of the U.S. Copyright Law.
                    </p>

                    <h2>Third-Party Services</h2>
                    <p>
                        Music playback is provided through official third-party services like Spotify, YouTube, and other platforms in compliance with their terms of service. We do not host or distribute copyrighted music files directly.
                    </p>

                    <h2>API Usage</h2>
                    <p>
                        OlamideVerse uses various third-party APIs in compliance with their respective terms of service. These include:
                    </p>
                    <ul>
                        <li>Spotify API for album and track information</li>
                        <li>YouTube API for video content</li>
                        <li>Genius API for lyrics and song information</li>
                    </ul>

                    <h2>Removal Requests</h2>
                    <p>
                        If you are a rights holder and believe that any content on this platform infringes upon your copyright, please contact us and the content will be promptly removed.
                    </p>

                    <h2>No Commercial Intent</h2>
                    <p>
                        OlamideVerse is a fan project with no commercial intent. Any future monetization features would only be implemented after securing appropriate partnerships and permissions from rights holders.
                    </p>

                    <h2>Contact Information</h2>
                    <p>
                        For any legal inquiries or removal requests, please contact us at:
                    </p>
                    <p>
                        Email: legal@olamideverse.com
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
