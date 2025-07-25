'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface CyberButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'neon' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  glowColor?: 'purple' | 'cyan' | 'pink' | 'green';
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export default function CyberButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  disabled = false,
  glowColor = 'purple',
  className = '',
  icon,
  iconPosition = 'left',
  loading = false
}: CyberButtonProps) {
  const getVariantClasses = () => {
    const glowColors = {
      purple: 'primary',
      cyan: 'accent',
      pink: 'neon-pink',
      green: 'cyber-green'
    };

    const currentGlow = glowColors[glowColor];

    switch (variant) {
      case 'neon':
        return `
          bg-transparent border-2 border-${currentGlow}-500
          text-${currentGlow}-400 hover:text-secondary-950
          hover:bg-${currentGlow}-500 hover:shadow-lg hover:shadow-${currentGlow}-500/50
          font-mono font-semibold uppercase tracking-wider
          relative overflow-hidden
          before:absolute before:inset-0 before:bg-${currentGlow}-500
          before:translate-x-[-100%] hover:before:translate-x-0
          before:transition-transform before:duration-300 before:z-[-1]
        `;
      case 'ghost':
        return `
          bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40
          text-white backdrop-blur-md
          hover:shadow-lg hover:shadow-primary-500/20
        `;
      case 'secondary':
        return `
          bg-secondary-800 hover:bg-secondary-700 border border-secondary-600
          text-white hover:border-${currentGlow}-500/50
          hover:shadow-lg hover:shadow-${currentGlow}-500/20
        `;
      default: // primary
        return `
          bg-gradient-to-r from-${currentGlow}-600 to-${currentGlow}-500
          hover:from-${currentGlow}-500 hover:to-${currentGlow}-400
          text-white border-0
          hover:shadow-xl hover:shadow-${currentGlow}-500/40
        `;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      case 'xl':
        return 'px-12 py-6 text-xl';
      default: // md
        return 'px-6 py-3 text-base';
    }
  };

  const buttonClasses = `
    ${getVariantClasses()}
    ${getSizeClasses()}
    rounded-lg font-semibold
    transform transition-all duration-300 ease-out
    hover:scale-105 active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    focus:outline-none focus:ring-2 focus:ring-primary-500/50
    relative overflow-hidden group
    ${className}
  `;

  const content = (
    <>
      {/* Holographic shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      group-hover:animate-[shimmer_1.5s_ease-in-out_infinite]" />
      
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <div className={`flex items-center justify-center gap-2 relative z-10 ${loading ? 'opacity-0' : ''}`}>
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        <span>{children}</span>
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0 transform group-hover:translate-x-1 transition-transform duration-300">
            {icon}
          </span>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        <motion.button
          className={buttonClasses}
          disabled={disabled || loading}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {content}
        </motion.button>
      </Link>
    );
  }

  return (
    <motion.button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {content}
    </motion.button>
  );
}

// Add shimmer keyframe to globals.css
export const shimmerKeyframes = `
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;
