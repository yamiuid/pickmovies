import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

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
      <head>
        {/* Google Analytics 脚本 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-E200ZWPLV5`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-E200ZWPLV5');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
