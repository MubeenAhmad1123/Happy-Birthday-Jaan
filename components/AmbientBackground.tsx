'use client'

import React, { useMemo } from 'react'

interface AmbientBackgroundProps {
  variant?: 'dark' | 'light'
}

export default function AmbientBackground({ variant = 'dark' }: AmbientBackgroundProps) {
  // Pre-calculate deterministic particle properties (13 elements to keep phones at 60fps)
  const particles = useMemo(() => {
    return [
      { id: 1, type: 'petal', left: 6, delay: 0, duration: 9.5, drift: 22, rot: 130, size: 14 },
      { id: 2, type: 'heart', left: 18, delay: 2.5, duration: 8.2, drift: -18, rot: 40, size: 13 },
      { id: 3, type: 'star', left: 32, delay: 1.1, duration: 3.0, top: 16, size: 11 },
      { id: 4, type: 'heart', left: 44, delay: 4.8, duration: 9.0, drift: 25, rot: -35, size: 12 },
      { id: 5, type: 'petal', left: 56, delay: 1.6, duration: 8.6, drift: -22, rot: -110, size: 15 },
      { id: 6, type: 'star', left: 68, delay: 2.2, duration: 2.7, top: 38, size: 10 },
      { id: 7, type: 'heart', left: 76, delay: 3.8, duration: 8.8, drift: 18, rot: 50, size: 14 },
      { id: 8, type: 'petal', left: 86, delay: 5.5, duration: 9.8, drift: -26, rot: 170, size: 13 },
      { id: 9, type: 'star', left: 14, delay: 0.4, duration: 3.4, top: 68, size: 12 },
      { id: 10, type: 'star', left: 88, delay: 1.8, duration: 3.2, top: 80, size: 11 },
      { id: 11, type: 'heart', left: 28, delay: 6.2, duration: 9.2, drift: -16, rot: -20, size: 11 },
      { id: 12, type: 'petal', left: 64, delay: 7.1, duration: 9.6, drift: 20, rot: 85, size: 14 },
      { id: 13, type: 'star', left: 50, delay: 2.9, duration: 2.9, top: 52, size: 9 },
    ]
  }, [])

  const heartColor = variant === 'dark' ? '#FF7597' : '#E56B8A'
  const petalColor = variant === 'dark' ? '#E56B8A' : '#F9D5DE'
  const starColor = variant === 'dark' ? '#FFD97D' : '#E8C27A'

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {particles.map((p) => {
        if (p.type === 'star') {
          return (
            <div
              key={p.id}
              className="star-particle"
              style={
                {
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  width: p.size,
                  height: p.size,
                  '--duration': `${p.duration}s`,
                  '--delay': `${p.delay}s`,
                  filter: 'drop-shadow(0 0 6px rgba(255, 217, 125, 0.6))',
                } as React.CSSProperties
              }
            >
              <svg viewBox="0 0 24 24" fill={starColor} className="w-full h-full opacity-75">
                <path d="M12 2l2.4 6.9 7.6.3-5.8 4.7 2 7.1-6.2-4.2-6.2 4.2 2-7.1-5.8-4.7 7.6-.3z" />
              </svg>
            </div>
          )
        }

        return (
          <div
            key={p.id}
            className="ambient-particle"
            style={
              {
                left: `${p.left}%`,
                width: p.size,
                height: p.size,
                '--duration': `${p.duration}s`,
                '--delay': `${p.delay}s`,
                '--drift': `${p.drift}px`,
                '--rot': `${p.rot}deg`,
                filter: p.type === 'heart' ? 'drop-shadow(0 0 8px rgba(255, 117, 151, 0.5))' : undefined,
              } as React.CSSProperties
            }
          >
            {p.type === 'heart' ? (
              <svg viewBox="0 0 24 24" fill={heartColor} className="w-full h-full opacity-70">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              /* Soft Flower Petal */
              <svg viewBox="0 0 24 24" fill={petalColor} className="w-full h-full opacity-60">
                <path d="M12 2C9 7 5 11 5 15c0 4 3.1 7 7 7s7-3 7-7c0-4-4-8-7-13z" />
              </svg>
            )}
          </div>
        )
      })}
    </div>
  )
}
