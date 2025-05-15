import type React from "react"
import type { Metadata } from "next"
import { Varela_Round } from "next/font/google"
import "./globals.css"

const varelaRound = Varela_Round({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-varela-round",
})

export const metadata: Metadata = {
  title: "SuiCraft - Sui Hackathon Token Creator",
  description: "Create and deploy your own Sui tokens with ease for your hackathon project.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={varelaRound.className}>{children}</body>
    </html>
  )
}
