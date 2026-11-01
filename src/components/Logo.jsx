import React from 'react';

export const Logo = ({ size = 'md', className = '', showGlow = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
    '2xl': 'w-44 h-44'
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Liquid glow aura behind logo */}
      {showGlow && (
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/50 via-blue-500/40 to-indigo-600/50 blur-xl rounded-full scale-110 pointer-events-none animate-pulse-slow"></div>
      )}
      
      {/* High-definition W Forge Emblem */}
      <div className={`relative ${sizeClasses[size] || sizeClasses.md} rounded-2xl overflow-hidden shadow-2xl border border-cyan-400/40 liquid-glass p-0.5 group`}>
        <img
          src="/wforge-logo.png"
          alt="W Forge 3D Printing Logo"
          className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle glass shimmer sheen */}
        <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
      </div>
    </div>
  );
};
