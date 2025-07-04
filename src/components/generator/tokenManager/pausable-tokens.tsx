"use client"

import { motion } from "framer-motion"
import { ArrowLeft, ExternalLink, Loader2, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import {
  Badge
} from "@/components/ui/badge"
// import { useNetworkVariables } from "@/components/utils/networkConfig"
import { useState } from "react"
import { deriveCoinType } from "@/components/hooks/getData"
import { TokenPageProps } from "./TokenPage"

export default function PausableTokens({ network, tokenData, isLoading }: TokenPageProps) {
  const { toast } = useToast()
  const suiClient = useSuiClient()
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction()
  // const { coinPackageId } = useNetworkVariables();

  let derivedCoinType: string | undefined;

  if (tokenData) {
    deriveCoinType(suiClient, tokenData).then((result) => {
      derivedCoinType = result;
      console.log("Derived coin type:", result);
    });
  }

  // Pausable state
  const [isPaused, setIsPaused] = useState(false)
  const [pauseSuccess, setPauseSuccess] = useState(false)
  const [unpauseSuccess, setUnpauseSuccess] = useState(false)

  // Helper function to safely truncate strings
  const truncateString = (str: string | undefined, start = 6, end = 4) => {
    if (!str || typeof str !== 'string' || str.length <= start + end) {
      return str || ''
    }
    return `${str.substring(0, start)}...${str.substring(str.length - end)}`
  }

  // Handle pause token function
  const handlePauseToken = async () => {
    if (!tokenData?.denyCap) {
      toast({
        title: "Error",
        description: "Missing deny cap. Cannot pause token.",
        variant: "destructive",
      })
      return
    }

    console.log("Pausing token:", {
      treasuryCap: tokenData.treasuryCap,
    })

    const tx = new Transaction()
    tx.setGasBudget(100_000_000)

    // Call the global_pause function on the regulated_coin contract
    tx.moveCall({
      target: `${derivedCoinType}::global_pause`,
      arguments: [
        tx.object('0x403'),
        tx.object(tokenData.denyCap),
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
            console.log("Pause successful:", res)
            toast({
              title: "Success",
              description: `Successfully paused ${tokenData.symbol} token transfers`,
            })
            setIsPaused(true)
            setPauseSuccess(true)
            setTimeout(() => setPauseSuccess(false), 3000)
          }
        },
        onError: (err) => {
          console.error("Pause transaction failed:", err)
          toast({
            title: "Transaction Failed",
            description: "Failed to pause token transfers. Please try again.",
            variant: "destructive",
          })
        }
      }
    )
  }

  // Handle unpause token function
  const handleUnpauseToken = async () => {
    if (!tokenData?.denyCap) {
      toast({
        title: "Error",
        description: "Missing deny cap. Cannot unpause token.",
        variant: "destructive",
      })
      return
    }

    console.log("Unpausing token:", {
      treasuryCap: tokenData.treasuryCap,
    })

    const tx = new Transaction()
    tx.setGasBudget(100_000_000)

    // Call the global_unpause function on the regulated_coin contract
    tx.moveCall({
      target: `${derivedCoinType}::global_unpause`,
      arguments: [
        tx.object('0x403'),
        tx.object(tokenData.denyCap),
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
            console.log("Unpause successful:", res)
            toast({
              title: "Success",
              description: `Successfully unpaused ${tokenData.symbol} token transfers`,
            })
            setIsPaused(false)
            setUnpauseSuccess(true)
            setTimeout(() => setUnpauseSuccess(false), 3000)
          }
        },
        onError: (err) => {
          console.error("Unpause transaction failed:", err)
          toast({
            title: "Transaction Failed",
            description: "Failed to unpause token transfers. Please try again.",
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

  // Check if token doesn't have pausable feature
  if (tokenData && (!tokenData.features || !tokenData.features.pausable)) {
    return (
      <Alert className="bg-zinc-900 border-zinc-800 max-w-xl mx-auto">
        <Terminal className="h-4 w-4 text-teal-500" />
        <AlertTitle className="text-white">Feature Not Available</AlertTitle>
        <AlertDescription className="text-zinc-400">
          The pausable feature is not available for this token. This feature is only available for regulated coins with the pausable feature enabled.
          <div className="mt-4">
            <Button
              className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white"
              onClick={() => window.location.href = `/generator/${network}/token`}
            >
              Back to Token Page
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
            <Pause className="mr-2 h-5 w-5 text-blue-400" />
            Pause/Unpause {tokenData?.symbol} Token
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Control token transfers in case of emergency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-zinc-800 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-zinc-400 text-sm">Token:</span>
              <span className="text-white font-medium">{tokenData?.name} ({tokenData?.symbol})</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-zinc-400 text-sm">Treasury Cap:</span>
              <div className="flex items-center">
                <span className="text-white truncate max-w-[200px]">
                  {truncateString(tokenData?.treasuryCap)}
                </span>
                {tokenData?.treasuryCap && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-1 cursor-pointer"
                    onClick={() => window.open(`https://suiscan.xyz/${network}/object/${tokenData?.treasuryCap}`, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 text-zinc-400" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-zinc-400 text-sm">Deny Cap:</span>
              <div className="flex items-center">
                <span className="text-white truncate max-w-[200px]">
                  {truncateString(tokenData?.denyCap)}
                </span>
                {tokenData?.denyCap && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-1 cursor-pointer"
                    onClick={() => window.open(`https://suiscan.xyz/${network}/object/${tokenData?.denyCap}`, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 text-zinc-400" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-sm">Status:</span>
              <Badge variant="outline" className={isPaused ? "bg-red-900/30 text-red-400 border-red-800" : "bg-green-900/30 text-green-400 border-green-800"}>
                {isPaused ? "Paused" : "Active"}
              </Badge>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div className="bg-zinc-800 rounded-lg p-5 border border-zinc-700">
              <h3 className="text-white font-medium mb-4">Token Transfer Status</h3>

              <div className="text-zinc-300 text-sm mb-6">
                {isPaused ? (
                  <div className="flex items-start">
                    <Pause className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                    <p>
                      This token is currently <strong className="text-red-400">paused</strong>. All token transfers are disabled. Only the token owner can unpause the token to re-enable transfers.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start">
                    <Play className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <p>
                      This token is currently <strong className="text-green-400">active</strong>. Token transfers are enabled and working normally. The token owner can pause the token in case of emergency.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {isPaused ? (
                  <Button
                    className="w-full bg-green-600 cursor-pointer hover:bg-green-700 text-white"
                    disabled={isPending}
                    onClick={handleUnpauseToken}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Unpausing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Unpause Token Transfers
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-red-600 cursor-pointer hover:bg-red-700 text-white"
                    disabled={isPending}
                    onClick={handlePauseToken}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Pausing...
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause Token Transfers
                      </>
                    )}
                  </Button>
                )}

                {pauseSuccess && (
                  <div className="text-yellow-500 text-sm text-center py-2 px-4 bg-yellow-900/20 border border-yellow-900 rounded-md">
                    Token transfers have been paused successfully!
                  </div>
                )}

                {unpauseSuccess && (
                  <div className="text-green-500 text-sm text-center py-2 px-4 bg-green-900/20 border border-green-900 rounded-md">
                    Token transfers have been unpaused successfully!
                  </div>
                )}
              </div>
            </div>

            <div className="bg-zinc-800 rounded-lg p-5 border border-zinc-700">
              <h3 className="text-white font-medium mb-2">Important Information</h3>
              <ul className="text-zinc-300 text-sm list-disc pl-5 space-y-2">
                <li>
                  When a token is paused, all transfers are disabled except for the token owner.
                </li>
                <li>
                  The pause functionality should be used only in emergency situations such as security breaches or critical issues.
                </li>
                <li>
                  Only the token owner (controller of the Treasury Cap) can pause and unpause the token.
                </li>
                <li>
                  Pausing the token does not affect existing balances, only the ability to transfer them.
                </li>
              </ul>
            </div>
          </div>
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
            onClick={() => tokenData?.pkgId && window.open(`https://suiscan.xyz/${network}/object/${tokenData?.pkgId}`, '_blank')}
          >
            View on Explorer
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}