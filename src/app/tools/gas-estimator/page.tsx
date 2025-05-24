"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Home, Fuel, ChevronLeft, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Navbar from "@/components/navbar"

export default function GasEstimatorPage() {
  const [tokenTemplate, setTokenTemplate] = useState("standard")
  const [creationCount, setCreationCount] = useState(1)
  const [estimatedCost, setEstimatedCost] = useState(0.01)
  const [usdValue, setUsdValue] = useState(2)

  const templates = [
    { 
      id: "standard", 
      name: "Standard Token", 
      cost: 0.01,
      description: "Perfect for basic use cases with essential functionality",
      features: ["Mintable & Burnable", "Metadata editing", "Low gas fees", "Quick deployment"]
    },
    { 
      id: "regulated", 
      name: "Regulated Token", 
      cost: 0.02,
      description: "Advanced features for compliance and security",
      features: ["Pausable transfers", "Denylist management", "Metadata editing", "Compliance ready"]
    },
    { 
      id: "closed-loop", 
      name: "Closed-Loop Token", 
      cost: 0.05,
      description: "Governance-controlled tokens with policy management",
      features: ["Policy governance", "Action requests", "Immutable metadata", "Enterprise grade"]
    },
  ]

  const suiToUsdRate = 2.10 // More realistic SUI/USD rate

  const updateEstimate = (template: string, count: number) => {
    const selectedTemplate = templates.find((t) => t.id === template)
    const cost = selectedTemplate?.cost || 0.01
    const totalCost = cost * count
    setEstimatedCost(totalCost)
    setUsdValue(Math.round(totalCost * suiToUsdRate * 100) / 100) // Round to 2 decimal places
  }

  const handleTemplateChange = (template: string) => {
    setTokenTemplate(template)
    updateEstimate(template, creationCount)
  }

  const handleCountChange = (newCount: number) => {
    const count = Math.max(1, newCount)
    setCreationCount(count)
    updateEstimate(tokenTemplate, count)
  }

  const incrementCount = () => handleCountChange(creationCount + 1)
  const decrementCount = () => handleCountChange(creationCount - 1)

  const selectedTemplate = templates.find(t => t.id === tokenTemplate)

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar/>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex mt-4 items-center text-sm text-zinc-400 mb-8">
          <Link href="/" className="hover:text-white flex items-center">
            <Home className="w-4 h-4 mr-1" />
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-zinc-300">Tools</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-white">Gas Estimator</span>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <Fuel className="w-10 h-10 mr-3 text-teal-500" />
              Gas Fee Estimator
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Calculate the estimated gas fees for creating tokens on the Sui blockchain
            </p>
          </motion.div>

          {/* Main Calculator Card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border-zinc-700 overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-teal-500/20 to-purple-500/20 p-6 border-b border-zinc-700">
                <CardTitle className="text-2xl font-bold text-white text-center">
                  Gas Fee Calculator
                  <div className="w-20 h-1 bg-gradient-to-r from-teal-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
                </CardTitle>
                <p className="text-center text-zinc-300 mt-2">Calculate your gas costs for token creation</p>
              </div>

              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {/* Token Template Selector */}
                  <div>
                    <label className="block text-zinc-300 text-lg font-medium mb-4">Token Type</label>
                    <div className="relative">
                      <Select value={tokenTemplate} onValueChange={handleTemplateChange}>
                        <SelectTrigger className="bg-zinc-800 border-zinc-600 text-white h-16 text-lg">
                          <div className="flex items-center justify-between w-full">
                            <ChevronLeft className="w-6 h-6 text-zinc-400" />
                            <SelectValue />
                            <ChevronRight className="w-6 h-6 text-zinc-400" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-800 border-zinc-600">
                          {templates.map((template) => (
                            <SelectItem key={template.id} value={template.id} className="text-white hover:bg-zinc-700">
                              <div className="flex items-center justify-between w-full">
                                <span>{template.name}</span>
                                <span className="text-zinc-400 ml-4">{template.cost} SUI</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Template Description */}
                    {selectedTemplate && (
                      <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
                        <p className="text-zinc-300 text-sm mb-2">{selectedTemplate.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedTemplate.features.map((feature, index) => (
                            <span key={index} className="text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Number of Creations */}
                  <div>
                    <label className="block text-zinc-300 text-lg font-medium mb-4">Number of tokens</label>
                    <div className="flex items-center bg-zinc-800 rounded-lg border border-zinc-600 h-16">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-14 w-14 text-zinc-400 hover:text-white hover:bg-zinc-700"
                        onClick={decrementCount}
                        disabled={creationCount <= 1}
                      >
                        <Minus className="w-6 h-6" />
                      </Button>
                      <div className="flex-1 text-center">
                        <span className="text-2xl font-bold text-white">{creationCount}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-14 w-14 text-zinc-400 hover:text-white hover:bg-zinc-700"
                        onClick={incrementCount}
                      >
                        <Plus className="w-6 h-6" />
                      </Button>
                    </div>
                    
                    {/* Calculation breakdown */}
                    <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
                      <div className="text-zinc-300 text-sm">
                        <div className="flex justify-between">
                          <span>Cost per token:</span>
                          <span>{selectedTemplate?.cost} SUI</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Number of tokens:</span>
                          <span>×{creationCount}</span>
                        </div>
                        <div className="border-t border-zinc-700 mt-2 pt-2 flex justify-between font-medium text-white">
                          <span>Total cost:</span>
                          <span>{estimatedCost.toFixed(3)} SUI</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Result Display */}
                <div className="text-center py-8 border-t border-zinc-700">
                  <div className="text-5xl font-bold text-white mb-2">{estimatedCost.toFixed(3)} SUI</div>
                  <div className="text-2xl text-teal-400">≈ ${usdValue.toFixed(2)} USD</div>
                  <div className="text-sm text-zinc-500 mt-2">Based on current SUI price of ${suiToUsdRate}</div>
                </div>

                {/* Action Button */}
                <div className="text-center mt-8">
                  <p className="text-zinc-300 text-lg mb-6">Ready to create your token?</p>
                  <Button
                    className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white px-8 py-3 text-lg font-medium rounded-lg"
                    onClick={() => (window.location.href = "/generate")}
                  >
                    Create Token Now
                  </Button>
                </div>
              </CardContent>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-teal-500/20 rounded-full blur-xl"></div>
            </Card>
          </motion.div>

          {/* Token Types Overview */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Token Types & Pricing</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <span className="text-lg">😊</span>
                      </div>
                      Standard Token
                    </div>
                    <span className="text-blue-400 font-bold">0.01 SUI</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-300">
                  <p className="text-sm mb-4">Perfect for basic use cases with essential functionality</p>
                  <ul className="text-xs space-y-1">
                    <li>• Mintable & Burnable</li>
                    <li>• Metadata editing</li>
                    <li>• Low gas fees</li>
                    <li>• Quick deployment</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                        <span className="text-lg">😎</span>
                      </div>
                      Regulated Token
                    </div>
                    <span className="text-purple-400 font-bold">0.02 SUI</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-300">
                  <p className="text-sm mb-4">Advanced features for compliance and security</p>
                  <ul className="text-xs space-y-1">
                    <li>• Pausable transfers</li>
                    <li>• Denylist management</li>
                    <li>• Metadata editing</li>
                    <li>• Compliance ready</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                        <span className="text-lg">🚀</span>
                      </div>
                      Closed-Loop Token
                    </div>
                    <span className="text-emerald-400 font-bold">0.05 SUI</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-300">
                  <p className="text-sm mb-4">Governance-controlled tokens with policy management</p>
                  <ul className="text-xs space-y-1">
                    <li>• Policy governance</li>
                    <li>• Action requests</li>
                    <li>• Immutable metadata</li>
                    <li>• Enterprise grade</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Additional Information */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Gas Fee Information</CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-300">
                  <ul className="space-y-2 text-sm">
                    <li>• Fixed pricing based on token complexity</li>
                    <li>• No additional network congestion fees</li>
                    <li>• Regulated tokens include advanced security features</li>
                    <li>• Closed-loop tokens provide enterprise governance</li>
                    <li>• All prices include deployment and initial setup</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">Why Choose Sui Token Wizard?</CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-300">
                  <ul className="space-y-2 text-sm">
                    <li>• Transparent, fixed pricing</li>
                    <li>• Fast deployment in under 5 minutes</li>
                    <li>• Comprehensive dashboard management</li>
                    <li>• Multiple token types for different use cases</li>
                    <li>• Built on the efficient Sui blockchain</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}