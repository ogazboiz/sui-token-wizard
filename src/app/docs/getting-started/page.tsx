"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Home, Coins, Shield, Zap, ExternalLink, ScrollText, Image, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
        <Navbar/>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-zinc-400 mb-8">
          <Link href="/" className="hover:text-white flex items-center">
            <Home className="w-4 h-4 mr-1" />
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-zinc-300">Docs</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-white">Getting Started</span>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-4">Getting Started with Sui Token Wizard</h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Create, manage, and deploy tokens and NFT collections on the Sui blockchain in minutes with Sui Token Wizard
            </p>
          </motion.div>

          {/* Quick Start Cards */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Coins className="w-5 h-5 mr-2 text-teal-500" />
                  Create Tokens
                </CardTitle>
              </CardHeader>
              <CardContent className="text-zinc-300">
                <p className="mb-4">Launch your token in under 5 minutes</p>
                <Button className="bg-teal-500 hover:bg-teal-600 text-white w-full">
                  <Link href="/generate">Start Creating</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Image className="w-5 h-5 mr-2 text-purple-500" />
                  Create NFTs
                </CardTitle>
              </CardHeader>
              <CardContent className="text-zinc-300">
                <p className="mb-4">Design unique NFT collections</p>
                <Button className="bg-purple-500 hover:bg-purple-600 text-white w-full">
                  <Link href="/nft/generate">Create Collection</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Zap className="w-5 h-5 mr-2 text-orange-500" />
                  Your Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="text-zinc-300">
                <p className="mb-4">Manage all your tokens and NFTs</p>
                <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white w-full">
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Token Types Overview */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Choose Your Token Type</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                      <span className="text-lg">😊</span>
                    </div>
                    Standard Coin
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-300">
                  <p className="text-sm mb-4">Perfect for basic use cases with essential functionality</p>
                  <ul className="text-xs space-y-1 mb-4">
                    <li>• Mintable & Burnable</li>
                    <li>• Metadata editing</li>
                    <li>• Low gas fees</li>
                    <li>• Quick deployment</li>
                  </ul>
                  <Badge variant="outline" className="border-blue-500 text-blue-400">
                    0.01 SUI
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                      <span className="text-lg">😎</span>
                    </div>
                    Regulated Coin
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-300">
                  <p className="text-sm mb-4">Advanced features for compliance and security</p>
                  <ul className="text-xs space-y-1 mb-4">
                    <li>• Pausable transfers</li>
                    <li>• Denylist management</li>
                    <li>• Metadata editing</li>
                    <li>• Compliance ready</li>
                  </ul>
                  <Badge variant="outline" className="border-purple-500 text-purple-400">
                    0.02 SUI
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                      <span className="text-lg">🚀</span>
                    </div>
                    Closed-Loop Token
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-300">
                  <p className="text-sm mb-4">Governance-controlled tokens with policy management</p>
                  <ul className="text-xs space-y-1 mb-4">
                    <li>• Policy governance</li>
                    <li>• Action requests</li>
                    <li>• Immutable metadata</li>
                    <li>• Enterprise grade</li>
                  </ul>
                  <Badge variant="outline" className="border-emerald-500 text-emerald-400">
                    0.05 SUI
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Step by Step Guide */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Step-by-Step Guide</h2>

            <div className="space-y-6">
              {/* Step 1 */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
                      <p className="text-zinc-400 mb-4">
                        Connect your Sui wallet to start creating tokens and NFTs. We support all major Sui wallets 
                        including Sui Wallet, Ethos, and Martian.
                      </p>
                      <div className="flex items-center text-sm text-zinc-500">
                        <Shield className="w-4 h-4 mr-1" />
                        Secure connection with wallet encryption
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">Choose What to Create</h3>
                      <p className="text-zinc-400 mb-4">
                        Select between creating fungible tokens (Standard, Regulated, or Closed-Loop) or NFT collections 
                        based on your project needs.
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className="border-blue-500 text-blue-400">
                          Standard Coin
                        </Badge>
                        <Badge variant="outline" className="border-purple-500 text-purple-400">
                          Regulated Coin
                        </Badge>
                        <Badge variant="outline" className="border-emerald-500 text-emerald-400">
                          Closed-Loop Token
                        </Badge>
                        <Badge variant="outline" className="border-orange-500 text-orange-400">
                          NFT Collection
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">Configure Details</h3>
                      <p className="text-zinc-400 mb-4">
                        Set your token/NFT details including name, symbol, description, supply, and special features. 
                        All fields are customizable to match your project requirements.
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-zinc-500">• Name & Symbol</div>
                        <div className="text-zinc-500">• Description & Metadata</div>
                        <div className="text-zinc-500">• Supply & Decimals</div>
                        <div className="text-zinc-500">• Special Features</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 4 */}
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <div className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                      4
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">Deploy & Manage</h3>
                      <p className="text-zinc-400 mb-4">
                        Deploy to the Sui blockchain and use our comprehensive management tools. For closed-loop tokens, 
                        set up policies and manage action requests through our governance interface.
                      </p>
                      <div className="flex items-center text-sm text-zinc-500">
                        <Zap className="w-4 h-4 mr-1" />
                        Instant deployment with low gas fees
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Features Overview */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Comprehensive Feature Set</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Coins className="w-5 h-5 mr-2 text-yellow-500" />
                    Token Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-300">
                  <ul className="space-y-2 text-sm">
                    <li>• Mint & burn tokens</li>
                    <li>• Transfer ownership</li>
                    <li>• Edit metadata</li>
                    <li>• Dashboard analytics</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Shield className="w-5 h-5 mr-2 text-red-500" />
                    Security Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-300">
                  <ul className="space-y-2 text-sm">
                    <li>• Pausable transfers</li>
                    <li>• Address denylist</li>
                    <li>• Policy governance</li>
                    <li>• Multi-network support</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <ScrollText className="w-5 h-5 mr-2 text-purple-500" />
                    Governance
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-300">
                  <ul className="space-y-2 text-sm">
                    <li>• Token policies</li>
                    <li>• Action requests</li>
                    <li>• Multi-party approval</li>
                    <li>• Controlled operations</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Palette className="w-5 h-5 mr-2 text-orange-500" />
                    NFT Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-300">
                  <ul className="space-y-2 text-sm">
                    <li>• Collection creation</li>
                    <li>• Custom attributes</li>
                    <li>• Royalty settings</li>
                    <li>• Metadata management</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Workflow Examples */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Example Workflows</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Coins className="w-5 h-5 mr-2 text-teal-500" />
                    Token Creation Workflow
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-300">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center mr-3">1</div>
                      <span>Choose token type & network</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center mr-3">2</div>
                      <span>Configure name, symbol & supply</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center mr-3">3</div>
                      <span>Enable features (pausable, denylist)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center mr-3">4</div>
                      <span>Deploy & manage via dashboard</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Image className="w-5 h-5 mr-2 text-purple-500" />
                    NFT Collection Workflow
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-zinc-300">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center mr-3">1</div>
                      <span>Select network & connect wallet</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center mr-3">2</div>
                      <span>Set collection details & artwork</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center mr-3">3</div>
                      <span>Configure attributes & royalties</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center mr-3">4</div>
                      <span>Deploy & view in dashboard</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Closed-Loop Token Special Section */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-800/50">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <ScrollText className="w-6 h-6 mr-3 text-emerald-400" />
                  Closed-Loop Token Governance
                </CardTitle>
              </CardHeader>
              <CardContent className="text-zinc-300">
                <p className="mb-4">
                  Closed-loop tokens provide enterprise-grade governance with policy-controlled operations and 
                  multi-party approval workflows.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-2">Policy Management</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Create token policies using new_policy()</li>
                      <li>• Control access to token operations</li>
                      <li>• Immutable metadata for security</li>
                      <li>• Enterprise compliance ready</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Action Requests</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Submit requests using new_request()</li>
                      <li>• Multi-party approval workflow</li>
                      <li>• Track request status & history</li>
                      <li>• Controlled token operations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Additional Resources</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Get Started</h3>
                  <p className="text-zinc-400 mb-4">
                    Jump right in and start creating tokens and NFT collections with Sui Token Wizard.
                  </p>
                  <div className="space-y-2">
                    <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                      <Link href="/generate" className="flex items-center">
                        <Coins className="w-4 h-4 mr-2" />
                        Create Your First Token
                      </Link>
                    </Button>
                    <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                      <Link href="/nft/generate" className="flex items-center">
                        <Image className="w-4 h-4 mr-2" />
                        Create NFT Collection
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Explore & Learn</h3>
                  <p className="text-zinc-400 mb-4">
                    Learn more about Sui blockchain development and explore advanced features.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:text-white">
                      <Link href="/dashboard" className="flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        View Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:text-white">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Sui Documentation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}