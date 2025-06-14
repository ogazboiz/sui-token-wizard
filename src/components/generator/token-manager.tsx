"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Home, Sparkles, Plus, Users, Shield, Coins, Flame, FileText, Loader2, Pause, ScrollText, Droplets, LayoutDashboard, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import ContractTemplates from "@/components/contract-templates"
import { ConnectButton, useCurrentAccount, useSuiClient } from "@mysten/dapp-kit"
import { useWalletConnection } from "@/components/hooks/useWalletConnection"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import TokenPage from "./tokenManager/TokenPage"
import MintTokens from "./tokenManager/mint-tokens"
import BurnTokens from "./tokenManager/burn-tokens"
import DenylistTokens from "./tokenManager/denylist-tokens"
import PausableTokens from "./tokenManager/pausable-tokens"
import PolicyTokens from "./tokenManager/policy-tokens"
import ActionRequests from "./tokenManager/new-request"
import { detectTokenTypeFromPackageId } from "../utils/helpers"
import { TokenData, useFetchTokenData } from "../hooks/tokenData"

interface TokenManagerProps {
  network: "mainnet" | "testnet" | "devnet"
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

export default function TokenManager({ network = "testnet" }: TokenManagerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const packageId = searchParams?.get('packageId')
  const suiClient = useSuiClient()
  const account = useCurrentAccount()

  const [activeTool, setActiveTool] = useState("token-creator")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const { isConnected, isReady } = useWalletConnection()
  const [hasCreatedToken, setHasCreatedToken] = useState(false)
  const [tokenData, setTokenData] = useState<TokenData | undefined>(undefined)
  const [tokenType, setTokenType] = useState<'standard' | 'regulated' | 'closed-loop' | null>(null)

  // Intelligent cleanup - only clear when actually leaving token management
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Only clear if not staying in generator routes
      const currentPath = window.location.pathname
      if (!currentPath.includes('/generator/')) {
        localStorage.removeItem('tokenPolicy')
        localStorage.removeItem('actionRequests')
        console.log('Cleaned up localStorage on page unload')
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      
      // Only clean up if we're actually leaving the token management area
      const newPath = window.location.pathname
      if (!newPath.includes('/generator/')) {
        localStorage.removeItem('tokenPolicy')
        localStorage.removeItem('actionRequests')
        console.log('Cleaned up localStorage on component unmount')
      }
    }
  }, [])

  // Smart package switching - only clear when switching to different token
  const prevPackageIdRef = useRef<string | null>(null)
  
  useEffect(() => {
    if (prevPackageIdRef.current && prevPackageIdRef.current !== packageId && packageId) {
      console.log('Package ID changed from', prevPackageIdRef.current, 'to', packageId)
      
      // Clear previous session data when switching to different token
      localStorage.removeItem('tokenPolicy')
      localStorage.removeItem('actionRequests')
      console.log('Cleaned up localStorage on token switch')
    }
    prevPackageIdRef.current = packageId
  }, [packageId])

  // Check if the user has a token and detect its type
  useEffect(() => {
    const loadTokenData = async () => {
      console.log('Loading token data, packageId:', packageId)
      console.log('Current pathname:', pathname)

      if (packageId) {
        const detectedType = await detectTokenTypeFromPackageId(suiClient, packageId)
        console.log('Detected token type:', detectedType)

        if (detectedType) {
          setTokenType(detectedType)
          setHasCreatedToken(true)
        } else {
          setHasCreatedToken(true)
          setTokenType('standard')
        }
      }
    }

    loadTokenData()
  }, [packageId, pathname, suiClient])

  //can also get isError here
  const { data, isLoading, refetch } = useFetchTokenData(suiClient, packageId ?? "", account?.address ?? "", tokenType ?? undefined)
  useEffect(() => {
    setTokenData(data);
  }, [data]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const toolMap: { [key: string]: string } = {
      '/mint': 'mint-tokens',
      '/burn': 'burn-tokens',
      '/denylist': 'denylist',
      '/pausable': 'pausable',
      '/policy': 'policy',
      '/action-requests': 'action-requests',
      '/token': 'token-page',
    };

    const matchedTool = Object.entries(toolMap).find(([key]) => pathname.includes(key));
    if (matchedTool) {
      setActiveTool(matchedTool[1]);
    } else {
      setActiveTool('token-creator');
      // Set template from URL if on token-creator
      const params = new URLSearchParams(window.location.search);
      const template = params.get("template");
      if (template && ["standard", "regulated", "closed-loop"].includes(template)) {
        setSelectedTemplate(template);
      }
    }
  }, [pathname]);

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
      isNew: hasCreatedToken && tokenType === "closed-loop",
      comingSoon: !hasCreatedToken || tokenType !== "closed-loop",
      route: `/generator/${network}/action-requests${packageId ? `?packageId=${packageId}` : ''}`,
      showOnlyForClosedLoop: true,
      // Removed requiresPolicy - Action Requests always shows for closed-loop tokens
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

  // Filter tools based on token type - SIMPLIFIED LOGIC
  const filteredTools = tools.filter(tool => {
    if (tool.id === "token-creator") return true

    if (tool.comingSoon && !tool.showOnlyForClosedLoop && !tool.showOnlyForRegulated) return true

    if (!tokenType) {
      return !tool.showOnlyForClosedLoop && !tool.showOnlyForRegulated
    }

    switch (tokenType) {
      case "closed-loop":
        return !tool.showOnlyForRegulated

      case "regulated":
        return !tool.showOnlyForClosedLoop

      case "standard":
        return !tool.showOnlyForClosedLoop && !tool.showOnlyForRegulated

      default:
        return !tool.showOnlyForClosedLoop && !tool.showOnlyForRegulated
    }
  })

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

  if (!isReady) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen">
        {/* Sticky Breadcrumb */}
        <div className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center text-sm text-zinc-400">
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
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6">
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
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Sticky Breadcrumb */}
      <div className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-zinc-400">
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
        </div>
      </div>

      <div className="container mx-auto px-4 pt-6">
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          {/* Centered Sidebar */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:flex ">
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden flex flex-col w-full mb-6">
              {/* Dashboard/Back Button Section */}
              <div className="p-3 border-b border-zinc-800 bg-zinc-800/30 flex-shrink-0">
                <Link 
                  href="/dashboard" 
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-all duration-200 group"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="font-medium">My Dashboard</span>
                  <ArrowLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>

              {/* Tools Header */}
              <div className="p-4 border-b border-zinc-800 flex-shrink-0">
                <h2 className="font-medium text-white flex items-center flex-wrap">
                  Tools{tokenType && (
                    <span className={`ml-2 text-xs px-2 py-1 rounded ${tokenType === 'closed-loop' ? 'bg-emerald-500/20 text-emerald-400' :
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
                  <p className="text-xs text-zinc-500 mt-1 break-all">
                    Package: {packageId.slice(0, 8)}...{packageId.slice(-6)}
                  </p>
                )}
              </div>

              {/* Scrollable Tools List */}
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="p-2 space-y-1">
                  {filteredTools.map((tool) => (
                    <button
                      key={tool.id}
                      className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between transition-all duration-200 ${
                        tool.isActive 
                          ? "bg-teal-500/20 text-teal-400 border border-teal-500/30" 
                          : tool.comingSoon && (tool.id === 'liquidity-pool' || tool.id === 'multisender')
                            ? "text-zinc-600 cursor-not-allowed" 
                            : tool.comingSoon
                              ? "text-zinc-500 cursor-not-allowed opacity-70"
                              : "text-zinc-400 hover:text-white hover:bg-zinc-800/50 cursor-pointer"
                      }`}
                      disabled={tool.comingSoon}
                      onClick={() => !tool.comingSoon && handleToolSelect(tool.id, tool.route)}
                    >
                      <div className="flex items-center min-w-0 flex-1">
                        <div className={`w-6 h-6 mr-3 flex items-center justify-center flex-shrink-0 ${
                          tool.comingSoon && (tool.id === 'liquidity-pool' || tool.id === 'multisender') ? 'opacity-50' : ''
                        }`}>
                          {tool.icon}
                        </div>
                        <span className={`font-medium truncate ${
                          tool.comingSoon && (tool.id === 'liquidity-pool' || tool.id === 'multisender') ? 'opacity-70' : ''
                        }`}>
                          {tool.name}
                        </span>
                        <div className="flex items-center ml-2 flex-shrink-0">
                          {tool.isNew && (
                            <span className="text-xs bg-teal-500/20 text-teal-400 px-1.5 py-0.5 rounded font-medium">
                              New
                            </span>
                          )}
                          {tool.comingSoon && (tool.id === 'liquidity-pool' || tool.id === 'multisender') && (
                            <span className="text-xs bg-zinc-700/50 text-zinc-500 px-1.5 py-0.5 rounded font-medium border border-zinc-700/30">
                              Soon
                            </span>
                          )}
                        </div>
                      </div>
                      {!tool.comingSoon && <ChevronRight className="w-4 h-4 opacity-50 ml-2 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-zinc-800 flex-shrink-0">
                <Button 
                  variant="outline" 
                  className="w-full text-zinc-400 border-zinc-700 hover:text-white hover:border-zinc-600 transition-colors text-sm"
                >
                  Need other tools? Contact us
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="min-w-0 pb-4">
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
            <TokenPage network={network} tokenData={tokenData} isLoading={isLoading} refetch={refetch} />
          )}
          {activeTool === "policy" && (
            <PolicyTokens network={network} tokenData={tokenData} />
          )}
          {activeTool === "action-requests" && (
            <ActionRequests network={network} tokenData={tokenData} />
          )}
          {activeTool === "mint-tokens" && (
            <MintTokens network={network} tokenData={tokenData} isLoading={isLoading} refetch={refetch} />
          )}
          {activeTool === "burn-tokens" && (
            <BurnTokens network={network} tokenData={tokenData} isLoading={isLoading} refetch={refetch} />
          )}
          {activeTool === "denylist" && (
            <DenylistTokens network={network} tokenData={tokenData} isLoading={isLoading} refetch={refetch} />
          )}
          {activeTool === "pausable" && (
            <PausableTokens network={network} tokenData={tokenData} isLoading={isLoading} refetch={refetch} />
          )}
        </div>
      </div>
    </div>
    </div>
  )
}