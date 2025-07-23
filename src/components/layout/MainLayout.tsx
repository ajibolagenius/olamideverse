import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import LegalDisclaimer from './LegalDisclaimer';
import { useApp } from '@/context/AppContext';

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { showLegalDisclaimer } = useApp();

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            {showLegalDisclaimer && <LegalDisclaimer />}
        </div>
    );
}
