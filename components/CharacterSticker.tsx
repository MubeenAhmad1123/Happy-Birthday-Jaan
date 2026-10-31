'use client'

import React from 'react'

export type CharacterType =
  | 'dudu-bubu-box'
  | 'dudu-bubu-hug'
  | 'bubu-sad'
  | 'dudu-bubu-chai'
  | 'dudu-bubu-nashta'
  | 'dudu-bubu-bday'
  | 'dudu-bubu-flowers'
  | 'panda-peek'

interface CharacterStickerProps {
  type: CharacterType
  size?: number
  className?: string
}

export default function CharacterSticker({
  type,
  size = 140,
  className = '',
}: CharacterStickerProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {type === 'dudu-bubu-box' && (
        <svg viewBox="0 0 160 160" width={size} height={size} fill="none">
          {/* Sparkles */}
          <circle cx="25" cy="35" r="3" fill="#E56B8A" opacity="0.6" />
          <circle cx="135" cy="40" r="4" fill="#E56B8A" opacity="0.7" />
          <path d="M130 20 L133 28 L141 31 L133 34 L130 42 L127 34 L119 31 L127 28 Z" fill="#FFB703" />
          
          {/* Panda Head (Dudu) peeking */}
          <circle cx="80" cy="62" r="36" fill="#FFFFFF" stroke="#3A3036" strokeWidth="3" />
          {/* Panda Ears */}
          <circle cx="54" cy="38" r="13" fill="#3A3036" />
          <circle cx="54" cy="38" r="7" fill="#F9D5DE" />
          <circle cx="106" cy="38" r="13" fill="#3A3036" />
          <circle cx="106" cy="38" r="7" fill="#F9D5DE" />
          {/* Panda Eye Patches */}
          <ellipse cx="68" cy="60" rx="9" ry="12" fill="#3A3036" transform="rotate(-15 68 60)" />
          <circle cx="69" cy="58" r="3.5" fill="#FFFFFF" />
          <ellipse cx="92" cy="60" rx="9" ry="12" fill="#3A3036" transform="rotate(15 92 60)" />
          <circle cx="91" cy="58" r="3.5" fill="#FFFFFF" />
          {/* Nose & Mouth */}
          <ellipse cx="80" cy="68" rx="4" ry="3" fill="#3A3036" />
          <path d="M76 72 Q80 76 84 72" stroke="#3A3036" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Blush */}
          <ellipse cx="60" cy="70" rx="6" ry="4" fill="#F9D5DE" />
          <ellipse cx="100" cy="70" rx="6" ry="4" fill="#F9D5DE" />
          {/* Panda Paws holding box rim */}
          <ellipse cx="58" cy="88" rx="8" ry="6" fill="#FFFFFF" stroke="#3A3036" strokeWidth="2.5" />
          <ellipse cx="102" cy="88" rx="8" ry="6" fill="#FFFFFF" stroke="#3A3036" strokeWidth="2.5" />

          {/* Gift Box */}
          <rect x="36" y="88" width="88" height="62" rx="12" fill="#FFF0F3" stroke="#E56B8A" strokeWidth="3" />
          {/* Ribbon vertical */}
          <rect x="73" y="88" width="14" height="62" fill="#E56B8A" />
          {/* Box Lid */}
          <rect x="30" y="82" width="100" height="14" rx="6" fill="#F9D5DE" stroke="#E56B8A" strokeWidth="2.5" />
          <rect x="73" y="82" width="14" height="14" fill="#B8405E" />
          {/* Bow on Box */}
          <path d="M68 80 C55 65 60 82 72 82 Z" fill="#E56B8A" />
          <path d="M92 80 C105 65 100 82 88 82 Z" fill="#E56B8A" />
          <circle cx="80" cy="82" r="5" fill="#B8405E" />
        </svg>
      )}

      {type === 'dudu-bubu-hug' && (
        <svg viewBox="0 0 160 160" width={size} height={size} fill="none">
          {/* Floating mini hearts */}
          <path d="M80 18 C78 12 70 12 68 18 C65 24 80 32 80 32 C80 32 95 24 92 18 C90 12 82 12 80 18 Z" fill="#E56B8A" />
          <path d="M125 45 C123 40 117 40 115 45 C113 50 125 57 125 57 C125 57 137 50 135 45 C133 40 127 40 125 45 Z" fill="#F9D5DE" />

          {/* Bear (Bubu - brown) on the left */}
          <circle cx="48" cy="48" r="12" fill="#C88D6A" />
          <circle cx="48" cy="48" r="6" fill="#F3D1BC" />
          <circle cx="68" cy="76" r="32" fill="#C88D6A" stroke="#3A3036" strokeWidth="3" />
          {/* Bear closed happy eyes */}
          <path d="M52 74 Q58 68 64 74" stroke="#3A3036" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="60" cy="82" rx="4" ry="3" fill="#3A3036" />
          <ellipse cx="48" cy="82" rx="6" ry="4" fill="#F9D5DE" />

          {/* Panda (Dudu - white) on the right */}
          <circle cx="114" cy="48" r="12" fill="#3A3036" />
          <circle cx="114" cy="48" r="6" fill="#F9D5DE" />
          <circle cx="98" cy="76" r="32" fill="#FFFFFF" stroke="#3A3036" strokeWidth="3" />
          {/* Panda Eye patch & wink */}
          <ellipse cx="106" cy="74" rx="8" ry="10" fill="#3A3036" transform="rotate(15 106 74)" />
          <path d="M102 74 Q106 70 110 74" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="90" cy="74" rx="8" ry="10" fill="#3A3036" transform="rotate(-15 90 74)" />
          <circle cx="91" cy="73" r="3" fill="#FFFFFF" />
          <ellipse cx="98" cy="82" rx="4" ry="3" fill="#3A3036" />
          <path d="M95 85 Q98 88 101 85" stroke="#3A3036" strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="112" cy="82" rx="6" ry="4" fill="#F9D5DE" />

          {/* Hugging Arms wrap around */}
          {/* Bear arm */}
          <path d="M72 90 Q92 98 108 90" stroke="#C88D6A" strokeWidth="12" strokeLinecap="round" />
          <path d="M72 90 Q92 98 108 90" stroke="#3A3036" strokeWidth="2.5" fill="none" />
          {/* Panda arm */}
          <path d="M96 92 Q80 98 62 90" stroke="#FFFFFF" strokeWidth="11" strokeLinecap="round" />
          <path d="M96 92 Q80 98 62 90" stroke="#3A3036" strokeWidth="2.5" fill="none" />

          {/* Bodies */}
          <ellipse cx="65" cy="120" rx="26" ry="24" fill="#C88D6A" stroke="#3A3036" strokeWidth="3" />
          <ellipse cx="98" cy="120" rx="26" ry="24" fill="#FFFFFF" stroke="#3A3036" strokeWidth="3" />
        </svg>
      )}

      {type === 'bubu-sad' && (
        <svg viewBox="0 0 160 160" width={size} height={size} fill="none">
          {/* Rain cloud */}
          <path
            d="M50 35 C42 35 36 41 36 48 C30 49 26 55 26 60 C26 66 31 71 38 71 L92 71 C98 71 103 66 103 60 C103 55 99 50 94 49 C94 40 86 33 76 33 C70 33 64 36 61 41 C58 37 54 35 50 35 Z"
            fill="#CFE2FE"
            stroke="#93C5FD"
            strokeWidth="2"
          />
          {/* Rain drops */}
          <line x1="42" y1="78" x2="38" y2="88" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="65" y1="78" x2="61" y2="90" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="88" y1="78" x2="84" y2="88" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />

          {/* Sad Bubu Head */}
          <circle cx="56" cy="74" r="11" fill="#C88D6A" />
          <circle cx="104" cy="74" r="11" fill="#C88D6A" />
          <circle cx="80" cy="100" r="32" fill="#C88D6A" stroke="#3A3036" strokeWidth="3" />
          {/* Sad tearful eyes */}
          <ellipse cx="68" cy="98" rx="5" ry="6" fill="#3A3036" />
          <circle cx="69" cy="96" r="2" fill="#FFFFFF" />
          {/* Big tear */}
          <path d="M62 104 C60 110 65 114 67 110 C69 106 64 102 62 104 Z" fill="#60A5FA" />
          <ellipse cx="92" cy="98" rx="5" ry="6" fill="#3A3036" />
          <circle cx="91" cy="96" r="2" fill="#FFFFFF" />
          {/* Sad mouth */}
          <path d="M75 114 Q80 108 85 114" stroke="#3A3036" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Snout */}
          <ellipse cx="80" cy="106" rx="9" ry="6" fill="#F3D1BC" />
          <ellipse cx="80" cy="104" rx="4" ry="2.5" fill="#3A3036" />
        </svg>
      )}

      {type === 'dudu-bubu-chai' && (
        <svg viewBox="0 0 160 160" width={size} height={size} fill="none">
          {/* Steam heart */}
          <path d="M80 25 C78 20 72 20 70 25 C68 30 80 38 80 38 C80 38 92 30 90 25 C88 20 82 20 80 25 Z" fill="#E56B8A" opacity="0.7" />

          {/* Bubu (Bear) holding teapot/cup */}
          <circle cx="45" cy="55" r="10" fill="#C88D6A" />
          <circle cx="62" cy="78" r="28" fill="#C88D6A" stroke="#3A3036" strokeWidth="2.5" />
          <ellipse cx="56" cy="76" rx="3.5" ry="4" fill="#3A3036" />
          <circle cx="57" cy="75" r="1.5" fill="#FFFFFF" />
          <ellipse cx="68" cy="76" rx="3.5" ry="4" fill="#3A3036" />
          <circle cx="69" cy="75" r="1.5" fill="#FFFFFF" />
          <ellipse cx="62" cy="83" rx="3" ry="2" fill="#3A3036" />

          {/* Steaming Chai Cup between them */}
          <rect x="74" y="80" width="16" height="18" rx="4" fill="#FFF8F5" stroke="#E56B8A" strokeWidth="2" />
          <path d="M90 84 C95 84 95 92 90 92" stroke="#E56B8A" strokeWidth="2" fill="none" />
          <ellipse cx="82" cy="80" rx="8" ry="2" fill="#D4A373" />
          {/* Saucer */}
          <ellipse cx="82" cy="99" rx="14" ry="3" fill="#F9D5DE" />

          {/* Dudu (Panda) excited on right */}
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
      )}

      {type === 'dudu-bubu-nashta' && (
        <svg viewBox="0 0 160 160" width={size} height={size} fill="none">
          {/* Table */}
          <ellipse cx="80" cy="115" rx="56" ry="16" fill="#FDF0ED" stroke="#E56B8A" strokeWidth="2.5" />
          
          {/* Plates with breakfast */}
          <ellipse cx="64" cy="114" rx="14" ry="7" fill="#FFFFFF" stroke="#D4A373" strokeWidth="1.5" />
          <ellipse cx="64" cy="113" rx="10" ry="4" fill="#FFD166" />{/* Meetha chawal */}
          <ellipse cx="96" cy="114" rx="14" ry="7" fill="#FFFFFF" stroke="#D4A373" strokeWidth="1.5" />
          <ellipse cx="96" cy="113" rx="9" ry="4" fill="#D4A373" />{/* Naan / chane */}

          {/* Dudu & Bubu sitting together */}
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
      )}

      {type === 'dudu-bubu-bday' && (
        <svg viewBox="0 0 160 160" width={size} height={size} fill="none">
          {/* Party hats */}
          <polygon points="58,18 48,46 68,46" fill="#FFB703" stroke="#3A3036" strokeWidth="2" />
          <polygon points="102,18 92,46 112,46" fill="#E56B8A" stroke="#3A3036" strokeWidth="2" />
          <circle cx="58" cy="16" r="4" fill="#E56B8A" />
          <circle cx="102" cy="16" r="4" fill="#FFB703" />

          {/* Bear (Bubu) */}
          <circle cx="48" cy="50" r="10" fill="#C88D6A" />
          <circle cx="62" cy="72" r="26" fill="#C88D6A" stroke="#3A3036" strokeWidth="2.5" />
          <path d="M56 70 Q60 66 64 70" stroke="#3A3036" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="61" cy="76" rx="3" ry="2" fill="#3A3036" />

          {/* Panda (Dudu / Birthday Girl!) */}
          <circle cx="114" cy="50" r="10" fill="#3A3036" />
          <circle cx="100" cy="72" r="26" fill="#FFFFFF" stroke="#3A3036" strokeWidth="2.5" />
          <ellipse cx="94" cy="70" rx="6" ry="8" fill="#3A3036" transform="rotate(-10 94 70)" />
          <circle cx="95" cy="69" r="2.5" fill="#FFFFFF" />
          <ellipse cx="106" cy="70" rx="6" ry="8" fill="#3A3036" transform="rotate(10 106 70)" />
          <circle cx="105" cy="69" r="2.5" fill="#FFFFFF" />
          <ellipse cx="100" cy="76" rx="3" ry="2" fill="#3A3036" />
          <path d="M97 80 Q100 84 103 80" stroke="#3A3036" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Birthday Cake in center */}
          <rect x="66" y="94" width="30" height="24" rx="4" fill="#FFF0F3" stroke="#E56B8A" strokeWidth="2" />
          {/* Frosting */}
          <path d="M66 100 Q71 104 76 100 Q81 104 86 100 Q91 104 96 100" stroke="#E56B8A" strokeWidth="2.5" fill="none" />
          {/* Candle */}
          <line x1="81" y1="94" x2="81" y2="84" stroke="#3A3036" strokeWidth="2" strokeLinecap="round" />
          {/* Flame */}
          <ellipse cx="81" cy="80" rx="3" ry="5" fill="#FFB703" />
          <circle cx="81" cy="81" r="2" fill="#E56B8A" />
          {/* Number 25 badge */}
          <circle cx="81" cy="108" r="7" fill="#B8405E" />
          <text x="81" y="111" fontSize="7" fontWeight="bold" fill="white" textAnchor="middle">25</text>
        </svg>
      )}

      {type === 'dudu-bubu-flowers' && (
        <svg viewBox="0 0 160 160" width={size} height={size} fill="none">
          {/* Flowers bouquet */}
          <circle cx="80" cy="82" r="16" fill="#F9D5DE" stroke="#E56B8A" strokeWidth="2" />
          <circle cx="75" cy="77" r="7" fill="#E56B8A" />
          <circle cx="85" cy="77" r="7" fill="#FFB703" />
          <circle cx="80" cy="88" r="8" fill="#FFFFFF" stroke="#E56B8A" strokeWidth="1.5" />
          <path d="M72 96 L78 116 L84 96" stroke="#40916C" strokeWidth="3" strokeLinecap="round" />

          {/* Bubu giving */}
          <circle cx="45" cy="55" r="9" fill="#C88D6A" />
          <circle cx="58" cy="76" r="26" fill="#C88D6A" stroke="#3A3036" strokeWidth="2" />
          <path d="M53 74 Q57 70 61 74" stroke="#3A3036" strokeWidth="2" strokeLinecap="round" />

          {/* Dudu receiving happily */}
          <circle cx="118" cy="55" r="9" fill="#3A3036" />
          <circle cx="104" cy="76" r="26" fill="#FFFFFF" stroke="#3A3036" strokeWidth="2" />
          <ellipse cx="98" cy="74" rx="5" ry="7" fill="#3A3036" />
          <ellipse cx="108" cy="74" rx="5" ry="7" fill="#3A3036" />
          <ellipse cx="94" cy="80" rx="5" ry="3" fill="#F9D5DE" />
          <ellipse cx="112" cy="80" rx="5" ry="3" fill="#F9D5DE" />
        </svg>
      )}

      {type === 'panda-peek' && (
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
      )}
    </div>
  )
}

