'use client'

import React, { useMemo } from 'react'

interface AmbientBackgroundProps {
  variant?: 'dark' | 'light'
}

export default function AmbientBackground({ variant = 'dark' }: AmbientBackgroundProps) {
  // Pre-calculate deterministic particle properties (10 elements to stay fast on mobile)
  const particles = useMemo(() => {
    return [
      { id: 1, type: 'petal', left: 8, delay: 0, duration: 9, drift: 25, rot: 140, size: 14 },
      { id: 2, type: 'heart', left: 22, delay: 3.5, duration: 8.5, drift: -20, rot: 45, size: 12 },
      { id: 3, type: 'star', left: 35, delay: 1.2, duration: 3.2, top: 18, size: 10 },
      { id: 4, type: 'petal', left: 48, delay: 5.2, duration: 9.5, drift: 30, rot: -120, size: 13 },
      { id: 5, type: 'heart', left: 62, delay: 1.8, duration: 8, drift: -15, rot: -30, size: 11 },
      { id: 6, type: 'star', left: 78, delay: 2.1, duration: 2.8, top: 42, size: 9 },
      { id: 7, type: 'petal', left: 88, delay: 4.1, duration: 10, drift: -25, rot: 180, size: 15 },
      { id: 8, type: 'heart', left: 92, delay: 6.5, duration: 9, drift: 20, rot: 60, size: 12 },
      { id: 9, type: 'star', left: 15, delay: 0.5, duration: 3.6, top: 72, size: 11 },
      { id: 10, type: 'star', left: 85, delay: 1.9, duration: 3.1, top: 82, size: 10 },
    ]
  }, [])

  const heartColor = variant === 'dark' ? '#E56B8A' : '#E56B8A'
  const petalColor = variant === 'dark' ? '#B8405E' : '#F9D5DE'
  const starColor = variant === 'dark' ? '#E8C27A' : '#FFD166'

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
                } as React.CSSProperties
              }
            >
              <svg viewBox="0 0 24 24" fill={starColor} className="w-full h-full opacity-70">
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
              } as React.CSSProperties
            }
          >
            {p.type === 'heart' ? (
              <svg viewBox="0 0 24 24" fill={heartColor} className="w-full h-full opacity-60">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              /* Soft Flower Petal */
              <svg viewBox="0 0 24 24" fill={petalColor} className="w-full h-full opacity-55">
                <path d="M12 2C9 7 5 11 5 15c0 4 3.1 7 7 7s7-3 7-7c0-4-4-8-7-13z" />
              </svg>
            )}
          </div>
        )
      })}
    </div>
  )
}
