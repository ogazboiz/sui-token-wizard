"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ScrollText, AlertCircle, Plus, Check, X, Loader2, User, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit"
import { Transaction } from "@mysten/sui/transactions"

interface PolicyTokensProps {
  network: string
}

interface TokenData {
  name: string
  symbol: string
  newPkgId: string
  treasuryCap: string
  type: string
}

interface PolicyRequest {
  id: string
  name: string
  amount: string
  recipient: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export default function PolicyTokens({ network }: PolicyTokensProps) {
  const { toast } = useToast()
  const suiClient = useSuiClient()
  const account = useCurrentAccount()
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction()

  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [isCreatingPolicy, setIsCreatingPolicy] = useState(false)
  const [policyCreated, setPolicyCreated] = useState(false)
  const [tokenPolicyId, setTokenPolicyId] = useState<string>("")
  const [tokenPolicyCapId, setTokenPolicyCapId] = useState<string>("")

  useEffect(() => {
    // Load token data from localStorage
    const storedTokenData = localStorage.getItem('tokenData')
    if (storedTokenData) {
      const parsedData = JSON.parse(storedTokenData)
      if (parsedData.type === 'closed-loop') {
        setTokenData(parsedData)
        
        // Check if policy already exists
        const policyData = localStorage.getItem('tokenPolicy')
        if (policyData) {
          const parsedPolicy = JSON.parse(policyData)
          setPolicyCreated(true)
          setTokenPolicyId(parsedPolicy.policyId)
          setTokenPolicyCapId(parsedPolicy.policyCapId)
        }
      }
    }
  }, [])

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
        target: `${tokenData.newPkgId}::${tokenData.symbol.toLowerCase()}::new_policy`,
        arguments: [
          tx.object(tokenData.treasuryCap)
        ],
        typeArguments: [`${tokenData.newPkgId}::${tokenData.symbol.toLowerCase()}::${tokenData.symbol.toUpperCase()}`]
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
                const policyId = policyObj.objectId
                const policyCapId = policyCapObj.objectId
                
                setTokenPolicyId(policyId)
                setTokenPolicyCapId(policyCapId)
                setPolicyCreated(true)
                
                // Save policy data
                const policyData = {
                  policyId,
                  policyCapId,
                  tokenSymbol: tokenData.symbol,
                  createdAt: new Date().toISOString()
                }
                localStorage.setItem('tokenPolicy', JSON.stringify(policyData))
                
                toast({
                  title: "Policy created successfully!",
                  description: "Your token policy has been created and is ready to manage requests.",
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
                <p className="text-lg font-semibold text-white">{tokenData.symbol}</p>
                <p className="text-xs text-zinc-400">{tokenData.name}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Policy Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-white">
                  {policyCreated ? "Active" : "Not Created"}
                </p>
                <p className="text-xs text-zinc-400">
                  {policyCreated ? "Policy is managing requests" : "Create policy to start"}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Policy ID</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-white">
                  {policyCreated ? tokenPolicyId.slice(0, 8) + '...' : 'N/A'}
                </p>
                <p className="text-xs text-zinc-400">
                  {policyCreated ? "Policy object ID" : "No policy created"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Create Policy Section */}
      {!policyCreated && (
        <motion.div
          className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Create Token Policy</h3>
            <p className="text-zinc-400 mb-6">
              Create a policy to manage action requests for your closed-loop token. This will enable
              controlled access to token operations through an approval workflow.
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isCreatingPolicy ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating policy...
                </div>
              ) : (
                <div className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Token Policy
                </div>
              )}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Policy Information Section */}
      {policyCreated && (
        <motion.div
          className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Policy Successfully Created</h3>
            <div className="bg-zinc-800 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-zinc-400 text-sm">Policy ID</p>
                  <p className="text-white font-mono text-sm break-all">{tokenPolicyId}</p>
                </div>
                <div>
                  <p className="text-zinc-400 text-sm">Policy Cap ID</p>
                  <p className="text-white font-mono text-sm break-all">{tokenPolicyCapId}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-blue-400 text-sm mb-2">✨ Next Steps</p>
              <p className="text-zinc-300 text-sm">
                Your token policy is now active! You can create action requests using the <strong>Action Requests</strong> tool 
                in the sidebar. This will allow you to submit requests that require policy approval.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}