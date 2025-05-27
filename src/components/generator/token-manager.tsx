"use client"
import type React from "react"
import { useState, useEffect } from "react"
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
  showOnlyForRegulated?: boolean
  hideForClosedLoop?: boolean
  requiresPolicy?: boolean
}

export default function TokenManager({ network }: TokenManagerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const packageId = searchParams?.get('packageId')
  
  const [activeTool, setActiveTool] = useState("token-creator")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const { isConnected, isReady } = useWalletConnection()
  const [hasCreatedToken, setHasCreatedToken] = useState(false)
  const [tokenType, setTokenType] = useState<'standard' | 'regulated' | 'closed-loop' | null>(null)
  const [hasPolicyCreated, setHasPolicyCreated] = useState(false)

  // Helper function to detect token type from package ID
  const detectTokenTypeFromPackageId = async (pkgId: string): Promise<'standard' | 'regulated' | 'closed-loop' | null> => {
    try {
      // Method 1: Check localStorage for existing token data
      const savedTokenData = localStorage.getItem('tokenData')
      if (savedTokenData) {
        const parsedData = JSON.parse(savedTokenData)
        if (parsedData.newPkgId === pkgId || parsedData.packageId === pkgId) {
          return parsedData.type || 'standard'
        }
      }

      // Method 2: Check if there's a userTokens array in localStorage
      const userTokens = localStorage.getItem('userTokens')
      if (userTokens) {
        const tokens = JSON.parse(userTokens)
        const matchingToken = tokens.find((token: any) => 
          token.packageId === pkgId || token.newPkgId === pkgId
        )
        if (matchingToken) {
          return matchingToken.type || 'standard'
        }
      }

      // Method 3: Try to detect from package ID pattern (if you have consistent patterns)
      // This is a fallback method - you might need to adjust based on your actual package ID patterns
      
      // For now, return standard as default
      return 'standard'
    } catch (error) {
      console.error('Error detecting token type:', error)
      return 'standard' // Default fallback
    }
  }

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

  // Check if the user has a token and detect its type
  useEffect(() => {
    const loadTokenData = async () => {
      console.log('Loading token data, packageId:', packageId)
      console.log('Current pathname:', pathname)
      
      if (packageId) {
        // If packageId is provided, detect token type
        const detectedType = await detectTokenTypeFromPackageId(packageId)
        console.log('Detected token type:', detectedType)
        
        if (detectedType) {
          setTokenType(detectedType)
          setHasCreatedToken(true)
          
          // Check if policy exists for closed-loop tokens
          if (detectedType === "closed-loop") {
            const policyData = localStorage.getItem('tokenPolicy')
            setHasPolicyCreated(!!policyData)
          }
        } else {
          // If we can't detect type from packageId, still set hasCreatedToken to true
          // so the tools show up, and default to standard
          setHasCreatedToken(true)
          setTokenType('standard')
        }
      } else {
        // Fallback to localStorage check
        if (typeof window !== "undefined") {
          const tokenData = localStorage.getItem('tokenData')
          if (tokenData) {
            const parsedTokenData = JSON.parse(tokenData)
            setHasCreatedToken(true)
            setTokenType(parsedTokenData.type || 'standard')
            
            // Check if policy exists for closed-loop tokens
            if (parsedTokenData.type === "closed-loop") {
              const policyData = localStorage.getItem('tokenPolicy')
              setHasPolicyCreated(!!policyData)
            }
          }
        }
      }
    }

    loadTokenData()
  }, [packageId, pathname])

  // Define tools with updated conditional logic
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
      route: `/generator/${network}/token${packageId ? `?packageId=${packageId}` : ''}`,
    },
    // CLOSED-LOOP ONLY TOOLS
    {
      id: "policy",
      name: "Token Policy",
      icon: <ScrollText className="w-5 h-5" />,
      isActive: activeTool === "policy",
      isNew: hasCreatedToken && tokenType === "closed-loop",
      comingSoon: !hasCreatedToken || tokenType !== "closed-loop",
      route: `/generator/${network}/policy${packageId ? `?packageId=${packageId}` : ''}`,
      showOnlyForClosedLoop: true,
    },
    {
      id: "action-requests",
      name: "Action Requests",
      icon: <Plus className="w-5 h-5" />,
      isActive: activeTool === "action-requests",
      isNew: hasCreatedToken && tokenType === "closed-loop" && hasPolicyCreated,
      comingSoon: !hasCreatedToken || tokenType !== "closed-loop",
      route: `/generator/${network}/action-requests${packageId ? `?packageId=${packageId}` : ''}`,
      showOnlyForClosedLoop: true,
      requiresPolicy: true,
    },
    // REGULATED ONLY TOOLS
    {
      id: "denylist",
      name: "Denylist",
      icon: <Shield className="w-5 h-5" />,
      isActive: activeTool === "denylist",
      isNew: hasCreatedToken && tokenType === "regulated",
      comingSoon: !hasCreatedToken || tokenType !== "regulated",
      route: `/generator/${network}/denylist${packageId ? `?packageId=${packageId}` : ''}`,
      showOnlyForRegulated: true,
    },
    {
      id: "pausable",
      name: "Pausable",
      icon: <Pause className="w-5 h-5" />,
      isActive: activeTool === "pausable",
      isNew: hasCreatedToken && tokenType === "regulated",
      comingSoon: !hasCreatedToken || tokenType !== "regulated",
      route: `/generator/${network}/pausable${packageId ? `?packageId=${packageId}` : ''}`,
      showOnlyForRegulated: true,
    },
    // UNIVERSAL TOOLS (Available for all token types)
    {
      id: "mint-tokens",
      name: "Mint Tokens",
      icon: <Coins className="w-5 h-5" />,
      isActive: activeTool === "mint-tokens",
      isNew: hasCreatedToken,
      comingSoon: !hasCreatedToken,
      route: `/generator/${network}/mint${packageId ? `?packageId=${packageId}` : ''}`,
    },
    {
      id: "burn-tokens",
      name: "Burn Tokens",
      icon: <Flame className="w-5 h-5" />,
      isActive: activeTool === "burn-tokens",
      isNew: hasCreatedToken,
      comingSoon: !hasCreatedToken,
      route: `/generator/${network}/burn${packageId ? `?packageId=${packageId}` : ''}`,
    },
    // COMING SOON TOOLS
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
    // Always show token creator
    if (tool.id === "token-creator") return true
    
    // Always show coming soon tools
    if (tool.comingSoon && !tool.showOnlyForClosedLoop && !tool.showOnlyForRegulated) return true
    
    // If no token type detected yet, only show universal tools and coming soon
    if (!tokenType) {
      return !tool.showOnlyForClosedLoop && !tool.showOnlyForRegulated
    }
    
    // Filter based on token type
    switch (tokenType) {
      case "closed-loop":
        // Show: universal tools + closed-loop specific tools
        return !tool.showOnlyForRegulated
        
      case "regulated":
        // Show: universal tools + regulated specific tools
        return !tool.showOnlyForClosedLoop
        
      case "standard":
        // Show: only universal tools (no regulated or closed-loop tools)
        return !tool.showOnlyForClosedLoop && !tool.showOnlyForRegulated
        
      default:
        return !tool.showOnlyForClosedLoop && !tool.showOnlyForRegulated
    }
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check URL to determine active tool
      if (pathname.includes('/mint')) {
        setActiveTool('mint-tokens')
      } else if (pathname.includes('/burn')) {
        setActiveTool('burn-tokens')
      } else if (pathname.includes('/denylist')) {
        setActiveTool('denylist')
      } else if (pathname.includes('/pausable')) {
        setActiveTool('pausable')
      } else if (pathname.includes('/policy')) {
        setActiveTool('policy')
      } else if (pathname.includes('/action-requests')) {
        setActiveTool('action-requests')
      } else if (pathname.includes('/token')) {
        setActiveTool('token-page')
      } else {
        setActiveTool('token-creator')
        // Set template from URL if on token-creator
        const params = new URLSearchParams(window.location.search)
        const template = params.get("template")
        if (template && ["standard", "regulated", "closed-loop"].includes(template)) {
          setSelectedTemplate(template)
        }
      }
    }
  }, [pathname])

  const handleTemplateSelect = (templateId: string | null) => {
    setSelectedTemplate(templateId)
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      if (templateId) {
        url.searchParams.set("template", templateId)
      } else {
        url.searchParams.delete("template")
      }
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

  const getTokenTypeDisplay = () => {
    if (!tokenType) return ""
    
    switch (tokenType) {
      case "closed-loop":
        return " (Closed-Loop)"
      case "regulated":
        return " (Regulated)"
      case "standard":
        return " (Standard)"
      default:
        return ""
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
        <span className="text-white">{getActiveToolName()}{getTokenTypeDisplay()}</span>
      </div>
      
      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="font-medium text-white flex items-center">
              Tools{tokenType && (
                <span className={`ml-2 text-xs px-2 py-1 rounded ${
                  tokenType === 'closed-loop' ? 'bg-emerald-500/20 text-emerald-400' :
                  tokenType === 'regulated' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {tokenType === 'closed-loop' ? 'Closed-Loop' :
                   tokenType === 'regulated' ? 'Regulated' : 'Standard'}
                </span>
              )}
              <span className="ml-1 text-orange-400">🔥</span>
            </h2>
            {packageId && (
              <p className="text-xs text-zinc-500 mt-1">
                Package: {packageId.slice(0, 8)}...{packageId.slice(-6)}
              </p>
            )}
          </div>
          <div className="p-2">
            {filteredTools.map((tool) => (
              <button
                key={tool.id}
                className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between ${
                  tool.isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
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
                      <span className="text-4xl font-bold text-white">S</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Sui Token Manager</h2>
                    <p className="text-zinc-400 text-sm">
                      Sui Token Manager is your all-in-one tool for creating tokens, transferring to multiple addresses,
                      managing ownership, minting, burning, and interacting with token contracts effortlessly. Streamline
                      your Sui operations in one place!
                    </p>
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