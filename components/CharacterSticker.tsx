'use client'

import React, { useState } from 'react'

export type CharacterType =
  | 'dudu-bubu-box'
  | 'dudu-bubu-hug'
  | 'bubu-sad'
  | 'dudu-bubu-chai'
  | 'dudu-bubu-nashta'
  | 'dudu-bubu-bday'
  | 'dudu-bubu-flowers'
  | 'panda-peek'
  | 'panda-lawyer'
  | 'dudu-bubu-lawyer'
  | 'dudu-bubu-freedom'
  | 'bubu-maria-base'
  | 'dudu-mubi-base'
  | 'dudu-bubu-box-alt'
  | 'dudu-bubu-stars'
  | 'dudu-bubu-cake'
  | 'dudu-bubu-call'
  | 'dudu-bubu-desk'
  | 'hub-camera'
  | 'hub-letter'
  | 'hub-cassette'
  | 'dudu-bubu-camera'
  | 'dudu-bubu-letter'
  | 'dudu-bubu-cassette'
  | 'dudu-bubu-music'
  | 'dudu-bubu-playful'
  | 'dudu-bubu-kiss'
  | 'dudu-bubu-blanket'
  | 'dudu-bubu-hands'
  | 'dudu-bubu-night-cuddle'
  | 'dudu-bubu-nature-picnic'
  | 'dudu-bubu-cafe-date'
  | 'dudu-bubu-stargazing'
  | 'dudu-bubu-music-earphones'
  | 'dudu-bubu-couch-kiss'
  | 'dudu-bubu-journey-strip'

interface CharacterStickerProps {
  type: CharacterType
  size?: number
  className?: string
}

// Full-resolution authentic images & transparent stickers
const REAL_IMAGE_MAP: Record<string, string> = {
  'dudu-bubu-hug': '/characters/dudu-bubu-hug.png',
  'dudu-bubu-box': '/characters/dudu-bubu-box.png',
  'bubu-sad': '/characters/bubu-sad.png',
  'dudu-bubu-chai': '/characters/dudu-bubu-chai.png',
  'bubu-maria-base': '/characters/bubu-maria-base.png',
  'dudu-mubi-base': '/characters/dudu-mubi-base.png',
  'dudu-bubu-box-alt': '/characters/dudu-bubu-box-alt.png',
  'dudu-bubu-lawyer': '/characters/dudu-bubu-lawyer.png',
  'panda-lawyer': '/characters/dudu-bubu-lawyer.png',
  'dudu-bubu-playful': '/characters/dudu-bubu-playful.png',
  'dudu-bubu-kiss': '/characters/dudu-bubu-kiss.png',
  'dudu-bubu-blanket': '/characters/dudu-bubu-blanket.png',
  'dudu-bubu-hands': '/characters/dudu-bubu-hands.png',
  'dudu-bubu-flowers': '/characters/dudu-bubu-flowers-real.jpg',
  'dudu-bubu-night-cuddle': '/characters/dudu-bubu-night-cuddle.jpg',
  'dudu-bubu-nature-picnic': '/characters/dudu-bubu-nature-picnic.jpg',
  'dudu-bubu-cafe-date': '/characters/dudu-bubu-cafe-date.jpg',
  'dudu-bubu-stargazing': '/characters/dudu-bubu-stargazing.jpg',
  'dudu-bubu-music-earphones': '/characters/dudu-bubu-music-earphones.jpg',
  'dudu-bubu-couch-kiss': '/characters/dudu-bubu-couch-kiss.jpg',
  'dudu-bubu-journey-strip': '/characters/dudu-bubu-journey-strip.jpg',
}

export default function CharacterSticker({
  type,
  size = 140,
  className = '',
}: CharacterStickerProps) {
  const [imageError, setImageError] = useState(false)

  // Map aliases
  const canonicalType = type === 'dudu-bubu-lawyer' ? 'panda-lawyer' : type
  const realSrc = REAL_IMAGE_MAP[type] || REAL_IMAGE_MAP[canonicalType]

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* If a real asset exists and has not errored, render it */}
      {realSrc && !imageError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={realSrc}
          alt={type}
          width={size}
          height={size}
          className="w-full h-full object-contain filter drop-shadow-sm select-none"
          draggable={false}
          onError={() => setImageError(true)}
        />
      ) : (
        /* Render high-fidelity handcrafted SVG fallback */
        renderSvgFallback(canonicalType, size)
      )}
    </div>
  )
}

function renderSvgFallback(type: string, size: number) {
  switch (type) {
    case 'dudu-bubu-box':
    case 'dudu-bubu-box-alt':
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} fill="none">
          <circle cx="25" cy="35" r="3" fill="#E56B8A" opacity="0.6" />
          <circle cx="135" cy="40" r="4" fill="#E56B8A" opacity="0.7" />
          <path d="M130 20 L133 28 L141 31 L133 34 L130 42 L127 34 L119 31 L127 28 Z" fill="#FFB703" />
          <circle cx="80" cy="62" r="36" fill="#FFFFFF" stroke="#3A3036" strokeWidth="3" />
          <circle cx="54" cy="38" r="13" fill="#3A3036" />
          <circle cx="54" cy="38" r="7" fill="#F9D5DE" />
          <circle cx="106" cy="38" r="13" fill="#3A3036" />
          <circle cx="106" cy="38" r="7" fill="#F9D5DE" />
          <ellipse cx="68" cy="60" rx="9" ry="12" fill="#3A3036" transform="rotate(-15 68 60)" />
          <circle cx="69" cy="58" r="3.5" fill="#FFFFFF" />
          <ellipse cx="92" cy="60" rx="9" ry="12" fill="#3A3036" transform="rotate(15 92 60)" />
          <circle cx="91" cy="58" r="3.5" fill="#FFFFFF" />
          <ellipse cx="80" cy="68" rx="4" ry="3" fill="#3A3036" />
          <path d="M76 72 Q80 76 84 72" stroke="#3A3036" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <ellipse cx="60" cy="70" rx="6" ry="4" fill="#F9D5DE" />
          <ellipse cx="100" cy="70" rx="6" ry="4" fill="#F9D5DE" />
          <ellipse cx="58" cy="88" rx="8" ry="6" fill="#FFFFFF" stroke="#3A3036" strokeWidth="2.5" />
          <ellipse cx="102" cy="88" rx="8" ry="6" fill="#FFFFFF" stroke="#3A3036" strokeWidth="2.5" />
          <rect x="36" y="88" width="88" height="62" rx="12" fill="#FFF0F3" stroke="#E56B8A" strokeWidth="3" />
          <rect x="73" y="88" width="14" height="62" fill="#E56B8A" />
          <rect x="30" y="82" width="100" height="14" rx="6" fill="#F9D5DE" stroke="#E56B8A" strokeWidth="2.5" />
          <rect x="73" y="82" width="14" height="14" fill="#B8405E" />
          <path d="M68 80 C55 65 60 82 72 82 Z" fill="#E56B8A" />
          <path d="M92 80 C105 65 100 82 88 82 Z" fill="#E56B8A" />
          <circle cx="80" cy="82" r="5" fill="#B8405E" />
        </svg>
      )

    case 'dudu-bubu-hug':
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} fill="none">
          <path d="M80 18 C78 12 70 12 68 18 C65 24 80 32 80 32 C80 32 95 24 92 18 C90 12 82 12 80 18 Z" fill="#E56B8A" />
          <path d="M125 45 C123 40 117 40 115 45 C113 50 125 57 125 57 C125 57 137 50 135 45 C133 40 127 40 125 45 Z" fill="#F9D5DE" />
          <circle cx="48" cy="48" r="12" fill="#C88D6A" />
          <circle cx="48" cy="48" r="6" fill="#F3D1BC" />
          <circle cx="68" cy="76" r="32" fill="#C88D6A" stroke="#3A3036" strokeWidth="3" />
          <path d="M52 74 Q58 68 64 74" stroke="#3A3036" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="60" cy="82" rx="4" ry="3" fill="#3A3036" />
          <ellipse cx="48" cy="82" rx="6" ry="4" fill="#F9D5DE" />
          <circle cx="114" cy="48" r="12" fill="#3A3036" />
          <circle cx="114" cy="48" r="6" fill="#F9D5DE" />
          <circle cx="98" cy="76" r="32" fill="#FFFFFF" stroke="#3A3036" strokeWidth="3" />
          <ellipse cx="106" cy="74" rx="8" ry="10" fill="#3A3036" transform="rotate(15 106 74)" />
          <path d="M102 74 Q106 70 110 74" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="90" cy="74" rx="8" ry="10" fill="#3A3036" transform="rotate(-15 90 74)" />
          <circle cx="91" cy="73" r="3" fill="#FFFFFF" />
          <ellipse cx="98" cy="82" rx="4" ry="3" fill="#3A3036" />
          <path d="M95 85 Q98 88 101 85" stroke="#3A3036" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="112" cy="82" rx="6" ry="4" fill="#F9D5DE" />
          <path d="M72 90 Q92 98 108 90" stroke="#C88D6A" strokeWidth="12" strokeLinecap="round" />
          <path d="M72 90 Q92 98 108 90" stroke="#3A3036" strokeWidth="2.5" fill="none" />
          <path d="M96 92 Q80 98 62 90" stroke="#FFFFFF" strokeWidth="11" strokeLinecap="round" />
          <path d="M96 92 Q80 98 62 90" stroke="#3A3036" strokeWidth="2.5" fill="none" />
          <ellipse cx="65" cy="120" rx="26" ry="24" fill="#C88D6A" stroke="#3A3036" strokeWidth="3" />
          <ellipse cx="98" cy="120" rx="26" ry="24" fill="#FFFFFF" stroke="#3A3036" strokeWidth="3" />
        </svg>
      )

    case 'bubu-sad':
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} fill="none">
          <path
            d="M50 35 C42 35 36 41 36 48 C30 49 26 55 26 60 C26 66 31 71 38 71 L92 71 C98 71 103 66 103 60 C103 55 99 50 94 49 C94 40 86 33 76 33 C70 33 64 36 61 41 C58 37 54 35 50 35 Z"
            fill="#CFE2FE"
            stroke="#93C5FD"
            strokeWidth="2"
          />
          <line x1="42" y1="78" x2="38" y2="88" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="65" y1="78" x2="61" y2="90" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="88" y1="78" x2="84" y2="88" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="56" cy="74" r="11" fill="#C88D6A" />
          <circle cx="104" cy="74" r="11" fill="#C88D6A" />
          <circle cx="80" cy="100" r="32" fill="#C88D6A" stroke="#3A3036" strokeWidth="3" />
          <ellipse cx="68" cy="98" rx="5" ry="6" fill="#3A3036" />
          <circle cx="69" cy="96" r="2" fill="#FFFFFF" />
          <path d="M62 104 C60 110 65 114 67 110 C69 106 64 102 62 104 Z" fill="#60A5FA" />
          <ellipse cx="92" cy="98" rx="5" ry="6" fill="#3A3036" />
          <circle cx="91" cy="96" r="2" fill="#FFFFFF" />
          <path d="M75 114 Q80 108 85 114" stroke="#3A3036" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <ellipse cx="80" cy="106" rx="9" ry="6" fill="#F3D1BC" />
          <ellipse cx="80" cy="104" rx="4" ry="2.5" fill="#3A3036" />
        </svg>
      )

    case 'dudu-bubu-chai':
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} fill="none">
          <path d="M80 25 C78 20 72 20 70 25 C68 30 80 38 80 38 C80 38 92 30 90 25 C88 20 82 20 80 25 Z" fill="#E56B8A" opacity="0.7" />
          <circle cx="45" cy="55" r="10" fill="#C88D6A" />
          <circle cx="62" cy="78" r="28" fill="#C88D6A" stroke="#3A3036" strokeWidth="2.5" />
          <ellipse cx="56" cy="76" rx="3.5" ry="4" fill="#3A3036" />
          <circle cx="57" cy="75" r="1.5" fill="#FFFFFF" />
          <ellipse cx="68" cy="76" rx="3.5" ry="4" fill="#3A3036" />
          <circle cx="69" cy="75" r="1.5" fill="#FFFFFF" />
          <ellipse cx="62" cy="83" rx="3" ry="2" fill="#3A3036" />
          <rect x="74" y="80" width="16" height="18" rx="4" fill="#FFF8F5" stroke="#E56B8A" strokeWidth="2" />
          <path d="M90 84 C95 84 95 92 90 92" stroke="#E56B8A" strokeWidth="2" fill="none" />
          <ellipse cx="82" cy="80" rx="8" ry="2" fill="#D4A373" />
          <ellipse cx="82" cy="99" rx="14" ry="3" fill="#F9D5DE" />
          <circle cx="118" cy="55" r="10" fill="#3A3036" />
          <circle cx="102" cy="78" r="28" fill="#FFFFFF" stroke="#3A3036" strokeWidth="2.5" />
          <ellipse cx="96" cy="76" rx="6" ry="8" fill="#3A3036" transform="rotate(-10 96 76)" />
          <circle cx="97" cy="75" r="2.5" fill="#FFFFFF" />
          <ellipse cx="108" cy="76" rx="6" ry="8" fill="#3A3036" transform="rotate(10 108 76)" />
          <circle cx="107" cy="75" r="2.5" fill="#FFFFFF" />
          <ellipse cx="102" cy="83" rx="3" ry="2" fill="#3A3036" />
          <path d="M99 87 Q102 91 105 87" stroke="#3A3036" strokeWidth="2" fill="none" strokeLinecap="round" />
          <ellipse cx="90" cy="85" rx="5" ry="3" fill="#F9D5DE" />
          <ellipse cx="114" cy="85" rx="5" ry="3" fill="#F9D5DE" />
        </svg>
      )

    case 'dudu-bubu-nashta':
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} fill="none">
          <ellipse cx="80" cy="115" rx="56" ry="16" fill="#FDF0ED" stroke="#E56B8A" strokeWidth="2.5" />
          <ellipse cx="64" cy="114" rx="14" ry="7" fill="#FFFFFF" stroke="#D4A373" strokeWidth="1.5" />
          <ellipse cx="64" cy="113" rx="10" ry="4" fill="#FFD166" />
          <ellipse cx="96" cy="114" rx="14" ry="7" fill="#FFFFFF" stroke="#D4A373" strokeWidth="1.5" />
          <ellipse cx="96" cy="113" rx="9" ry="4" fill="#D4A373" />
          <circle cx="50" cy="45" r="8" fill="#C88D6A" />
          <circle cx="62" cy="65" r="24" fill="#C88D6A" stroke="#3A3036" strokeWidth="2" />
          <path d="M57 65 Q61 61 65 65" stroke="#3A3036" strokeWidth="2" strokeLinecap="round" />
          <circle cx="112" cy="45" r="8" fill="#3A3036" />
          <circle cx="100" cy="65" r="24" fill="#FFFFFF" stroke="#3A3036" strokeWidth="2" />
          <ellipse cx="95" cy="64" rx="5" ry="7" fill="#3A3036" />
          <circle cx="95" cy="63" r="2" fill="#FFFFFF" />
          <ellipse cx="105" cy="64" rx="5" ry="7" fill="#3A3036" />
          <circle cx="105" cy="63" r="2" fill="#FFFFFF" />
        </svg>
      )

    case 'dudu-bubu-bday':
    case 'dudu-bubu-cake':
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} fill="none">
          <polygon points="58,18 48,46 68,46" fill="#FFB703" stroke="#3A3036" strokeWidth="2" />
          <polygon points="102,18 92,46 112,46" fill="#E56B8A" stroke="#3A3036" strokeWidth="2" />
          <circle cx="58" cy="16" r="4" fill="#E56B8A" />
          <circle cx="102" cy="16" r="4" fill="#FFB703" />
          <circle cx="48" cy="50" r="10" fill="#C88D6A" />
          <circle cx="62" cy="72" r="26" fill="#C88D6A" stroke="#3A3036" strokeWidth="2.5" />
          <path d="M56 70 Q60 66 64 70" stroke="#3A3036" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="61" cy="76" rx="3" ry="2" fill="#3A3036" />
          <circle cx="114" cy="50" r="10" fill="#3A3036" />
          <circle cx="100" cy="72" r="26" fill="#FFFFFF" stroke="#3A3036" strokeWidth="2.5" />
          <ellipse cx="94" cy="70" rx="6" ry="8" fill="#3A3036" transform="rotate(-10 94 70)" />
          <circle cx="95" cy="69" r="2.5" fill="#FFFFFF" />
          <ellipse cx="106" cy="70" rx="6" ry="8" fill="#3A3036" transform="rotate(10 106 70)" />
          <circle cx="105" cy="69" r="2.5" fill="#FFFFFF" />
          <ellipse cx="100" cy="76" rx="3" ry="2" fill="#3A3036" />
          <path d="M97 80 Q100 84 103 80" stroke="#3A3036" strokeWidth="2" fill="none" strokeLinecap="round" />
          <rect x="66" y="94" width="30" height="24" rx="4" fill="#FFF0F3" stroke="#E56B8A" strokeWidth="2" />
          <path d="M66 100 Q71 104 76 100 Q81 104 86 100 Q91 104 96 100" stroke="#E56B8A" strokeWidth="2.5" fill="none" />
          <line x1="81" y1="94" x2="81" y2="84" stroke="#3A3036" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="81" cy="80" rx="3" ry="5" fill="#FFB703" />
          <circle cx="81" cy="81" r="2" fill="#E56B8A" />
          <circle cx="81" cy="108" r="7" fill="#B8405E" />
          <text x="81" y="111" fontSize="7" fontWeight="bold" fill="white" textAnchor="middle">25</text>
        </svg>
      )

    case 'dudu-bubu-flowers':
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} fill="none">
          <circle cx="80" cy="82" r="16" fill="#F9D5DE" stroke="#E56B8A" strokeWidth="2" />
          <circle cx="75" cy="77" r="7" fill="#E56B8A" />
          <circle cx="85" cy="77" r="7" fill="#FFB703" />
          <circle cx="80" cy="88" r="8" fill="#FFFFFF" stroke="#E56B8A" strokeWidth="1.5" />
          <path d="M72 96 L78 116 L84 96" stroke="#40916C" strokeWidth="3" strokeLinecap="round" />
          <circle cx="45" cy="55" r="9" fill="#C88D6A" />
          <circle cx="58" cy="76" r="26" fill="#C88D6A" stroke="#3A3036" strokeWidth="2" />
          <path d="M53 74 Q57 70 61 74" stroke="#3A3036" strokeWidth="2" strokeLinecap="round" />
          <circle cx="118" cy="55" r="9" fill="#3A3036" />
          <circle cx="104" cy="76" r="26" fill="#FFFFFF" stroke="#3A3036" strokeWidth="2" />
          <ellipse cx="98" cy="74" rx="5" ry="7" fill="#3A3036" />
          <ellipse cx="108" cy="74" rx="5" ry="7" fill="#3A3036" />
          <ellipse cx="94" cy="80" rx="5" ry="3" fill="#F9D5DE" />
          <ellipse cx="112" cy="80" rx="5" ry="3" fill="#F9D5DE" />
        </svg>
      )

    case 'panda-peek':
      return (
        <svg viewBox="0 0 120 120" width={size} height={size} fill="none">
          <circle cx="60" cy="64" r="32" fill="#FFFFFF" stroke="#3A3036" strokeWidth="3" />
          <circle cx="38" cy="40" r="11" fill="#3A3036" />
          <circle cx="82" cy="40" r="11" fill="#3A3036" />
          <ellipse cx="50" cy="62" rx="8" ry="10" fill="#3A3036" transform="rotate(-15 50 62)" />
          <circle cx="51" cy="60" r="3" fill="#FFFFFF" />
          <ellipse cx="70" cy="62" rx="8" ry="10" fill="#3A3036" transform="rotate(15 70 62)" />
          <circle cx="69" cy="60" r="3" fill="#FFFFFF" />
          <ellipse cx="60" cy="69" rx="4" ry="3" fill="#3A3036" />
          <path d="M56 73 Q60 76 64 73" stroke="#3A3036" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="42" cy="71" rx="6" ry="4" fill="#F9D5DE" />
          <ellipse cx="78" cy="71" rx="6" ry="4" fill="#F9D5DE" />
        </svg>
      )

    case 'panda-lawyer':
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} fill="none">
          <circle cx="28" cy="40" r="3" fill="#FFB703" />
          <circle cx="132" cy="40" r="3" fill="#FFB703" />
          <path d="M76 18 L84 18 M80 18 L80 32" stroke="#D4A373" strokeWidth="2" strokeLinecap="round" />
          <path d="M70 24 L90 24" stroke="#D4A373" strokeWidth="2" strokeLinecap="round" />
          <path d="M68 24 L64 34 M72 24 L76 34" stroke="#D4A373" strokeWidth="1.2" />
          <path d="M88 24 L84 34 M92 24 L96 34" stroke="#D4A373" strokeWidth="1.2" />
          <path d="M63 34 Q70 38 77 34 Z" fill="#FFB703" />
          <path d="M83 34 Q90 38 97 34 Z" fill="#FFB703" />
          <rect x="110" y="112" width="34" height="10" rx="2" fill="#B8405E" stroke="#3A3036" strokeWidth="1.5" />
          <rect x="112" y="103" width="30" height="9" rx="2" fill="#3A3036" stroke="#3A3036" strokeWidth="1.5" />
          <rect x="114" y="95" width="26" height="8" rx="2" fill="#E56B8A" stroke="#3A3036" strokeWidth="1.5" />
          <text x="127" y="119" fontSize="6" fill="white" fontWeight="bold" textAnchor="middle">LAW</text>
          <rect x="22" y="116" width="18" height="8" rx="2" fill="#8C5338" stroke="#3A3036" strokeWidth="1.5" transform="rotate(-25 22 116)" />
          <line x1="26" y1="118" x2="38" y2="134" stroke="#8C5338" strokeWidth="3" strokeLinecap="round" />
          <circle cx="56" cy="46" r="11" fill="#3A3036" />
          <circle cx="56" cy="46" r="5" fill="#F9D5DE" />
          <circle cx="104" cy="46" r="11" fill="#3A3036" />
          <circle cx="104" cy="46" r="5" fill="#F9D5DE" />
          <circle cx="80" cy="70" r="32" fill="#FFFFFF" stroke="#3A3036" strokeWidth="3" />
          <ellipse cx="68" cy="68" rx="8" ry="10" fill="#3A3036" transform="rotate(-15 68 68)" />
          <circle cx="69" cy="66" r="3" fill="#FFFFFF" />
          <ellipse cx="92" cy="68" rx="8" ry="10" fill="#3A3036" transform="rotate(15 92 68)" />
          <circle cx="91" cy="66" r="3" fill="#FFFFFF" />
          <ellipse cx="80" cy="76" rx="4" ry="2.5" fill="#3A3036" />
          <path d="M76 80 Q80 84 84 80" stroke="#3A3036" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <ellipse cx="60" cy="78" rx="5" ry="3" fill="#F9D5DE" />
          <ellipse cx="100" cy="78" rx="5" ry="3" fill="#F9D5DE" />
          <path d="M52 102 C52 94 62 92 72 94 L80 102 L88 94 C98 92 108 94 108 102 L106 138 C106 142 94 144 80 144 C66 144 54 142 54 138 Z" fill="#2A2026" stroke="#3A3036" strokeWidth="2.5" />
          <rect x="74" y="96" width="5" height="18" rx="1" fill="#FFFFFF" stroke="#3A3036" strokeWidth="1" />
          <rect x="81" y="96" width="5" height="18" rx="1" fill="#FFFFFF" stroke="#3A3036" strokeWidth="1" />
          <path d="M60 94 L74 116" stroke="#3A3036" strokeWidth="2" />
          <path d="M100 94 L86 116" stroke="#3A3036" strokeWidth="2" />
        </svg>
      )

    case 'dudu-bubu-freedom':
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} fill="none">
          {/* Sky & Butterflies */}
          <path d="M30 40 Q35 32 40 40 Q35 48 30 40 Z" fill="#FFB703" />
          <path d="M130 35 Q135 28 140 35 Q135 42 130 35 Z" fill="#E56B8A" />
          <path d="M80 20 Q84 15 88 20 Q84 25 80 20 Z" fill="#93C5FD" />
          {/* Meadow grass */}
          <ellipse cx="80" cy="145" rx="70" ry="15" fill="#D8F3DC" />
          {/* Flowing white dupatta in wind */}
          <path
            d="M50 78 C35 70 20 85 10 75 C18 68 38 60 55 72 Z"
            fill="#FFFFFF"
            stroke="#E56B8A"
            strokeWidth="1.5"
            opacity="0.8"
          />
          {/* Running happy Panda (Maria) */}
          <circle cx="56" cy="46" r="10" fill="#3A3036" />
          <circle cx="56" cy="46" r="5" fill="#F9D5DE" />
          <circle cx="104" cy="46" r="10" fill="#3A3036" />
          <circle cx="104" cy="46" r="5" fill="#F9D5DE" />
          <circle cx="80" cy="70" r="30" fill="#FFFFFF" stroke="#3A3036" strokeWidth="3" />
          <ellipse cx="68" cy="68" rx="7" ry="9" fill="#3A3036" transform="rotate(-15 68 68)" />
          <circle cx="69" cy="67" r="2.5" fill="#FFFFFF" />
          <ellipse cx="92" cy="68" rx="7" ry="9" fill="#3A3036" transform="rotate(15 92 68)" />
          <circle cx="91" cy="67" r="2.5" fill="#FFFFFF" />
          <ellipse cx="80" cy="74" rx="3.5" ry="2.5" fill="#3A3036" />
          <path d="M76 78 Q80 82 84 78" stroke="#3A3036" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="62" cy="76" rx="5" ry="3" fill="#F9D5DE" />
          <ellipse cx="98" cy="76" rx="5" ry="3" fill="#F9D5DE" />
          {/* Open joyous paws */}
          <ellipse cx="44" cy="85" rx="7" ry="12" fill="#FFFFFF" stroke="#3A3036" strokeWidth="2.5" transform="rotate(-35 44 85)" />
          <ellipse cx="116" cy="85" rx="7" ry="12" fill="#FFFFFF" stroke="#3A3036" strokeWidth="2.5" transform="rotate(35 116 85)" />
          {/* Body */}
          <ellipse cx="80" cy="115" rx="28" ry="24" fill="#FFFFFF" stroke="#3A3036" strokeWidth="3" />
        </svg>
      )

    case 'hub-camera':
    case 'dudu-bubu-camera':
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} fill="none">
          {/* Sparkles & Hearts */}
          <circle cx="26" cy="32" r="3" fill="#D4AF37" opacity="0.8" />
          <path d="M136 28 L138 34 L144 36 L138 38 L136 44 L134 38 L128 36 L134 34 Z" fill="#D4AF37" />
          <path d="M142 56 C140 52 135 52 133 56 C131 60 142 66 142 66 C142 66 153 60 151 56 C149 52 144 52 142 56 Z" fill="#E56B8A" opacity="0.85" />
          
          {/* Dudu peeking out from behind with thumbs-up */}
          <circle cx="106" cy="52" r="9" fill="#C88D6A" />
          <circle cx="106" cy="52" r="4.5" fill="#F3D1BC" />
          <circle cx="134" cy="56" r="9" fill="#C88D6A" />
          <circle cx="134" cy="56" r="4.5" fill="#F3D1BC" />
          <circle cx="118" cy="74" r="24" fill="#C88D6A" stroke="#3A3036" strokeWidth="2.5" />
          <path d="M110 70 Q114 66 118 70" stroke="#3A3036" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="128" cy="69" rx="3.5" ry="4" fill="#3A3036" />
          <circle cx="129" cy="68" r="1.2" fill="#FFFFFF" />
          <ellipse cx="120" cy="77" rx="6" ry="4.5" fill="#F3D1BC" />
          <ellipse cx="120" cy="76" rx="3" ry="2" fill="#3A3036" />
          <path d="M118 80 Q120 83 123 80" stroke="#3A3036" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <ellipse cx="110" cy="77" rx="4" ry="2.5" fill="#F9D5DE" />
          <ellipse cx="130" cy="77" rx="4" ry="2.5" fill="#F9D5DE" />
          {/* Dudu's Thumbs Up Paw */}
          <ellipse cx="140" cy="80" rx="6" ry="7" fill="#C88D6A" stroke="#3A3036" strokeWidth="2" />
          <circle cx="140" cy="73" r="3.5" fill="#C88D6A" stroke="#3A3036" strokeWidth="2" />

          {/* Bubu (Maria) in center */}
          <circle cx="42" cy="50" r="11" fill="#3A3036" />
          <circle cx="42" cy="50" r="5" fill="#F9D5DE" />
          <circle cx="86" cy="50" r="11" fill="#3A3036" />
          <circle cx="86" cy="50" r="5" fill="#F9D5DE" />
          <circle cx="64" cy="74" r="30" fill="#FFFFFF" stroke="#3A3036" strokeWidth="3" />
          <ellipse cx="53" cy="72" rx="7" ry="9" fill="#3A3036" transform="rotate(-12 53 72)" />
          <circle cx="54" cy="70" r="2.5" fill="#FFFFFF" />
          <ellipse cx="75" cy="72" rx="7" ry="9" fill="#3A3036" transform="rotate(12 75 72)" />
          <circle cx="74" cy="70" r="2.5" fill="#FFFFFF" />
          <ellipse cx="64" cy="78" rx="3.5" ry="2.5" fill="#3A3036" />
          <path d="M60 82 Q64 86 68 82" stroke="#3A3036" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="46" cy="80" rx="6" ry="3.5" fill="#FF8DA1" />
          <ellipse cx="82" cy="80" rx="6" ry="3.5" fill="#FF8DA1" />

          {/* Retro Film Camera in Bubu's paws */}
          <rect x="36" y="94" width="56" height="38" rx="8" fill="#FFF0F5" stroke="#E56B8A" strokeWidth="2.5" />
          <rect x="42" y="88" width="44" height="8" rx="3" fill="#E56B8A" />
          <rect x="44" y="90" width="8" height="4" rx="1.5" fill="#FFD166" />
          <circle cx="78" cy="86" r="3" fill="#D90429" />
          {/* Big Vintage Lens with Reflection */}
          <circle cx="64" cy="113" r="15" fill="#241B21" stroke="#D4AF37" strokeWidth="2" />
          <circle cx="64" cy="113" r="11" fill="#3B3238" />
          <circle cx="64" cy="113" r="7" fill="#151216" />
          <path d="M59 108 Q63 105 67 108" stroke="#93C5FD" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Polaroid photo sliding out below */}
          <g transform="rotate(-6 64 134)">
            <rect x="52" y="126" width="24" height="26" rx="2" fill="#FFFFFF" stroke="#3A3036" strokeWidth="1.5" />
            <rect x="55" y="128" width="18" height="16" fill="#FCE7F3" />
            <path d="M64 135 C62 133 59 133 58 135 C57 137 64 141 64 141 C64 141 71 137 70 135 C69 133 66 133 64 135 Z" fill="#E56B8A" />
          </g>
          {/* Paws holding camera */}
          <ellipse cx="38" cy="108" rx="6" ry="7" fill="#FFFFFF" stroke="#3A3036" strokeWidth="2" />
          <ellipse cx="90" cy="108" rx="6" ry="7" fill="#FFFFFF" stroke="#3A3036" strokeWidth="2" />
        </svg>
      )

    case 'hub-letter':
    case 'dudu-bubu-letter':
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} fill="none">
          {/* Floating Rose Petals & Sparkles */}
          <path d="M22 42 Q28 36 32 44 Q26 50 22 42 Z" fill="#FF8DA1" opacity="0.8" />
          <path d="M138 38 Q144 32 148 40 Q142 46 138 38 Z" fill="#F9D5DE" />
          <path d="M142 88 Q148 82 152 90 Q146 96 142 88 Z" fill="#FF8DA1" opacity="0.7" />
          <path d="M18 106 Q24 100 28 108 Q22 114 18 106 Z" fill="#F9D5DE" opacity="0.9" />
          <path d="M78 20 L80 24 L84 25 L80 26 L78 30 L76 26 L72 25 L76 24 Z" fill="#D4AF37" />

          {/* Dudu (Brown Bear) holding envelope */}
          <circle cx="36" cy="54" r="9" fill="#C88D6A" />
          <circle cx="36" cy="54" r="4.5" fill="#F3D1BC" />
          <circle cx="68" cy="54" r="9" fill="#C88D6A" />
          <circle cx="68" cy="54" r="4.5" fill="#F3D1BC" />
          <circle cx="52" cy="74" r="26" fill="#C88D6A" stroke="#3A3036" strokeWidth="2.5" />
          <path d="M44 72 Q48 68 52 72" stroke="#3A3036" strokeWidth="2" strokeLinecap="round" />
          <path d="M56 72 Q60 68 64 72" stroke="#3A3036" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="52" cy="79" rx="6" ry="4" fill="#F3D1BC" />
          <ellipse cx="52" cy="78" rx="3" ry="2" fill="#3A3036" />
          <ellipse cx="42" cy="79" rx="4.5" ry="3" fill="#F9D5DE" />
          <ellipse cx="62" cy="79" rx="4.5" ry="3" fill="#F9D5DE" />

          {/* Pink Envelope with Heart Wax Seal in Dudu's paws */}
          <rect x="52" y="90" width="56" height="38" rx="6" fill="#FFF0F5" stroke="#E56B8A" strokeWidth="2.5" />
          <path d="M52 90 L80 110 L108 90" stroke="#E56B8A" strokeWidth="2" fill="none" />
          <path d="M52 128 L74 106" stroke="#E56B8A" strokeWidth="1.5" opacity="0.6" />
          <path d="M108 128 L86 106" stroke="#E56B8A" strokeWidth="1.5" opacity="0.6" />
          {/* Heart Wax Seal */}
          <circle cx="80" cy="110" r="9" fill="#E56B8A" stroke="#D4AF37" strokeWidth="1.2" />
          <path d="M80 108 C78 105 74 105 73 108 C72 111 80 115 80 115 C80 115 88 111 87 108 C86 105 82 105 80 108 Z" fill="#FFFFFF" />
          {/* Bear Paws holding envelope */}
          <ellipse cx="50" cy="106" rx="6" ry="7" fill="#C88D6A" stroke="#3A3036" strokeWidth="2" />
          <ellipse cx="110" cy="106" rx="6" ry="7" fill="#C88D6A" stroke="#3A3036" strokeWidth="2" />

          {/* Bubu (Maria) blushing with paws on cheeks */}
          <circle cx="94" cy="50" r="11" fill="#3A3036" />
          <circle cx="94" cy="50" r="5" fill="#F9D5DE" />
          <circle cx="134" cy="50" r="11" fill="#3A3036" />
          <circle cx="134" cy="50" r="5" fill="#F9D5DE" />
          <circle cx="114" cy="74" r="28" fill="#FFFFFF" stroke="#3A3036" strokeWidth="2.5" />
          <path d="M104 70 Q108 66 112 70" stroke="#3A3036" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M118 70 Q122 66 126 70" stroke="#3A3036" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="115" cy="77" rx="3.5" ry="2.5" fill="#3A3036" />
          <path d="M112 81 Q115 84 118 81" stroke="#3A3036" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Super blushing cheeks */}
          <ellipse cx="98" cy="78" rx="8" ry="5" fill="#FF6584" opacity="0.9" />
          <ellipse cx="130" cy="78" rx="8" ry="5" fill="#FF6584" opacity="0.9" />
          {/* Bubu's paws on cheeks in adorable shy joy */}
          <ellipse cx="98" cy="80" rx="6" ry="7" fill="#FFFFFF" stroke="#3A3036" strokeWidth="2" transform="rotate(-15 98 80)" />
          <ellipse cx="130" cy="80" rx="6" ry="7" fill="#FFFFFF" stroke="#3A3036" strokeWidth="2" transform="rotate(15 130 80)" />
        </svg>
      )

    case 'hub-cassette':
    case 'dudu-bubu-cassette':
    case 'dudu-bubu-music':
      return (
        <svg viewBox="0 0 160 160" width={size} height={size} fill="none">
          {/* Musical Notes & Hearts floating */}
          <g fill="#E56B8A">
            <path d="M26 36 C24 32 20 32 19 36 C18 40 26 44 26 44 C26 44 34 40 33 36 C32 32 28 32 26 36 Z" />
            <path d="M134 32 C132 28 128 28 127 32 C126 36 134 40 134 40 C134 40 142 36 141 32 C140 28 136 28 134 32 Z" opacity="0.8" />
          </g>
          {/* Musical Notes */}
          <path d="M22 62 L22 50 L34 46 L34 58 M22 55 L34 51" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="62" r="3.5" fill="#D4AF37" />
          <circle cx="32" cy="58" r="3.5" fill="#D4AF37" />
          <path d="M138 58 L138 48 L146 45 L146 55 M138 52 L146 49" stroke="#E56B8A" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="136" cy="58" r="3" fill="#E56B8A" />
          <circle cx="144" cy="55" r="3" fill="#E56B8A" />

          {/* Floating Retro Cassette Tape */}
          <rect x="44" y="16" width="72" height="42" rx="6" fill="#241B22" stroke="#E56B8A" strokeWidth="2.5" />
          <rect x="50" y="21" width="60" height="32" rx="4" fill="#FFF5F8" />
          <rect x="58" y="28" width="44" height="16" rx="3" fill="#1C161B" />
          {/* Cassette Reels */}
          <circle cx="68" cy="36" r="6" fill="#FFFFFF" />
          <circle cx="68" cy="36" r="2.5" fill="#E56B8A" />
          <circle cx="92" cy="36" r="6" fill="#FFFFFF" />
          <circle cx="92" cy="36" r="2.5" fill="#E56B8A" />
          <rect x="74" y="34" width="12" height="4" fill="#6B4B3E" />

          {/* Earbud wires from cassette down to Dudu and Bubu */}
          <path d="M80 58 Q80 78 58 92" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M80 58 Q80 78 102 92" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Left Earbud in Dudu's ear */}
          <circle cx="58" cy="92" r="4.5" fill="#FFFFFF" stroke="#3A3036" strokeWidth="1.5" />
          {/* Right Earbud in Bubu's ear */}
          <circle cx="102" cy="92" r="4.5" fill="#FFFFFF" stroke="#3A3036" strokeWidth="1.5" />

          {/* Dudu (Brown Bear) on left listening peacefully */}
          <circle cx="34" cy="78" r="8" fill="#C88D6A" />
          <circle cx="34" cy="78" r="4" fill="#F3D1BC" />
          <circle cx="64" cy="78" r="8" fill="#C88D6A" />
          <circle cx="64" cy="78" r="4" fill="#F3D1BC" />
          <circle cx="50" cy="100" r="24" fill="#C88D6A" stroke="#3A3036" strokeWidth="2.5" />
          {/* Peaceful closed eyes */}
          <path d="M42 98 Q46 102 50 98" stroke="#3A3036" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M54 98 Q58 102 62 98" stroke="#3A3036" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="51" cy="104" rx="5" ry="3.5" fill="#F3D1BC" />
          <ellipse cx="51" cy="103" rx="2.5" ry="1.8" fill="#3A3036" />
          <ellipse cx="40" cy="105" rx="4" ry="2.5" fill="#F9D5DE" />
          <ellipse cx="60" cy="105" rx="4" ry="2.5" fill="#F9D5DE" />

          {/* Bubu (White Panda) on right listening peacefully */}
          <circle cx="86" cy="76" r="10" fill="#3A3036" />
          <circle cx="86" cy="76" r="4.5" fill="#F9D5DE" />
          <circle cx="122" cy="76" r="10" fill="#3A3036" />
          <circle cx="122" cy="76" r="4.5" fill="#F9D5DE" />
          <circle cx="104" cy="100" r="24" fill="#FFFFFF" stroke="#3A3036" strokeWidth="2.5" />
          {/* Peaceful closed eyes */}
          <path d="M96 98 Q100 102 104 98" stroke="#3A3036" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M108 98 Q112 102 116 98" stroke="#3A3036" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="105" cy="104" rx="3" ry="2" fill="#3A3036" />
          <ellipse cx="94" cy="105" rx="5" ry="3" fill="#FF8DA1" />
          <ellipse cx="118" cy="105" rx="5" ry="3" fill="#FF8DA1" />

          {/* Cozy Bodies resting side by side */}
          <ellipse cx="54" cy="132" rx="20" ry="18" fill="#C88D6A" stroke="#3A3036" strokeWidth="2.5" />
          <ellipse cx="100" cy="132" rx="20" ry="18" fill="#FFFFFF" stroke="#3A3036" strokeWidth="2.5" />
          {/* Shared Little Heart between them */}
          <path d="M78 122 C76 119 72 119 71 122 C70 125 78 129 78 129 C78 129 86 125 85 122 C84 119 80 119 78 122 Z" fill="#E56B8A" />
        </svg>
      )

    default:
      return (
        <svg viewBox="0 0 120 120" width={size} height={size} fill="none">
          <circle cx="60" cy="60" r="35" fill="#FFF0F3" stroke="#E56B8A" strokeWidth="2.5" />
          <text x="60" y="66" fontSize="24" textAnchor="middle">🤍</text>
        </svg>
      )
  }
}
