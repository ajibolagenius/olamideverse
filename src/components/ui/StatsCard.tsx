'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ImmersiveCard from './ImmersiveCard';
import GlitchText from './GlitchText';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'primary' | 'accent' | 'neon-pink' | 'cyber-green';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  glitch?: boolean;
  className?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = 'primary',
  size = 'md',
  animated = true,
  glitch = false,
  className = ''
}: StatsCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'accent':
        return {
          text: 'text-accent-400',
          bg: 'from-accent-600/20 to-accent-400/10',
          border: 'border-accent-500/30',
          glow: 'shadow-accent-500/20'
        };
      case 'neon-pink':
        return {
          text: 'text-neon-pink-400',
          bg: 'from-neon-pink-600/20 to-neon-pink-400/10',
          border: 'border-neon-pink-500/30',
          glow: 'shadow-neon-pink-500/20'
        };
      case 'cyber-green':
        return {
          text: 'text-cyber-green-400',
          bg: 'from-cyber-green-600/20 to-cyber-green-400/10',
          border: 'border-cyber-green-500/30',
          glow: 'shadow-cyber-green-500/20'
        };
      default:
        return {
          text: 'text-primary-400',
          bg: 'from-primary-600/20 to-primary-400/10',
          border: 'border-primary-500/30',
          glow: 'shadow-primary-500/20'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-4',
          value: 'text-2xl md:text-3xl',
          title: 'text-xs',
          icon: 'w-6 h-6',
          trend: 'text-xs'
        };
      case 'lg':
        return {
          container: 'p-8',
          value: 'text-5xl md:text-6xl',
          title: 'text-base',
          icon: 'w-10 h-10',
          trend: 'text-sm'
        };
      default:
        return {
          container: 'p-6',
          value: 'text-4xl md:text-5xl',
          title: 'text-sm',
          icon: 'w-8 h-8',
          trend: 'text-sm'
        };
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return (
          <svg className="w-4 h-4 text-cyber-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l5-5 5 5M7 7l5-5 5 5" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-5 5-5-5m10 10l-5-5-5 5" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        );
    }
  };

  const colors = getColorClasses();
  const sizes = getSizeClasses();

  return (
    <ImmersiveCard
      variant="cyber"
      glowColor={color === 'primary' ? 'purple' : 
                 color === 'accent' ? 'cyan' : 
                 color === 'neon-pink' ? 'pink' : 'green'}
      className={`
        relative overflow-hidden group
        bg-gradient-to-br ${colors.bg}
        border ${colors.border}
        hover:shadow-lg hover:${colors.glow}
        ${sizes.container}
        ${className}
      `}
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10">
        {/* Header with icon and trend */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <motion.div 
                className={`${colors.text} ${sizes.icon} flex-shrink-0`}
                animate={animated ? { rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                {icon}
              </motion.div>
            )}
            <h3 className={`font-medium text-white/80 uppercase tracking-wider ${sizes.title}`}>
              {title}
            </h3>
          </div>
          
          {trend && trendValue && (
            <div className={`flex items-center gap-1 ${sizes.trend}`}>
              {getTrendIcon()}
              <span className={
                trend === 'up' ? 'text-cyber-green-400' :
                trend === 'down' ? 'text-red-400' :
                'text-yellow-400'
              }>
                {trendValue}
              </span>
            </div>
          )}
        </div>

        {/* Main value */}
        <div className={`font-black mb-2 ${sizes.value}`}>
          {glitch ? (
            <GlitchText 
              color={color}
              intensity="low"
              trigger="hover"
            >
              {value.toString()}
            </GlitchText>
          ) : (
            <motion.span 
              className={`${colors.text} drop-shadow-lg`}
              initial={animated ? { scale: 0.5, opacity: 0 } : {}}
              animate={animated ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            >
              {value}
            </motion.span>
          )}
        </div>

        {/* Animated underline */}
        <motion.div
          className={`h-1 bg-gradient-to-r ${colors.bg.replace('/', '/40').replace('to-', 'to-')} rounded-full`}
          initial={animated ? { width: 0 } : { width: '100%' }}
          animate={animated ? { width: '100%' } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        {/* Pulse effect */}
        {animated && (
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${colors.bg} rounded-xl opacity-0`}
            animate={{ opacity: [0, 0.1, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        )}
      </div>

      {/* Corner accent */}
      <div className={`
        absolute top-0 right-0 w-16 h-16 
        bg-gradient-to-bl ${colors.bg} 
        opacity-20 transform rotate-45 translate-x-8 -translate-y-8
      `} />
    </ImmersiveCard>
  );
}
