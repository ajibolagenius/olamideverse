import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-secondary-200 dark:border-secondary-800 bg-background py-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">OlamideVerse</h3>
                        <p className="text-secondary-600 dark:text-secondary-400">
                            Celebrating Olamide's musical legacy through an immersive digital experience.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4">Navigation</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/albums" className="hover:text-primary transition-colors">
                                    Albums
                                </Link>
                            </li>
                            <li>
                                <Link href="/story" className="hover:text-primary transition-colors">
                                    Story Mode
                                </Link>
                            </li>
                            <li>
                                <Link href="/media" className="hover:text-primary transition-colors">
                                    Media Gallery
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/legal/terms" className="hover:text-primary transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/privacy" className="hover:text-primary transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/disclaimer" className="hover:text-primary transition-colors">
                                    Legal Disclaimer
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-secondary-200 dark:border-secondary-800 text-center text-secondary-600 dark:text-secondary-400">
                    <p>© {currentYear} OlamideVerse. All rights reserved.</p>
                    <p className="mt-2 text-sm">
                        This is a fan project. All content rights belong to their respective owners.
                    </p>
                </div>
            </div>
        </footer>
    );
}
