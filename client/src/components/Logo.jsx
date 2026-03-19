import React from "react";

export default function Logo({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f0c060"/>
          <stop offset="100%" stopColor="#00e5cc"/>
        </linearGradient>
        <linearGradient id="lg2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9b6dff"/>
          <stop offset="100%" stopColor="#00e5cc"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Hexagon background */}
      <polygon points="24,2 43,13 43,35 24,46 5,35 5,13" fill="url(#lg2)" opacity="0.15" stroke="url(#lg1)" strokeWidth="1.5"/>
      {/* Inner spark / L shape */}
      <filter id="g2"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <g filter="url(#g2)">
        <rect x="14" y="13" width="4" height="18" rx="2" fill="url(#lg1)"/>
        <rect x="14" y="27" width="14" height="4" rx="2" fill="url(#lg1)"/>
        <circle cx="33" cy="16" r="3" fill="#00e5cc" opacity="0.9"/>
        <circle cx="33" cy="16" r="5" fill="#00e5cc" opacity="0.2"/>
      </g>
    </svg>
  );
}
