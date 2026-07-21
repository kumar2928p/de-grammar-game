import React from 'react';

export default function Parrot({ isFlying }) {
  return (
    <div className={`parrot-container ${isFlying ? 'flying' : ''}`}>
      <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <path d="M 40,20 C 60,20 70,30 70,50 C 70,70 60,80 40,80 C 20,80 30,50 40,20 Z" fill="#2ECC71" />
        
        {/* Belly */}
        <path d="M 40,40 C 55,40 60,50 60,65 C 60,75 50,80 40,80 C 35,80 35,60 40,40 Z" fill="#27AE60" />
        
        {/* Head */}
        <circle cx="55" cy="30" r="18" fill="#2ECC71" />
        
        {/* Eye */}
        <circle cx="62" cy="25" r="4" fill="#FFFFFF" />
        <circle cx="64" cy="25" r="2" fill="#000000" />
        
        {/* Beak */}
        <path d="M 72,25 C 85,25 85,35 70,35 Z" fill="#F1C40F" />
        <path d="M 70,35 C 75,35 75,42 68,40 Z" fill="#E67E22" />
        
        {/* Wing (Animated part) */}
        <g className="parrot-wing">
          <path d="M 45,45 C 55,45 55,70 35,70 C 25,70 30,50 45,45 Z" fill="#27AE60" />
          <path d="M 40,50 C 48,50 50,65 35,65 C 30,65 30,55 40,50 Z" fill="#2ECC71" />
        </g>
        
        {/* Tail */}
        <path d="M 30,75 L 10,95 L 20,95 Z" fill="#27AE60" />
        <path d="M 35,78 L 15,100 L 25,100 Z" fill="#2ECC71" />
      </svg>
    </div>
  );
}
