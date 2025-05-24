import type React from "react"
import type { Metadata } from "next"
import { Varela_Round } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const varelaRound = Varela_Round({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-varela-round",

})

export const metadata: Metadata = {
   title: 'Sui Token wizard',
  description: 'The complete no-code platform for creating and managing tokens & NFTs on Sui blockchain. Features standard, regulated, and closed-loop tokens with built-in governance, policy management, and enterprise-grade security.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={varelaRound.className}>
        <Providers>{children}</Providers>
        </body>
    </html>
  )
}
