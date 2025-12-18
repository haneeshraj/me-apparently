import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Me, Apparently - Find Your 3-Badge Personality Stack',
  description: 'A 2-minute, login-free web experience where you discover your personality through three collectible badges.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

