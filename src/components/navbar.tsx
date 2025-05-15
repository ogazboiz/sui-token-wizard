"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-900 border-b border-zinc-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md bg-teal-500 flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <span className="font-bold text-xl text-white hidden sm:inline-block">Sui Token Creator</span>
          </Link>

          <div className={`relative max-w-md w-full hidden md:block ${isSearchFocused ? "ring-1 ring-teal-500" : ""}`}>
            <Input
              type="text"
              placeholder="Search for tokens or tools"
              className="pl-10 pr-4 py-2 w-full bg-zinc-800 border-zinc-700 text-zinc-300 placeholder:text-zinc-500 focus-visible:ring-teal-500"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={18} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                  Create <ChevronDown size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                <DropdownMenuItem className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700">
                  Fungible Token
                </DropdownMenuItem>
                <DropdownMenuItem className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700">
                  NFT Collection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                  Tools <ChevronDown size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                <DropdownMenuItem className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700">
                  Explorer
                </DropdownMenuItem>
                <DropdownMenuItem className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700">
                  Gas Estimator
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                  Docs <ChevronDown size={16} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                <DropdownMenuItem className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700">
                  Getting Started
                </DropdownMenuItem>
                <DropdownMenuItem className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700">
                  API Reference
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button className="bg-teal-500 hover:bg-teal-600 text-white border-0">Connect wallet</Button>
        </div>
      </div>
    </nav>
  )
}
