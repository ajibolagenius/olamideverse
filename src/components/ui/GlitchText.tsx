'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GlitchTextProps {
  children: string;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  color?: 'primary' | 'accent' | 'neon-pink' | 'cyber-green';
  animate?: boolean;
  trigger?: 'hover' | 'auto' | 'click';
}

export default function GlitchText({
  children,
  className = '',
  intensity = 'medium',
  color = 'primary',
  animate = true,
  trigger = 'auto'
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchedText, setGlitchedText] = useState(children);

  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const getColorClasses = () => {
    switch (color) {
      case 'accent':
        return 'text-accent-400';
      case 'neon-pink':
        return 'text-neon-pink-400';
      case 'cyber-green':
        return 'text-cyber-green-400';
      default:
        return 'text-primary-400';
    }
  };

  const getIntensitySettings = () => {
    switch (intensity) {
      case 'low':
        return { duration: 100, frequency: 3000, glitchProbability: 0.1 };
      case 'high':
        return { duration: 300, frequency: 1000, glitchProbability: 0.3 };
      default:
        return { duration: 200, frequency: 2000, glitchProbability: 0.2 };
    }
  };

  const createGlitchEffect = () => {
    const settings = getIntensitySettings();
    const chars = children.split('');
    
    return chars.map(char => {
      if (Math.random() < settings.glitchProbability) {
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }
      return char;
    }).join('');
  };

  useEffect(() => {
    if (!animate || trigger !== 'auto') return;

    const settings = getIntensitySettings();
    
    const interval = setInterval(() => {
      setIsGlitching(true);
      setGlitchedText(createGlitchEffect());
      
      setTimeout(() => {
        setGlitchedText(children);
        setIsGlitching(false);
      }, settings.duration);
    }, settings.frequency);

    return () => clearInterval(interval);
  }, [children, animate, trigger, intensity]);

  const handleTrigger = () => {
    if (trigger === 'hover' || trigger === 'click') {
      setIsGlitching(true);
      setGlitchedText(createGlitchEffect());
      
      setTimeout(() => {
        setGlitchedText(children);
        setIsGlitching(false);
      }, getIntensitySettings().duration);
    }
  };

  const baseClasses = `
    ${getColorClasses()}
    font-mono font-bold
    relative inline-block
    ${className}
  `;

  const glitchElement = (
    <span
      className={baseClasses}
      onMouseEnter={trigger === 'hover' ? handleTrigger : undefined}
      onClick={trigger === 'click' ? handleTrigger : undefined}
      style={{ cursor: trigger !== 'auto' ? 'pointer' : 'default' }}
    >
      {/* Main text */}
      <span className="relative z-10">
        {glitchedText}
      </span>
      
      {/* Glitch layers */}
      {isGlitching && (
        <>
          <span 
            className="absolute inset-0 text-neon-pink-500 opacity-70"
            style={{
              transform: 'translate(-2px, 2px)',
              zIndex: -1,
              clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)'
            }}
          >
            {createGlitchEffect()}
          </span>
          <span 
            className="absolute inset-0 text-accent-500 opacity-70"
            style={{
              transform: 'translate(2px, -2px)',
              zIndex: -2,
              clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)'
            }}
          >
            {createGlitchEffect()}
          </span>
        </>
      )}
      
      {/* Static noise overlay */}
      {isGlitching && (
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='0.1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
            animation: 'noise 0.1s infinite'
          }}
        />
      )}
    </span>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {glitchElement}
    </motion.div>
  );
}

// Add noise animation keyframes to globals.css
export const noiseKeyframes = `
@keyframes noise {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-1px, -1px); }
  20% { transform: translate(-1px, 1px); }
  30% { transform: translate(1px, -1px); }
  40% { transform: translate(1px, 1px); }
  50% { transform: translate(-1px, 0); }
  60% { transform: translate(1px, 0); }
  70% { transform: translate(0, -1px); }
  80% { transform: translate(0, 1px); }
  90% { transform: translate(-1px, -1px); }
}
`;
