"use client"

import Link from "next/link"
import { Github, Twitter, Linkedin, Mail, ExternalLink } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-md bg-teal-500 flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <span className="font-bold text-xl text-white">Sui Token Creator</span>
            </div>
            <p className="text-zinc-400 text-sm mb-4">
              Create and deploy custom tokens on the Sui blockchain with ease. Our simple, fast, and secure platform
              lets you bring your ideas to life.
            </p>
            <div className="flex space-x-4">
              <Link href="https://github.com" className="text-zinc-400 hover:text-white transition-colors">
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://twitter.com" className="text-zinc-400 hover:text-white transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://linkedin.com" className="text-zinc-400 hover:text-white transition-colors">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/generator/mainnet" className="text-zinc-400 hover:text-teal-400 transition-colors text-sm">
                  Token Creator
                </Link>
              </li>
              <li>
                <Link href="/nft/generate" className="text-zinc-400 hover:text-teal-400 transition-colors text-sm">
                  NFT Collection Creator
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-zinc-400 hover:text-teal-400 transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-zinc-400 hover:text-teal-400 transition-colors text-sm flex items-center"
                >
                  <span>Multisender</span>
                  <span className="ml-2 text-xs bg-teal-500 text-black px-1.5 py-0.5 rounded font-medium">Soon</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-zinc-400 hover:text-teal-400 transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-zinc-400 hover:text-teal-400 transition-colors text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-zinc-400 hover:text-teal-400 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="https://sui.io"
                  className="text-zinc-400 hover:text-teal-400 transition-colors text-sm flex items-center"
                >
                  <span>Sui Blockchain</span>
                  <ExternalLink size={12} className="ml-1" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="mailto:contact@suitokencreator.com"
                  className="text-zinc-400 hover:text-teal-400 transition-colors text-sm flex items-center"
                >
                  <Mail size={14} className="mr-2" />
                  <span>contact@suitokencreator.com</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-teal-400 transition-colors text-sm">
                  Contact Form
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-zinc-400 hover:text-teal-400 transition-colors text-sm">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-500 text-sm">© {currentYear} Sui Token Creator. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-zinc-500 hover:text-zinc-300 text-sm">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-zinc-500 hover:text-zinc-300 text-sm">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
