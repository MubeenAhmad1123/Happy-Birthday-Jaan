import type { Metadata } from 'next'
import { Dancing_Script, Caveat, Baloo_2 } from 'next/font/google'
import './globals.css'

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
})

const baloo2 = Baloo_2({
  subsets: ['latin'],
  variable: '--font-baloo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'A little something',
  description: '',
  robots: { index: false, follow: false },
  openGraph: null as any,
  twitter: null as any,
  other: {
    'X-Robots-Tag': 'noindex, nofollow',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${dancingScript.variable} ${caveat.variable} ${baloo2.variable}`}
    >
      <head>
        {/* Ensure no accidental link preview */}
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body>{children}</body>
    </html>
  )
}
