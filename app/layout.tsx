import React from "react"
import type { Metadata } from 'next'
import { Inter, Space_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'

import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceMono = Space_Mono({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
})

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
      <body className={`${inter.variable} ${spaceMono.variable} font-sans antialiased`}>
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
