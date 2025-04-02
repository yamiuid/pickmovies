import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pick Movies Now',
  description: 'Get personalized movie recommendations',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
