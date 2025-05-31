"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Clock } from "lucide-react"
import Link from "next/link"

interface Network {
  id: string
  name: string
  description: string
  color: string
  status: "stable" | "testing" | "development"
  available: boolean
}

const networks: Network[] = [
  {
    id: "mainnet",
    name: "Sui Mainnet",
    description: "Production network with permanent data persistence. Use for live deployment.",
    color: "bg-purple-500",
    status: "stable",
    available: false,
  },
  {
    id: "testnet",
    name: "Sui Testnet",
    description: "Pre-production testing network with semi-permanent data. Use for final testing.",
    color: "bg-teal-500",
    status: "testing",
    available: true,
  },
  {
    id: "devnet",
    name: "Sui Devnet",
    description: "Development network that is regularly wiped. Use for early development and experimentation.",
    color: "bg-blue-500",
    status: "development",
    available: false,
  },
]

export default function NftGenerator() {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null)

  const handleNetworkClick = (networkId: string, available: boolean) => {
    if (available) {
      setSelectedNetwork(networkId)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Sui NFT Collection Creator</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Create your own NFT collection on the Sui blockchain with our easy-to-use interface. Design, mint, and
            manage your digital collectibles in minutes.
          </p>
        </div>

        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white">Select network</h2>
            <div className="mt-2 w-36 h-1 bg-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid gap-6">
            {networks.map((network) => (
              <motion.div
                key={network.id}
                className={`relative overflow-hidden rounded-xl border transition-all duration-200 ${
                  !network.available
                    ? "bg-zinc-900/50 border-zinc-800 cursor-not-allowed opacity-60"
                    : selectedNetwork === network.id
                    ? "bg-zinc-900 border-purple-500 shadow-lg shadow-purple-500/20"
                    : "bg-zinc-900 border-zinc-800 cursor-pointer hover:border-zinc-700"
                }`}
                whileHover={
                  network.available
                    ? { y: -2, borderColor: selectedNetwork === network.id ? "#a855f7" : "#52525b" }
                    : {}
                }
                whileTap={network.available ? { scale: 0.98 } : {}}
                onClick={() => handleNetworkClick(network.id, network.available)}
              >
                {/* Selection indicator */}
                {selectedNetwork === network.id && network.available && (
                  <motion.div
                    className="absolute inset-0 border-2 border-purple-500 rounded-xl pointer-events-none"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}

                {/* Coming Soon overlay */}
                {!network.available && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Clock size={10} />
                      <span className="hidden sm:inline">Coming Soon</span>
                      <span className="sm:hidden">Soon</span>
                    </div>
                  </div>
                )}

                <div className="p-4 sm:p-6 flex items-start sm:items-center gap-4 sm:gap-6">
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white shrink-0 ${
                      network.available ? network.color : "bg-zinc-700"
                    }`}
                  >
                    <span className="text-lg sm:text-2xl font-bold">S</span>
                  </div>

                  <div className="flex-1 min-w-0 pr-8 sm:pr-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                      <h3 className={`text-lg sm:text-xl font-bold ${network.available ? "text-white" : "text-zinc-500"}`}>
                        {network.name}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full w-fit ${getStatusBadgeColor(network.status, network.available)}`}>
                        {getStatusLabel(network.status)}
                      </span>
                    </div>
                    <p className={`text-sm ${network.available ? "text-zinc-400" : "text-zinc-600"} leading-relaxed`}>
                      {network.description}
                    </p>
                  </div>

                  {/* Selection checkmark */}
                  {selectedNetwork === network.id && network.available && (
                    <motion.div
                      className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        {selectedNetwork && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href={`/nft/${selectedNetwork}`}
              className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25"
            >
              Continue with {networks.find(n => n.id === selectedNetwork)?.name}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 3.5L10.5 8L6 12.5V3.5z"/>
              </svg>
            </Link>
          </motion.div>
        )}

        {/* Info section */}
        <div className="mt-16 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Why Choose Testnet?</h3>
            <p className="text-zinc-400 text-sm max-w-2xl mx-auto">
              Testnet is perfect for creating and testing NFT collections without real costs. You can experiment freely 
              with your collection designs, minting processes, and smart contract functionality before moving to mainnet.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-teal-400 text-xl">💰</span>
              </div>
              <h4 className="text-white font-medium text-sm">Free Testing</h4>
              <p className="text-zinc-500 text-xs mt-1">No real SUI required</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-teal-400 text-xl">🚀</span>
              </div>
              <h4 className="text-white font-medium text-sm">Fast Deployment</h4>
              <p className="text-zinc-500 text-xs mt-1">Quick contract deployment</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-teal-400 text-xl">🧪</span>
              </div>
              <h4 className="text-white font-medium text-sm">Safe Testing</h4>
              <p className="text-zinc-500 text-xs mt-1">Perfect for experimentation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getStatusBadgeColor(status: string, available: boolean): string {
  if (!available) {
    return "bg-zinc-500/20 text-zinc-500"
  }
  
  switch (status) {
    case "stable":
      return "bg-green-500/20 text-green-400"
    case "testing":
      return "bg-yellow-500/20 text-yellow-400"
    case "development":
      return "bg-blue-500/20 text-blue-400"
    default:
      return "bg-zinc-500/20 text-zinc-400"
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "stable":
      return "Stable"
    case "testing":
      return "Testing"
    case "development":
      return "Development"
    default:
      return "Unknown"
  }
}