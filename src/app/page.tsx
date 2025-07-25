'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AppProvider } from "@/context/AppContext";
import { QueryProvider } from "@/context/QueryContext";
import MainLayout from "@/components/layout/MainLayout";
import { layoutAnimations, pageTransitions, performanceUtils } from "@/lib/animations";
import ImmersiveCard from "@/components/ui/ImmersiveCard";
import CyberButton from "@/components/ui/CyberButton";
import GlitchText from "@/components/ui/GlitchText";
import StatsCard from "@/components/ui/StatsCard";
import { 
  MusicNote, 
  Play, 
  Headphones,
  Waveform,
  Crown,
  Lightning
} from "@phosphor-icons/react/dist/ssr";

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
                    <div className="relative overflow-hidden immersive-theme">
                        {/* Cyber Grid Background */}
                        <div className="cyber-grid" />
                        
                        {/* Floating Particles */}
                        <div className="particles fixed inset-0 pointer-events-none">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="particle"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 8}s`,
                                        backgroundColor: i % 4 === 0 ? '#6366f1' : 
                                                       i % 4 === 1 ? '#06b6d4' : 
                                                       i % 4 === 2 ? '#ec4899' : '#10b981'
                                    }}
                                />
                            ))}
                        </div>
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
                                        <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black leading-none tracking-tighter">
                                            <GlitchText 
                                                color="primary"
                                                intensity="medium"
                                                trigger="auto"
                                                className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-white to-primary"
                                            >
                                                OLAMIDE
                                            </GlitchText>
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
                                        <CyberButton
                                            href="/albums"
                                            variant="primary"
                                            size="lg"
                                            glowColor="purple"
                                            icon={<Play weight="duotone" />}
                                            iconPosition="left"
                                        >
                                            Explore Albums
                                        </CyberButton>
                                        <CyberButton
                                            href="/story"
                                            variant="ghost"
                                            size="lg"
                                            glowColor="cyan"
                                            icon={<Lightning weight="duotone" />}
                                            iconPosition="right"
                                        >
                                            Enter Story Mode
                                        </CyberButton>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Stats Section - Enhanced with Immersive Cards */}
                        <section ref={statsRef} className="py-20 bg-gradient-to-r from-secondary-950 via-secondary-900 to-secondary-950 relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
                            <div className="container mx-auto px-6 relative z-10">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <StatsCard
                                        title="Studio Albums"
                                        value="15+"
                                        icon={<MusicNote weight="duotone" />}
                                        color="primary"
                                        trend="up"
                                        trendValue="+3"
                                        animated
                                        glitch
                                    />
                                    <StatsCard
                                        title="Total Streams"
                                        value="100M+"
                                        icon={<Headphones weight="duotone" />}
                                        color="accent"
                                        trend="up"
                                        trendValue="+25M"
                                        animated
                                    />
                                    <StatsCard
                                        title="Career Start"
                                        value="2010"
                                        icon={<Waveform weight="duotone" />}
                                        color="neon-pink"
                                        trend="neutral"
                                        animated
                                    />
                                    <StatsCard
                                        title="Label"
                                        value="YBNL"
                                        icon={<Crown weight="duotone" />}
                                        color="cyber-green"
                                        trend="up"
                                        trendValue="Growing"
                                        animated
                                        glitch
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Features Section - Enhanced Cards */}
                        <section ref={featuresRef} className="py-24 bg-gradient-to-br from-secondary-950 via-secondary-900 to-secondary-950 relative">
                            <div className="absolute inset-0">
                                <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 blur-3xl" />
                                <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-r from-neon-pink/5 to-cyber-green/5 blur-3xl" />
                            </div>
                            
                            <div className="container mx-auto px-6 relative z-10">
                                <div className="text-center mb-16">
                                    <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-primary mb-4">
                                        Experience the Legacy
                                    </h2>
                                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                                        Discover Olamide&apos;s artistic journey through multiple immersive mediums
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                                    <ImmersiveCard variant="cyber" glowColor="purple" className="feature-card">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-400 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                                <MusicNote weight="duotone" size={32} className="text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-4 text-white">Complete Discography</h3>
                                            <p className="text-white/70 leading-relaxed">
                                                Browse and listen to Olamide&apos;s entire music collection with high-quality playback and synchronized lyrics.
                                            </p>
                                        </div>
                                    </ImmersiveCard>

                                    <ImmersiveCard variant="cyber" glowColor="cyan" className="feature-card">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-gradient-to-br from-accent-600 to-accent-400 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                                <Lightning weight="duotone" size={32} className="text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-4 text-white">Immersive Stories</h3>
                                            <p className="text-white/70 leading-relaxed">
                                                Dive deep into the cultural context and artistic vision behind each album with rich media storytelling.
                                            </p>
                                        </div>
                                    </ImmersiveCard>

                                    <ImmersiveCard variant="cyber" glowColor="pink" className="feature-card">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-gradient-to-br from-neon-pink-600 to-neon-pink-400 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                                <Crown weight="duotone" size={32} className="text-white" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-4 text-white">Media Gallery</h3>
                                            <p className="text-white/70 leading-relaxed">
                                                Explore videos, interviews, and rare content in our curated media collection celebrating Olamide&apos;s career.
                                            </p>
                                        </div>
                                    </ImmersiveCard>
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
