"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Wallet, Compass } from "lucide-react"
import EcosystemModal from "@/components/Modal"

interface Item {
  id: string
  name: string
  logo: string
  color: string
  type: "wallet" | "explorer"
  url: string
  platform?: string
}

const items: Item[] = [
  { id: "sui-wallet", name: "Sui Wallet", logo: "S", color: "bg-blue-500", type: "wallet", url: "https://suiwallet.com", platform: "Chrome" },
  { id: "surf", name: "Surf", logo: "S", color: "bg-cyan-500", type: "wallet", url: "https://surf.tech", platform: "iOS, Android" },
  { id: "suiet", name: "Suiet", logo: "S", color: "bg-green-500", type: "wallet", url: "https://suiet.app", platform: "Chrome" },
  { id: "nightly", name: "Nightly", logo: "N", color: "bg-indigo-600", type: "wallet", url: "https://nightly.app", platform: "Cross-platform" },
  { id: "phantom", name: "Phantom", logo: "P", color: "bg-gradient-to-r from-purple-500 to-pink-500", type: "wallet", url: "https://phantom.com", platform: "Cross-chain" },
  { id: "martian", name: "Martian", logo: "M", color: "bg-red-500", type: "wallet", url: "https://martianwallet.xyz", platform: "Mobile + Extension" },
  { id: "stashed", name: "Stashed", logo: "S", color: "bg-emerald-600", type: "wallet", url: "https://getstashed.com", platform: "Extension" },
  { id: "wave", name: "Wave", logo: "W", color: "bg-sky-600", type: "wallet", url: "https://waveonsui.com", platform: "Mobile" },
  { id: "okx", name: "OKX", logo: "O", color: "bg-blue-800", type: "wallet", url: "https://okx.com", platform: "Multi-chain" },
  { id: "suiscan", name: "SuiScan", logo: "S", color: "bg-teal-600", type: "explorer", url: "https://suiscan.xyz" },
  { id: "suivision", name: "SuiVision", logo: "S", color: "bg-cyan-600", type: "explorer", url: "https://suivision.xyz" },
  { id: "polymedia", name: "Polymedia", logo: "P", color: "bg-violet-600", type: "explorer", url: "https://explorer.polymedia.app" },
  { id: "oklink", name: "OKLink", logo: "O", color: "bg-yellow-500", type: "explorer", url: "https://oklink.com/sui" },
  { id: "sui-explorer", name: "Sui Explorer", logo: "S", color: "bg-indigo-700", type: "explorer", url: "https://github.com/MystenLabs/sui/tree/main/apps/explorer" }
]

export default function EcosystemSection() {
  const [openType, setOpenType] = useState<"wallets" | "explorers" | null>(null)
  const wallets = items.filter((i) => i.type === "wallet")
  const explorers = items.filter((i) => i.type === "explorer")

  return (
    <div className="py-16 px-4 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-white mb-2">Supported Ecosystem</h2>
      <div className="mt-2 w-48 h-1 bg-purple-500 mx-auto rounded-full"></div>
      <p className="text-zinc-400 mt-4 mb-10">Connect with wallets or explore transactions seamlessly</p>

      <div className="flex justify-center gap-6">
        <button onClick={() => setOpenType("wallets")} className="flex flex-col cursor-pointer items-center gap-2">
          <motion.div whileHover={{ scale: 1.1 }} className="bg-teal-500 text-white p-4 rounded-full">
            <Wallet size={28} />
          </motion.div>
          <span className="text-sm text-white">Wallets</span>
        </button>
        <button onClick={() => setOpenType("explorers")} className="flex flex-col cursor-pointer items-center gap-2">
          <motion.div whileHover={{ scale: 1.1 }} className="bg-teal-500 text-white p-4 rounded-full">
            <Compass size={28} />
          </motion.div>
          <span className="text-sm text-white">Explorers</span>
        </button>
      </div>

      <EcosystemModal
        open={openType === "wallets"}
        onOpenChange={(open) => setOpenType(open ? "wallets" : null)}
        title="Supported Wallets"
        items={wallets.map(({ name, logo, color, url, platform }) => ({ name, logo, color, link: url, platform }))}
      />

      <EcosystemModal
        open={openType === "explorers"}
        onOpenChange={(open) => setOpenType(open ? "explorers" : null)}
        title="Supported Explorers"
        items={explorers.map(({ name, logo, color, url }) => ({ name, logo, color, link: url }))}
      />
    </div>
  )
}
