"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  Coins,
  ImageIcon,
  ExternalLink,
  Copy,
  MoreHorizontal,
  PlusCircle,
  Loader2,
  TrendingUp,
  Eye,
  Settings,
  AlertCircle
} from "lucide-react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { useCurrentAccount, useSuiClient, ConnectButton } from "@mysten/dapp-kit"
import { getMetadataField, useGetAllCoinsAndTokensByOwner, useGetAllNftsByOwner } from "../hooks/getData"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import Link from "next/link"
import { useWalletConnection } from "@/components/hooks/useWalletConnection"
import { detectTokenType, extractPackageIdFromCoinType, extractPackageIdFromObject } from "../utils/helpers"

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
  packageId: string
  createdAt: string
  type: 'standard' | 'regulated' | 'closed-loop'
  status: string
}

interface NFTCollection {
  id: string;
  name: string;
  symbol: string;
  network: string;
  supply: string;
  minted: string;
  address: string;
  packageId: string;
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
}

// Skeleton Components
const TokenTableSkeleton = () => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-zinc-800">
          <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Token</th>
          <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Network</th>
          <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Supply</th>
          <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Type</th>
          <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Package ID</th>
          <th className="px-6 py-4 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-800">
        {[...Array(3)].map((_, i) => (
          <tr key={i} className="animate-pulse">
            <td className="px-6 py-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-zinc-700 mr-3"></div>
                <div>
                  <div className="h-4 bg-zinc-700 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-zinc-800 rounded w-16"></div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="h-6 bg-zinc-700 rounded-full w-20"></div>
            </td>
            <td className="px-6 py-4">
              <div className="h-4 bg-zinc-700 rounded w-16"></div>
            </td>
            <td className="px-6 py-4">
              <div className="h-6 bg-zinc-700 rounded-full w-24"></div>
            </td>
            <td className="px-6 py-4">
              <div className="h-4 bg-zinc-700 rounded w-32"></div>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="h-8 w-8 bg-zinc-700 rounded ml-auto"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const NFTGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 animate-pulse">
        <div className="h-40 bg-zinc-700"></div>
        <div className="p-4">
          <div className="h-6 bg-zinc-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-zinc-800 rounded w-1/2 mb-4"></div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-zinc-900 rounded-lg p-2">
              <div className="h-3 bg-zinc-800 rounded w-12 mb-1"></div>
              <div className="h-4 bg-zinc-700 rounded w-16"></div>
            </div>
            <div className="bg-zinc-900 rounded-lg p-2">
              <div className="h-3 bg-zinc-800 rounded w-12 mb-1"></div>
              <div className="h-4 bg-zinc-700 rounded w-16"></div>
            </div>
          </div>
          <div className="h-9 bg-zinc-700 rounded w-full"></div>
        </div>
      </div>
    ))}
  </div>
)

const DashboardStats = ({ tokens, nftCollections }: { tokens: Token[], nftCollections: NFTCollection[] }) => {
  const totalTokens = tokens.length
  const totalNFTs = nftCollections.length
  const totalSupply = tokens.reduce((sum, token) => sum + parseInt(token.supply || '0'), 0)
  const totalNFTMinted = nftCollections.reduce((sum, nft) => sum + parseInt(nft.minted || '0'), 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-zinc-900 rounded-xl border border-zinc-800 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm font-medium">Total Tokens</p>
            <p className="text-2xl font-bold text-white">{totalTokens}</p>
          </div>
          <div className="bg-teal-500/20 p-3 rounded-lg">
            <Coins className="h-6 w-6 text-teal-400" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-zinc-900 rounded-xl border border-zinc-800 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm font-medium">NFT Collections</p>
            <p className="text-2xl font-bold text-white">{totalNFTs}</p>
          </div>
          <div className="bg-purple-500/20 p-3 rounded-lg">
            <ImageIcon className="h-6 w-6 text-purple-400" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-zinc-900 rounded-xl border border-zinc-800 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm font-medium">Token Supply</p>
            <p className="text-2xl font-bold text-white">{totalSupply.toLocaleString()}</p>
          </div>
          <div className="bg-blue-500/20 p-3 rounded-lg">
            <TrendingUp className="h-6 w-6 text-blue-400" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-zinc-900 rounded-xl border border-zinc-800 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm font-medium">NFTs Minted</p>
            <p className="text-2xl font-bold text-white">{totalNFTMinted.toLocaleString()}</p>
          </div>
          <div className="bg-orange-500/20 p-3 rounded-lg">
            <ImageIcon className="h-6 w-6 text-orange-400" />
          </div>
        </div>
      </motion.div>
    </div>
  )
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
  const { data: coinData, isLoading: coinsLoading } = useGetAllCoinsAndTokensByOwner(account?.address || "")

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        setIsLoading(true)

        if (coinData) {
          console.log("Coin data:", coinData);
          // Filter tokens and extract package IDs
          const filteredTokens = await Promise.all(
            coinData
              .filter((token) =>
                token.coinType.includes("p_regulated_coin") ||
                token.coinType.includes("u_regulated_coin") ||
                token.coinType.includes("token") ||
                token.coinType.includes("my_coin")
              )
              .map(async (token, index) => {
                console.log("Token:", token);
                try {
                  const tokenMetadata = await getMetadataField(suiClient, token.coinType);
                  const packageId = extractPackageIdFromCoinType(token.coinType);
                  const tokenType = detectTokenType(token.coinType);

                  return {
                    id: `token-${index}`,
                    name: tokenMetadata?.name || "Unknown Token",
                    symbol: tokenMetadata?.symbol || "UNK",
                    network,
                    supply: token.balance || "0",
                    decimals: tokenMetadata?.decimals || 0,
                    description: tokenMetadata?.description || "No description",
                    address: token.coinType,
                    packageId,
                    type: tokenType,

                    status: "active",
                  };
                } catch (error) {
                  console.error("Error:", error);
                  return null;
                }
              })
          );

          // Filter NFTs and extract package IDs
          const filteredNfts = allNfts.data?.map((token, index) => {
            // @ts-expect-error: Sui object content fields are not typed in the SDK
            const fields = token.data?.content?.fields || {};
            const owner = token.data?.owner;
            const packageId = extractPackageIdFromObject(token.data?.objectId || "");

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
              packageId,
              owner: typedOwner,
              createdAt: new Date().toISOString().split("T")[0],
              image:
                !fields.url || fields.url.trim() === ""
                  ? "https://ik.imagekit.io/9okxyhdq0/Sui%20Token%20Creator.png?updatedAt=1748573953730"
                  : fields.url,
              status: "active",
            };
          });

          // @ts-expect-error: type interface ish
          setTokens(filteredTokens.filter(Boolean))
          setNftCollections(filteredNfts || [])
        }
      } catch (err) {
        setError("Failed to load dashboard data")
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

  const handleMintTokens = (token: Token) => {
    console.log("Navigating to mint with package ID:", token.packageId)
    router.push(`/generator/${network}/mint?packageId=${token.packageId}`)
  }

  const handleManageToken = (token: Token) => {
    console.log("Navigating to manage with package ID:", token.packageId)
    router.push(`/generator/${network}/token?packageId=${token.packageId}`)
  }

  const handleMintNFT = (collection: NFTCollection) => {
    console.log("Navigating to NFT mint with package ID:", collection.packageId)
    router.push(`/nft/mint/${collection.packageId}`)
  }

  const getTokenTypeBadge = (type: 'standard' | 'regulated' | 'closed-loop') => {
    switch (type) {
      case "closed-loop":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "regulated":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "standard":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
    }
  }

  const getTokenTypeLabel = (type: 'standard' | 'regulated' | 'closed-loop') => {
    switch (type) {
      case "closed-loop":
        return "Closed-Loop"
      case "regulated":
        return "Regulated"
      case "standard":
        return "Standard"
      default:
        return "Unknown"
    }
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

  // Loading state
  if (!isReady) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <span className="ml-4 text-zinc-300">Checking wallet connection...</span>
        </div>
      </div>
    )
  }

  // Not connected state
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            className="bg-zinc-900 rounded-xl border border-zinc-800 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-zinc-800 rounded-full p-6 w-fit mx-auto mb-6">
              <Wallet className="h-16 w-16 text-zinc-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Connect Your Wallet</h1>
            <p className="text-zinc-400 mb-8">
              Connect your wallet to view your dashboard and manage your tokens and NFT collections.
            </p>
            <Alert className="bg-zinc-800/50 border-zinc-700 mb-8 text-left">
              <AlertCircle className="h-4 w-4 text-teal-500" />
              <AlertTitle className="text-white">Wallet Required</AlertTitle>
              <AlertDescription className="text-zinc-400">
                Your dashboard shows all tokens and NFT collections created with your connected wallet address.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ConnectButton
                connectText="Connect Wallet"
                className="bg-teal-500 cursor-pointer hover:bg-teal-600 text-white px-8 py-3 rounded-lg font-medium"
              />
              <Button
                variant="outline"
                className="border-zinc-700 text-zinc-300 cursor-pointer hover:text-white hover:border-zinc-600 px-8 py-3"
                onClick={() => router.push("/")}
              >
                Back to Home
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert className="bg-zinc-900 border-zinc-800 max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-white">Error Loading Dashboard</AlertTitle>
          <AlertDescription className="text-zinc-400 mb-4">
            {error}. Please try refreshing the page or contact support if the issue persists.
          </AlertDescription>
          <div className="flex gap-3">
            <Button
              className="bg-teal-500 cursor-pointer hover:bg-teal-600 text-white"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
            <Button
              variant="outline"
              className="border-zinc-700 text-zinc-300 cursor-pointer hover:text-white"
              onClick={() => router.push("/generate")}
            >
              Create Token
            </Button>
          </div>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Dashboard</h1>
          <p className="text-zinc-400">Manage your tokens and NFT collections</p>
          <div className="flex items-center mt-2 gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-zinc-500 text-sm font-mono">
              {account?.address.slice(0, 8)}...{account?.address.slice(-6)}
            </p>
            <button
              className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
              onClick={() => handleCopyAddress(account?.address || "")}
            >
              <Copy size={14} />
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            className="bg-teal-500 hover:bg-teal-600 text-white cursor-pointer"
            onClick={() => router.push("/generate")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Token
          </Button>
          <Button
            className="bg-purple-500 hover:bg-purple-600 text-white cursor-pointer"
            onClick={() => router.push("/nft/generate")}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Create NFT
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {!isLoading && !coinsLoading && (
        <DashboardStats tokens={tokens} nftCollections={nftCollections} />
      )}

      {/* Main Content */}
      <motion.div
        className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Custom Tab Header */}
          <div className="p-6 pb-0">
            <div className="flex space-x-1 bg-zinc-800/50 p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab("tokens")}
                className={`flex items-center px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === "tokens"
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
                  }`}
              >
                <Coins className="mr-2 h-4 w-4" />
                Tokens ({tokens.length})
              </button>
              <button
                onClick={() => setActiveTab("nfts")}
                className={`flex items-center px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === "nfts"
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
                  }`}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                NFT Collections ({nftCollections.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <TabsContent value="tokens" className="p-0 mt-6">
            <AnimatePresence mode="wait">
              {isLoading || coinsLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TokenTableSkeleton />
                </motion.div>
              ) : tokens.length > 0 ? (
                <motion.div
                  key="tokens"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-x-auto"
                >
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
                          Balance
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                          Package ID
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {tokens.map((token, index) => (
                        <motion.tr
                          key={token.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="hover:bg-zinc-800/30 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white font-bold mr-3">
                                {token.symbol.charAt(0).toUpperCase()}
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-zinc-300 font-mono">
                              {parseInt(token.supply).toLocaleString()}
                            </div>
                            <div className="text-xs text-zinc-500">
                              {token.decimals} decimals
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline" className={getTokenTypeBadge(token.type)}>
                              {getTokenTypeLabel(token.type)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-zinc-400 font-mono">
                                {token.packageId.slice(0, 8)}...{token.packageId.slice(-6)}
                              </span>
                              <button
                                className="ml-2 text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors"
                                onClick={() => handleCopyAddress(token.packageId)}
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-zinc-400 cursor-pointer hover:text-white hover:bg-zinc-700 transition-colors">
                                  <MoreHorizontal size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700 p-0">
                                <DropdownMenuItem className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700 cursor-pointer p-3">
                                  <Link href={`https://suiscan.xyz/${network}/object/${token.packageId}`} target="_blank" rel="noopener noreferrer" className="flex items-center w-full">
                                    <ExternalLink size={14} className="mr-4" /> View on Explorer
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700 cursor-pointer p-3"
                                  onClick={() => handleMintTokens(token)}
                                >
                                  <Coins size={14} className="mr-2" /> Mint Tokens
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700 cursor-pointer p-3"
                                  onClick={() => handleManageToken(token)}
                                >
                                  <Settings size={14} className="mr-2" /> Manage Token
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-16 px-6"
                >
                  <div className="bg-zinc-800 rounded-full p-6 mb-6">
                    <Coins className="h-12 w-12 text-zinc-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No tokens yet</h3>
                  <p className="text-zinc-400 text-center max-w-md mb-8">
                    You haven&apos;t created any tokens yet. Start building your token ecosystem by creating your first token.
                  </p>
                  <Button
                    onClick={() => router.push("/generate")}
                    className="bg-teal-500 cursor-pointer hover:bg-teal-600 text-white px-8 py-3"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Token
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="nfts" className="p-0 mt-6">
            <AnimatePresence mode="wait">
              {isLoading || coinsLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <NFTGridSkeleton />
                </motion.div>
              ) : nftCollections.length > 0 ? (
                <motion.div
                  key="nfts"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6"
                >
                  {nftCollections.map((collection, index) => (
                    <motion.div
                      key={collection.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 hover:border-zinc-600 transition-all duration-300 hover:shadow-xl group"
                    >
                      <div className="h-48 bg-zinc-700 relative overflow-hidden">
                        <Image
                          src={collection.image}
                          alt={collection.name}
                          width={400}
                          height={192}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-3 right-3">
                          <Badge variant="outline" className={getNetworkBadgeColor(collection.network)}>
                            {collection.network}
                          </Badge>
                        </div>
                        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex gap-2">
                            <button
                              className="bg-black/50 backdrop-blur-sm p-2 rounded-lg text-white hover:bg-black/70 transition-colors"
                              onClick={() => handleCopyAddress(collection.packageId)}
                            >
                              <Copy size={14} />
                            </button>
                            <Link
                              href={`https://suiscan.xyz/${network}/object/${collection.packageId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-black/50 backdrop-blur-sm p-2 rounded-lg text-white hover:bg-black/70 transition-colors"
                            >
                              <ExternalLink size={14} />
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1 capitalize">{collection.name}</h3>
                            <p className="text-sm text-zinc-400 capitalize">{collection.symbol}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-zinc-400 cursor-pointer hover:text-white hover:bg-zinc-700 transition-colors h-8 w-8">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700">
                              <DropdownMenuItem className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700 cursor-pointer">
                                <Link href={`https://suiscan.xyz/${network}/object/${collection.packageId}`} target="_blank" rel="noopener noreferrer" className="flex items-center w-full">
                                  <ExternalLink size={14} className="mr-2" /> View on Explorer
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-700 cursor-pointer"
                                onClick={() => handleMintNFT(collection)}
                              >
                                <ImageIcon size={14} className="mr-2" /> Mint NFT
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-zinc-900 rounded-lg p-3">
                            <p className="text-xs text-zinc-500 mb-1">Total Supply</p>
                            <p className="text-sm font-bold text-white">{parseInt(collection.supply).toLocaleString()}</p>
                          </div>
                          <div className="bg-zinc-900 rounded-lg p-3">
                            <p className="text-xs text-zinc-500 mb-1">Minted</p>
                            <p className="text-sm font-bold text-white">{parseInt(collection.minted).toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-zinc-500 mb-4">
                          <div className="flex items-center">
                            <span className="font-mono text-zinc-400">
                              {collection.packageId.slice(0, 8)}...{collection.packageId.slice(-6)}
                            </span>
                            <button
                              className="ml-2 text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors"
                              onClick={() => handleCopyAddress(collection.packageId)}
                            >
                              <Copy size={12} />
                            </button>
                          </div>

                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors"
                            onClick={() => handleMintNFT(collection)}
                          >
                            <ImageIcon className="mr-2 h-3 w-3" />
                            Mint NFT
                          </Button>
                          <Link href={`https://suiscan.xyz/${network}/object/${collection.packageId}`} target="_blank" rel="noopener noreferrer">
                            <Button
                              variant="outline"
                              size="icon"
                              className="border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-16 px-6"
                >
                  <div className="bg-zinc-800 rounded-full p-6 mb-6">
                    <ImageIcon className="h-12 w-12 text-zinc-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No NFT collections yet</h3>
                  <p className="text-zinc-400 text-center max-w-md mb-8">
                    You haven&apos;t created any NFT collections yet. Launch your first collection and start minting unique digital assets.
                  </p>
                  <Button
                    onClick={() => router.push("/nft/generate")}
                    className="bg-purple-500 hover:bg-purple-600 cursor-pointer text-white px-8 py-3"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Collection
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}