'use client';

import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export default function Header() {
    const { theme, setTheme } = useApp();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-secondary-200 dark:border-secondary-800 bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-primary">
                    OlamideVerse
                </Link>

                <nav className="hidden md:flex items-center space-x-6">
                    <Link href="/albums" className="hover:text-primary transition-colors">
                        Albums
                    </Link>
                    <Link href="/story" className="hover:text-primary transition-colors">
                        Story Mode
                    </Link>
                    <Link href="/media" className="hover:text-primary transition-colors">
                        Media Gallery
                    </Link>
                </nav>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? '🌙' : '☀️'}
                    </button>

                    <button className="md:hidden p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
                        ☰
                    </button>
                </div>
            </div>
        </header>
    );
}
