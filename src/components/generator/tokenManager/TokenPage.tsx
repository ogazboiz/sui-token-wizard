"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, ExternalLink, Edit3, Save, X, Loader2, Search, Filter, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ClipLoader } from "react-spinners"
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit"
import { Transaction } from "@mysten/sui/transactions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, Shield, Pause, ScrollText, Plus } from "lucide-react"
import { TokenData } from "@/components/hooks/tokenData"
import { deriveCoinType } from "@/components/hooks/getData"

export interface TokenPageProps {
  network: "mainnet" | "testnet" | "devnet"
  tokenData: TokenData | undefined
  isLoading: boolean
  refetch: () => void
}

type EditMode = 'name' | 'symbol' | 'description' | 'all' | null

// Minted Token Interface
interface MintedToken {
  id: number
  tokenName: string
  coinId: string
  owner: string
  amount: number
  mintedAt: string
  transactionId: string
}

export default function TokenPage({ network, tokenData, isLoading, refetch }: TokenPageProps) {
  console.log("network", network);
  console.log(tokenData);
  const { toast } = useToast()
  const account = useCurrentAccount()
  const suiClient = useSuiClient()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()

  let derivedCoinType: string | undefined;

  if (tokenData) {
    deriveCoinType(suiClient, tokenData).then((result) => {
      derivedCoinType = result;
      console.log("Derived coin type:", result);
    });
  }

  // Modal and edit state
  const [showEditModal, setShowEditModal] = useState(false)
  const [editMode, setEditMode] = useState<EditMode>(null)
  const [editValue, setEditValue] = useState("")
  const [editForm, setEditForm] = useState({
    name: "",
    symbol: "",
    description: ""
  })
  const [isUpdating, setIsUpdating] = useState(false)

  // Generate dummy minted tokens data - Replace this with real blockchain data
  const generateMintedTokens = (tokenName: string = "Token"): MintedToken[] => {
    const tokens: MintedToken[] = [];
    const owners = [
      "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
      "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u",
      "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v",
    ];

    for (let i = 1; i <= 8; i++) {
      tokens.push({
        id: i,
        tokenName: `${tokenName} ${i}`,
        coinId: `0x${Math.random().toString(16).substr(2, 40)}${i.toString().padStart(8, '0')}`,
        owner: owners[Math.floor(Math.random() * owners.length)],
        amount: Math.floor(Math.random() * 10000) + 100,
        mintedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        transactionId: `0x${Math.random().toString(16).substr(2, 64)}`
      });
    }
    return tokens;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Value copied to clipboard",
      })
    } catch (err) {
      console.error("Failed to copy:", err)
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const openEditModal = (mode: EditMode) => {
    if (!tokenData) return

    setEditMode(mode)
    setShowEditModal(true)

    if (mode === 'name') {
      setEditValue(tokenData.name)
    } else if (mode === 'symbol') {
      setEditValue(tokenData.symbol)
    } else if (mode === 'description') {
      setEditValue(tokenData.description)
    } else if (mode === 'all') {
      setEditForm({
        name: tokenData.name,
        symbol: tokenData.symbol,
        description: tokenData.description
      })
    }
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditMode(null)
    setEditValue("")
    setEditForm({
      name: tokenData?.name || "",
      symbol: tokenData?.symbol || "",
      description: tokenData?.description || ""
    })
  }

  const handleSingleFieldSave = async () => {
    if (!tokenData || !account || !editMode || editMode === 'all') return

    if (!editValue.trim()) {
      toast({
        title: "Validation Error",
        description: "Field cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)

    try {
      const tx = new Transaction()
      tx.setGasBudget(10_000_000)

      tx.moveCall({
        target: `${derivedCoinType}::update_${editMode}`,
        arguments: [
          tx.object(tokenData.treasuryCap),
          tx.object(tokenData.metadata),
          tx.pure.string(editValue),
        ],
      })

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
              },
            })

            if (res.effects?.status.status === "success") {
              refetch()
              closeEditModal()

              toast({
                title: "Token updated successfully!",
                description: `Token ${editMode} has been updated.`,
              })
            }
          },
          onError: (err) => {
            console.error("Update failed:", err)
            toast({
              title: "Update failed",
              description: "Failed to update token metadata",
              variant: "destructive",
            })
          }
        }
      )
    } catch (err) {
      console.error("Update error:", err)
      toast({
        title: "Error",
        description: "An error occurred while updating the token",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAllFieldsSave = async () => {
    if (!tokenData || !account) return

    if (!editForm.name.trim() || !editForm.symbol.trim() || !editForm.description.trim()) {
      toast({
        title: "Validation Error",
        description: "All fields are required",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)

    try {
      const tx = new Transaction()
      tx.setGasBudget(10_000_000)

      tx.moveCall({
        target: `${derivedCoinType}::update_metadata`,
        arguments: [
          tx.object(tokenData.metadata),
          tx.pure.string(editForm.name),
          tx.pure.string(editForm.symbol),
          tx.pure.string(editForm.description),
        ],
      })

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
              },
            })

            if (res.effects?.status.status === "success") {
              refetch()
              closeEditModal()

              toast({
                title: "Token updated successfully!",
                description: "All token information has been updated.",
              })
            }
          },
          onError: (err) => {
            console.error("Update failed:", err)
            toast({
              title: "Update failed",
              description: "Failed to update token metadata",
              variant: "destructive",
            })
          }
        }
      )
    } catch (err) {
      console.error("Update error:", err)
      toast({
        title: "Error",
        description: "An error occurred while updating the token",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const canEdit = () => {
    return tokenData && tokenData?.type !== "closed-loop"
  }

  const getModalTitle = () => {
    switch (editMode) {
      case 'name': return 'Edit Token Name'
      case 'symbol': return 'Edit Token Symbol'
      case 'description': return 'Edit Token Description'
      case 'all': return 'Edit All Token Information'
      default: return 'Edit Token'
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <ClipLoader size={40} color="#14b8a6" />
        <span className="ml-4 text-zinc-300">Loading token data...</span>
      </div>
    )
  }

  if (!isLoading && !tokenData) {
    return (
      <Alert className="bg-zinc-900 border-zinc-800 max-w-xl mx-auto">
        <Terminal className="h-4 w-4 text-teal-500" />
        <AlertTitle className="text-white">No Token Found</AlertTitle>
        <AlertDescription className="text-zinc-400">
          You haven&apos;t created any tokens yet or token data was lost. Please create a new token.
          <div className="mt-4">
            <Button
              className="bg-teal-500 cursor-pointer hover:bg-teal-600 text-white"
              onClick={() => (window.location.href = `/generator/${network}`)}
            >
              Create a Token
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <>
      <motion.div
        className="grid gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Token Info Card */}
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl font-bold flex flex-col">
                  <span className="bg-gradient-to-r from-teal-400 to-teal-500 bg-clip-text text-transparent capitalize">
                    {tokenData?.name} ({tokenData?.symbol})
                  </span>
                </CardTitle>
                <CardDescription className="text-zinc-400 capitalize">{tokenData?.description}</CardDescription>

                {/* Token Type Badge */}
                <div className="mt-3">
                  {tokenData?.type === "closed-loop" && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                      Closed-Loop Token
                    </span>
                  )}
                  {tokenData?.type === "regulated" && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                      Regulated Token
                    </span>
                  )}
                  {(!tokenData?.type || tokenData?.type === "standard") && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                      Standard Coin
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Button with Dropdown Options */}
              {canEdit() && (
                <div className="relative">
                  <Button
                    onClick={() => openEditModal('all')}
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Token Info
                  </Button>
                </div>
              )}
            </div>

            {/* Individual Edit Options */}
            {canEdit() && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-zinc-400 text-sm mb-3">Quick edit specific fields:</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => openEditModal('name')}
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 cursor-pointer hover:text-white hover:bg-zinc-800 border border-zinc-700"
                  >
                    Edit Name
                  </Button>
                  <Button
                    onClick={() => openEditModal('symbol')}
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 cursor-pointer hover:text-white hover:bg-zinc-800 border border-zinc-700"
                  >
                    Edit Symbol
                  </Button>
                  <Button
                    onClick={() => openEditModal('description')}
                    variant="ghost"
                    size="sm"
                    className="text-zinc-400 cursor-pointer hover:text-white hover:bg-zinc-800 border border-zinc-700"
                  >
                    Edit Description
                  </Button>
                </div>
              </div>
            )}

            {/* Notice for closed-loop tokens */}
            {tokenData?.type === "closed-loop" && (
              <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <p className="text-emerald-400 text-sm">
                  ℹ️ Closed-loop tokens have immutable metadata. Name, symbol, and description cannot be changed after creation.
                </p>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoCard
                label="Package ID"
                value={tokenData?.pkgId || ""}
                isCopyable
                explorer={`https://suiscan.xyz/${network}/object/${tokenData?.pkgId}`}
                onCopy={copyToClipboard}
              />
              <InfoCard
                label="Treasury Cap"
                value={tokenData?.treasuryCap || ""}
                isCopyable
                explorer={`https://suiscan.xyz/${network}/object/${tokenData?.treasuryCap}`}
                onCopy={copyToClipboard}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InfoCard
                label="Owner"
                value={tokenData?.owner || ""}
                isCopyable
                explorer={`https://suiscan.xyz/${network}/object/${tokenData?.owner}`}
                onCopy={copyToClipboard}
              />
              <InfoCard
                label="Metadata"
                value={tokenData?.metadata || ""}
                isCopyable
                explorer={`https://suiscan.xyz/${network}/object/${tokenData?.metadata}`}
                onCopy={copyToClipboard}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InfoCard label="Decimals" value={String(tokenData?.decimal) || "9"} />
              <InfoCard
                label="Transaction"
                value={tokenData?.txId || ""}
                isCopyable
                explorer={`https://suiscan.xyz/${network}/tx/${tokenData?.txId}`}
                onCopy={copyToClipboard}
              />
            </div>

            {(tokenData?.type === "regulated" || tokenData?.type === "closed-loop") && tokenData?.features && (
              <div className="mt-4 border-t border-zinc-800 pt-4">
                <h3 className="text-sm font-medium mb-3">Token Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  <FeatureItem name="Mintable" enabled={tokenData?.features?.mintable || false} />
                  <FeatureItem name="Burnable" enabled={tokenData?.features?.burnable || false} />
                  {tokenData?.type !== "closed-loop" && (
                    <>
                      <FeatureItem name="Pausable" enabled={tokenData?.features?.pausable || false} />
                      <FeatureItem name="Denylist" enabled={tokenData?.features?.denylist || false} />
                    </>
                  )}
                  {tokenData?.type === "closed-loop" && (
                    <>
                      <FeatureItem name="Allowlist" enabled={tokenData?.features?.allowlist || false} />
                      <FeatureItem name="Transfer Restrictions" enabled={tokenData?.features?.transferRestrictions || false} />
                    </>
                  )}
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
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <ActionCard
                title="Mint Tokens"
                description="Create new tokens and send them to any address"
                icon={<Coins className="h-8 w-8 text-teal-400" />}
                buttonText="Mint Tokens"
                buttonVariant="default"
                href={`/generator/${network}/mint/?packageId=${tokenData?.pkgId}`}
              />

              <ActionCard
                title="Burn Tokens"
                description="Burn tokens to reduce the total supply of tokens"
                icon={<Flame className="h-8 w-8 text-orange-400" />}
                buttonText="Burn Tokens"
                buttonVariant="custom"
                href={`/generator/${network}/burn/?packageId=${tokenData?.pkgId}`}
              />
            </div>

            {/* Advanced Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {tokenData?.type === "closed-loop" && (
                <>
                  <ActionCard
                    title="Token Policy"
                    description="Create and manage token policies for governance"
                    icon={<ScrollText className="h-8 w-8 text-purple-400" />}
                    buttonText="Manage Policy"
                    buttonVariant="secondary"
                    href={`/generator/${network}/policy`}
                  />

                  <ActionCard
                    title="Action Requests"
                    description="Submit and manage action requests requiring approval"
                    icon={<Plus className="h-8 w-8 text-blue-400" />}
                    buttonText="Manage Requests"
                    buttonVariant="secondary"
                    href={`/generator/${network}/action-requests`}
                  />
                </>
              )}

              {tokenData?.type === "regulated" && tokenData?.features && (
                <>
                  {tokenData?.features.denylist && (
                    <ActionCard
                      title="Denylist Management"
                      description="Block or unblock addresses from transferring tokens"
                      icon={<Shield className="h-8 w-8 text-red-400" />}
                      buttonText="Manage Denylist"
                      buttonVariant="secondary"
                      href={`/generator/${network}/denylist`}
                    />
                  )}

                  {tokenData?.features.pausable && (
                    <ActionCard
                      title="Pause/Unpause"
                      description="Control token transfers in case of emergency"
                      icon={<Pause className="h-8 w-8 text-blue-400" />}
                      buttonText="Manage Pausable"
                      buttonVariant="secondary"
                      href={`/generator/${network}/pausable`}
                    />
                  )}
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t border-zinc-800 pt-4">
            <Button
              variant="outline"
              size="sm"
              className="border-zinc-700 cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-800"
              onClick={() => (window.location.href = `/generator/${network}`)}
            >
              Back to Token Creator
            </Button>
          </CardFooter>
        </Card>

        {/* NEW: Minted Tokens Card */}
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center">
                  <TrendingUp className="h-5 w-5 text-teal-400 mr-2" />
                  Minted Tokens
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Track all minted {tokenData?.name} tokens and their owners
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-700 cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-800"
                onClick={() => (window.location.href = `/generator/${network}/mint/?packageId=${tokenData?.pkgId}`)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Mint New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <MintedTokensList 
              tokenData={tokenData} 
              network={network} 
              onCopy={copyToClipboard}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-zinc-900 rounded-xl border border-zinc-800 w-full max-w-md"
          >
            <div className="p-3 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">{getModalTitle()}</h2>
                <Button
                  onClick={closeEditModal}
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 cursor-pointer hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              {editMode === 'all' ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="modal-name" className="text-zinc-300 text-sm">Token Name*</Label>
                    <Input
                      id="modal-name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white mt-1"
                      placeholder="Enter token name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="modal-symbol" className="text-zinc-300 text-sm">Token Symbol*</Label>
                    <Input
                      id="modal-symbol"
                      value={editForm.symbol}
                      onChange={(e) => setEditForm({ ...editForm, symbol: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white mt-1"
                      placeholder="Enter token symbol"
                    />
                  </div>
                  <div>
                    <Label htmlFor="modal-description" className="text-zinc-300 text-sm">Description*</Label>
                    <Input
                      id="modal-description"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 text-white mt-1"
                      placeholder="Enter token description"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="modal-single" className="text-zinc-300 text-sm pb-2">
                    {editMode === 'name' ? 'Token Name*' :
                      editMode === 'symbol' ? 'Token Symbol*' : 'Description*'}
                  </Label>
                  <Input
                    id="modal-single"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white "
                    placeholder={`Enter token ${editMode}`}
                    autoFocus
                  />
                </div>
              )}

              <div className="flex items-center space-x-3 mt-6">
                <Button
                  onClick={editMode === 'all' ? handleAllFieldsSave : handleSingleFieldSave}
                  disabled={isUpdating}
                  className="bg-green-600 cursor-pointer hover:bg-green-700 text-white flex-1"
                >
                  {isUpdating ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </div>
                  )}
                </Button>
                <Button
                  onClick={closeEditModal}
                  disabled={isUpdating}
                  variant="outline"
                  className="border-zinc-700 cursor-pointer text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

// NEW: Minted Tokens List Component
interface MintedTokensListProps {
  tokenData: TokenData | undefined
  network: string
  onCopy: (text: string) => void
}

function MintedTokensList({ tokenData, network, onCopy }: MintedTokensListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOwner, setSelectedOwner] = useState("all")

  // TODO: Replace with real blockchain data
  const generateMintedTokens = (tokenName: string = "Token"): MintedToken[] => {
    const tokens: MintedToken[] = [];
    const owners = [
      "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
      "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u",
      "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v",
    ];

    for (let i = 1; i <= 8; i++) {
      tokens.push({
        id: i,
        tokenName: `${tokenName} ${i}`,
        coinId: `0x${Math.random().toString(16).substr(2, 40)}${i.toString().padStart(8, '0')}`,
        owner: owners[Math.floor(Math.random() * owners.length)],
        amount: Math.floor(Math.random() * 10000) + 100,
        mintedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        transactionId: `0x${Math.random().toString(16).substr(2, 64)}`
      });
    }
    return tokens;
  };

  const mintedTokens = generateMintedTokens(tokenData?.name || "Token");
  const uniqueOwners = [...new Set(mintedTokens.map(token => token.owner))];

  const filteredTokens = mintedTokens.filter(token => {
    const matchesSearch = token.tokenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.coinId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         token.owner.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOwner = selectedOwner === "all" || token.owner === selectedOwner;
    
    return matchesSearch && matchesOwner;
  });

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search by token name, coin ID, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <select
            value={selectedOwner}
            onChange={(e) => setSelectedOwner(e.target.value)}
            className="pl-10 pr-8 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer"
          >
            <option value="all">All Owners</option>
            {uniqueOwners.map((owner, index) => (
              <option key={owner} value={owner}>
                Owner {index + 1} ({truncateAddress(owner)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
          <div className="text-lg font-bold text-teal-400">{mintedTokens.length}</div>
          <div className="text-zinc-400 text-xs">Total Minted</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
          <div className="text-lg font-bold text-blue-400">{uniqueOwners.length}</div>
          <div className="text-zinc-400 text-xs">Unique Owners</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
          <div className="text-lg font-bold text-green-400">
            {mintedTokens.reduce((sum, token) => sum + token.amount, 0).toLocaleString()}
          </div>
          <div className="text-zinc-400 text-xs">Total Supply</div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-zinc-400 text-sm">
        Showing {filteredTokens.length} of {mintedTokens.length} tokens
      </p>

      {/* Token List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredTokens.length === 0 ? (
          <div className="text-center py-8">
            <Coins className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">No tokens found matching your criteria</p>
          </div>
        ) : (
          filteredTokens.map((token) => (
            <div
              key={token.id}
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-colors"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Token Info */}
                <div className="lg:col-span-1">
                  <div className="font-semibold text-teal-400 mb-1">
                    {token.tokenName}
                  </div>
                  <div className="text-zinc-400 text-sm">
                    Amount: <span className="text-white font-medium">{token.amount.toLocaleString()}</span>
                  </div>
                  <div className="text-zinc-400 text-xs mt-1">
                    {formatDate(token.mintedAt)}
                  </div>
                </div>

                {/* Owner */}
                <div className="lg:col-span-1">
                  <div className="text-zinc-400 text-xs mb-1">Owner</div>
                  <div className="flex items-center">
                    <span className="text-sm font-mono text-white mr-2">
                      {truncateAddress(token.owner)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCopy(token.owner)}
                      className="h-6 w-6 text-zinc-400 hover:text-white"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Coin ID */}
                <div className="lg:col-span-1">
                  <div className="text-zinc-400 text-xs mb-1">Coin ID</div>
                  <div className="flex items-center">
                    <span className="text-sm font-mono text-white mr-2">
                      {truncateAddress(token.coinId)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCopy(token.coinId)}
                      className="h-6 w-6 text-zinc-400 hover:text-white"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="lg:col-span-1 flex items-center justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(`https://suiscan.xyz/${network}/object/${token.coinId}`, '_blank')}
                    className="h-8 w-8 text-zinc-400 hover:text-white bg-zinc-700 hover:bg-zinc-600"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => (window.location.href = `/generator/${network}/burn/?packageId=${tokenData?.pkgId}&coinId=${token.coinId}`)}
                    className="h-8 w-8 text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 border border-red-700/50"
                  >
                    🔥
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Keep all the existing component interfaces and implementations
interface InfoCardProps {
  label: string
  value: string
  isCopyable?: boolean
  explorer?: string
  onCopy?: (text: string) => void
}

function InfoCard({ label, value, isCopyable = false, explorer, onCopy }: InfoCardProps) {
  const truncatedValue = value.length > 15 ? `${value.substring(0, 8)}...${value.substring(value.length - 6)}` : value

  const handleCopy = async () => {
    if (onCopy) {
      onCopy(value)
    }
  }

  return (
    <div className="bg-zinc-800 rounded-lg p-3">
      <div className="text-xs text-zinc-400 mb-1">{label}</div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium truncate max-w-[150px]">{truncatedValue}</div>
        <div className="flex items-center">
          {isCopyable && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 cursor-pointer text-zinc-500 hover:text-white"
              onClick={handleCopy}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          )}
          {explorer && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 cursor-pointer text-zinc-500 hover:text-white"
              onClick={() => window.open(explorer, "_blank")}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

interface FeatureItemProps {
  name: string
  enabled: boolean
}

function FeatureItem({ name, enabled }: FeatureItemProps) {
  return (
    <div className="flex items-center justify-between bg-zinc-800 rounded-lg p-2.5">
      <span className="text-sm">{name}</span>
      <span className={`text-xs font-medium ${enabled ? "text-teal-400" : "text-zinc-500"}`}>
        {enabled ? "Enabled" : "Disabled"}
      </span>
    </div>
  )
}

interface ActionCardProps {
  title: string
  description: string
  icon: React.ReactNode
  buttonText: string
  buttonVariant: "default" | "destructive" | "outline" | "secondary" | "custom"
  href: string
}

function ActionCard({ title, description, icon, buttonText, buttonVariant, href }: ActionCardProps) {
  const buttonClassNames = {
    default: "bg-teal-500 hover:bg-teal-600 text-white",
    destructive: "bg-red-500 hover:bg-red-600 text-white",
    outline: "border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800",
    secondary: "bg-zinc-700 hover:bg-zinc-600 text-white",
    custom: "bg-red-700 hover:bg-red-800 text-white",
  }

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
        variant={buttonVariant === "custom" || buttonVariant === "secondary" ? "default" : buttonVariant}
        size="sm"
        className={`w-full cursor-pointer ${buttonClassNames[buttonVariant]}`}
        onClick={() => (window.location.href = href)}
      >
        {buttonText}
      </Button>
    </div>
  )
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