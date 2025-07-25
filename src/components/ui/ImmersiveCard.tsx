'use client';

import React, { ReactNode, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ImmersiveCardProps {
  children: ReactNode;
  variant?: 'default' | 'neon' | 'holographic' | 'cyber';
  className?: string;
  glowColor?: 'purple' | 'cyan' | 'pink' | 'green';
  interactive?: boolean;
  floating?: boolean;
}

export default function ImmersiveCard({
  children,
  variant = 'default',
  className = '',
  glowColor = 'purple',
  interactive = true,
  floating = false
}: ImmersiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!interactive || !cardRef.current) return;

    const card = cardRef.current;
    let isHovering = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(1.02, 1.02, 1.02)
      `;
    };

    const handleMouseEnter = () => {
      isHovering = true;
      card.style.transition = 'transform 0.1s ease-out';
    };

    const handleMouseLeave = () => {
      isHovering = false;
      card.style.transition = 'transform 0.3s ease-out';
      card.style.transform = `
        perspective(1000px)
        rotateX(0deg)
        rotateY(0deg)
        scale3d(1, 1, 1)
      `;
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [interactive]);

  const getVariantClasses = () => {
    switch (variant) {
      case 'neon':
        return `
          bg-secondary-950/80 backdrop-blur-xl border-2 border-${glowColor === 'purple' ? 'primary' : 
            glowColor === 'cyan' ? 'accent' : 
            glowColor === 'pink' ? 'neon-pink' : 'cyber-green'}-500/50
          shadow-lg shadow-${glowColor === 'purple' ? 'primary' : 
            glowColor === 'cyan' ? 'accent' : 
            glowColor === 'pink' ? 'neon-pink' : 'cyber-green'}-500/20
          hover:shadow-xl hover:shadow-${glowColor === 'purple' ? 'primary' : 
            glowColor === 'cyan' ? 'accent' : 
            glowColor === 'pink' ? 'neon-pink' : 'cyber-green'}-500/40
          transition-all duration-300
        `;
      case 'holographic':
        return 'holo-card';
      case 'cyber':
        return `
          bg-gradient-to-br from-secondary-900/90 to-secondary-950/90
          border border-primary-500/30
          backdrop-filter backdrop-blur-md
          shadow-lg shadow-primary-500/10
          hover:shadow-xl hover:shadow-primary-500/30
          relative overflow-hidden
          before:absolute before:inset-0 before:bg-gradient-to-r 
          before:from-transparent before:via-primary-500/10 before:to-transparent
          before:translate-x-[-100%] hover:before:translate-x-[100%]
          before:transition-transform before:duration-700
          transition-all duration-300
        `;
      default:
        return `
          bg-white/5 backdrop-blur-md border border-white/10
          shadow-lg shadow-black/20
          hover:bg-white/10 hover:border-white/20
          transition-all duration-300
        `;
    }
  };

  const cardClasses = `
    ${getVariantClasses()}
    rounded-xl p-6 transform-gpu
    ${floating ? 'animate-float' : ''}
    ${interactive ? 'cursor-pointer' : ''}
    ${className}
  `;

  return (
    <motion.div
      ref={cardRef}
      className={cardClasses}
      initial={floating ? { y: 10, opacity: 0 } : { opacity: 0, scale: 0.9 }}
      animate={floating ? { y: 0, opacity: 1 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={interactive ? { scale: 1.02 } : {}}
    >
      {/* Scanning lines for cyber variant */}
      {variant === 'cyber' && (
        <div className="scan-lines absolute inset-0 rounded-xl pointer-events-none" />
      )}
      
      {/* Particle effect for neon variant */}
      {variant === 'neon' && (
        <div className="particles absolute inset-0 rounded-xl pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                backgroundColor: glowColor === 'purple' ? '#6366f1' : 
                                glowColor === 'cyan' ? '#06b6d4' : 
                                glowColor === 'pink' ? '#ec4899' : '#10b981'
              }}
            />
          ))}
        </div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
