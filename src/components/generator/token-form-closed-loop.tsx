"use client"
import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, HelpCircle, Flame, Shield, Loader2, Users, Lock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { Coins } from "@/components/ui/icons"
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit"
import { useUpdateToken } from "../hooks/updateCoin"
import { Transaction } from "@mysten/sui/transactions"
import { normalizeSuiObjectId } from "@mysten/sui.js/utils"
import { useRouter } from "next/navigation"

interface TokenFormClosedLoopProps {
  network: string
  onBack: () => void
  onSwitchTemplate: (templateId: "standard" | "regulated") => void
}

export default function TokenFormClosedLoop({ network, onBack, onSwitchTemplate }: TokenFormClosedLoopProps) {
  const router = useRouter()
  const { toast } = useToast()
  const suiClient = useSuiClient();
  const updateToken = useUpdateToken;
  const account = useCurrentAccount();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();

  const [tokenName, setTokenName] = useState("")
  const [tokenSymbol, setTokenSymbol] = useState("")
  const [customDecimals, setCustomDecimals] = useState(false)
  const [decimals, setDecimals] = useState("9")
  const [description, setDescription] = useState("")
  const [, setTokenCreated] = useState(false);
  const [isCreatingToken, setIsCreatingToken] = useState(false)

  // Closed-loop features are always enabled
  const burnable = true
  const mintable = true
  const denylist = true
  const allowlist = true
  const transferRestrictions = true

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenName || !tokenSymbol || !decimals || !description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Set creating state
    setIsCreatingToken(true)
    console.log({
      tokenName,
      tokenSymbol,
      description,
      decimals: Number(decimals),
      allowlist,
      transferRestrictions
    });

    toast({
      title: "Closed-loop token creation initiated",
      description: "Your advanced token is being created. Please wait...",
    })

    try {
      // can the bytecode for closed loop be updated?
      const { updatedBytes } = await updateToken(tokenName, tokenSymbol, description, Number(decimals));
      await publishNewBytecode(updatedBytes);
    } catch (err) {
      console.error("Closed-loop token creation failed:", err);
      setIsCreatingToken(false)
      toast({
        title: "Token creation failed",
        description: "An error occurred while creating your token",
        variant: "destructive",
      })
    }
  }

  const publishNewBytecode = async (updatedBytes: Uint8Array) => {
    const tx = new Transaction();
    tx.setGasBudget(100_000_000);

    const [upgradeCap] = tx.publish({
      modules: [[...updatedBytes]],
      dependencies: [normalizeSuiObjectId("0x1"), normalizeSuiObjectId("0x2")],
    });

    tx.transferObjects([upgradeCap], tx.pure("address", account!.address));

    signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          const res = await suiClient.waitForTransaction({
            digest,
            options: {
              showEffects: true,
              showEvents: true,
              showObjectChanges: true,
              showBalanceChanges: true,
              showInput: true,
            },
          });

          if (res.effects?.status.status === "success") {
            console.log("Token created successfully:", res);
            const txId = res.effects.transactionDigest;
            const createdArr = res.effects.created || [];
            const ownerObj = createdArr.find(
              (item) => typeof item.owner === "object" && "AddressOwner" in item.owner
            );
            // @ts-expect-error addr owner type
            const owner = ownerObj ? ownerObj?.owner?.AddressOwner : "";

            const pkgId = res.objectChanges?.find(
              (item) => item.type === "published"
            )?.packageId || "";

            const treasuryCap = res.objectChanges?.find(
              (item) =>
                item.type === "created" &&
                typeof item.objectType === "string" &&
                item.objectType.includes("TreasuryCap")
              // @ts-expect-error object id type
            )?.objectId || "";

            const denyCap = res.objectChanges?.find(
              (item) =>
                item.type === "created" &&
                typeof item.objectType === "string" &&
                item.objectType.includes("DenyCap")
              // @ts-expect-error object id type
            )?.objectId;

            console.log({ txId, owner, pkgId, treasuryCap, denyCap });
            setTokenCreated(true);

            toast({
              title: "Token created successfully!",
              description: "Your closed-loop token has been created and is ready to use.",
            })

            setTimeout(() => {
              router.push(`/generator/${network}/token/?packageId=${pkgId}`)
            }, 1000)
          } else {
            setIsCreatingToken(false)
            throw new Error("Publishing failed")
          }
        },
        onError: (err) => {
          setIsCreatingToken(false)
          console.error("Publish transaction failed:", err)
          toast({
            title: "Transaction failed",
            description: "Failed to publish token contract",
            variant: "destructive",
          })
        }
      }
    );
  };

  return (
    <motion.div
      className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-bold text-white">Create token on {getNetworkName()}</h2>
        </div>
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 mr-2">
            <span className="text-xl">🚀</span>
          </div>
          <div>
            <div className="text-white font-medium">Closed-loop token</div>
            <div className="text-emerald-400 text-sm">0.05 SUI</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-zinc-400 mb-6">
          Launch your sophisticated closed-loop token on {getNetworkName()} network. Perfect for controlled ecosystems,
          loyalty programs, and gaming economies with advanced security and compliance features.
        </p>

        <div className="bg-zinc-800 rounded-lg p-6 mb-6">
          <h3 className="text-white font-medium mb-4">Token information</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tokenName" className="text-zinc-300 flex items-center">
                    Token Name*
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-zinc-500 ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">The name of your closed-loop token (e.g., &quot;Ecosystem Points&quot;)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="tokenName"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    placeholder="Ecosystem Points"
                    className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="tokenSymbol" className="text-zinc-300 flex items-center">
                    Token Symbol*
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3.5 w-3.5 text-zinc-500 ml-1" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">
                            The symbol of your token (e.g., &quot;ECO&quot;). Usually 3-5 characters.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="tokenSymbol"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                    placeholder="ECO"
                    className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500 mt-1"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <Switch
                    id="customDecimals"
                    checked={customDecimals}
                    onCheckedChange={setCustomDecimals}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                  <Label htmlFor="customDecimals" className="ml-2 text-zinc-300">
                    Custom Decimals
                  </Label>
                </div>
                <p className="text-zinc-500 text-xs mb-2">
                  Change the number of decimals for your token. Default: 9.
                </p>
                {customDecimals && (
                  <Input
                    id="decimals"
                    type="number"
                    value={decimals}
                    onChange={(e) => setDecimals(e.target.value)}
                    placeholder="9"
                    className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500 w-24"
                  />
                )}
              </div>

              <div>
                <Label htmlFor="description" className="text-zinc-300 flex items-center">
                  Description*
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-zinc-500 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-xs">
                          Brief description of your closed-loop token ecosystem
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A closed-loop token for controlled ecosystem management"
                  className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500 mt-1"
                />
                <p className="text-zinc-500 text-xs mt-1">
                  Describe the purpose and use case of your closed-loop token
                </p>
              </div>

              <div className="border-t border-zinc-700 pt-4">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  Closed-Loop Features
                  <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-medium">
                    All Included
                  </span>
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Flame className="h-4 w-4 text-orange-400 mr-2" />
                        <Label className="text-zinc-300">
                          Burnable
                        </Label>
                      </div>
                      <p className="text-zinc-500 text-xs mt-1 ml-6">
                        Remove tokens from circulation for deflationary mechanics
                      </p>
                    </div>
                    <Switch
                      checked={burnable}
                      disabled={true}
                      className="data-[state=checked]:bg-emerald-500 opacity-100"
                    />
                  </div>

                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Coins className="h-4 w-4 text-yellow-400 mr-2" />
                        <Label className="text-zinc-300">
                          Mintable
                        </Label>
                      </div>
                      <p className="text-zinc-500 text-xs mt-1 ml-6">
                        Create new tokens for ecosystem growth and rewards
                      </p>
                    </div>
                    <Switch
                      checked={mintable}
                      disabled={true}
                      className="data-[state=checked]:bg-emerald-500 opacity-100"
                    />
                  </div>

                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 text-red-400 mr-2" />
                        <Label className="text-zinc-300">
                          Denylist
                        </Label>
                      </div>
                      <p className="text-zinc-500 text-xs mt-1 ml-6">
                        Block malicious addresses from participating
                      </p>
                    </div>
                    <Switch
                      checked={denylist}
                      disabled={true}
                      className="data-[state=checked]:bg-emerald-500 opacity-100"
                    />
                  </div>

                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-green-400 mr-2" />
                        <Label className="text-zinc-300">
                          Allowlist
                        </Label>
                      </div>
                      <p className="text-zinc-500 text-xs mt-1 ml-6">
                        Restrict token access to approved addresses only
                      </p>
                    </div>
                    <Switch
                      checked={allowlist}
                      disabled={true}
                      className="data-[state=checked]:bg-emerald-500 opacity-100"
                    />
                  </div>

                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Lock className="h-4 w-4 text-purple-400 mr-2" />
                        <Label className="text-zinc-300">
                          Transfer Restrictions
                        </Label>
                      </div>
                      <p className="text-zinc-500 text-xs mt-1 ml-6">
                        Control how and when tokens can be transferred
                      </p>
                    </div>
                    <Switch
                      checked={transferRestrictions}
                      disabled={true}
                      className="data-[state=checked]:bg-emerald-500 opacity-100"
                    />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <p className="text-emerald-400 text-sm font-medium">✨ Premium Features Included</p>
                  <p className="text-zinc-400 text-xs mt-1">
                    All advanced features are automatically enabled for your closed-loop token, giving you complete control over your ecosystem.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button
                type="submit"
                className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isPending || isCreatingToken}
              >
                {isPending || isCreatingToken ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating closed-loop token...
                  </div>
                ) : (
                  "Create closed-loop token"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full border-zinc-700 cursor-pointer text-zinc-300 hover:bg-zinc-800 hover:text-white"
                disabled={isPending || isCreatingToken}
              >
                Create on testnet for FREE
              </Button>
            </div>

            <div className="flex items-center justify-between text-sm pt-2">
              <div className="text-zinc-400">
                Price: <span className="text-emerald-400">0.05 SUI</span>
              </div>
              <Button variant="link" className="text-emerald-400 cursor-pointer p-0 h-auto">
                Activate promocode
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-8">
          <h3 className="text-white font-medium mb-4 text-center">Other templates</h3>
          <div className="grid grid-cols-2 gap-4">
            <div
              className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 cursor-pointer hover:border-emerald-500 transition-colors"
              onClick={() => onSwitchTemplate("standard")}
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center mr-2">
                  <span className="text-lg">😊</span>
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Standard coin</div>
                  <div className="text-teal-400 text-xs">Price: 0.01 SUI</div>
                </div>
              </div>
              <div className="text-emerald-400 text-xs hover:text-emerald-300">
                Switch to this template
              </div>
            </div>
            <div
              className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 cursor-pointer hover:border-emerald-500 transition-colors"
              onClick={() => onSwitchTemplate("regulated")}
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-fuchsia-900/50 flex items-center justify-center mr-2">
                  <span className="text-lg">😎</span>
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Regulated coin</div>
                  <div className="text-teal-400 text-xs">Price: 0.02 SUI</div>
                </div>
              </div>
              <div className="text-emerald-400 text-xs hover:text-emerald-300">
                Switch to this template
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}