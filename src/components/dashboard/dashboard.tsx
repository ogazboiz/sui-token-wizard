"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Coins, ImageIcon, ExternalLink, Copy, MoreHorizontal, PlusCircle, ArrowUpRight, Terminal, Loader2, Flame, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { useCurrentAccount, useSuiClient, ConnectButton } from "@mysten/dapp-kit"
import { getMetadataField, useGetAllCoins, useGetAllNftsByOwner } from "../hooks/getData"
import { ClipLoader } from "react-spinners"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import Link from "next/link"
import { useWalletConnection } from "@/components/hooks/useWalletConnection"

// Interface for token and NFT data
interface Token {
  id: string
  name: string
  symbol: string
  decimals: number
  description: string
  network: string
  supply: string
  address: string
  createdAt: string
  type: string
  status: string
  // Minimal identifiers for hybrid approach
  coinType: string
  packageId: string
}

interface NFTCollection {
  id: string;
  name: string;
  symbol: string;
  network: string;
  supply: string;
  minted: string;
  address: string;
  owner: string | {
    AddressOwner: string;
  } | {
    ObjectOwner: string;
  } | {
    Shared: {
      initial_shared_version: string;
    };
  };
  createdAt: string;
  image: string;
  status: string;
  // Minimal identifiers for hybrid approach
  objectId: string;
  type?: string;
}

// Hybrid storage manager
class TokenStorageManager {
  private static ACTIVE_TOKEN_KEY = 'activeTokenId'
  private static ACTIVE_NFT_KEY = 'activeNftId' 
  private static TOKEN_TYPE_KEY = 'activeTokenType'

  static setActiveToken(tokenAddress: string, tokenType: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ACTIVE_TOKEN_KEY, tokenAddress)
      localStorage.setItem(this.TOKEN_TYPE_KEY, tokenType)
    }
  }

  static setActiveNFT(nftId: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ACTIVE_NFT_KEY, nftId)
    }
  }

  static getActiveToken(): { address: string; type: string } | null {
    if (typeof window !== 'undefined') {
      const address = localStorage.getItem(this.ACTIVE_TOKEN_KEY)
      const type = localStorage.getItem(this.TOKEN_TYPE_KEY)
      return address && type ? { address, type } : null
    }
    return null
  }

  static getActiveNFT(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.ACTIVE_NFT_KEY)
    }
    return null
  }

  static clearActive() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ACTIVE_TOKEN_KEY)
      localStorage.removeItem(this.ACTIVE_NFT_KEY)
      localStorage.removeItem(this.TOKEN_TYPE_KEY)
    }
  }

  static clearOnWalletDisconnect() {
    // Clear active selections when wallet disconnects
    this.clearActive()
  }
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
  const { isConnected, isReady } = useWalletConnection()

  const allNfts = useGetAllNftsByOwner(account?.address || "");
  const { data: coinData, isLoading: coinsLoading } = useGetAllCoins(account?.address || "")

  // Clear active selections when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      TokenStorageManager.clearOnWalletDisconnect()
    }
  }, [isConnected])

  // Function to determine token type based on coinType
  const determineTokenType = (coinType: string): string => {
    if (coinType.includes("p_regulated_coin") || coinType.includes("regulated")) {
      return "regulated"
    } else if (coinType.includes("closed_loop") || coinType.includes("closedloop")) {
      return "closed-loop"
    } else if (coinType.includes("my_coin") || coinType.includes("standard")) {
      return "standard"
    }
    return "standard" // default
  }

  // Function to determine token features based on type
  const getTokenFeatures = (type: string) => {
    switch (type) {
      case "regulated":
        return {
          burnable: true,
          mintable: true,
          pausable: true,
          denylist: true,
          allowlist: false,
          transferRestrictions: false
        }
      case "closed-loop":
        return {
          burnable: true,
          mintable: true,
          pausable: false,
          denylist: false,
          allowlist: true,
          transferRestrictions: true
        }
      case "standard":
      default:
        return {
          burnable: false,
          mintable: false,
          pausable: false,
          denylist: false,
          allowlist: false,
          transferRestrictions: false
        }
    }
  }

  // Function to navigate to token manager with minimal token data
  const navigateToTokenManager = (token: Token) => {
    // Store only minimal identifier and type
    TokenStorageManager.setActiveToken(token.address, token.type)
    
    // Navigate to token manager - it will fetch fresh data
    router.push(`/generator/${network}?tokenId=${encodeURIComponent(token.address)}&type=${token.type}`)
  }

  // Function to navigate to mint page with minimal token data
  const navigateToMint = (token: Token) => {
    // Store only minimal identifier and type
    TokenStorageManager.setActiveToken(token.address, token.type)
    
    // Navigate directly to mint page - it will fetch fresh data
    router.push(`/generator/${network}/mint?tokenId=${encodeURIComponent(token.address)}&type=${token.type}`)
  }

  // Function to navigate to NFT manager with minimal NFT data
  const navigateToNFTManager = (nft: NFTCollection) => {
    // Store only minimal identifier
    TokenStorageManager.setActiveNFT(nft.objectId)
    
    // Navigate to NFT manager/mint page - it will fetch fresh data
    router.push(`/nft/mint/${nft.address}?nftId=${encodeURIComponent(nft.objectId)}`)
  }

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        setIsLoading(true)

        if (coinData?.data) {
          // Filter tokens
          const filteredTokens = await Promise.all(
            coinData.data
              .filter((token) =>
                token.coinType.includes("p_regulated_coin") ||
                token.coinType.includes("u_regulated_coin") ||
                token.coinType.includes("my_coin") ||
                token.coinType.includes("regulated") ||
                token.coinType.includes("closed_loop") ||
                token.coinType.includes("standard")
              )
              .map(async (token, index) => {
                try {
                  const tokenMetadata = await getMetadataField(suiClient, token.coinType);
                  const tokenType = determineTokenType(token.coinType);
                  
                  return {
                    id: `token-${index}`,
                    name: tokenMetadata?.name || "Unknown Token",
                    symbol: tokenMetadata?.symbol || "UNK",
                    network,
                    supply: token.balance || "0",
                    decimals: tokenMetadata?.decimals || 0,
                    description: tokenMetadata?.description || "No description",
                    address: token.coinType,
                    createdAt: new Date().toISOString().split("T")[0],
                    type: tokenType,
                    status: "active",
                    // Hybrid approach: store minimal identifiers
                    coinType: token.coinType,
                    packageId: token.coinType.split("::")[0]
                  };
                } catch (error) {
                  console.error("Error:", error);
                  return null;
                }
              })
          );

          // Filter NFTs
          const filteredNfts = allNfts.data?.map((token, index) => {
            // @ts-expect-error: Sui object content fields are not typed in the SDK
            const fields = token.data?.content?.fields || {};
            const owner = token.data?.owner;

            // Ensure owner matches the expected type
            let typedOwner: NFTCollection['owner'];
            if (typeof owner === 'string' ||
              'AddressOwner' in (owner || {}) ||
              'ObjectOwner' in (owner || {}) ||
              'Shared' in (owner || {})) {
              typedOwner = owner as NFTCollection['owner'];
            } else {
              typedOwner = "";
            }

            return {
              id: `nft-${index}`,
              name: fields.name || "Unknown NFT",
              symbol: fields.symbol || "NFT",
              network,
              supply: fields.supply?.toString() || "10000",
              minted: fields.minted?.toString() || "0",
              address: token.data?.objectId || "",
              owner: typedOwner,
              createdAt: new Date().toISOString().split("T")[0],
              image: fields.url || "https://via.placeholder.com/150",
              status: "active",
              // Hybrid approach: store minimal identifiers
              objectId: token.data?.objectId || "",
              type: "nft"
            };
          });

          // @ts-expect-error: type interface ish
          setTokens(filteredTokens.filter(Boolean))
          setNftCollections(filteredNfts || [])
        }
      } catch (err) {
        setError("Failed to load token data")
        console.error("Error fetching token data:", err)
      } finally {
        setIsLoading(false)
      }
    }
    
    // Only fetch data if wallet is connected
    if (account?.address && coinData && isConnected) {
      fetchTokenData()
    } else if (isConnected) {
      setIsLoading(false)
    }
  }, [account?.address, coinData, network, allNfts.data, suiClient, isConnected])

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast({
      title: "Address copied",
      description: "The address has been copied to your clipboard.",
    })
  }

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

  const getTokenTypeBadge = (type: string) => {
    switch (type) {
      case "regulated":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "closed-loop":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "standard":
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    }
  }

  const getTokenTypeLabel = (type: string) => {
    switch (type) {
      case "regulated":
        return "Regulated"
      case "closed-loop":
        return "Closed-Loop"
      case "standard":
      default:
        return "Standard"
    }
  }

  // Show loading state while checking wallet connection
  if (!isReady) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        <span className="ml-4 text-zinc-300">Checking wallet connection...</span>
      </div>
    )
  }

  // Show wallet connection prompt if not connected
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-8">
            <Wallet className="h-16 w-16 text-zinc-700 mx-auto mb-6" />
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Connect Your Wallet</h1>
            <p className="text-zinc-400 mb-8">
              You need to connect your wallet to view your dashboard and manage your tokens and NFT collections.
            </p>
            <Alert className="bg-zinc-800 border-zinc-700 mb-6">
              <Terminal className="h-4 w-4 text-teal-500" />
              <AlertTitle className="text-white">Wallet Required</AlertTitle>
              <AlertDescription className="text-zinc-400">
                Connect your wallet to access your personal dashboard with all your tokens and NFT collections.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ConnectButton
                connectText="Connect Wallet"
                className="bg-teal-500 cursor-pointer hover:bg-teal-600 text-white px-8 py-3"
              />
              <Button
                variant="outline"
                className="border-zinc-700 text-zinc-300 cursor-pointer hover:text-white px-8 py-3"
                onClick={() => router.push("/")}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state for token data
  if (isLoading || coinsLoading) {
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
              className="bg-teal-500 cursor-pointer hover:bg-teal-600 text-white"
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
          <p className="text-zinc-500 mt-1 text-sm">
            Connected: {account?.address.slice(0, 6)}...{account?.address.slice(-4)}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-300 cursor-pointer hover:text-white"
            onClick={() => router.push("/generate")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Token
          </Button>
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-300 cursor-pointer hover:text-white"
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
                className="flex-1 h-full  data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:shadow-none rounded-none"
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
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Network
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Supply
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Decimals
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Description
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
                            <div className="w-8 h-8 rounded-full bg-teal-500 capitalize flex items-center justify-center text-white font-bold mr-3">
                              {token.symbol.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white capitalize">{token.name}</div>
                              <div className="text-xs text-zinc-400 capitalize">{token.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className={getTokenTypeBadge(token.type)}>
                            {getTokenTypeLabel(token.type)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className={getNetworkBadgeColor(token.network)}>
                            {token.network}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{token.supply}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{token.decimals}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300 capitalize">{token.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-zinc-400 font-mono">
                              {token.address.slice(0, 6)}...{token.address.slice(-4)}
                            </span>
                            <button
                              className="ml-2 text-zinc-500 cursor-pointer hover:text-zinc-300"
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
                              <Button variant="ghost" size="icon" className="text-zinc-400 cursor-pointer hover:text-white">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700">
                              <DropdownMenuItem
                                className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700 cursor-pointer"
                                onClick={() => navigateToTokenManager(token)}
                              >
                                <Settings size={14} className="mr-2" /> Manage Token
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700 cursor-pointer"
                                onClick={() => navigateToMint(token)}
                              >
                                <Coins size={14} className="mr-2" /> Mint Tokens
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700 cursor-pointer"
                              >
                                <Link href={`https://suiscan.xyz/testnet/object/${token.address.split("::")[0]}`} target="_blank" rel="noopener noreferrer" className="flex">
                                  <ExternalLink size={14} className="mr-2" /> View on Explorer
                                </Link>
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
                <Button onClick={() => router.push("/generate")} className="bg-teal-500 cursor-pointer hover:bg-teal-600 text-white">
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
                    <div className="h-40 bg-zinc-700 relative cursor-pointer" onClick={() => navigateToNFTManager(collection)}>
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
                      <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-medium">Click to Manage</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-white capitalize">{collection.name}</h3>
                          <p className="text-sm text-zinc-400 capitalize">{collection.symbol}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-zinc-400 cursor-pointer hover:text-white h-8 w-8">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700">
                            <DropdownMenuItem
                              className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700 cursor-pointer"
                              onClick={() => navigateToNFTManager(collection)}
                            >
                              <Settings size={14} className="mr-2" /> Manage NFT
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700 cursor-pointer"
                              onClick={() => router.push(`/nft/mint/${collection.address}`)}
                            >
                              <ImageIcon size={14} className="mr-2" /> Mint NFT
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700 cursor-pointer"
                              onClick={() => router.push(`/explorer/${collection.address}`)}
                            >
                              <ExternalLink size={14} className="mr-2" /> View on Explorer
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
                          <span className="font-mono text-zinc-300">
                            {collection.address.slice(0, 6)}...{collection.address.slice(-4)}
                          </span>
                          <button
                            className="ml-1 text-zinc-500 cursor-pointer hover:text-zinc-300"
                            onClick={() => handleCopyAddress(collection.address)}
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                        <span>{collection.createdAt}</span>
                      </div>

                      <Button
                        onClick={() => navigateToNFTManager(collection)}
                        variant="outline"
                        className="w-full mt-4 border-zinc-700 text-zinc-300 hover:text-white cursor-pointer"
                      >
                        Manage Collection <ArrowUpRight className="ml-2 h-3 w-3" />
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
                  className="bg-purple-500 hover:bg-purple-600 cursor-pointer text-white"
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