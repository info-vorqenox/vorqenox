import React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Vorqenox - The Ultimate Destination for Premium Apps & Tools",
  description:
    "Discover premium apps, games, AI tools, and gift cards. Vorqenox is your ultimate destination for the best digital products and exclusive offers.",
  keywords: [
    "premium apps",
    "AI tools",
    "gift cards",
    "games",
    "digital products",
    "Vorqenox",
  ],
  openGraph: {
    title: "Vorqenox - Premium Apps & Tools",
    description:
      "Discover premium apps, games, AI tools, and gift cards.",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased min-h-screen">{children}</body>
    </html>
  )
}
