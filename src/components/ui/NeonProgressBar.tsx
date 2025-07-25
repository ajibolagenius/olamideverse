'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface NeonProgressBarProps {
  progress: number; // 0-100
  className?: string;
  color?: 'primary' | 'accent' | 'neon-pink' | 'cyber-green';
  height?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showPercentage?: boolean;
  label?: string;
  glowing?: boolean;
}

export default function NeonProgressBar({
  progress,
  className = '',
  color = 'primary',
  height = 'md',
  animated = true,
  showPercentage = false,
  label,
  glowing = true
}: NeonProgressBarProps) {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setCurrentProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setCurrentProgress(progress);
    }
  }, [progress, animated]);

  const getColorClasses = () => {
    switch (color) {
      case 'accent':
        return {
          bg: 'from-accent-600 to-accent-400',
          border: 'border-accent-500',
          glow: glowing ? 'shadow-lg shadow-accent-500/50' : '',
          text: 'text-accent-400'
        };
      case 'neon-pink':
        return {
          bg: 'from-neon-pink-600 to-neon-pink-400',
          border: 'border-neon-pink-500',
          glow: glowing ? 'shadow-lg shadow-neon-pink-500/50' : '',
          text: 'text-neon-pink-400'
        };
      case 'cyber-green':
        return {
          bg: 'from-cyber-green-600 to-cyber-green-400',
          border: 'border-cyber-green-500',
          glow: glowing ? 'shadow-lg shadow-cyber-green-500/50' : '',
          text: 'text-cyber-green-400'
        };
      default:
        return {
          bg: 'from-primary-600 to-primary-400',
          border: 'border-primary-500',
          glow: glowing ? 'shadow-lg shadow-primary-500/50' : '',
          text: 'text-primary-400'
        };
    }
  };

  const getHeightClasses = () => {
    switch (height) {
      case 'sm':
        return 'h-2';
      case 'lg':
        return 'h-6';
      default:
        return 'h-4';
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`w-full ${className}`}>
      {/* Label and percentage */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-white/80">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className={`text-sm font-mono font-semibold ${colors.text}`}>
              {Math.round(currentProgress)}%
            </span>
          )}
        </div>
      )}

      {/* Progress bar container */}
      <div className={`
        relative w-full ${getHeightClasses()} 
        bg-secondary-900/80 rounded-full 
        border ${colors.border}/30
        overflow-hidden
        backdrop-blur-sm
      `}>
        {/* Background grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '10px 10px'
          }}
        />

        {/* Progress fill */}
        <motion.div
          className={`
            h-full bg-gradient-to-r ${colors.bg}
            relative overflow-hidden
            ${colors.glow}
          `}
          initial={{ width: '0%' }}
          animate={{ width: `${currentProgress}%` }}
          transition={{ 
            duration: animated ? 1.5 : 0, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100
          }}
        >
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                          animate-[shine_2s_ease-in-out_infinite]" />
          
          {/* Pulse effect for active progress */}
          {currentProgress > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 
                            animate-pulse" />
          )}
        </motion.div>

        {/* Scan line effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="h-full w-0.5 bg-white/60 absolute animate-[scan_3s_linear_infinite]"
            style={{ left: `${currentProgress}%` }}
          />
        </div>
      </div>

      {/* Additional info */}
      {currentProgress === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mt-2 text-center text-sm font-semibold ${colors.text}`}
        >
          ✓ Complete
        </motion.div>
      )}
    </div>
  );
}

// Add shine and scan keyframes to globals.css
export const progressKeyframes = `
@keyframes shine {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
  100% { transform: translateX(100%); }
}

@keyframes scan {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
`;
