"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Home, Sparkles, Plus, Users, Shield, Coins, Flame, FileText, Loader2, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import ContractTemplates from "@/components/contract-templates"
import { ConnectButton } from "@mysten/dapp-kit"
import { useWalletConnection } from "@/components/hooks/useWalletConnection"
import { useRouter, usePathname } from "next/navigation"
import TokenPage from "./tokenManager/TokenPage"
import MintTokens from "./tokenManager/mint-tokens"
import BurnTokens from "./tokenManager/burn-tokens"
import DenylistTokens from "./tokenManager/denylist-tokens"
import PausableTokens from "./tokenManager/pausable-tokens"

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
}

export default function TokenManager({ network }: TokenManagerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeTool, setActiveTool] = useState("token-creator")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const { isConnected, isReady } = useWalletConnection()
  const [hasCreatedToken, setHasCreatedToken] = useState(false)

  // Check if the user has already created a token
  useEffect(() => {
    if (typeof window !== "undefined") {
      const tokenData = localStorage.getItem('tokenData')
      setHasCreatedToken(!!tokenData)
    }
  }, [])

  // Define tools with updated active states
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
      id: "liquidity-pool",
      name: "Create Liquidity Pool",
      icon: <Plus className="w-5 h-5" />,
      isNew: true,
      comingSoon: true,
    },
    {
      id: "multisender",
      name: "Multisender",
      icon: <Users className="w-5 h-5" />,
      comingSoon: true,
    },
    {
      id: "denylist",
      name: "Denylist",
      icon: <Shield className="w-5 h-5" />,
      isActive: activeTool === "denylist",
      isNew: hasCreatedToken,
      comingSoon: !hasCreatedToken,
      route: `/generator/${network}/denylist`,
    },
    {
      id: "pausable",
      name: "Pausable",
      icon: <Pause className="w-5 h-5" />,
      isActive: activeTool === "pausable",
      isNew: hasCreatedToken,
      comingSoon: !hasCreatedToken,
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
  ]

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check URL to determine active tool
      if (pathname.includes('/token')) {
        setActiveTool('token-page')
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
        const params = new URLSearchParams(window.location.search)
        const template = params.get("template")
        if (template && ["standard", "regulated"].includes(template)) {
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
        <span className="text-white">
          {activeTool === "token-page" ? "Token Page" : 
           activeTool === "mint-tokens" ? "Mint Tokens" :
           activeTool === "burn-tokens" ? "Burn Tokens" :
           activeTool === "denylist" ? "Denylist" :
           activeTool === "pausable" ? "Pausable" : "Token Creator"}
        </span>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-800">
            <h2 className="font-medium text-white flex items-center">
              List of tools <span className="ml-1 text-orange-400">🔥</span>
            </h2>
          </div>
          <div className="p-2">
            {tools.map((tool) => (
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
                    <span className="ml-2 text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded font-medium">New</span>
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