"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, AlertCircle, Check, X, Loader2, User, Clock, FileText, History, ExternalLink, Copy, Trash2, ScrollText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit"
import { Transaction } from "@mysten/sui/transactions"
import { deriveCoinType } from "@/components/hooks/getData"
import { TokenData } from "@/components/hooks/tokenData"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface ActionRequestsProps {
  network: string
  tokenData: TokenData | undefined
}

interface PolicyRequest {
  id: string
  name: string
  amount: string
  recipient: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  description?: string
  tokenSymbol?: string
  tokenName?: string
  network?: string
  transactionDigest?: string
  policyId?: string // Track which policy was used
}

interface ActivePolicy {
  policyId: string
  policyCapId: string
  tokenSymbol: string
  tokenName: string
  packageId: string
  createdAt: string
  network: string
  transactionDigest?: string
}

export default function ActionRequests({ network, tokenData }: ActionRequestsProps) {
  const { toast } = useToast()
  const suiClient = useSuiClient()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()

  const [hasPolicyCreated, setHasPolicyCreated] = useState(false)
  const [allRequestsHistory, setAllRequestsHistory] = useState<PolicyRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Policy selection state
  const [activePolicy, setActivePolicy] = useState<ActivePolicy | null>(null)
  const [availablePolicies, setAvailablePolicies] = useState<ActivePolicy[]>([])
  const [showPolicySelector, setShowPolicySelector] = useState(false)

  let derivedCoinType: string | undefined;

  if (tokenData) {
    deriveCoinType(suiClient, tokenData).then((result) => {
      derivedCoinType = result;
      console.log("Derived coin type:", result);
    });
  }

  // New request form
  const [requestName, setRequestName] = useState("")
  const [requestAmount, setRequestAmount] = useState("")
  const [requestRecipient, setRequestRecipient] = useState("")
  const [requestDescription, setRequestDescription] = useState("")
  const [requestType, setRequestType] = useState("")
  const [isCreatingRequest, setIsCreatingRequest] = useState(false)

  // Current session requests list
  const [requests, setRequests] = useState<PolicyRequest[]>([])

  // Helper function to get all policies for current token
  const getPoliciesForToken = (packageId: string): ActivePolicy[] => {
    const allPolicies = localStorage.getItem('allCreatedPolicies')
    if (allPolicies) {
      try {
        const policies = JSON.parse(allPolicies)
        return policies.filter((policy: any) => policy.packageId === packageId)
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      } catch (error) {
        console.error('Error parsing policies:', error)
        return []
      }
    }
    return []
  }

  // Helper function to get active policy (most recent by default)
  const getActivePolicyForToken = (packageId: string): ActivePolicy | null => {
    // Check if user has manually selected a policy for this session
    const selectedPolicy = localStorage.getItem(`selectedPolicy_${packageId}`)
    if (selectedPolicy) {
      try {
        return JSON.parse(selectedPolicy)
      } catch (error) {
        console.error('Error parsing selected policy:', error)
      }
    }

    // Otherwise, get the most recent policy
    const policies = getPoliciesForToken(packageId)
    return policies.length > 0 ? policies[0] : null
  }

  // Helper function to check if policy exists for current token
  const checkIfPolicyExistsForToken = (packageId: string): boolean => {
    // Check current session first
    const currentSessionPolicy = localStorage.getItem('tokenPolicy')
    if (currentSessionPolicy) {
      return true
    }

    // Check policy history for this specific token
    const policies = getPoliciesForToken(packageId)
    return policies.length > 0
  }

  useEffect(() => {
    // Set loading to false after a brief moment to handle initial render
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    if (tokenData?.type === 'closed-loop' && tokenData?.pkgId) {
      // Get all policies for this token
      const policies = getPoliciesForToken(tokenData.pkgId)
      setAvailablePolicies(policies)

      // Set active policy
      const activePol = getActivePolicyForToken(tokenData.pkgId)
      setActivePolicy(activePol)
      setHasPolicyCreated(!!activePol)

      // Show policy selector if multiple policies exist
      setShowPolicySelector(policies.length > 1)

      console.log('Found policies for token:', policies.length)
      console.log('Active policy:', activePol)

      // Load existing requests for current session
      const savedRequests = localStorage.getItem('actionRequests')
      if (savedRequests) {
        setRequests(JSON.parse(savedRequests))
      }

      // Load all requests history
      loadAllRequestsHistory()
    }

    return () => clearTimeout(timer)
  }, [tokenData])

  const loadAllRequestsHistory = () => {
    const allHistory = localStorage.getItem('allActionRequestsHistory')
    if (allHistory) {
      const history: PolicyRequest[] = JSON.parse(allHistory)
      // Sort by creation date (newest first)
      history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setAllRequestsHistory(history)
    }
  }

  const handlePolicySelect = (policy: ActivePolicy) => {
    setActivePolicy(policy)
    // Save user's selection for this session
    if (tokenData?.pkgId) {
      localStorage.setItem(`selectedPolicy_${tokenData.pkgId}`, JSON.stringify(policy))
    }
    
    toast({
      title: "Policy selected",
      description: `Now using policy from ${new Date(policy.createdAt).toLocaleDateString()}`,
    })
  }

  const saveRequestToHistory = (request: PolicyRequest) => {
    // Save to global history
    const existingHistory = localStorage.getItem('allActionRequestsHistory')
    let history: PolicyRequest[] = existingHistory ? JSON.parse(existingHistory) : []
    
    // Check if request already exists (avoid duplicates)
    const existingIndex = history.findIndex(r => r.id === request.id)
    if (existingIndex === -1) {
      const requestWithTokenInfo = {
        ...request,
        tokenSymbol: tokenData?.symbol,
        tokenName: tokenData?.name,
        network: network,
        transactionDigest: request.id, // Using the digest as transaction ID
        policyId: activePolicy?.policyId // Track which policy was used
      }
      history.unshift(requestWithTokenInfo) // Add to beginning of array
      localStorage.setItem('allActionRequestsHistory', JSON.stringify(history))
      setAllRequestsHistory(history)
    }
  }

  const deleteRequestFromHistory = (requestId: string) => {
    const existingHistory = localStorage.getItem('allActionRequestsHistory')
    if (existingHistory) {
      let history: PolicyRequest[] = JSON.parse(existingHistory)
      history = history.filter(r => r.id !== requestId)
      localStorage.setItem('allActionRequestsHistory', JSON.stringify(history))
      setAllRequestsHistory(history)
      
      toast({
        title: "Request removed",
        description: "Request has been removed from your history.",
      })
    }
  }

  const updateRequestStatusInHistory = (requestId: string, status: 'approved' | 'rejected') => {
    const existingHistory = localStorage.getItem('allActionRequestsHistory')
    if (existingHistory) {
      let history: PolicyRequest[] = JSON.parse(existingHistory)
      history = history.map(req =>
        req.id === requestId ? { ...req, status } : req
      )
      localStorage.setItem('allActionRequestsHistory', JSON.stringify(history))
      setAllRequestsHistory(history)
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

  const getNetworkBadgeColor = (networkName: string) => {
    switch (networkName?.toLowerCase()) {
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'approved':
        return 'bg-green-500/20 text-green-400'
      case 'rejected':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-zinc-500/20 text-zinc-400'
    }
  }

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!requestName || !requestAmount || !requestRecipient || !tokenData || !activePolicy) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields and ensure a policy is selected",
        variant: "destructive",
      })
      return
    }

    setIsCreatingRequest(true)

    try {
      const tx = new Transaction()
      tx.setGasBudget(10_000_000)

      // Call new_request function with the active policy
      tx.moveCall({
        target: `${derivedCoinType}::create_new_request`,
        arguments: [
          tx.object(activePolicy.policyId), // Use the selected policy
          tx.pure.string(requestName),
          tx.pure.u64(requestAmount),
          tx.pure.option("address", requestRecipient),
          tx.pure.option("u64", null), // spent_balance as None for now
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

            console.log("Transaction result:", res);

            if (res.effects?.status.status === "success") {
              // Add to local requests list
              const newRequest: PolicyRequest = {
                id: digest,
                name: requestName,
                amount: requestAmount,
                recipient: requestRecipient,
                status: 'pending',
                createdAt: new Date().toISOString(),
                description: requestDescription,
                policyId: activePolicy.policyId
              }

              const updatedRequests = [newRequest, ...requests]
              setRequests(updatedRequests)

              // Save to current session localStorage
              localStorage.setItem('actionRequests', JSON.stringify(updatedRequests))

              // Save to global history
              saveRequestToHistory(newRequest)

              // Clear form
              setRequestName("")
              setRequestAmount("")
              setRequestRecipient("")
              setRequestDescription("")
              setRequestType("")

              toast({
                title: "Request created successfully!",
                description: `Action request submitted using policy ${activePolicy.policyId.slice(0, 8)}...`,
              })
            }
          },
          onError: (err) => {
            console.error("Request creation failed:", err)
            toast({
              title: "Request creation failed",
              description: "Failed to create action request",
              variant: "destructive",
            })
          }
        }
      )
    } catch (err) {
      console.error("Request creation error:", err)
      toast({
        title: "Error",
        description: "An error occurred while creating the request",
        variant: "destructive",
      })
    } finally {
      setIsCreatingRequest(false)
    }
  }

  const handleApproveRequest = (requestId: string) => {
    const updatedRequests = requests.map(req =>
      req.id === requestId ? { ...req, status: 'approved' as const } : req
    )
    setRequests(updatedRequests)
    localStorage.setItem('actionRequests', JSON.stringify(updatedRequests))

    // Update in global history as well
    updateRequestStatusInHistory(requestId, 'approved')

    toast({
      title: "Request approved",
      description: "The action request has been approved.",
    })
  }

  const handleRejectRequest = (requestId: string) => {
    const updatedRequests = requests.map(req =>
      req.id === requestId ? { ...req, status: 'rejected' as const } : req
    )
    setRequests(updatedRequests)
    localStorage.setItem('actionRequests', JSON.stringify(updatedRequests))

    // Update in global history as well
    updateRequestStatusInHistory(requestId, 'rejected')

    toast({
      title: "Request rejected",
      description: "The action request has been rejected.",
    })
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast({
      title: "Address copied",
      description: "The address has been copied to your clipboard.",
    })
  }

  // Policy Selector Component
  const PolicySelector = () => (
    <motion.div
      className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Active Policy</h3>
            <p className="text-zinc-400 text-sm">
              {availablePolicies.length > 1 
                ? `${availablePolicies.length} policies available - action requests will use the selected policy` 
                : "Current policy for action requests"}
            </p>
          </div>
          {showPolicySelector && (
            <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {availablePolicies.length} policies
            </Badge>
          )}
        </div>

        {activePolicy ? (
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                    <ScrollText className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      Policy ID: {activePolicy.policyId.slice(0, 8)}...{activePolicy.policyId.slice(-8)}
                    </p>
                    <p className="text-zinc-400 text-xs">
                      Created: {new Date(activePolicy.createdAt).toLocaleDateString()} at {new Date(activePolicy.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyAddress(activePolicy.policyId)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                  title="Copy policy ID"
                >
                  <Copy size={16} />
                </button>
                {activePolicy.transactionDigest && (
                  <a
                    href={`https://suiscan.xyz/${network}/tx/${activePolicy.transactionDigest}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                    title="View transaction"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
              <p className="text-emerald-400 text-sm">
                ✅ This policy will be used for all new action requests
              </p>
            </div>

            {showPolicySelector && (
              <div className="mt-4 pt-4 border-t border-zinc-700">
                <p className="text-zinc-400 text-sm mb-3">Switch to different policy:</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availablePolicies.map((policy, index) => (
                    <button
                      key={policy.policyId}
                      onClick={() => handlePolicySelect(policy)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        policy.policyId === activePolicy.policyId
                          ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                          : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            Policy #{index + 1} - {policy.policyId.slice(0, 8)}...{policy.policyId.slice(-8)}
                          </p>
                          <p className="text-xs opacity-75">
                            {new Date(policy.createdAt).toLocaleDateString()} {new Date(policy.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        {policy.policyId === activePolicy.policyId && (
                          <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-zinc-800 rounded-lg p-4 text-center">
            <p className="text-zinc-400">No policy found for this token</p>
          </div>
        )}
      </div>
    </motion.div>
  )

  // Loading state - show while token data is being fetched
  if (isLoading || !tokenData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-4 text-zinc-300">Loading token data...</span>
        </div>
      </div>
    )
  }

  // Check if token is closed-loop
  if (tokenData.type !== 'closed-loop') {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert className="bg-zinc-900 border-zinc-800">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-zinc-400">
            Action requests are only available for closed-loop tokens. 
            Your current token ({tokenData.name}) is a {tokenData.type} token.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Check if policy has been created for this token
  if (!hasPolicyCreated) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert className="bg-zinc-900 border-zinc-800">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-zinc-400">
            You need to create a token policy first before creating action requests for {tokenData.name} ({tokenData.symbol}).
            Please go to the <strong>Token Policy</strong> section in the sidebar to create one.
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
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
              <Plus className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Action Requests Manager</h2>
              <p className="text-zinc-400">
                Create and manage action requests for {tokenData.name} ({tokenData.symbol}) on {getNetworkName()}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Current Session</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-white">{requests.length}</p>
                <p className="text-xs text-zinc-400">Requests this session</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Total All Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-white">{allRequestsHistory.length}</p>
                <p className="text-xs text-zinc-400">All requests ever created</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-yellow-400">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
                <p className="text-xs text-zinc-400">Awaiting approval</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Available Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-emerald-400">{availablePolicies.length}</p>
                <p className="text-xs text-zinc-400">For this token</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Policy Selector */}
      <PolicySelector />

      {/* Create Request Form */}
      <motion.div
        className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="p-6 border-b border-zinc-800">
          <h3 className="text-xl font-bold text-white">Create New Action Request</h3>
          <p className="text-zinc-400">
            Submit a new action request using policy {activePolicy?.policyId.slice(0, 8)}...{activePolicy?.policyId.slice(-8)}
          </p>
        </div>

        <div className="p-6">
          <div className="bg-zinc-800 rounded-lg p-4 mb-6">
            <h4 className="text-white font-medium mb-2">Function Signature</h4>
            <code className="text-emerald-400 text-sm bg-zinc-900 p-3 rounded block">
              public fun new_request&lt;T&gt;(<br />
              &nbsp;&nbsp;policy: &TokenPolicy&lt;T&gt;,<br />
              &nbsp;&nbsp;name: String,<br />
              &nbsp;&nbsp;amount: u64,<br />
              &nbsp;&nbsp;recipient: Option&lt;address&gt;,<br />
              &nbsp;&nbsp;spent_balance: Option&lt;Balance&lt;T&gt;&gt;,<br />
              &nbsp;&nbsp;ctx: &TxContext,<br />
              ): ActionRequest&lt;T&gt;
            </code>
          </div>

          <form onSubmit={handleCreateRequest} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requestType" className="text-zinc-300">
                  Request Type
                </Label>
                <Select value={requestType} onValueChange={setRequestType}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="mint">Mint Tokens</SelectItem>
                    <SelectItem value="burn">Burn Tokens</SelectItem>
                    <SelectItem value="transfer">Transfer Tokens</SelectItem>
                    <SelectItem value="allowlist">Allowlist Address</SelectItem>
                    <SelectItem value="denylist">Denylist Address</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="requestName" className="text-zinc-300">
                  Request Name*
                </Label>
                <Input
                  id="requestName"
                  value={requestName}
                  onChange={(e) => setRequestName(e.target.value)}
                  placeholder="e.g., Mint rewards for Q1"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500 mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requestAmount" className="text-zinc-300">
                  Amount*
                </Label>
                <Input
                  id="requestAmount"
                  type="number"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  placeholder="1000"
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500 mt-1"
                />
              </div>

              <div>
                <Label htmlFor="requestRecipient" className="text-zinc-300">
                  Recipient Address*
                </Label>
                <Input
                  id="requestRecipient"
                  value={requestRecipient}
                  onChange={(e) => setRequestRecipient(e.target.value)}
                  placeholder="0x..."
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500 mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="requestDescription" className="text-zinc-300">
                Description (Optional)
              </Label>
              <Textarea
                id="requestDescription"
                value={requestDescription}
                onChange={(e) => setRequestDescription(e.target.value)}
                placeholder="Describe the purpose of this request..."
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500 mt-1"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              disabled={isCreatingRequest || !activePolicy}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingRequest ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating request...
                </div>
              ) : (
                <div className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Action Request {activePolicy ? `(Policy ${activePolicy.policyId.slice(0, 8)}...)` : ''}
                </div>
              )}
            </Button>
          </form>
        </div>
      </motion.div>

      {/* Tabs for Current Session and All History */}
      <motion.div
        className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Tabs defaultValue="current" className="w-full">
          <div className="p-6 pb-0">
            <TabsList className="grid w-fit grid-cols-2 bg-zinc-800/50">
              <TabsTrigger value="current" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Current Session ({requests.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                <History className="w-4 h-4 mr-2" />
                All History ({allRequestsHistory.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="current" className="p-6 pt-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">Current Session Requests</h3>
              <p className="text-zinc-400">
                View and manage requests from this session
              </p>
            </div>

            {requests.length === 0 ? (
              <div className="text-center text-zinc-400 py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No action requests yet</p>
                <p className="text-sm">Create your first request above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-zinc-800 rounded-lg p-4 border border-zinc-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{request.name}</h4>
                            <p className="text-zinc-400 text-sm">
                              {request.amount} tokens → {request.recipient.slice(0, 8)}...{request.recipient.slice(-6)}
                            </p>
                            {request.description && (
                              <p className="text-zinc-500 text-xs mt-1">{request.description}</p>
                            )}
                            {request.policyId && (
                              <p className="text-zinc-500 text-xs mt-1">
                                Policy: {request.policyId.slice(0, 8)}...{request.policyId.slice(-8)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-zinc-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${getStatusBadgeColor(request.status)}`}>
                            {request.status}
                          </span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApproveRequest(request.id)}
                            className="text-green-400 cursor-pointer border-green-400 hover:bg-green-400 hover:text-white"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectRequest(request.id)}
                            className="text-red-400 cursor-pointer border-red-400 hover:bg-red-400 hover:text-white"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="p-6 pt-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">All Action Requests History</h3>
              <p className="text-zinc-400">
                View all action requests you've created across different tokens and sessions.
              </p>
            </div>

            {allRequestsHistory.length === 0 ? (
              <div className="text-center text-zinc-400 py-12">
                <History className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No request history</p>
                <p className="text-sm">Create your first request to see it here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {allRequestsHistory.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 hover:border-zinc-600 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                            {request.tokenSymbol?.charAt(0).toUpperCase() || 'R'}
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{request.name}</h4>
                            <div className="flex items-center gap-2">
                              <p className="text-zinc-400 text-sm">{request.tokenName} ({request.tokenSymbol})</p>
                              {request.network && (
                                <Badge variant="outline" className={getNetworkBadgeColor(request.network)}>
                                  {request.network}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                          <div>
                            <p className="text-zinc-500 text-xs">Amount & Recipient</p>
                            <p className="text-zinc-300 text-xs">
                              {request.amount} → {request.recipient.slice(0, 8)}...{request.recipient.slice(-6)}
                            </p>
                          </div>
                          <div>
                            <p className="text-zinc-500 text-xs">Status</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                          <div>
                            <p className="text-zinc-500 text-xs">Created</p>
                            <p className="text-zinc-300 text-xs">
                              {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {request.policyId && (
                          <div className="mb-2">
                            <p className="text-zinc-500 text-xs">Policy Used</p>
                            <p className="text-zinc-400 text-xs font-mono">
                              {request.policyId.slice(0, 12)}...{request.policyId.slice(-12)}
                            </p>
                          </div>
                        )}

                        {request.description && (
                          <p className="text-zinc-500 text-xs mb-2">{request.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {request.transactionDigest && (
                          <a
                            href={`https://suiscan.xyz/${network}/tx/${request.transactionDigest}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                            title="View transaction"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => handleCopyAddress(request.id)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
                          title="Copy request ID"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          onClick={() => deleteRequestFromHistory(request.id)}
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