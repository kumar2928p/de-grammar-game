import React from 'react';
import './Butterflies.css';

export default function Butterflies({ active }) {
  if (!active) return null;

  // Generate an array to map over to create multiple butterflies
  const butterflies = Array.from({ length: 6 });

  return (
    <div className="butterflies-container">
      {butterflies.map((_, i) => (
        <div key={i} className={`butterfly b-${i + 1}`}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g className="left-wing">
              <path d="M50 50 C20 10 0 40 45 50" fill="url(#wing-grad-1)"/>
              <path d="M50 50 C10 60 30 90 48 55" fill="url(#wing-grad-2)"/>
            </g>
            <g className="right-wing">
              <path d="M50 50 C80 10 100 40 55 50" fill="url(#wing-grad-1)"/>
              <path d="M50 50 C90 60 70 90 52 55" fill="url(#wing-grad-2)"/>
            </g>
            <path d="M48 40 Q50 30 52 40 L51 60 Q50 70 49 60 Z" fill="#333"/>
            <defs>
              <linearGradient id="wing-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF9A9E" />
                <stop offset="100%" stopColor="#FECFEF" />
              </linearGradient>
              <linearGradient id="wing-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A1C4FD" />
                <stop offset="100%" stopColor="#C2E9FB" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  );
}
