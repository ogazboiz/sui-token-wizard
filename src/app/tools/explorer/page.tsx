"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Home, Search, ExternalLink, Wallet, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { useToast } from "@/components/ui/use-toast"
import Navbar from "@/components/navbar"

export default function ExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const account = useCurrentAccount()
  const { toast } = useToast()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const explorerUrl = `https://suiexplorer.com/object/${searchQuery.trim()}`
      window.open(explorerUrl, "_blank")
    }
  }

  const handleWalletExplore = () => {
    if (account?.address) {
      const explorerUrl = `https://suiexplorer.com/address/${account.address}`
      window.open(explorerUrl, "_blank")
    }
  }

  const copyAddress = async () => {
    if (account?.address) {
      try {
        await navigator.clipboard.writeText(account.address)
        toast({
          title: "Copied!",
          description: "Wallet address copied to clipboard",
        })
      } catch (err) {
        console.error("Failed to copy:", err)
      }
    }
  }

  const quickLinks = [
    {
      title: "Latest Transactions",
      description: "View recent transactions on the Sui network",
      url: "https://suivision.xyz/transactionss",
    },
    {
      title: "Top Packages",
      description: "Explore the most active packages",
      url: "https://suivision.xyz/packages",
    }
  ]

  return (
    <div className="min-h-screen bg-zinc-950">
           <Navbar/>
      <div className="container mx-auto px-4 py-8">
      
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-zinc-400 mb-8">
          <Link href="/" className="hover:text-white flex items-center">
            <Home className="w-4 h-4 mr-1" />
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-zinc-300">Tools</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-white">Explorer</span>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <Search className="w-10 h-10 mr-3 text-teal-500" />
              Sui Explorer
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Explore transactions, objects, and addresses on the Sui blockchain
            </p>
          </motion.div>

          {/* Search Section */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-center">Search the Blockchain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter transaction hash, object ID, or address..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 h-12"
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-6 h-12"
                    disabled={!searchQuery.trim()}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Wallet Section */}
          {account && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Wallet className="w-5 h-5 mr-2 text-purple-500" />
                    Your Connected Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-4">
                    <div className="flex-1">
                      <div className="text-sm text-zinc-400 mb-1">Address</div>
                      <div className="text-white font-mono text-sm">
                        {account.address.substring(0, 20)}...{account.address.substring(account.address.length - 10)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyAddress}
                        className="border-zinc-700 text-zinc-400 hover:text-white"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button onClick={handleWalletExplore} className="bg-purple-500 hover:bg-purple-600 text-white">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View in Explorer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Quick Links</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {quickLinks.map((link, index) => (
                <Card key={index} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{link.title}</h3>
                    <p className="text-zinc-400 mb-4 text-sm">{link.description}</p>
                    <Button
                      variant="outline"
                      className="w-full border-zinc-700 text-zinc-300 hover:text-white"
                      onClick={() => window.open(link.url, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in Explorer
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Information Section */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">About Sui Explorer</CardTitle>
              </CardHeader>
              <CardContent className="text-zinc-300">
                <p className="mb-4">
                  The Sui Explorer is the official blockchain explorer for the Sui network. It provides comprehensive
                  information about transactions, objects, addresses, and network statistics.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-white mb-2">What you can explore:</h4>
                    <ul className="space-y-1 text-zinc-400">
                      <li>• Transaction details and history</li>
                      <li>• Object information and metadata</li>
                      <li>• Address balances and activity</li>
                      <li>• Smart contract interactions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Network information:</h4>
                    <ul className="space-y-1 text-zinc-400">
                      <li>• Real-time network statistics</li>
                      <li>• Validator performance metrics</li>
                      <li>• Gas price trends</li>
                      <li>• Network health indicators</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
