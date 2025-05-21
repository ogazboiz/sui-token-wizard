"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ChevronRight, Home, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ClipLoader } from "react-spinners"
import { useCurrentAccount } from "@mysten/dapp-kit"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

interface TokenPageProps {
  network: string
}

export default function TokenPage({ network }: TokenPageProps) {
  const { toast } = useToast()
  const account = useCurrentAccount()

  // Token data state
  const [tokenData, setTokenData] = useState<{
    name: string
    symbol: string
    description: string
    decimal: string
    newPkgId: string
    txId: string
    treasuryCap: string
    type?: string
    features?: {
      burnable?: boolean
      mintable?: boolean
      pausable?: boolean
      denylist?: boolean
    }
  } | null>(null)

  const [tokenLoaded, setTokenLoaded] = useState(false)

  useEffect(() => {
    // Check localStorage for token data when component mounts
    const savedTokenData = localStorage.getItem('tokenData')
    if (savedTokenData) {
      const parsedData = JSON.parse(savedTokenData)
      setTokenData(parsedData)
      setTokenLoaded(true)
    }
  }, [])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Value copied to clipboard",
      })
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  // Render loading state if token data isn't loaded yet
  if (!tokenLoaded) {
    return (
      <div className="flex justify-center items-center py-20">
        <ClipLoader size={40} color="#14b8a6" />
        <span className="ml-4 text-zinc-300">Loading token data...</span>
      </div>
    )
  }

  // Render no token found message if no token data is available
  if (tokenLoaded && !tokenData) {
    return (
      <Alert className="bg-zinc-900 border-zinc-800 max-w-xl mx-auto">
        <Terminal className="h-4 w-4 text-teal-500" />
        <AlertTitle className="text-white">No Token Found</AlertTitle>
        <AlertDescription className="text-zinc-400">
          You haven't created any tokens yet or token data was lost. Please create a new token.
          <div className="mt-4">
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => window.location.href = `/generator/${network}`}
            >
              Create a Token
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  // Render token details
  return (
    <motion.div
      className="grid gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Token Info Card */}
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold flex items-center">
            <span
              className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent"
            >
              {tokenData?.name} ({tokenData?.symbol})
            </span>
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {tokenData?.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InfoCard
              label="Package ID"
              value={tokenData?.newPkgId || ""}
              isCopyable
              explorer={`https://suiscan.xyz/${network}/object/${tokenData?.newPkgId}`}
            />
            <InfoCard
              label="Treasury Cap"
              value={tokenData?.treasuryCap || ""}
              isCopyable
              explorer={`https://suiscan.xyz/${network}/object/${tokenData?.treasuryCap}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoCard
              label="Decimals"
              value={tokenData?.decimal || "9"}
            />
            <InfoCard
              label="Transaction"
              value={tokenData?.txId || ""}
              isCopyable
              explorer={`https://suiscan.xyz/${network}/tx/${tokenData?.txId}`}
            />
          </div>

          {tokenData?.type === "regulated" && (
            <div className="mt-4 border-t border-zinc-800 pt-4">
              <h3 className="text-sm font-medium mb-3">Token Features</h3>
              <div className="grid grid-cols-2 gap-3">
                <FeatureItem
                  name="Mintable"
                  enabled={tokenData.features?.mintable || false}
                />
                <FeatureItem
                  name="Burnable"
                  enabled={tokenData.features?.burnable || false}
                />
                <FeatureItem
                  name="Pausable"
                  enabled={tokenData.features?.pausable || false}
                />
                <FeatureItem
                  name="Denylist"
                  enabled={tokenData.features?.denylist || false}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Token Management Card */}
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="text-xl">Token Management</CardTitle>
          <CardDescription className="text-zinc-400">
            Manage your {tokenData?.name} token with the following operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <ActionCard
              title="Mint Tokens"
              description="Create new tokens and send them to any address"
              icon={<Coins className="h-8 w-8 text-yellow-400" />}
              buttonText="Mint Tokens"
              buttonVariant="default"
              href={`/generator/${network}/mint`}
            />

            <ActionCard
              title="Burn Tokens"
              description="Burn tokens to reduce the total supply"
              icon={<Flame className="h-8 w-8 text-orange-400" />}
              buttonText="Burn Tokens"
              buttonVariant="custom"
              href={`/generator/${network}/burn`}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface InfoCardProps {
  label: string;
  value: string;
  isCopyable?: boolean;
  explorer?: string;
}

function InfoCard({ label, value, isCopyable = false, explorer }: InfoCardProps) {
  const truncatedValue = value.length > 15
    ? `${value.substring(0, 8)}...${value.substring(value.length - 6)}`
    : value;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-zinc-800 rounded-lg p-3">
      <div className="text-xs text-zinc-400 mb-1">{label}</div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium truncate max-w-[150px]">
          {truncatedValue}
        </div>
        <div className="flex items-center">
          {isCopyable && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-zinc-500 hover:text-white"
              onClick={copyToClipboard}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          )}
          {explorer && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-zinc-500 hover:text-white"
              onClick={() => window.open(explorer, '_blank')}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface FeatureItemProps {
  name: string;
  enabled: boolean;
}

function FeatureItem({ name, enabled }: FeatureItemProps) {
  return (
    <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-2.5">
      <span className="text-sm">{name}</span>
      <span className={`text-xs font-medium ${enabled ? 'text-green-500' : 'text-zinc-500'}`}>
        {enabled ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  );
}

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  buttonVariant: "default" | "destructive" | "outline" | "custom";
  href: string;
}

function ActionCard({ title, description, icon, buttonText, buttonVariant, href }: ActionCardProps) {
  return (
    <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 hover:border-zinc-600 transition-colors">
      <div className="flex items-start mb-3">
        <div className="mr-3">{icon}</div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-xs text-zinc-400">{description}</p>
        </div>
      </div>
      <Button
        variant={buttonVariant === "custom" ? "default" : buttonVariant}
        size="sm"
        className={`w-full ${buttonVariant === "custom"
          ? "bg-red-700 hover:bg-red-800 text-white"
          : ""
          }`}
        onClick={() => window.location.href = href}
      >
        {buttonText}
      </Button>
    </div>
  );
}

function Coins(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  )
}

function Flame(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  )
}