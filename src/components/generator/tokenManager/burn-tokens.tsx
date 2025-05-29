"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ClipLoader } from "react-spinners"
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit"
import { Transaction } from '@mysten/sui/transactions'
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
import { deriveCoinType } from "@/components/hooks/getData"
import { TokenPageProps } from "./TokenPage"

export default function BurnTokens({ network, tokenData, isLoading }: TokenPageProps) {
  const { toast } = useToast()
  const suiClient = useSuiClient()
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction()

  let derivedCoinType: string | undefined;

  if (tokenData) {
    deriveCoinType(suiClient, tokenData).then((result) => {
      derivedCoinType = result;
      console.log("Derived coin type:", result);
    });
  }

  // Burn state
  const [treasuryCap, setTreasuryCap] = useState(tokenData?.treasuryCap)
  const [burnCoin, setBurnCoin] = useState(tokenData?.coinCap)
  const [burnSuccess, setBurnSuccess] = useState(false)

  // todo: to get coinCap from token data
  // useEffect(() => {
  //   const coinCap = localStorage.getItem('coinCap')
  //   if (coinCap) {
  //     setBurnCoin(coinCap)
  //   }
  // }, [])

  console.log(tokenData)

  // Handle burn token function
  const handleBurn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenData) return

    console.log("Burning with values:", {
      treasuryCap: tokenData.treasuryCap,
      coinCap: burnCoin,
    })

    const tx = new Transaction()
    tx.setGasBudget(100_000_000)

    // Call the burn function on the Coin contract
    tx.moveCall({
      target: `${derivedCoinType}::burn`,
      arguments: [
        tx.object(tokenData.treasuryCap),
        tx.object(burnCoin || ""),
      ],
    })

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          const res = await suiClient.waitForTransaction({
            digest,
            options: { showEffects: true }
          })

          if (res.effects?.status.status === "success") {
            console.log("Burn successful:", res)
            toast({
              title: "Success",
              description: `Successfully burned ${tokenData.symbol} tokens`,
            })
            setBurnSuccess(true)
            setBurnCoin('')
            setTimeout(() => setBurnSuccess(false), 3000)
          }
        },
        onError: (err) => {
          console.error("Burn transaction failed:", err)
          toast({
            title: "Transaction Failed",
            description: "Failed to burn tokens. Please try again.",
            variant: "destructive",
          })
        }
      }
    )
  }

  // Render loading state if token data isn't loaded yet
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <ClipLoader size={40} color="#14b8a6" />
        <span className="ml-4 text-zinc-300">Loading token data...</span>
      </div>
    )
  }

  // Render no token found message if no token data is available
  if (!isLoading && !tokenData) {
    return (
      <Alert className="bg-zinc-900 border-zinc-800 max-w-xl mx-auto">
        <Terminal className="h-4 w-4 text-teal-500" />
        <AlertTitle className="text-white">No Token Found</AlertTitle>
        <AlertDescription className="text-zinc-400">
          You haven&apos;t created any tokens yet or token data was lost. Please create a new token.
          <div className="mt-4">
            <Button
              className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white"
              onClick={() => window.location.href = `/generator/${network}`}
            >
              Create a Token
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Flame className="mr-2 h-5 w-5 text-orange-400" />
            Burn {tokenData?.symbol} Tokens
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Burn tokens to reduce the total supply of tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-zinc-800 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-zinc-400 text-sm">Token:</span>
              <span className="text-white font-medium capitalize">{tokenData?.name} ({tokenData?.symbol})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-sm">Treasury Cap:</span>
              <div className="flex items-center">
                <span className="text-white truncate max-w-[200px]">
                  {tokenData?.treasuryCap.substring(0, 6)}...{tokenData?.treasuryCap.substring(tokenData.treasuryCap.length - 4)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-1 cursor-pointer"
                  onClick={() => window.open(`https://suiscan.xyz/${network}/object/${tokenData?.treasuryCap}`, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 text-zinc-400" />
                </Button>
              </div>
            </div>
          </div>

          <form onSubmit={handleBurn} className="space-y-5">
            <div>
              <label className="text-zinc-300 text-sm block mb-1">Treasury Cap</label>
              <Input
                placeholder="Enter treasury cap"
                value={treasuryCap}
                onChange={(e) => setTreasuryCap(e.target.value)}
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
              <p className="text-zinc-500 text-xs mt-1">
                Enter the treasury cap of your coin.
              </p>
            </div>

            <div>
              <label className="text-zinc-300 text-sm block mb-1">Coin ID</label>
              <Input
                placeholder="Enter coin ID to burn (optional)"
                value={burnCoin}
                onChange={(e) => setBurnCoin(e.target.value)}
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
              <p className="text-zinc-500 text-xs mt-1">
                Optionally specify a coin ID to burn. Leave empty to burn from your wallet balance.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer bg-red-600 hover:bg-red-700 text-white"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Burning...
                </>
              ) : "Burn Tokens"}
            </Button>

            {burnSuccess && (
              <div className="text-green-500 text-sm text-center py-2 px-4 bg-green-900/20 border border-green-900 rounded-md">
                Tokens burned successfully!
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-zinc-800 pt-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700 cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={() => window.location.href = `/generator/${network}/token`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Token Page
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700 cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-800"
            onClick={() => window.open(`https://suiscan.xyz/${network}/object/${tokenData?.pkgId}`, '_blank')}
          >
            View on Explorer
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
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