"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Coins, ImageIcon, ExternalLink, Copy, MoreHorizontal, PlusCircle, ArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

// Mock data for tokens
const mockTokens = [
  {
    id: "token-1",
    name: "Sui Example Token",
    symbol: "SET",
    network: "mainnet",
    supply: "1,000,000",
    address: "0x1a2b3c4d5e6f...",
    createdAt: "2025-05-10",
    type: "fungible",
    status: "active",
  },
  {
    id: "token-2",
    name: "Test Token",
    symbol: "TST",
    network: "testnet",
    supply: "500,000",
    address: "0x6f5e4d3c2b1a...",
    createdAt: "2025-05-08",
    type: "fungible",
    status: "active",
  },
]

// Mock data for NFT collections
const mockNftCollections = [
  {
    id: "nft-1",
    name: "Sui Punks",
    symbol: "SPNK",
    network: "mainnet",
    supply: "10,000",
    minted: "2,345",
    address: "0x7a8b9c0d1e2f...",
    createdAt: "2025-05-12",
    image: "/placeholder.svg?height=100&width=100",
    status: "active",
  },
  {
    id: "nft-2",
    name: "Sui Avatars",
    symbol: "SAVT",
    network: "testnet",
    supply: "5,000",
    minted: "1,200",
    address: "0x3f2e1d0c9b8a...",
    createdAt: "2025-05-05",
    image: "/placeholder.svg?height=100&width=100",
    status: "active",
  },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("tokens")
  const router = useRouter()
  const { toast } = useToast()

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast({
      title: "Address copied",
      description: "The address has been copied to your clipboard.",
    })
  }

  const getNetworkBadgeColor = (network: string) => {
    switch (network) {
      case "mainnet":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "testnet":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "devnet":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">My Dashboard</h1>
          <p className="text-zinc-400 mt-1">Manage your tokens and NFT collections</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:text-white"
            onClick={() => router.push("/generate")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Token
          </Button>
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:text-white"
            onClick={() => router.push("/nft/generate")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create NFT
          </Button>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <Tabs defaultValue="tokens" onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-zinc-800">
            <TabsList className="flex h-14 bg-transparent border-b border-zinc-800">
              <TabsTrigger
                value="tokens"
                className="flex-1 h-full data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:shadow-none rounded-none"
              >
                <Coins className="mr-2 h-4 w-4" />
                Tokens
              </TabsTrigger>
              <TabsTrigger
                value="nfts"
                className="flex-1 h-full data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:shadow-none rounded-none"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                NFT Collections
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="tokens" className="p-0">
            {mockTokens.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Token
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Network
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Supply
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {mockTokens.map((token) => (
                      <motion.tr
                        key={token.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-zinc-800/50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold mr-3">
                              {token.symbol.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{token.name}</div>
                              <div className="text-xs text-zinc-400">{token.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className={getNetworkBadgeColor(token.network)}>
                            {token.network}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{token.supply}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-zinc-400 font-mono">{token.address}</span>
                            <button
                              className="ml-2 text-zinc-500 hover:text-zinc-300"
                              onClick={() => handleCopyAddress(token.address)}
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">{token.createdAt}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700">
                              <DropdownMenuItem className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700 cursor-pointer">
                                <ExternalLink size={14} className="mr-2" /> View on Explorer
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700 cursor-pointer">
                                <Coins size={14} className="mr-2" /> Mint Tokens
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <Wallet className="h-16 w-16 text-zinc-700 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No tokens yet</h3>
                <p className="text-zinc-400 text-center max-w-md mb-6">
                  You haven't created any tokens yet. Create your first token to get started.
                </p>
                <Button onClick={() => router.push("/generate")} className="bg-teal-500 hover:bg-teal-600 text-white">
                  Create Token
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="nfts" className="p-0">
            {mockNftCollections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {mockNftCollections.map((collection) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700"
                  >
                    <div className="h-40 bg-zinc-700 relative">
                      <img
                        src={collection.image || "/placeholder.svg"}
                        alt={collection.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant="outline" className={getNetworkBadgeColor(collection.network)}>
                          {collection.network}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-white">{collection.name}</h3>
                          <p className="text-sm text-zinc-400">{collection.symbol}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white h-8 w-8">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700">
                            <DropdownMenuItem className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700 cursor-pointer">
                              <ExternalLink size={14} className="mr-2" /> View on Explorer
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700 cursor-pointer">
                              <ImageIcon size={14} className="mr-2" /> Mint NFT
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-zinc-900 rounded-lg p-2">
                          <p className="text-xs text-zinc-500">Supply</p>
                          <p className="text-sm font-medium text-white">{collection.supply}</p>
                        </div>
                        <div className="bg-zinc-900 rounded-lg p-2">
                          <p className="text-xs text-zinc-500">Minted</p>
                          <p className="text-sm font-medium text-white">{collection.minted}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <div className="flex items-center">
                          <span className="font-mono">
                            {collection.address.substring(0, 6)}...
                            {collection.address.substring(collection.address.length - 4)}
                          </span>
                          <button
                            className="ml-1 text-zinc-500 hover:text-zinc-300"
                            onClick={() => handleCopyAddress(collection.address)}
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                        <span>{collection.createdAt}</span>
                      </div>

                      <Button variant="outline" className="w-full mt-4 border-zinc-700 text-zinc-300 hover:text-white">
                        View Collection <ArrowUpRight className="ml-2 h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <ImageIcon className="h-16 w-16 text-zinc-700 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No NFT collections yet</h3>
                <p className="text-zinc-400 text-center max-w-md mb-6">
                  You haven't created any NFT collections yet. Create your first collection to get started.
                </p>
                <Button
                  onClick={() => router.push("/nft/generate")}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  Create NFT Collection
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
