import { notFound } from 'next/navigation'

// Every path except /g/[slug] returns a plain 404
export default function Home() {
  notFound()
}
