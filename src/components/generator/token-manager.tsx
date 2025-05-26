"use client"
import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Home, Sparkles, Plus, Users, Shield, Coins, Flame, FileText, Loader2, Pause, ScrollText, Droplets } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import ContractTemplates from "@/components/contract-templates"
import { ConnectButton } from "@mysten/dapp-kit"
import { useWalletConnection } from "@/components/hooks/useWalletConnection"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit"
import { getMetadataField } from "@/components/hooks/getData"
import TokenPage from "./tokenManager/TokenPage"
import MintTokens from "./tokenManager/mint-tokens"
import BurnTokens from "./tokenManager/burn-tokens"
import DenylistTokens from "./tokenManager/denylist-tokens"
import PausableTokens from "./tokenManager/pausable-tokens"
import PolicyTokens from "./tokenManager/policy-tokens"
import ActionRequests from "./tokenManager/new-request"

interface TokenManagerProps {
  network: string
}

interface Tool {
  id: string
  name: string
  icon: React.ReactNode
  isNew?: boolean
  isActive?: boolean
  comingSoon?: boolean
  route?: string
  showOnlyForClosedLoop?: boolean
  requiresPolicy?: boolean
}

interface TokenData {
  name: string
  symbol: string
  description: string
  decimal: string
  newPkgId: string
  txId: string
  owner: string
  treasuryCap: string
  metadata: string
  denyCap?: string
  type?: string
  features?: {
    burnable?: boolean
    mintable?: boolean
    pausable?: boolean
    denylist?: boolean
    allowlist?: boolean
    transferRestrictions?: boolean
  }
}

// Hybrid storage manager (same as Dashboard)
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

  static getActiveToken(): { address: string; type: string } | null {
    if (typeof window !== 'undefined') {
      const address = localStorage.getItem(this.ACTIVE_TOKEN_KEY)
      const type = localStorage.getItem(this.TOKEN_TYPE_KEY)
      return address && type ? { address, type } : null
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
}

// Fresh data fetcher
class TokenDataFetcher {
  static async fetchTokenData(suiClient: any, tokenAddress: string, accountAddress: string): Promise<TokenData | null> {
    try {
      // Fetch fresh metadata from blockchain
      const metadata = await getMetadataField(suiClient, tokenAddress)
      
      if (!metadata) {
        throw new Error("Could not fetch token metadata")
      }

      // Extract package ID from token address
      const packageId = tokenAddress.split("::")[0]
      
      // Determine token type from address pattern
      const tokenType = TokenDataFetcher.determineTokenType(tokenAddress)
      
      // Get token features based on type
      const features = TokenDataFetcher.getTokenFeatures(tokenType)

      return {
        name: metadata.name || "Unknown Token",
        symbol: metadata.symbol || "UNK",
        description: metadata.description || "No description",
        decimal: metadata.decimals?.toString() || "9",
        newPkgId: packageId,
        txId: "", // Would need transaction history to get this
        owner: accountAddress,
        treasuryCap:  "", // Would need to fetch from contract state
        metadata: metadata.id || "",
        denyCap: "",
        type: tokenType,
        features
      }
    } catch (error) {
      console.error("Error fetching fresh token data:", error)
      return null
    }
  }

  static determineTokenType(coinType: string): string {
    if (coinType.includes("p_regulated_coin") || coinType.includes("regulated")) {
      return "regulated"
    } else if (coinType.includes("closed_loop") || coinType.includes("closedloop")) {
      return "closed-loop"
    } else if (coinType.includes("my_coin") || coinType.includes("standard")) {
      return "standard"
    }
    return "standard"
  }

  static getTokenFeatures(type: string) {
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
}

export default function TokenManager({ network }: TokenManagerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const suiClient = useSuiClient()
  const account = useCurrentAccount()
  
  const [activeTool, setActiveTool] = useState("token-creator")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const { isConnected, isReady } = useWalletConnection()
  const [hasCreatedToken, setHasCreatedToken] = useState(false)
  const [isClosedLoopToken, setIsClosedLoopToken] = useState(false)
  const [hasPolicyCreated, setHasPolicyCreated] = useState(false)
  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [isRegulatedToken, setIsRegulatedToken] = useState(false)
  const [isManagingExistingToken, setIsManagingExistingToken] = useState(false)
  const [isLoadingTokenData, setIsLoadingTokenData] = useState(false)
  
  // Add network validation at the beginning
  if (!network || typeof network !== 'string') {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-red-400">
          Error: Invalid network parameter
        </div>
      </div>
    )
  }

  // Function to fetch fresh token data
  const fetchFreshTokenData = useCallback(async (tokenAddress: string) => {
    if (!account?.address || !suiClient) {
      console.warn("Account or SuiClient not available")
      return
    }

    setIsLoadingTokenData(true)
    try {
      const freshData = await TokenDataFetcher.fetchTokenData(
        suiClient, 
        tokenAddress, 
        account.address
      )
      
      if (freshData) {
        setTokenData(freshData)
        setHasCreatedToken(true)
        setIsClosedLoopToken(freshData.type === "closed-loop")
        setIsRegulatedToken(freshData.type === "regulated")
        setIsManagingExistingToken(true)
        
        // Store fresh data in legacy format for compatibility with existing components
        localStorage.setItem('tokenData', JSON.stringify(freshData))
        
        // Check if policy exists for closed-loop tokens
        if (freshData.type === "closed-loop") {
          const policyData = localStorage.getItem('tokenPolicy')
          setHasPolicyCreated(!!policyData)
        }
      }
    } catch (error) {
      console.error("Failed to fetch fresh token data:", error)
    } finally {
      setIsLoadingTokenData(false)
    }
  }, [suiClient, account?.address])

  // Check for active token on mount and URL changes
  useEffect(() => {
    const checkForActiveToken = async () => {
      // Check URL params first (highest priority)
      const urlTokenId = searchParams.get('tokenId')
      const urlTokenType = searchParams.get('type')
      
      if (urlTokenId && urlTokenType) {
        // Store in localStorage and fetch fresh data
        TokenStorageManager.setActiveToken(urlTokenId, urlTokenType)
        await fetchFreshTokenData(urlTokenId)
        return
      }
      
      // Check localStorage for active token
      const activeToken = TokenStorageManager.getActiveToken()
      if (activeToken && account?.address) {
        await fetchFreshTokenData(activeToken.address)
        return
      }
      
      // No active token, check legacy localStorage for compatibility
      const legacyTokenData = localStorage.getItem('tokenData')
      if (legacyTokenData) {
        try {
          const parsedData = JSON.parse(legacyTokenData)
          setTokenData(parsedData)
          setHasCreatedToken(true)
          setIsClosedLoopToken(parsedData.type === "closed-loop")
          setIsRegulatedToken(parsedData.type === "regulated")
          setIsManagingExistingToken(true)
        } catch (error) {
          console.error("Error parsing legacy token data:", error)
        }
      }
    }

    if (isConnected && account?.address) {
      checkForActiveToken()
    }
  }, [isConnected, account?.address, searchParams, fetchFreshTokenData])

  // Clear data when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      TokenStorageManager.clearActive()
      localStorage.removeItem('tokenData') // Also clear legacy data
      setTokenData(null)
      setHasCreatedToken(false)
      setIsClosedLoopToken(false)
      setIsRegulatedToken(false)
      setIsManagingExistingToken(false)
      setHasPolicyCreated(false)
    }
  }, [isConnected])

  // Function to clear active token and return to creator
  const clearActiveToken = useCallback(() => {
    TokenStorageManager.clearActive()
    localStorage.removeItem('tokenData') // Also clear legacy data
    setTokenData(null)
    setHasCreatedToken(false)
    setIsClosedLoopToken(false)
    setIsRegulatedToken(false)
    setIsManagingExistingToken(false)
    setHasPolicyCreated(false)
    setActiveTool("token-creator")
    setSelectedTemplate(null)
    router.push(`/generator/${network}`)
  }, [network, router])

  // Define tools with updated active states based on token type
  const tools: Tool[] = [
    {
      id: "token-creator",
      name: "Token Creator",
      icon: <Sparkles className="w-5 h-5" />,
      isActive: activeTool === "token-creator",
      route: `/generator/${network}`,
    },
    {
      id: "token-page",
      name: "Token Page",
      icon: <FileText className="w-5 h-5" />,
      isActive: activeTool === "token-page",
      isNew: hasCreatedToken,
      comingSoon: !hasCreatedToken,
      route: `/generator/${network}/token`,
    },
    {
      id: "policy",
      name: "Token Policy",
      icon: <ScrollText className="w-5 h-5" />,
      isActive: activeTool === "policy",
      isNew: hasCreatedToken && isClosedLoopToken,
      comingSoon: !hasCreatedToken || !isClosedLoopToken,
      route: `/generator/${network}/policy`,
      showOnlyForClosedLoop: true,
    },
    {
      id: "action-requests",
      name: "Action Requests",
      icon: <Plus className="w-5 h-5" />,
      isActive: activeTool === "action-requests",
      isNew: hasCreatedToken && isClosedLoopToken && hasPolicyCreated,
      comingSoon: !hasCreatedToken || !isClosedLoopToken,
      route: `/generator/${network}/action-requests`,
      showOnlyForClosedLoop: true,
      requiresPolicy: true,
    },
    {
      id: "denylist",
      name: "Denylist",
      icon: <Shield className="w-5 h-5" />,
      isActive: activeTool === "denylist",
      isNew: hasCreatedToken && isRegulatedToken,
      comingSoon: !hasCreatedToken || !isRegulatedToken,
      route: `/generator/${network}/denylist`,
    },
    {
      id: "pausable",
      name: "Pausable",
      icon: <Pause className="w-5 h-5" />,
      isActive: activeTool === "pausable",
      isNew: hasCreatedToken && isRegulatedToken && !isClosedLoopToken,
      comingSoon: !hasCreatedToken || !isRegulatedToken || isClosedLoopToken,
      route: `/generator/${network}/pausable`,
    },
    {
      id: "mint-tokens",
      name: "Mint Tokens",
      icon: <Coins className="w-5 h-5" />,
      isActive: activeTool === "mint-tokens",
      isNew: hasCreatedToken,
      comingSoon: !hasCreatedToken,
      route: `/generator/${network}/mint`,
    },
    {
      id: "burn-tokens",
      name: "Burn Tokens",
      icon: <Flame className="w-5 h-5" />,
      isActive: activeTool === "burn-tokens",
      isNew: hasCreatedToken,
      comingSoon: !hasCreatedToken,
      route: `/generator/${network}/burn`,
    },
    {
      id: "liquidity-pool",
      name: "Create Liquidity Pool",
      icon: <Droplets className="w-5 h-5" />,
      isNew: false,
      comingSoon: true,
    },
    {
      id: "multisender",
      name: "Multisender",
      icon: <Users className="w-5 h-5" />,
      comingSoon: true,
    },
  ]

  // Filter tools based on token type
  const filteredTools = tools.filter(tool => {
    if (tool.showOnlyForClosedLoop) {
      return isClosedLoopToken
    }
    // Hide denylist and pausable for non-regulated tokens
    if ((tool.id === "denylist" || tool.id === "pausable") && !isRegulatedToken) {
      return false
    }
    // Hide pausable for closed loop tokens
    if (tool.id === "pausable" && isClosedLoopToken) {
      return false
    }
    return true
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check URL to determine active tool
      if (pathname.includes('/token')) {
        setActiveTool('token-page')
      } else if (pathname.includes('/policy')) {
        setActiveTool('policy')
      } else if (pathname.includes('/action-requests')) {
        setActiveTool('action-requests')
      } else if (pathname.includes('/mint')) {
        setActiveTool('mint-tokens')
      } else if (pathname.includes('/burn')) {
        setActiveTool('burn-tokens')
      } else if (pathname.includes('/denylist')) {
        setActiveTool('denylist')
      } else if (pathname.includes('/pausable')) {
        setActiveTool('pausable')
      } else {
        setActiveTool('token-creator')
        // Set template from URL if on token-creator
        const template = searchParams.get("template")
        if (template && ["standard", "regulated", "closed-loop"].includes(template)) {
          setSelectedTemplate(template)
        }
      }
    }
  }, [pathname, searchParams])

  const handleTemplateSelect = (templateId: string | null) => {
    setSelectedTemplate(templateId)
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      if (templateId) {
        url.searchParams.set("template", templateId)
      } else {
        url.searchParams.delete("template")
      }
      // Remove tokenId params when selecting template
      url.searchParams.delete("tokenId")
      url.searchParams.delete("type")
      window.history.replaceState(null, "", url.toString())
    }
  }

  const handleToolSelect = (toolId: string, route?: string) => {
    if (route) {
      router.push(route)
    }
    setActiveTool(toolId)
  }

  const getNetworkName = () => {
    switch (network) {
      case "mainnet":
        return "Sui Mainnet"
      case "testnet":
        return "Sui Testnet"
      case "devnet":
        return "Sui Devnet"
      default:
        return "Sui"
    }
  }

  const getActiveToolName = () => {
    switch (activeTool) {
      case "token-page":
        return "Token Page"
      case "policy":
        return "Token Policy"
      case "action-requests":
        return "Action Requests"
      case "mint-tokens":
        return "Mint Tokens"
      case "burn-tokens":
        return "Burn Tokens"
      case "denylist":
        return "Denylist"
      case "pausable":
        return "Pausable"
      default:
        return "Token Creator"
    }
  }

  const getTokenTypeEmoji = () => {
    if (!tokenData) return "🔧"
    switch (tokenData.type) {
      case "regulated":
        return "🛡️"
      case "closed-loop":
        return "🔒"
      case "standard":
      default:
        return "💎"
    }
  }

  const getTokenTypeDescription = () => {
    if (!tokenData) return "Create and manage your tokens"
    switch (tokenData.type) {
      case "regulated":
        return `Managing ${tokenData.name} (Regulated Token)`
      case "closed-loop":
        return `Managing ${tokenData.name} (Closed-Loop Token)`
      case "standard":
      default:
        return `Managing ${tokenData.name} (Standard Token)`
    }
  }

  // Show loading state while checking wallet connection
  if (!isReady) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    )
  }

  // Show loading state while fetching token data
  if (isLoadingTokenData) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        <span className="ml-4 text-zinc-300">Loading fresh token data...</span>
      </div>
    )
  }

  // Show wallet connection prompt if not connected
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center text-sm text-zinc-400 mb-6">
          <Link href="/" className="hover:text-white flex items-center">
            <Home className="w-4 h-4 mr-1" />
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href="/generate" className="hover:text-white">
            {getNetworkName()}
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-white">Token Creator</span>
        </div>
        <div className="max-w-xl mx-auto">
          <Alert className="bg-zinc-900 border-zinc-800">
            <Terminal className="h-4 w-4 text-teal-500" />
            <AlertTitle className="text-white">Wallet Not Connected</AlertTitle>
            <AlertDescription className="text-zinc-400">
              You need to connect your wallet to create or manage tokens on {getNetworkName()}.
              <div className="mt-4 flex justify-center">
                <ConnectButton
                  connectText="Connect Wallet to Continue"
                  className="bg-teal-500 hover:bg-teal-600 text-white"
                />
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center text-sm text-zinc-400 mb-6">
        <Link href="/" className="hover:text-white flex items-center">
          <Home className="w-4 h-4 mr-1" />
        </Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <Link href="/generate" className="hover:text-white">
          {getNetworkName()}
        </Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-white">{getActiveToolName()}</span>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="font-medium text-white flex items-center">
              List of tools <span className="ml-1 text-orange-400">🔥</span>
            </h2>
            {tokenData && (
              <div className="mt-2 p-2 bg-zinc-800 rounded-lg">
                <div className="flex items-center text-xs text-zinc-400">
                  <span className="mr-2">{getTokenTypeEmoji()}</span>
                  <span className="truncate">{tokenData.symbol}</span>
                </div>
                <div className="text-xs text-zinc-500 capitalize mt-1">
                  {tokenData.type || "standard"} token
                </div>
                <div className="text-xs text-teal-400 mt-1">
                  ✓ Fresh data loaded
                </div>
              </div>
            )}
          </div>
          <div className="p-2">
            {filteredTools.map((tool) => (
              <button
                key={tool.id}
                className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between ${
                  tool.isActive 
                    ? "bg-zinc-800 text-white" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                } ${tool.comingSoon ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                disabled={tool.comingSoon}
                onClick={() => !tool.comingSoon && handleToolSelect(tool.id, tool.route)}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-2 flex items-center justify-center">{tool.icon}</div>
                  <span>{tool.name}</span>
                  {tool.isNew && (
                    <span className="ml-2 text-xs bg-teal-500/20 text-teal-400 px-1.5 py-0.5 rounded font-medium">
                      New
                    </span>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </div>
          <div className="p-4 mt-4 border-t border-zinc-800">
            {isManagingExistingToken && (
              <Button 
                onClick={clearActiveToken}
                variant="outline" 
                className="w-full text-zinc-400 border-zinc-700 hover:text-white mb-3"
              >
                ← Exit Token Manager
              </Button>
            )}
            <Button variant="outline" className="w-full text-zinc-400 border-zinc-700 hover:text-white">
              Need other tools? Contact us
            </Button>
          </div>
        </div>

        <div>
          {activeTool === "token-creator" && (
            <>
              <motion.div
                className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid md:grid-cols-[240px_1fr] h-full">
                  <div className="bg-[#0f1729] p-6 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-teal-500 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {tokenData ? getTokenTypeEmoji() : "S"}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Sui Token Manager</h2>
                    <p className="text-zinc-400 text-sm mb-2">
                      {getTokenTypeDescription()}
                    </p>
                    <p className="text-zinc-500 text-xs">
                      Sui Token Manager is your all-in-one tool for creating tokens, transferring to multiple addresses,
                      managing ownership, minting, burning, and interacting with token contracts effortlessly.
                    </p>
                    {tokenData && (
                      <div className="mt-4 flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/${network}`)}
                          className="border-zinc-700 text-zinc-400 hover:text-white text-xs"
                        >
                          ← Back to Dashboard
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearActiveToken}
                          className="border-zinc-700 text-zinc-400 hover:text-white text-xs"
                        >
                          Create New Token
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
              <ContractTemplates
                network={network}
                isLandingPage={false}
                selectedTemplate={selectedTemplate}
                onTemplateSelect={handleTemplateSelect}
              />
            </>
          )}
          {activeTool === "token-page" && (
            <TokenPage network={network} />
          )}
          {activeTool === "policy" && (
            <PolicyTokens network={network} />
          )}
          {activeTool === "action-requests" && (
            <ActionRequests network={network} />
          )}
          {activeTool === "mint-tokens" && (
            <MintTokens network={network} />
          )}
          {activeTool === "burn-tokens" && (
            <BurnTokens network={network} />
          )}
          {activeTool === "denylist" && (
            <DenylistTokens network={network} />
          )}
          {activeTool === "pausable" && (
            <PausableTokens network={network} />
          )}
        </div>
      </div>
    </div>
  )
}