'use client';

import { ReactNode, useEffect, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import LegalDisclaimer from './LegalDisclaimer';
import LegalDisclaimerBanner from '@/components/ui/LegalDisclaimerBanner';
import MusicPlayer from '@/components/player/MusicPlayer';
import PageTransition from './PageTransition';
import { layoutAnimations, performanceUtils } from '@/lib/animations';
import { useApp } from '@/context/AppContext';

interface MainLayoutProps {
    children: ReactNode;
    showPlayer?: boolean;
}

export default function MainLayout({ children, showPlayer = true }: MainLayoutProps) {
    const { showLegalDisclaimer } = useApp();
    const headerRef = useRef<HTMLElement>(null);
    const footerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const header = headerRef.current;
        const footer = footerRef.current;

        if (header) {
            performanceUtils.conditionalAnimate(() => {
                layoutAnimations.navAnimation(header);
            });
        }

        if (footer) {
            performanceUtils.conditionalAnimate(() => {
                layoutAnimations.footerAnimation(footer);
            });
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <LegalDisclaimerBanner />
            <header ref={headerRef} style={{ opacity: 0, transform: 'translateY(-100px)' }}>
                <Header />
            </header>
            <main className="flex-grow">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
            <footer ref={footerRef} style={{ opacity: 0, transform: 'translateY(100px)' }}>
                <Footer />
            </footer>
            {showLegalDisclaimer && <LegalDisclaimer />}
            {showPlayer && <MusicPlayer />}
        </div>
    );
}
