'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AppProvider } from "@/context/AppContext";
import { QueryProvider } from "@/context/QueryContext";
import MainLayout from "@/components/layout/MainLayout";
import { layoutAnimations, pageTransitions, performanceUtils } from "@/lib/animations";

export default function Home() {
    const heroRef = useRef<HTMLElement>(null);
    const featuresRef = useRef<HTMLElement>(null);
    const statsRef = useRef<HTMLElement>(null);
    const featuredAlbumRef = useRef<HTMLElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const hero = heroRef.current;
        const features = featuresRef.current;
        const stats = statsRef.current;
        const featuredAlbum = featuredAlbumRef.current;

        if (hero) {
            performanceUtils.conditionalAnimate(() => {
                layoutAnimations.heroAnimation(hero);
            });
        }

        if (features) {
            const featureCards = features.querySelectorAll('.feature-card');
            performanceUtils.conditionalAnimate(() => {
                pageTransitions.staggerIn(
                    Array.from(featureCards) as HTMLElement[],
                    performanceUtils.getOptimalDuration(0.8),
                    0.15
                );
            });
        }

        if (stats) {
            const statItems = stats.querySelectorAll('.stat-item');
            performanceUtils.conditionalAnimate(() => {
                pageTransitions.staggerIn(
                    Array.from(statItems) as HTMLElement[],
                    performanceUtils.getOptimalDuration(0.6),
                    0.1
                );
            });
        }

        if (featuredAlbum) {
            performanceUtils.conditionalAnimate(() => {
                pageTransitions.fadeIn(featuredAlbum, performanceUtils.getOptimalDuration(1.0));
            });
        }
    }, []);

    return (
        <QueryProvider>
            <AppProvider>
                <MainLayout>
                    <div className="relative overflow-hidden">
                        {/* Hero Section - Redesigned with Bold Typography */}
                        <section
                            ref={heroRef}
                            className="relative min-h-screen flex items-center justify-center overflow-hidden"
                            style={{ 
                                opacity: 1, // Changed from 0 to 1 for immediate visibility
                                transform: 'scale(1)', // Changed from 1.02 to 1
                                background: `
                                    radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 85, 0, 0.15) 0%, transparent 50%),
                                    linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #2a1810 50%, #1a1a1a 75%, #0a0a0a 100%)
                                `
                            }}
                        >
                            {/* Animated Background Elements */}
                            <div className="absolute inset-0">
                                <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 blur-3xl animate-pulse-slow"></div>
                                <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-r from-accent/5 to-primary/5 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-primary/5 to-transparent opacity-50"></div>
                            </div>

                            <div className="container mx-auto px-6 py-20 relative z-10">
                                <div className="text-center max-w-6xl mx-auto">
                                    {/* Mission Statement - Top Left Inspired */}
                                    <div className="text-left mb-8">
                                        <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
                                            Nigerian Music Legacy
                                        </p>
                                        <h2 className="text-lg text-white/70 font-light max-w-xs">
                                            Celebrating the Artistic Journey of a Hip-Hop Pioneer
                                        </h2>
                                    </div>

                                    {/* Main Hero Typography - Massive Impact */}
                                    <div className="mb-12">
                                        <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-accent leading-none tracking-tighter mb-4">
                                            Discover
                                        </h1>
                                        <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-accent via-white to-primary leading-none tracking-tighter">
                                            OLAMIDE
                                        </h1>
                                    </div>

                                    {/* Subtitle with Better Typography */}
                                    <div className="max-w-4xl mx-auto mb-16">
                                        <p className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light leading-relaxed">
                                            An immersive digital experience celebrating 
                                            <span className="text-primary font-medium"> Nigeria&apos;s indigenous rap king</span>, 
                                            his cultural impact, and musical evolution.
                                        </p>
                                    </div>

                                    {/* Enhanced Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                        <Link
                                            href="/albums"
                                            className="group relative px-12 py-4 bg-primary hover:bg-primary-600 text-white rounded-full transition-all duration-300 font-semibold text-lg hero-button transform hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
                                        >
                                            <span className="relative z-10">Explore Albums</span>
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </Link>
                                        <Link
                                            href="/story"
                                            className="group px-12 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all duration-300 font-semibold text-lg backdrop-blur-md border border-white/20 hover:border-white/40 hero-button transform hover:scale-105"
                                        >
                                            Enter Story Mode
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Stats Section - New Addition */}
                        <section ref={statsRef} className="py-20 bg-gradient-to-r from-secondary-950 via-black to-secondary-950">
                            <div className="container mx-auto px-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                    <div className="stat-item text-center" style={{ opacity: 1, transform: 'translateY(0px)' }}>
                                        <div className="text-4xl md:text-5xl font-black text-primary mb-2">15+</div>
                                        <div className="text-white/70 font-medium">Studio Albums</div>
                                    </div>
                                    <div className="stat-item text-center" style={{ opacity: 1, transform: 'translateY(0px)' }}>
                                        <div className="text-4xl md:text-5xl font-black text-accent mb-2">100M+</div>
                                        <div className="text-white/70 font-medium">Streams</div>
                                    </div>
                                    <div className="stat-item text-center" style={{ opacity: 1, transform: 'translateY(0px)' }}>
                                        <div className="text-4xl md:text-5xl font-black text-primary mb-2">2010</div>
                                        <div className="text-white/70 font-medium">Career Start</div>
                                    </div>
                                    <div className="stat-item text-center" style={{ opacity: 1, transform: 'translateY(0px)' }}>
                                        <div className="text-4xl md:text-5xl font-black text-accent mb-2">YBNL</div>
                                        <div className="text-white/70 font-medium">Label Founder</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Features Section - Enhanced Cards */}
                        <section ref={featuresRef} className="py-24 bg-gradient-to-br from-background via-secondary-50/50 to-background">
                            <div className="container mx-auto px-6">
                                <div className="text-center mb-16">
                                    <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-secondary-800 to-primary mb-4">
                                        Experience the Legacy
                                    </h2>
                                    <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                                        Discover Olamide&apos;s artistic journey through multiple immersive mediums
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                                    <div className="feature-card group relative p-8 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm rounded-2xl border border-secondary-200/50 dark:border-secondary-700/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:-translate-y-2" style={{ opacity: 1, transform: 'translateY(0px)' }}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="relative z-10">
                                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                                <span className="text-3xl">🎵</span>
                                            </div>
                                            <h3 className="text-2xl font-bold mb-4 text-secondary-900 dark:text-white">Complete Discography</h3>
                                            <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                                                Browse and listen to Olamide&apos;s entire music collection with high-quality playback and synchronized lyrics.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="feature-card group relative p-8 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm rounded-2xl border border-secondary-200/50 dark:border-secondary-700/50 hover:border-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 transform hover:-translate-y-2" style={{ opacity: 1, transform: 'translateY(0px)' }}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="relative z-10">
                                            <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                                <span className="text-3xl">📖</span>
                                            </div>
                                            <h3 className="text-2xl font-bold mb-4 text-secondary-900 dark:text-white">Immersive Stories</h3>
                                            <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                                                Dive deep into the cultural context and artistic vision behind each album with rich media storytelling.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="feature-card group relative p-8 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm rounded-2xl border border-secondary-200/50 dark:border-secondary-700/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:-translate-y-2" style={{ opacity: 1, transform: 'translateY(0px)' }}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="relative z-10">
                                            <div className="w-16 h-16 bg-gradient-to-br from-secondary-700 to-secondary-800 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                                <span className="text-3xl">🎬</span>
                                            </div>
                                            <h3 className="text-2xl font-bold mb-4 text-secondary-900 dark:text-white">Media Gallery</h3>
                                            <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                                                Explore videos, interviews, and rare content in our curated media collection celebrating Olamide&apos;s career.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Featured Album Section - Complete Redesign */}
                        <section
                            ref={featuredAlbumRef}
                            className="py-24 bg-gradient-to-br from-secondary-950 via-black to-secondary-900 relative overflow-hidden"
                            style={{ opacity: 1, transform: 'translateY(0px)' }}
                        >
                            {/* Background Effects */}
                            <div className="absolute inset-0">
                                <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-primary/10 to-accent/5 blur-3xl"></div>
                                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-accent/10 to-primary/5 blur-3xl"></div>
                            </div>

                            <div className="container mx-auto px-6 relative z-10">
                                <div className="text-center mb-16">
                                    <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-primary mb-4">
                                        Featured Album
                                    </h2>
                                    <p className="text-xl text-white/70">Latest Musical Evolution</p>
                                </div>

                                <div className="max-w-6xl mx-auto">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                        <div className="order-2 lg:order-1">
                                            <div className="relative group">
                                                <div className="aspect-square bg-gradient-to-br from-primary/20 via-secondary-800 to-accent/20 rounded-3xl overflow-hidden relative transform group-hover:scale-105 transition-transform duration-500">
                                                    {/* Placeholder with better design */}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="text-center">
                                                            <div className="text-6xl font-black text-white/30 mb-2">UY</div>
                                                            <div className="text-4xl font-black text-primary">SCUTI</div>
                                                            <div className="text-sm text-white/50 mt-2">Album Artwork</div>
                                                        </div>
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                                </div>
                                                {/* Glow Effect */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 -z-10 scale-110"></div>
                                            </div>
                                        </div>

                                        <div className="order-1 lg:order-2 text-white">
                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="text-4xl md:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-primary">
                                                        UY Scuti
                                                    </h3>
                                                    <p className="text-accent font-medium text-lg">
                                                        Released: June 18, 2021
                                                    </p>
                                                </div>
                                                
                                                <p className="text-xl text-white/80 leading-relaxed">
                                                    UY Scuti represents a significant evolution in Olamide&apos;s sound, blending 
                                                    <span className="text-primary font-medium"> afrobeats with elements of amapiano and R&B</span> 
                                                    to create a sophisticated, globally-minded album that showcases his versatility as an artist.
                                                </p>
                                                
                                                <div className="pt-4">
                                                    <Link
                                                        href="/albums/uy-scuti"
                                                        className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-full transition-all duration-300 font-semibold text-lg transform hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
                                                    >
                                                        <span>Explore Album</span>
                                                        <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
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
