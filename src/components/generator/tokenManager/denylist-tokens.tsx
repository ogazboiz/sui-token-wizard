"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ExternalLink, Loader2, Shield, X, Plus } from "lucide-react"
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
import { deriveCoinType, getDenyList } from "@/components/hooks/getData"
// import { useNetworkVariables } from "@/components/utils/networkConfig"

interface DenylistTokensProps {
  network: string
}

export default function DenylistTokens({ network }: DenylistTokensProps) {
  const { toast } = useToast()
  const suiClient = useSuiClient()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()
  // const { coinPackageId } = useNetworkVariables();

  // Token data state
  const [tokenData, setTokenData] = useState<{
    name: string
    symbol: string
    description: string
    decimal: string
    newPkgId: string
    txId: string
    metadata: string
    treasuryCap: string
    denyCap: string
    features?: {
      denylist?: boolean
    }
  } | null>(null)

  let derivedCoinType: string | undefined;
  // let denylist: string[] | undefined;

  if (tokenData) {
    deriveCoinType(suiClient, tokenData).then((result) => {
      derivedCoinType = result;
      console.log("Derived coin type:", result);
    });

    // getMetadataField(suiClient, tokenData.metadata || "").then((result) => {
    //   console.log("Metadata:", result);
    // });
  }

  // Denylist state
  const [addressToAdd, setAddressToAdd] = useState('')
  const [addressToRemove, setAddressToRemove] = useState('')
  const [denylistAddSuccess, setDenylistAddSuccess] = useState(false)
  const [denylistRemoveSuccess, setDenylistRemoveSuccess] = useState(false)
  const [tokenLoaded, setTokenLoaded] = useState(false)
  const [denylistedAddresses, setDenylistedAddresses] = useState<string[]>([])
  const [isAddPending, setIsAddPending] = useState(false)
  const [isRemovePending, setIsRemovePending] = useState(false)

  useEffect(() => {
    // Check localStorage for token data when component mounts
    const savedTokenData = localStorage.getItem('tokenData')
    let denylist: string[] | undefined;
    if (savedTokenData) {
      const parsedData = JSON.parse(savedTokenData)
      setTokenData(parsedData)

      // // dummy addresses
      // setDenylistedAddresses([
      //   "0x1234...5678",
      //   "0xabcd...ef01"
      // ])

      getDenyList(suiClient, '0x403').then((result) => {
        let denylist: string[] = [];

        // If fields.id is an array of objects
        if (Array.isArray(result.lists.fields.id)) {
          denylist = result.lists.fields.id.map((item: { id: string }) => item.id);
        }
        // If fields.id is a single object
        else if (result.lists.fields.id && typeof result.lists.fields.id === "object" && result.lists.fields.id.id) {
          denylist = [result.lists.fields.id.id];
        }
        // If fields.id is a string (unlikely, but just in case)
        else if (typeof result.lists.fields.id === "string") {
          denylist = [result.lists.fields.id];
        }

        setDenylistedAddresses(denylist);
      });

      setDenylistedAddresses(denylist || [])

      setTokenLoaded(true)
    }
  }, [suiClient])

  // Handle adding address to denylist
  const handleAddToDenylist = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenData || !addressToAdd) return

    setIsAddPending(true)

    console.log("Adding to denylist:", {
      treasuryCap: tokenData.treasuryCap,
      address: addressToAdd
    })

    const tx = new Transaction()
    tx.setGasBudget(100_000_000)

    // Call the add_deny_list function on the regulated_coin contract
    tx.moveCall({
      target: `${derivedCoinType}::add_deny_list`,
      arguments: [
        tx.object('0x403'),
        tx.object(tokenData.denyCap),
        tx.pure.address(addressToAdd),
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
            console.log("Add to denylist successful:", res)
            toast({
              title: "Success",
              description: `Successfully added ${addressToAdd} to denylist`,
            })
            // Add the address to our local state for UI update
            setDenylistedAddresses([...denylistedAddresses, addressToAdd])
            setDenylistAddSuccess(true)
            setAddressToAdd('')
            setTimeout(() => setDenylistAddSuccess(false), 3000)
            setIsAddPending(false)
          }
        },
        onError: (err) => {
          console.error("Add to denylist transaction failed:", err)
          toast({
            title: "Transaction Failed",
            description: "Failed to add address to denylist. Please try again.",
            variant: "destructive",
          })
          setIsAddPending(false)
        }
      }
    )
  }

  // Handle removing address from denylist
  const handleRemoveFromDenylist = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenData || !addressToRemove) return

    setIsRemovePending(true)

    console.log("Removing from denylist:", {
      treasuryCap: tokenData.treasuryCap,
      address: addressToRemove
    })

    const tx = new Transaction()
    tx.setGasBudget(100_000_000)

    // Call the remove_deny_list function on the regulated_coin contract
    tx.moveCall({
      target: `${derivedCoinType}::remove_deny_list`,
      arguments: [
        tx.object('0x403'),
        tx.object(tokenData.denyCap),
        tx.pure.address(addressToRemove),
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
            console.log("Remove from denylist successful:", res)
            toast({
              title: "Success",
              description: `Successfully removed ${addressToRemove} from denylist`,
            })
            // Remove the address from our local state for UI update
            setDenylistedAddresses(denylistedAddresses.filter(addr => addr !== addressToRemove))
            setDenylistRemoveSuccess(true)
            setAddressToRemove('')
            setTimeout(() => setDenylistRemoveSuccess(false), 3000)
            setIsRemovePending(false)
          }
        },
        onError: (err) => {
          console.error("Remove from denylist transaction failed:", err)
          toast({
            title: "Transaction Failed",
            description: "Failed to remove address from denylist. Please try again.",
            variant: "destructive",
          })
          setIsRemovePending(false)
        }
      }
    )
  }

  // Handle removing a specific address
  const handleRemoveSpecificAddress = (address: string) => {
    setAddressToRemove(address)
    // Automatically submit the form after setting the address
    setTimeout(() => {
      document.getElementById('remove-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
    }, 100)
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

  // Check if token doesn't have denylist feature
  if (tokenData && (!tokenData.features || !tokenData.features.denylist)) {
    return (
      <Alert className="bg-zinc-900 border-zinc-800 max-w-xl mx-auto">
        <Terminal className="h-4 w-4 text-teal-500" />
        <AlertTitle className="text-white">Feature Not Available</AlertTitle>
        <AlertDescription className="text-zinc-400">
          The denylist feature is not available for this token. This feature is only available for regulated tokens with the denylist feature enabled.
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
            <Shield className="mr-2 h-5 w-5 text-red-400" />
            Manage Denylist for {tokenData?.symbol} Token
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Block or unblock addresses from transferring your token
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
                  {tokenData?.treasuryCap.substring(0, 6)}...{tokenData?.treasuryCap.substring(tokenData.treasuryCap.length - 4)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-1 cursor-pointer "
                  onClick={() => window.open(`https://suiscan.xyz/${network}/object/${tokenData?.treasuryCap}`, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 text-zinc-400" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-sm">Deny Cap:</span>
              <div className="flex items-center">
                <span className="text-white truncate max-w-[200px]">
                  {tokenData?.denyCap.substring(0, 6)}...{tokenData?.denyCap.substring(tokenData?.denyCap.length - 4)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-1 cursor-pointer"
                  onClick={() => window.open(`https://suiscan.xyz/${network}/object/${tokenData?.denyCap}`, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 text-zinc-400" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add to denylist form */}
            <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
              <h3 className="text-white font-medium mb-3 flex items-center">
                <Plus className="h-4 w-4 mr-2 text-red-400" />
                Add to Denylist
              </h3>
              <form onSubmit={handleAddToDenylist} className="space-y-4">
                <div>
                  <label className="text-zinc-300 text-sm block mb-1">Address</label>
                  <Input
                    placeholder="Enter address to block"
                    value={addressToAdd}
                    onChange={(e) => setAddressToAdd(e.target.value)}
                    required
                    className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                  <p className="text-zinc-500 text-xs mt-1">
                    Enter the address that will be blocked from transferring tokens.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 cursor-pointer hover:bg-red-700 text-white"
                  disabled={isAddPending}
                >
                  {isAddPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : "Add to Denylist"}
                </Button>

                {denylistAddSuccess && (
                  <div className="text-green-500 text-sm text-center py-2 px-4 bg-green-900/20 border border-green-900 rounded-md">
                    Address added to denylist successfully!
                  </div>
                )}
              </form>
            </div>

            {/* Remove from denylist form */}
            <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
              <h3 className="text-white font-medium mb-3 flex items-center">
                <X className="h-4 w-4 mr-2 text-green-400" />
                Remove from Denylist
              </h3>
              <form id="remove-form" onSubmit={handleRemoveFromDenylist} className="space-y-4">
                <div>
                  <label className="text-zinc-300 text-sm block mb-1">Address</label>
                  <Input
                    placeholder="Enter address to unblock"
                    value={addressToRemove}
                    onChange={(e) => setAddressToRemove(e.target.value)}
                    required
                    className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                  <p className="text-zinc-500 text-xs mt-1">
                    Enter the address that will be unblocked by the next epoch.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 cursor-pointer hover:bg-green-700 text-white"
                  disabled={isRemovePending}
                >
                  {isRemovePending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : "Remove from Denylist"}
                </Button>

                {denylistRemoveSuccess && (
                  <div className="text-green-500 text-sm text-center py-2 px-4 bg-green-900/20 border border-green-900 rounded-md">
                    Address removed from denylist successfully!
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Denylisted addresses list */}
          <div className="mt-6">
            <h3 className="text-white font-medium mb-3">Denylisted Addresses</h3>
            {denylistedAddresses.length > 0 ? (
              <div className="bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden">
                <div className="divide-y divide-zinc-700">
                  {denylistedAddresses.map((address, index) => (
                    <div key={index} className="p-3 flex justify-between items-center">
                      <span className="text-zinc-300 text-sm">{address}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 cursor-pointer hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => handleRemoveSpecificAddress(address)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-4 text-center text-zinc-400">
                No addresses are currently denylisted for this token.
              </div>
            )}
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