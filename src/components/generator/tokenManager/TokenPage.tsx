"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Copy, ExternalLink, Edit3, Save, X, Loader2 } from "lucide-react"
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
import { deriveCoinType, deriveFullCoinType, getMetadataField } from "@/components/hooks/getData"
import { CoinMetadata } from "@mysten/sui/client"

interface TokenPageProps {
  network: string
}

interface TokenData {
  name: string
  symbol: string
  description: string
  decimal: string
  newPkgId: string
  txId: string
  owner: string
  treasuryCap: string
  metadata: string
  denyCap?: string
  type?: string
  features?: {
    burnable?: boolean
    mintable?: boolean
    pausable?: boolean
    denylist?: boolean
    allowlist?: boolean
    transferRestrictions?: boolean
  }
}

type EditMode = 'name' | 'symbol' | 'description' | 'all' | null

export default function TokenPage({ network }: TokenPageProps) {
  const { toast } = useToast()
  const account = useCurrentAccount()
  const suiClient = useSuiClient()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()

  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [tokenLoaded, setTokenLoaded] = useState(false)
  const [metadata, setMetadata] = useState<CoinMetadata | null>(null)

  let derivedCoinType: string | undefined;

  if (tokenData) {
    deriveCoinType(suiClient, tokenData).then((result) => {
      derivedCoinType = result;
      console.log("Derived coin type:", result);
    });
  }

  useEffect(() => {
    if (!tokenData) return;

    const fetchMetadata = async () => {
      try {
        const derivedFullCoinType = await deriveFullCoinType(suiClient, tokenData);
        console.log("Derived coin type:", derivedFullCoinType);

        const metadata = await getMetadataField(suiClient, derivedFullCoinType);
        console.log("Metadata:", metadata);
        setMetadata(metadata);
      } catch (err) {
        console.error("Error fetching metadata:", err);
      }
    };

    fetchMetadata();
  }, [tokenData, suiClient]);



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

  useEffect(() => {
    // Check localStorage for token data when component mounts
    const savedTokenData = localStorage.getItem("tokenData")
    if (savedTokenData) {
      const parsedData = JSON.parse(savedTokenData)
      setTokenData(parsedData)
      setEditForm({
        name: parsedData.name || "",
        symbol: parsedData.symbol || "",
        description: parsedData.description || ""
      })
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

      // const updatedValue = editValue;

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
              const updatedTokenData = {
                ...tokenData,
                [editMode]: editValue,
              }

              setTokenData(updatedTokenData)
              localStorage.setItem('tokenData', JSON.stringify(updatedTokenData))
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
              const updatedTokenData = {
                ...tokenData,
                name: editForm.name,
                symbol: editForm.symbol,
                description: editForm.description
              }

              setTokenData(updatedTokenData)
              localStorage.setItem('tokenData', JSON.stringify(updatedTokenData))
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
    return tokenData && tokenData.type !== "closed-loop"
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

  // // Render loading state if token data isn't loaded yet
  // if (!tokenLoaded) {
  //   return (
  //     <div className="flex justify-center items-center py-20">
  //       <ClipLoader size={40} color="#14b8a6" />
  //       <span className="ml-4 text-zinc-300">Loading token data...</span>
  //     </div>
  //   )
  // }

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

  // Render token details
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
                    {metadata?.name} ({metadata?.symbol})
                  </span>
                </CardTitle>
                <CardDescription className="text-zinc-400 capitalize">{metadata?.description}</CardDescription>

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
                      Standard Token
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
                value={tokenData?.newPkgId || ""}
                isCopyable
                explorer={`https://suiscan.xyz/${network}/object/${tokenData?.newPkgId}`}
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
                value={metadata?.id || ""}
                isCopyable
                explorer={`https://suiscan.xyz/${network}/object/${tokenData?.metadata}`}
                onCopy={copyToClipboard}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InfoCard label="Decimals" value={String(metadata?.decimals) || "9"} />
              <InfoCard
                label="Transaction"
                value={tokenData?.txId || ""}
                isCopyable
                explorer={`https://suiscan.xyz/${network}/tx/${tokenData?.txId}`}
                onCopy={copyToClipboard}
              />
            </div>

            {(tokenData?.type === "regulated" || tokenData?.type === "closed-loop") && tokenData.features && (
              <div className="mt-4 border-t border-zinc-800 pt-4">
                <h3 className="text-sm font-medium mb-3">Token Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  <FeatureItem name="Mintable" enabled={tokenData.features?.mintable || false} />
                  <FeatureItem name="Burnable" enabled={tokenData.features?.burnable || false} />
                  {tokenData.type !== "closed-loop" && (
                  <>
                    <FeatureItem name="Pausable" enabled={tokenData.features?.pausable || false} />
                    <FeatureItem name="Denylist" enabled={tokenData.features?.denylist || false} />
                  </>
                  )}
                  {tokenData.type === "closed-loop" && (
                    <>
                      <FeatureItem name="Allowlist" enabled={tokenData.features?.allowlist || false} />
                      <FeatureItem name="Transfer Restrictions" enabled={tokenData.features?.transferRestrictions || false} />
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
                href={`/generator/${network}/mint`}
              />

              <ActionCard
                title="Burn Tokens"
                description="Burn tokens to reduce the total supply of tokens"
                icon={<Flame className="h-8 w-8 text-orange-400" />}
                buttonText="Burn Tokens"
                buttonVariant="custom"
                href={`/generator/${network}/burn`}
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

              {tokenData?.type === "regulated" && tokenData.features && (
                <>
                  {tokenData.features.denylist && (
                    <ActionCard
                      title="Denylist Management"
                      description="Block or unblock addresses from transferring tokens"
                      icon={<Shield className="h-8 w-8 text-red-400" />}
                      buttonText="Manage Denylist"
                      buttonVariant="secondary"
                      href={`/generator/${network}/denylist`}
                    />
                  )}

                  {tokenData.features.pausable && (
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

// Keep all the other interface and component definitions the same
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