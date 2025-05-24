"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, AlertCircle, Check, X, Loader2, User, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit"
import { Transaction } from "@mysten/sui/transactions"
import { deriveCoinType } from "@/components/hooks/getData"

interface ActionRequestsProps {
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
  description?: string
}

export default function ActionRequests({ network }: ActionRequestsProps) {
  const { toast } = useToast()
  const suiClient = useSuiClient()
  const account = useCurrentAccount()
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction()

  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [hasPolicyCreated, setHasPolicyCreated] = useState(false)

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

  // Requests list
  const [requests, setRequests] = useState<PolicyRequest[]>([])

  useEffect(() => {
    // Load token data from localStorage
    const storedTokenData = localStorage.getItem('tokenData')
    if (storedTokenData) {
      const parsedData = JSON.parse(storedTokenData)
      if (parsedData.type === 'closed-loop') {
        setTokenData(parsedData)

        // Check if policy exists
        const policyData = localStorage.getItem('tokenPolicy')
        setHasPolicyCreated(!!policyData)

        // Load existing requests
        const savedRequests = localStorage.getItem('actionRequests')
        if (savedRequests) {
          setRequests(JSON.parse(savedRequests))
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

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!requestName || !requestAmount || !requestRecipient || !tokenData) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsCreatingRequest(true)

    try {
      const tx = new Transaction()
      tx.setGasBudget(10_000_000)

      // Call new_request function
      tx.moveCall({
        target: `${derivedCoinType}::create_new_request`,
        arguments: [
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

            if (res.effects?.status.status === "success") {
              // Add to local requests list
              const newRequest: PolicyRequest = {
                id: digest,
                name: requestName,
                amount: requestAmount,
                recipient: requestRecipient,
                status: 'pending',
                createdAt: new Date().toISOString(),
                description: requestDescription
              }

              const updatedRequests = [newRequest, ...requests]
              setRequests(updatedRequests)

              // Save to localStorage
              localStorage.setItem('actionRequests', JSON.stringify(updatedRequests))

              // Clear form
              setRequestName("")
              setRequestAmount("")
              setRequestRecipient("")
              setRequestDescription("")
              setRequestType("")

              toast({
                title: "Request created successfully!",
                description: "Your action request has been submitted for approval.",
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

    toast({
      title: "Request rejected",
      description: "The action request has been rejected.",
    })
  }

  if (!tokenData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert className="bg-zinc-900 border-zinc-800">
          <AlertCircle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-zinc-400">
            No closed-loop token found. Please create a closed-loop token first to use action requests.
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
            Action requests are only available for closed-loop tokens.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // if (!hasPolicyCreated) {
  //   return (
  //     <div className="container mx-auto px-4 py-6">
  //       <Alert className="bg-zinc-900 border-zinc-800">
  //         <AlertCircle className="h-4 w-4 text-orange-500" />
  //         <AlertDescription className="text-zinc-400">
  //           You need to create a token policy first before creating action requests.
  //           Please go to the Token Policy section to create one.
  //         </AlertDescription>
  //       </Alert>
  //     </div>
  //   )
  // }

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm">Total Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-white">{requests.length}</p>
                <p className="text-xs text-zinc-400">All time</p>
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
                <CardTitle className="text-white text-sm">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-green-400">
                  {requests.filter(r => r.status === 'approved').length}
                </p>
                <p className="text-xs text-zinc-400">Successfully processed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Create Request Form */}
      <motion.div
        className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="p-6 border-b border-zinc-800">
          <h3 className="text-xl font-bold text-white">Create New Action Request</h3>
          <p className="text-zinc-400">
            Submit a new action request using the new_request function
          </p>
        </div>

        <div className="p-6">
          <div className="bg-zinc-800 rounded-lg p-4 mb-6">
            <h4 className="text-white font-medium mb-2">Function Signature</h4>
            <code className="text-emerald-400 text-sm bg-zinc-900 p-3 rounded block">
              public fun new_request&lt;T&gt;(<br />
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
              disabled={isCreatingRequest}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white w-full"
            >
              {isCreatingRequest ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating request...
                </div>
              ) : (
                <div className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Action Request
                </div>
              )}
            </Button>
          </form>
        </div>
      </motion.div>

      {/* Requests List */}
      <motion.div
        className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="p-6 border-b border-zinc-800">
          <h3 className="text-xl font-bold text-white">Recent Action Requests</h3>
          <p className="text-zinc-400">
            View and manage your submitted action requests
          </p>
        </div>

        <div className="p-6">
          {requests.length === 0 ? (
            <div className="text-center text-zinc-400 py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No action requests yet</p>
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
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-zinc-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          request.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
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
        </div>
      </motion.div>
    </div>
  )
}