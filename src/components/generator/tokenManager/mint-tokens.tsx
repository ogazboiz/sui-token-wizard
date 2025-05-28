"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ExternalLink, Loader2, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { ClipLoader } from "react-spinners"
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit"
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

interface MintTokensProps {
  network: string
}

export default function MintTokens({ network }: MintTokensProps) {
  const { toast } = useToast()
  const account = useCurrentAccount()
  const suiClient = useSuiClient()
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction()

  // Token data state
  const [tokenData, setTokenData] = useState<{
    name: string
    symbol: string
    description: string
    decimal: string
    newPkgId: string
    txId: string
    treasuryCap: string
  } | null>(null)

  let derivedCoinType: string | undefined;

  if (tokenData) {
    deriveCoinType(suiClient, tokenData).then((result) => {
      derivedCoinType = result;
      console.log("Derived coin type:", result);
    });
  }

  // Mint state
  const [mintAmount, setMintAmount] = useState('')
  const [mintRecipient, setMintRecipient] = useState('')
  const [mintSuccess, setMintSuccess] = useState(false)
  const [tokenLoaded, setTokenLoaded] = useState(false)
  const [coin, setCoin] = useState('')

  useEffect(() => {
    // Check localStorage for token data when component mounts
    const savedTokenData = localStorage.getItem('tokenData')
    if (savedTokenData) {
      const parsedData = JSON.parse(savedTokenData)
      setTokenData(parsedData)
      // Pre-fill recipient with user's address
      if (account) {
        setMintRecipient(account.address)
      }
      setTokenLoaded(true)
    }
  }, [account])

  // Handle mint token function
  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenData) return

    console.log("Minting with values:", {
      treasuryCap: tokenData.treasuryCap,
      amount: mintAmount,
      recipient: mintRecipient
    })

    const tx = new Transaction()
    tx.setGasBudget(100_000_000)

    // Call the mint function on the Coin contract
    tx.moveCall({
      target: `${derivedCoinType}::mint`,
      arguments: [
        tx.object(tokenData.treasuryCap),
        tx.pure.u64(Number(mintAmount)),
        tx.pure.address(mintRecipient),
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
            console.log("Mint successful:", res)

            const coin = res.effects.created?.[0]?.reference?.objectId;
            console.log("Coin ID:", coin)

            toast({
              title: "Success",
              description: `Successfully minted ${mintAmount} ${tokenData.symbol} tokens to ${mintRecipient}`,
            })
            setMintSuccess(true);
            setTimeout(() => setMintSuccess(false), 3000);
            setMintAmount('')
            setCoin(coin as string)

            // localStorage.setItem('coinId', coin as string)
          }
        },
        onError: (err) => {
          console.error("Mint transaction failed:", err)
          toast({
            title: "Transaction Failed",
            description: "Failed to mint tokens. Please try again.",
            variant: "destructive",
          })
        }
      }
    )
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
            <Coins className="mr-2 h-5 w-5 text-yellow-400" />
            Mint {tokenData?.symbol} tokens
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Create new tokens and send them to any address
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
                  className="h-6 w-6 cursor-pointer ml-1"
                  onClick={() => window.open(`https://suiscan.xyz/${network}/object/${tokenData?.treasuryCap}`, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 text-zinc-400" />
                </Button>
              </div>
            </div>
            {coin && (
              <div className="flex justify-between items-center mt-4">
                <span className="text-zinc-400 text-sm">Coin ID:</span>
                <div className="flex items-center">
                  <span className="text-white truncate max-w-[200px]">
                    {coin.substring(0, 6)}...{coin.substring(coin.length - 4)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-1 cursor-pointer"
                    onClick={() => window.open(`https://suiscan.xyz/${network}/object/${coin}`, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 text-zinc-400" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleMint} className="space-y-5">
            <div>
              <label className="text-zinc-300 text-sm block mb-1">Amount</label>
              <Input
                type="number"
                placeholder="Enter amount to mint"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
              <p className="text-zinc-500 text-xs mt-1">
                Enter the number of tokens to mint. This amount will be added to the total supply.
              </p>
            </div>

            <div>
              <label className="text-zinc-300 text-sm block mb-1">Recipient Address</label>
              <Input
                placeholder="Enter recipient address"
                value={mintRecipient}
                onChange={(e) => setMintRecipient(e.target.value)}
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
              <p className="text-zinc-500 text-xs mt-1">
                Enter the address that will receive the minted tokens.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Minting...
                </>
              ) : "Mint Tokens"}
            </Button>

            {mintSuccess && (
              <div className="text-green-500 text-sm text-center py-2 px-4 bg-green-900/20 border border-green-900 rounded-md">
                Tokens minted successfully!
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
            onClick={() => window.open(`https://suiscan.xyz/${network}/object/${tokenData?.newPkgId}`, '_blank')}
          >
            View on Explorer
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}