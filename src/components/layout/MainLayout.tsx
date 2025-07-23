import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import LegalDisclaimer from './LegalDisclaimer';
import LegalDisclaimerBanner from '@/components/ui/LegalDisclaimerBanner';
import MusicPlayer from '@/components/player/MusicPlayer';
import { useApp } from '@/context/AppContext';

interface MainLayoutProps {
    children: ReactNode;
    showPlayer?: boolean;
}

export default function MainLayout({ children, showPlayer = true }: MainLayoutProps) {
    const { showLegalDisclaimer } = useApp();

    return (
        <div className="flex flex-col min-h-screen">
            <LegalDisclaimerBanner />
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            {showLegalDisclaimer && <LegalDisclaimer />}
            {showPlayer && <MusicPlayer />}
        </div>
    );
}
