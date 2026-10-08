import React from "react"
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'

import './globals.css'

export const metadata: Metadata = {
  title: 'Natthanun Puntanee - Software Engineer',
  description: 'Portfolio of Natthanun Puntanee, an experienced software engineer specializing in building scalable, high-performance applications.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Tell Dark Reader and similar extensions to not modify this site */}
        <meta name="darkreader-lock" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
