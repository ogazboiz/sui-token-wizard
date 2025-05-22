"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Coins, ImageIcon, ExternalLink, Copy, MoreHorizontal, PlusCircle, ArrowUpRight, Terminal } from "lucide-react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit"
import { useGetAllCoins, useGetOwnedObjects, useGetPackageMetadata } from "../hooks/getData"
import { ClipLoader } from "react-spinners"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { useNetworkVariable } from "../utils/networkConfig"

// Interface for token and NFT data
interface Token {
  id: string
  name: string
  symbol: string
  network: string
  supply: string
  address: string
  createdAt: string
  type: string
  status: string
}

interface NFTCollection {
  id: string
  name: string
  symbol: string
  network: string
  supply: string
  minted: string
  address: string
  createdAt: string
  image: string
  status: string
}

export default function Dashboard({ network }: { network: string }) {
  const [activeTab, setActiveTab] = useState("tokens")
  const [tokens, setTokens] = useState<Token[]>([])
  const [nftCollections, setNftCollections] = useState<NFTCollection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const suiClient = useSuiClient()
  const router = useRouter()
  const { toast } = useToast()
  const account = useCurrentAccount()
  const nftPackageId = useNetworkVariable("nftPackageId");
  console.log("nftPackageId:", nftPackageId);

  const { data: ownedObjects, isLoading: objectsLoading } = useGetOwnedObjects(account?.address || "")
  const { data: coinData, isLoading: coinsLoading } = useGetAllCoins(account?.address || "")

  // Fetch package metadata for a specific package
  const { data: packageMetadata } = useGetPackageMetadata(
    '0x44ef4a0335278b6435a88c1557a8afa9523f1e53a47e616725fb81e047563e7d::my_coin::MY_COIN'
  )
  console.log("Package metadata:", packageMetadata);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        setIsLoading(true)

        if (coinData?.data) {
          // Filter tokens
          const filteredTokens = coinData.data.filter((token) =>
            token.coinType.includes("p_regulated_coin") ||
            token.coinType.includes("u_regulated_coin") ||
            token.coinType.includes("my_coin")
          ).map((token, index) => ({
            id: `token-${index}`,
            name: token.coinType.split("::")[1] || "Unknown Token",
            symbol: token.coinType.split("::")[2] || "UNK",
            network,
            supply: token.balance || "0",
            address: token.coinType,
            createdAt: new Date().toISOString().split("T")[0],
            type: "fungible",
            status: "active",
          }))

          // Filter NFTs
          const filteredNfts = coinData.data.filter((token) =>
            token.coinType.includes("nft_coin")
          ).map((token, index) => ({
            id: `nft-${index}`,
            name: token.coinType.split("::")[1] || "Unknown NFT",
            symbol: token.coinType.split("::")[2] || "NFT",
            network,
            supply: "10000", // Update with actual supply if available
            minted: "0", // Update with actual minted count if available
            address: token.coinType,
            createdAt: new Date().toISOString().split("T")[0],
            image: "/placeholder.svg?height=100&width=100",
            status: "active",
          }))

          setTokens(filteredTokens)
          setNftCollections(filteredNfts)
        }
      } catch (err) {
        setError("Failed to load token data")
        console.error("Error fetching token data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (account?.address && coinData) {
      fetchTokenData()

    }
  }, [account?.address, coinData, network])

  // const nft = useFetchCounterNft(account?.address, '0xd2bfa388fa7ba1ee3cf9f15de83f9bf8323f821bc11e1c4163defdabe43352c3')
  // console.log(nft);
  // const handleCopyAddress = (address: string) => {
  //   navigator.clipboard.writeText(address)
  //   toast({
  //     title: "Address copied",
  //     description: "The address has been copied to your clipboard.",
  //   })
  // }

  const getNetworkBadgeColor = (network: string) => {
    switch (network.toLowerCase()) {
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

  if (isLoading || objectsLoading || coinsLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <ClipLoader size={40} color="#14b8a6" />
        <span className="ml-4 text-zinc-300">Loading token data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="bg-zinc-900 border-zinc-800 max-w-xl mx-auto">
        <Terminal className="h-4 w-4 text-teal-500" />
        <AlertTitle className="text-white">Error</AlertTitle>
        <AlertDescription className="text-zinc-400">
          {error}. Please try again or contact support.
          <div className="mt-4">
            <Button
              className="bg-teal-500 hover:bg-teal-600 text-white"
              onClick={() => router.push(`/generator/${network}`)}
            >
              Create a Token
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            {tokens.length > 0 ? (
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
                    {tokens.map((token) => (
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
                            <span className="text-sm text-zinc-400 font-mono">
                              {token.address.slice(0, 6)}...{token.address.slice(-4)}
                            </span>
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
                              <DropdownMenuItem
                                className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700 cursor-pointer"
                                onClick={() => router.push(`/explorer/${token.address}`)}
                              >
                                <ExternalLink size={14} className="mr-2" /> View on Explorer
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700 cursor-pointer"
                                onClick={() => router.push(`/mint/${token.address}`)}
                              >
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
                  You haven&apos;t created any tokens yet. Create your first token to get started.
                </p>
                <Button onClick={() => router.push("/generate")} className="bg-teal-500 hover:bg-teal-600 text-white">
                  Create Token
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="nfts" className="p-0">
            {nftCollections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {nftCollections.map((collection) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700"
                  >
                    <div className="h-40 bg-zinc-700 relative">
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        width={400}
                        height={160}
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
                            <DropdownMenuItem
                              className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700 cursor-pointer"
                              onClick={() => router.push(`/explorer/${collection.address}`)}
                            >
                              <ExternalLink size={14} className="mr-2" /> View on Explorer
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700 cursor-pointer"
                              onClick={() => router.push(`/nft/mint/${collection.address}`)}
                            >
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
                            {collection.address.slice(0, 6)}...{collection.address.slice(-4)}
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

                      <Button
                        variant="outline"
                        className="w-full mt-4 border-zinc-700 text-zinc-300 hover:text-white"
                        onClick={() => router.push(`/collection/${collection.address}`)}
                      >
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
                  You haven&apos;t created any NFT collections yet. Create your first collection to get started.
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