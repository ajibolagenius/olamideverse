import Image from "next/image";
import Link from "next/link";
import { AppProvider } from "@/context/AppContext";
import { QueryProvider } from "@/context/QueryContext";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
    return (
        <QueryProvider>
            <AppProvider>
                <MainLayout>
                    <div className="relative">
                        {/* Hero Section */}
                        <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900 overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500 to-transparent"></div>

                            <div className="container mx-auto px-4 py-16 relative z-10 text-center">
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                                    <span className="text-primary">Olamide</span>Verse
                                </h1>
                                <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8">
                                    An immersive journey through Olamide's musical legacy, celebrating his impact on Nigerian music and culture.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href="/albums"
                                        className="px-8 py-3 bg-primary hover:bg-primary-600 text-white rounded-full transition-colors font-medium text-lg"
                                    >
                                        Explore Albums
                                    </Link>
                                    <Link
                                        href="/story"
                                        className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors font-medium text-lg backdrop-blur-sm"
                                    >
                                        Enter Story Mode
                                    </Link>
                                </div>
                            </div>
                        </section>

                        {/* Features Section */}
                        <section className="py-16 bg-background">
                            <div className="container mx-auto px-4">
                                <h2 className="text-3xl font-bold mb-12 text-center">Experience the Legacy</h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="bg-secondary-50 dark:bg-secondary-800 p-6 rounded-lg">
                                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                            <span className="text-2xl text-primary">🎵</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Complete Discography</h3>
                                        <p className="text-secondary-600 dark:text-secondary-300">
                                            Browse and listen to Olamide's entire music collection with high-quality playback and synchronized lyrics.
                                        </p>
                                    </div>

                                    <div className="bg-secondary-50 dark:bg-secondary-800 p-6 rounded-lg">
                                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                            <span className="text-2xl text-primary">📖</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Immersive Stories</h3>
                                        <p className="text-secondary-600 dark:text-secondary-300">
                                            Dive deep into the cultural context and artistic vision behind each album with rich media storytelling.
                                        </p>
                                    </div>

                                    <div className="bg-secondary-50 dark:bg-secondary-800 p-6 rounded-lg">
                                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                            <span className="text-2xl text-primary">🎬</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Media Gallery</h3>
                                        <p className="text-secondary-600 dark:text-secondary-300">
                                            Explore videos, interviews, and rare content in our curated media collection celebrating Olamide's career.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Featured Album Section */}
                        <section className="py-16 bg-secondary-50 dark:bg-secondary-900">
                            <div className="container mx-auto px-4">
                                <h2 className="text-3xl font-bold mb-12 text-center">Featured Album</h2>

                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="w-full md:w-1/2">
                                        <div className="aspect-square bg-secondary-200 dark:bg-secondary-800 rounded-lg overflow-hidden relative">
                                            {/* Placeholder for album art */}
                                            <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-secondary-400">
                                                Album Art
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-1/2">
                                        <h3 className="text-2xl font-bold mb-2">UY Scuti</h3>
                                        <p className="text-secondary-600 dark:text-secondary-300 mb-4">
                                            Released: June 18, 2021
                                        </p>
                                        <p className="mb-6">
                                            UY Scuti represents a significant evolution in Olamide's sound, blending afrobeats with elements of amapiano and R&B to create a sophisticated, globally-minded album that showcases his versatility as an artist.
                                        </p>
                                        <Link
                                            href="/albums/uy-scuti"
                                            className="px-6 py-2 bg-primary hover:bg-primary-600 text-white rounded-full transition-colors inline-block"
                                        >
                                            Explore Album
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </MainLayout>
            </AppProvider>
        </QueryProvider>
    );
}
