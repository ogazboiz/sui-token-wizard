"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ScrollText, AlertCircle, Plus, Loader2, History, ExternalLink, Copy, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit"
import { Transaction } from "@mysten/sui/transactions"
import { deriveCoinType } from "@/components/hooks/getData"
import { TokenData } from "@/components/hooks/tokenData"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PolicyTokensProps {
  network: string
  tokenData: TokenData | undefined
}

interface PolicyRecord {
  policyId: string
  policyCapId: string
  tokenSymbol: string
  tokenName: string
  packageId: string
  createdAt: string
  network: string
  transactionDigest?: string
}

export default function PolicyTokens({ network, tokenData }: PolicyTokensProps) {
  const { toast } = useToast()
  const suiClient = useSuiClient()
  const account = useCurrentAccount()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()

  const [isCreatingPolicy, setIsCreatingPolicy] = useState(false)
  const [previousPolicies, setPreviousPolicies] = useState<PolicyRecord[]>([])
  
  // Separate states for session vs history
  const [sessionPolicyJustCreated, setSessionPolicyJustCreated] = useState(false)
  const [latestCreatedPolicy, setLatestCreatedPolicy] = useState<PolicyRecord | null>(null)

  let derivedCoinType: string | undefined;

  if (tokenData) {
    deriveCoinType(suiClient, tokenData).then((result) => {
      derivedCoinType = result;
      console.log("Derived coin type:", result);
    });
  }

  useEffect(() => {
    if (tokenData?.type === 'closed-loop') {
      // Load all previous policies
      loadPreviousPolicies()
      
      // Reset session state when component loads
      setSessionPolicyJustCreated(false)
      setLatestCreatedPolicy(null)
    }
  }, [tokenData])

  const loadPreviousPolicies = () => {
    const allPolicies = localStorage.getItem('allCreatedPolicies')
    if (allPolicies) {
      const policies: PolicyRecord[] = JSON.parse(allPolicies)
      // Sort by creation date (newest first)
      policies.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setPreviousPolicies(policies)
    }
  }

  const savePolicyToHistory = (policyRecord: PolicyRecord) => {
    const existingPolicies = localStorage.getItem('allCreatedPolicies')
    let policies: PolicyRecord[] = existingPolicies ? JSON.parse(existingPolicies) : []
    
    // Check if policy already exists (avoid duplicates)
    const existingIndex = policies.findIndex(p => p.policyId === policyRecord.policyId)
    if (existingIndex === -1) {
      policies.unshift(policyRecord) // Add to beginning of array
      localStorage.setItem('allCreatedPolicies', JSON.stringify(policies))
      setPreviousPolicies(policies)
    }
  }

  const deletePolicyFromHistory = (policyId: string) => {
    const existingPolicies = localStorage.getItem('allCreatedPolicies')
    if (existingPolicies) {
      let policies: PolicyRecord[] = JSON.parse(existingPolicies)
      policies = policies.filter(p => p.policyId !== policyId)
      localStorage.setItem('allCreatedPolicies', JSON.stringify(policies))
      setPreviousPolicies(policies)
      
      toast({
        title: "Policy removed",
        description: "Policy has been removed from your history.",
      })
    }
  }

  const getNetworkName = () => {
    switch (network) {
      case "mainnet": return "Sui Mainnet"
      case "testnet": return "Sui Testnet"
      case "devnet": return "Sui Devnet"
      default: return "Sui"
    }
  }

  const handleCreatePolicy = async () => {
    if (!tokenData || !account) return

    setIsCreatingPolicy(true)

    try {
      const tx = new Transaction()
      tx.setGasBudget(10_000_000)

      // Call new_policy function
      tx.moveCall({
        target: `${derivedCoinType}::new_policy`,
        arguments: [
          tx.object(tokenData.treasuryCap)
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
              // Find the created policy objects
              const policyObj = res.objectChanges?.find(
                (item) =>
                  item.type === "created" &&
                  typeof item.objectType === "string" &&
                  item.objectType.includes("TokenPolicy")
              )

              const policyCapObj = res.objectChanges?.find(
                (item) =>
                  item.type === "created" &&
                  typeof item.objectType === "string" &&
                  item.objectType.includes("TokenPolicyCap")
              )

              if (policyObj && policyCapObj) {
                // @ts-expect-error object id
                const policyId = policyObj.objectId
                // @ts-expect-error object id
                const policyCapId = policyCapObj.objectId

                // Save current session policy data (temporary for this session)
                const policyData = {
                  policyId,
                  policyCapId,
                  tokenSymbol: tokenData.symbol,
                  createdAt: new Date().toISOString()
                }
                localStorage.setItem('tokenPolicy', JSON.stringify(policyData))

                // Create policy record for history
                const policyRecord: PolicyRecord = {
                  policyId,
                  policyCapId,
                  tokenSymbol: tokenData.symbol,
                  tokenName: tokenData.name,
                  packageId: tokenData.pkgId,
                  createdAt: new Date().toISOString(),
                  network: network,
                  transactionDigest: digest
                }

                // Save to policy history
                savePolicyToHistory(policyRecord)

                // Set session state to show success temporarily
                setLatestCreatedPolicy(policyRecord)
                setSessionPolicyJustCreated(true)

                // Auto-reset the session success message after 5 seconds
                setTimeout(() => {
                  setSessionPolicyJustCreated(false)
                  setLatestCreatedPolicy(null)
                }, 5000)

                toast({
                  title: "Policy created successfully!",
                  description: "Your token policy has been created and added to history.",
                })
              }
            }
          },
          onError: (err) => {
            console.error("Policy creation failed:", err)
            toast({
              title: "Policy creation failed",
              description: "Failed to create token policy",
              variant: "destructive",
            })
          }
        }
      )
    } catch (err) {
      console.error("Policy creation error:", err)
      toast({
        title: "Error",
        description: "An error occurred while creating the policy",
        variant: "destructive",
      })
    } finally {
      setIsCreatingPolicy(false)
    }
  }

  const handleCreateAnother = () => {
    setSessionPolicyJustCreated(false)
    setLatestCreatedPolicy(null)
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast({
      title: "Address copied",
      description: "The address has been copied to your clipboard.",
    })
  }

  const getNetworkBadgeColor = (networkName: string) => {
    switch (networkName.toLowerCase()) {
      case "mainnet":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "testnet":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "devnet":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
    }
  }

  if (!tokenData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert className="bg-zinc-900 border-zinc-800">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-zinc-400">
            No closed-loop token found. Please create a closed-loop token first to use policy features.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (tokenData.type !== 'closed-loop') {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert className="bg-zinc-900 border-zinc-800">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-zinc-400">
            Token policies are only available for closed-loop tokens.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mr-4">
              <ScrollText className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Token Policy Manager</h2>
              <p className="text-zinc-400">
                Manage policies and action requests for {tokenData.name} ({tokenData.symbol}) on {getNetworkName()}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Token</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-white capitalize">{tokenData.name}</p>
                <p className="text-xs text-zinc-400 capitalize">{tokenData.symbol}</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Last Created</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-white">
                  {sessionPolicyJustCreated ? "Just now" : previousPolicies.length > 0 ? new Date(previousPolicies[0].createdAt).toLocaleDateString() : "None"}
                </p>
                <p className="text-xs text-zinc-400">
                  {sessionPolicyJustCreated ? "Policy created this session" : "Most recent policy"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Total Policies Created</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-white">{previousPolicies.length}</p>
                <p className="text-xs text-zinc-400">All time across all tokens</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Tabs for Current Session and Previous Policies */}
      <motion.div
        className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Tabs defaultValue="current" className="w-full">
          <div className="p-6 pb-0">
            <TabsList className="grid w-fit grid-cols-2 bg-zinc-800/50">
              <TabsTrigger value="current" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                Current Session
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                <History className="w-4 h-4 mr-2" />
                Policy History ({previousPolicies.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="current" className="p-6 pt-4">
            {/* Show success message temporarily after creating policy */}
            {sessionPolicyJustCreated && latestCreatedPolicy ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6"
              >
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                      <ScrollText className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-400">Policy Created Successfully!</h3>
                      <p className="text-emerald-300 text-sm">Your new token policy is ready to use</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-emerald-400 text-sm font-medium">Policy ID</p>
                      <div className="flex items-center">
                        <p className="text-white font-mono text-sm mr-2">{latestCreatedPolicy.policyId.slice(0, 16)}...{latestCreatedPolicy.policyId.slice(-8)}</p>
                        <button
                          className="text-emerald-400 hover:text-emerald-300 cursor-pointer"
                          onClick={() => handleCopyAddress(latestCreatedPolicy.policyId)}
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-emerald-400 text-sm font-medium">Policy Cap ID</p>
                      <div className="flex items-center">
                        <p className="text-white font-mono text-sm mr-2">{latestCreatedPolicy.policyCapId.slice(0, 16)}...{latestCreatedPolicy.policyCapId.slice(-8)}</p>
                        <button
                          className="text-emerald-400 hover:text-emerald-300 cursor-pointer"
                          onClick={() => handleCopyAddress(latestCreatedPolicy.policyCapId)}
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-emerald-300 text-sm">
                      ✨ You can now create action requests using the <strong>Action Requests</strong> tool!
                    </p>
                    <Button
                      onClick={handleCreateAnother}
                      variant="outline"
                      className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                    >
                      Create Another Policy
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : null}

            {/* Create Policy Form - Always available */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">
                {sessionPolicyJustCreated ? "Create Another Token Policy" : "Create Token Policy"}
              </h3>
              <p className="text-zinc-400 mb-6">
                {sessionPolicyJustCreated 
                  ? "You can create multiple policies for different use cases or approval workflows."
                  : "Create a policy to manage action requests for your closed-loop token. This will enable controlled access to token operations through an approval workflow."
                }
              </p>

              <div className="bg-zinc-800 rounded-lg p-4 mb-6">
                <h4 className="text-white font-medium mb-2">Policy Function Signature</h4>
                <code className="text-emerald-400 text-sm bg-zinc-900 p-2 rounded block">
                  public fun new_policy&lt;T&gt;(<br />
                  &nbsp;&nbsp;treasury_cap: &TreasuryCap&lt;T&gt;,<br />
                  &nbsp;&nbsp;ctx: &mut TxContext,<br />
                  ): (TokenPolicy&lt;T&gt;, TokenPolicyCap&lt;T&gt;)
                </code>
              </div>

              <Button
                onClick={handleCreatePolicy}
                disabled={isCreatingPolicy}
                className="bg-emerald-600 cursor-pointer hover:bg-emerald-700 text-white"
              >
                {isCreatingPolicy ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating policy...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    {sessionPolicyJustCreated ? "Create Another Policy" : "Create Token Policy"}
                  </div>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="p-6 pt-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">Previous Policies</h3>
              <p className="text-zinc-400">
                View and manage all policies you've created across different tokens and sessions.
              </p>
            </div>

            {previousPolicies.length === 0 ? (
              <div className="text-center text-zinc-400 py-12">
                <History className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No previous policies</p>
                <p className="text-sm">Create your first policy to see it here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {previousPolicies.map((policy, index) => (
                  <motion.div
                    key={policy.policyId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 hover:border-zinc-600 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold mr-3">
                            {policy.tokenSymbol.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{policy.tokenName}</h4>
                            <div className="flex items-center gap-2">
                              <p className="text-zinc-400 text-sm">{policy.tokenSymbol}</p>
                              <Badge variant="outline" className={getNetworkBadgeColor(policy.network)}>
                                {policy.network}
                              </Badge>
                              {index === 0 && (
                                <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                                  Latest
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <p className="text-zinc-500 text-xs">Policy ID</p>
                            <div className="flex items-center">
                              <p className="text-zinc-300 font-mono text-xs mr-2">
                                {policy.policyId.slice(0, 12)}...{policy.policyId.slice(-8)}
                              </p>
                              <button
                                className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
                                onClick={() => handleCopyAddress(policy.policyId)}
                              >
                                <Copy size={12} />
                              </button>
                            </div>
                          </div>
                          <div>
                            <p className="text-zinc-500 text-xs">Created</p>
                            <p className="text-zinc-300 text-xs">
                              {new Date(policy.createdAt).toLocaleDateString()} {new Date(policy.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <span>Package: {policy.packageId.slice(0, 8)}...{policy.packageId.slice(-6)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {policy.transactionDigest && (
                          <a
                            href={`https://suiscan.xyz/${network}/tx/${policy.transactionDigest}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                            title="View transaction"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <a
                          href={`https://suiscan.xyz/${network}/object/${policy.policyId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                          title="View policy object"
                        >
                          <Eye size={16} />
                        </a>
                        <button
                          onClick={() => deletePolicyFromHistory(policy.policyId)}
                          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded-lg transition-colors"
                          title="Remove from history"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}