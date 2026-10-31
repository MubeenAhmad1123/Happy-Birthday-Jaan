# Happy-Birthday-Jaan

A private, mobile-first birthday surprise website built with Next.js (App Router), Tailwind CSS, Framer Motion, and Three.js.

## Tech Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- Framer Motion for UI animations
- Three.js for the 3D crystal heart
- Firebase (Firestore & Storage) via `firebase-admin`
- `jose` signed session cookies & `bcryptjs` password verification

## Getting Started

1. Copy `.env.local.example` to `.env.local` and set your credentials:
```bash
cp .env.local.example .env.local
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```
