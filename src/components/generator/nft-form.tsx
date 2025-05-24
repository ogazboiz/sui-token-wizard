"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Plus, Trash2, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConnectButton, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit"
import { useWalletConnection } from "@/components/hooks/useWalletConnection"
// import { useNetworkVariable } from "../utils/networkConfig"
import { Transaction } from "@mysten/sui/transactions"


interface NftFormProps {
  network: string
}

interface NftAttribute {
  trait_type: string
  value: string
}

export default function NftForm({ network }: NftFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [collectionName, setCollectionName] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [description, setDescription] = useState("")
  const [royaltyPercentage, setRoyaltyPercentage] = useState("5")
  const [maxSupply, setMaxSupply] = useState("10000")
  const [mintPrice, setMintPrice] = useState("0.1")
  const [attributes, setAttributes] = useState<NftAttribute[]>([{ trait_type: "", value: "" }])
  const [isRevealable, setIsRevealable] = useState(false)
  const [isWhitelistEnabled, setIsWhitelistEnabled] = useState(false)
  const [nftId, setNftId] = useState('')

  const { toast } = useToast()
  const router = useRouter()
  const { isConnected, isReady } = useWalletConnection()
  // const nftPackageId = useNetworkVariable("nftPackageId");
  // for some reason, this dont work when imported
  const {
    mutate: signAndExecute,
    isSuccess,
  } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

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

  const getNetworkColor = () => {
    switch (network) {
      case "mainnet":
        return "text-purple-500"
      case "testnet":
        return "text-teal-500"
      case "devnet":
        return "text-blue-500"
      default:
        return "text-white"
    }
  }

  const handleAddAttribute = () => {
    setAttributes([...attributes, { trait_type: "", value: "" }])
  }

  const handleRemoveAttribute = (index: number) => {
    const newAttributes = [...attributes]
    newAttributes.splice(index, 1)
    setAttributes(newAttributes)
  }

  const handleAttributeChange = (index: number, field: "trait_type" | "value", value: string) => {
    const newAttributes = [...attributes]
    newAttributes[index][field] = value
    setAttributes(newAttributes)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!collectionName || !description || !imageUrl) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    console.log({ collectionName, description, imageUrl });

    setIsSubmitting(true);

    try {
      const tx = new Transaction();
      tx.moveCall({
        arguments: [
          tx.pure.string(collectionName),
          tx.pure.string(description),
          tx.pure.string(imageUrl),
        ],
        target: `0xdf941ca4f0df0a608d206becf36959f8c43c304c4cc289fb301d7915b8be9ba6::my_nft::mint_to_sender`,
      });

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: async ({ digest }) => {
            const { effects } = await suiClient.waitForTransaction({
              digest: digest,
              options: {
                showEffects: true,
              },
            });
            console.log("List created successfully:", effects);

            const nftId = effects?.created?.[0]?.reference?.objectId;
            setNftId(nftId || "");

            toast({
              title: "Collection created successfully!",
              description: `Your ${collectionName} NFT collection has been deployed to the ${getNetworkName()} blockchain.`,
              variant: "default",
            });
            setIsSubmitting(false);

            // Redirect to dashboard
            // router.push("/dashboard");
          },
          onError: (error) => {
            console.error("Error creating collection:", error);
            toast({
              title: "Error creating collection",
              description: "There was an error creating your NFT collection. Please try again.",
              variant: "destructive",
            });
            setIsSubmitting(false);
          },
        }
      );
    } catch (error) {
      console.error("Error creating collection:", error);
      toast({
        title: "Error creating collection",
        description: "There was an error creating your NFT collection. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking wallet connection
  if (!isReady) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  // Show wallet connection prompt if not connected
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6 text-zinc-400 cursor-pointer hover:text-white"
            onClick={() => router.push("/nft/generate")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to networks
          </Button>

          <Alert className="bg-zinc-900 border-zinc-800">
            <Terminal className="h-4 w-4 text-purple-500" />
            <AlertTitle className="text-white">Wallet Not Connected</AlertTitle>
            <AlertDescription className="text-zinc-400">
              You need to connect your wallet to create an NFT collection on {getNetworkName()}.
              <div className="mt-4 flex justify-center">
                <ConnectButton
                  connectText="Connect Wallet to Continue"
                  className="bg-purple-500 cursor-pointer hover:bg-purple-600 text-white"
                />
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 text-zinc-400 cursor-pointer hover:text-white"
          onClick={() => router.push("/nft/generate")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to networks
        </Button>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Create NFT Collection on <span className={getNetworkColor()}>{getNetworkName()}</span>
          </h1>
          <p className="text-zinc-400">
            Fill in the details below to create your custom NFT collection on the {getNetworkName()} blockchain.
          </p>
        </div>

        <motion.div
          className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Tabs defaultValue="basic" className="mb-6">
            <TabsList className="grid grid-cols-3 bg-zinc-800">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="attributes">Attributes</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="collectionName" className="text-zinc-300">
                      Collection Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="collectionName"
                      value={collectionName}
                      onChange={(e) => setCollectionName(e.target.value)}
                      placeholder="e.g. Sui Punks"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500 mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-zinc-300">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your NFT collection"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500 min-h-[100px] mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="imageUrl" className="text-zinc-300">
                      Image URL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="e.g. https://example.com/image.png"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500 mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxSupply" className="text-zinc-300">
                        Max Supply
                      </Label>
                      <Input
                        id="maxSupply"
                        type="number"
                        value={maxSupply}
                        onChange={(e) => setMaxSupply(e.target.value)}
                        placeholder="e.g. 10000"
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500 mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mintPrice" className="text-zinc-300">
                        Mint Price (SUI)
                      </Label>
                      <Input
                        id="mintPrice"
                        type="number"
                        step="0.01"
                        value={mintPrice}
                        onChange={(e) => setMintPrice(e.target.value)}
                        placeholder="e.g. 0.1"
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500 mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="royaltyPercentage" className="text-zinc-300">
                      Royalty Percentage
                    </Label>
                    <Input
                      id="royaltyPercentage"
                      type="number"
                      min="0"
                      max="15"
                      value={royaltyPercentage}
                      onChange={(e) => setRoyaltyPercentage(e.target.value)}
                      placeholder="e.g. 5"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500 mt-1"
                    />
                  </div>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="attributes" className="pt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">Collection Attributes</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddAttribute}
                    className="text-purple-400 cursor-pointer border-purple-400 hover:bg-purple-400/10"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Attribute
                  </Button>
                </div>

                <div className="space-y-3">
                  {attributes.map((attr, index) => (
                    <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                      <div>
                        <Input
                          value={attr.trait_type}
                          onChange={(e) => handleAttributeChange(index, "trait_type", e.target.value)}
                          placeholder="Trait name"
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500"
                        />
                      </div>
                      <div>
                        <Input
                          value={attr.value}
                          onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                          placeholder="Value"
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAttribute(index)}
                        className="text-zinc-400 cursor-pointer hover:text-red-400"
                        disabled={attributes.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="text-zinc-400 text-sm mt-2">
                  <p>Attributes will be applied to all NFTs in your collection.</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="pt-4">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="revealable" className="text-zinc-300">
                      Delayed Reveal
                    </Label>
                    <p className="text-zinc-500 text-sm">Hide NFT metadata until a specific time</p>
                  </div>
                  <Switch
                    id="revealable"
                    checked={isRevealable}
                    onCheckedChange={setIsRevealable}
                    className="data-[state=checked]:bg-purple-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="whitelist" className="text-zinc-300">
                      Whitelist
                    </Label>
                    <p className="text-zinc-500 text-sm">Enable whitelist for early minting</p>
                  </div>
                  <Switch
                    id="whitelist"
                    checked={isWhitelistEnabled}
                    onCheckedChange={setIsWhitelistEnabled}
                    className="data-[state=checked]:bg-purple-500"
                  />
                </div>

                {isWhitelistEnabled && (
                  <div>
                    <Label htmlFor="whitelistAddresses" className="text-zinc-300">
                      Whitelist Addresses
                    </Label>
                    <Textarea
                      id="whitelistAddresses"
                      placeholder="Enter addresses, one per line"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-purple-500 min-h-[100px] mt-1"
                    />
                    <p className="text-zinc-500 text-xs mt-1">Enter one address per line</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="pt-4 border-t border-zinc-800 mt-6">
            <Button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-purple-500 cursor-pointer hover:bg-purple-600 text-white py-3 h-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating Collection...
                </>
              ) : (
                "Create NFT Collection"
              )}
            </Button>
          </div>
        </motion.div>
        {isSuccess && (
          <div className="mt-4 text-green-500 flex flex-col gap-1 font-semibold">
            <span>NFT created successfully!</span>
            <span>NFT ID: {nftId || "loading id..."}</span>
            {nftId && (
              <a
                href={`https://suiscan.xyz/testnet/object/${nftId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-green-400 hover:text-green-300"
              >
                View NFT
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}