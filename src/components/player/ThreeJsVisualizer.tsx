'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer';
import type { Track } from '@/types/models';

interface ThreeJsVisualizerProps {
    track?: Track | null;
    isPlaying?: boolean;
    width?: number;
    height?: number;
    className?: string;
    showParticles?: boolean;
    rotationSpeed?: number;
    color?: string;
}

export default function ThreeJsVisualizer({
    track,
    isPlaying = false,
    width = 300,
    height = 300,
    className = '',
    showParticles = true,
    rotationSpeed = 0.01,
    color = '#3b82f6'
}: ThreeJsVisualizerProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene>();
    const rendererRef = useRef<THREE.WebGLRenderer>();
    const cameraRef = useRef<THREE.PerspectiveCamera>();
    const discRef = useRef<THREE.Mesh>();
    const particlesRef = useRef<THREE.Points>();
    const animationFrameRef = useRef<number>();
    const [isInitialized, setIsInitialized] = useState(false);

    const { analysisData, isConnected: _isAnalyzerConnected, error } = useAudioAnalyzer({
        track,
        isPlaying,
        enabled: true
    });

    // Initialize Three.js scene
    const initializeScene = useCallback(() => {
        if (!mountRef.current) return;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Create album disc
        createAlbumDisc(scene);

        // Create particles if enabled
        if (showParticles) {
            createParticles(scene);
        }

        setIsInitialized(true);
    }, [width, height, showParticles]);

    // Create the 3D album disc
    const createAlbumDisc = useCallback((scene: THREE.Scene) => {
        // Disc geometry
        const discGeometry = new THREE.CylinderGeometry(2, 2, 0.1, 32);

        // Disc material with album art texture if available
        let discMaterial: THREE.Material;

        if (track?.metadata?.coverArt) {
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(track.metadata.coverArt as string);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;

            discMaterial = new THREE.MeshPhongMaterial({
                map: texture,
                shininess: 100,
                transparent: true,
                opacity: 0.9
            });
        } else {
            discMaterial = new THREE.MeshPhongMaterial({
                color: new THREE.Color(color),
                shininess: 100,
                transparent: true,
                opacity: 0.8
            });
        }

        const disc = new THREE.Mesh(discGeometry, discMaterial);
        disc.rotation.x = Math.PI / 2; // Lay flat
        scene.add(disc);
        discRef.current = disc;

        // Add inner hole (like a vinyl record)
        const holeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.11, 16);
        const holeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const hole = new THREE.Mesh(holeGeometry, holeMaterial);
        hole.rotation.x = Math.PI / 2;
        hole.position.y = 0.001; // Slightly above disc
        scene.add(hole);

        // Add grooves for vinyl effect
        for (let i = 0; i < 20; i++) {
            const radius = 0.5 + (i * 0.075);
            const grooveGeometry = new THREE.RingGeometry(radius, radius + 0.01, 32);
            const grooveMaterial = new THREE.MeshBasicMaterial({
                color: 0x333333,
                transparent: true,
                opacity: 0.3
            });
            const groove = new THREE.Mesh(grooveGeometry, grooveMaterial);
            groove.rotation.x = -Math.PI / 2;
            groove.position.y = 0.051; // On top of disc
            scene.add(groove);
        }
    }, [track, color]);

    // Create particle system
    const createParticles = useCallback((scene: THREE.Scene) => {
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const colorObj = new THREE.Color(color);

        for (let i = 0; i < particleCount; i++) {
            // Random positions in a sphere around the disc
            const radius = 5 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // Vary colors slightly
            colors[i * 3] = colorObj.r + (Math.random() - 0.5) * 0.2;
            colors[i * 3 + 1] = colorObj.g + (Math.random() - 0.5) * 0.2;
            colors[i * 3 + 2] = colorObj.b + (Math.random() - 0.5) * 0.2;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);
        particlesRef.current = particles;
    }, [color]);

    // Animation loop
    const animate = useCallback(() => {
        if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

        // Rotate disc
        if (discRef.current && isPlaying) {
            const speed = analysisData ? rotationSpeed * (1 + analysisData.volume * 2) : rotationSpeed;
            discRef.current.rotation.z += speed;
        }

        // Animate particles based on audio data
        if (particlesRef.current && analysisData) {
            const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
            const time = Date.now() * 0.001;

            for (let i = 0; i < positions.length; i += 3) {
                // Add wave motion based on audio frequency data
                const waveOffset = Math.sin(time + i * 0.01) * analysisData.volume * 0.5;
                positions[i + 1] += waveOffset * 0.1;
            }

            particlesRef.current.geometry.attributes.position.needsUpdate = true;

            // Scale particles based on volume
            const scale = 1 + analysisData.volume * 0.5;
            particlesRef.current.scale.setScalar(scale);
        }

        // Camera movement based on audio
        if (cameraRef.current && analysisData) {
            const bassIntensity = analysisData.bass * 0.5;
            cameraRef.current.position.z = 5 + bassIntensity;

            // Subtle camera shake on high frequencies
            if (analysisData.treble > 0.7) {
                cameraRef.current.position.x += (Math.random() - 0.5) * 0.1;
                cameraRef.current.position.y += (Math.random() - 0.5) * 0.1;
            }
        }

        // Render
        rendererRef.current.render(sceneRef.current, cameraRef.current);

        animationFrameRef.current = requestAnimationFrame(animate);
    }, [isPlaying, analysisData, rotationSpeed]);

    // Initialize scene on mount
    useEffect(() => {
        initializeScene();

        return () => {
            // Cleanup
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (rendererRef.current && mountRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement);
                rendererRef.current.dispose();
            }
        };
    }, [initializeScene]);

    // Start animation when initialized
    useEffect(() => {
        if (isInitialized) {
            animate();
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isInitialized, animate]);

    // Audio analyzer is now handled by the useAudioAnalyzer hook

    // Update disc texture when track changes
    useEffect(() => {
        if (!discRef.current || !track) return;

        const material = discRef.current.material as THREE.MeshPhongMaterial;

        if (track.metadata?.coverArt) {
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(track.metadata.coverArt as string);
            material.map = texture;
            material.needsUpdate = true;
        } else {
            material.map = null;
            material.color = new THREE.Color(color);
            material.needsUpdate = true;
        }
    }, [track, color]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`relative ${className}`}
            style={{ width, height }}
        >
            <div
                ref={mountRef}
                className="w-full h-full rounded-lg overflow-hidden bg-black"
                style={{ width, height }}
            />

            {/* Loading overlay */}
            {!isInitialized && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <div className="text-white text-sm">Loading 3D visualizer...</div>
                </div>
            )}

            {/* Audio info overlay */}
            {analysisData && (
                <div className="absolute top-2 left-2 text-xs text-white bg-black/50 rounded px-2 py-1">
                    <div>Volume: {Math.round(analysisData.volume * 100)}%</div>
                    <div>Bass: {Math.round(analysisData.bass * 100)}%</div>
                    <div>Treble: {Math.round(analysisData.treble * 100)}%</div>
                </div>
            )}

            {/* Controls overlay */}
            <div className="absolute bottom-2 right-2 text-xs text-white/70">
                {isPlaying ? '🎵 Playing' : '⏸️ Paused'}
            </div>

            {/* Error overlay */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-900/50 rounded-lg">
                    <div className="text-red-300 text-sm">Visualizer error: {error}</div>
                </div>
            )}

            {/* Loading overlay */}
            {!isInitialized && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <div className="text-white text-sm">Loading 3D visualizer...</div>
                </div>
            )}
        </motion.div>
    );
}
