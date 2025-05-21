import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User, ArrowRight, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"

export const metadata: Metadata = {
  title: "How to Mint Tokens on Sui Network in 3 steps | Sui Token Creator",
  description: "Learn how to mint tokens on the Sui Network in just 3 simple steps with our comprehensive guide.",
}

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>

          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-xl">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{
                  backgroundImage: "url('/placeholder.svg?height=500&width=1000')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent" />

              {/* Floating badges */}
              <div className="absolute top-4 right-4 flex flex-wrap gap-2">
                <Badge className="bg-teal-500/80 text-white border-none px-3 py-1">Guide</Badge>
                <Badge className="bg-purple-500/80 text-white border-none px-3 py-1">Sui</Badge>
              </div>
            </div>

            <div className="p-6 md:p-10">
              {/* Article header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  How to Mint Tokens on Sui Network in 3 Steps
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-zinc-400 text-sm mb-6 border-b border-zinc-800 pb-6">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-teal-400" />
                    15.05.2025
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-teal-400" />5 min read
                  </div>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-teal-400" />
                    By Sui Token Creator Team
                  </div>
                </div>
              </div>

              {/* Article content with enhanced styling */}
              <div className="prose prose-invert prose-lg max-w-none">
                <div className="bg-teal-500/10 border-l-4 border-teal-500 p-4 rounded-r-lg mb-8">
                  <p className="text-teal-300 m-0">
                    The Sui blockchain offers a powerful and flexible platform for creating and managing tokens. In this
                    guide, we'll walk through the process of minting tokens on the Sui Network in just three simple
                    steps.
                  </p>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6 flex items-center">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 mr-3">
                    1
                  </span>
                  Set Up Your Sui Wallet
                </h2>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="col-span-2">
                    <p>
                      Before you can mint tokens on Sui, you'll need a compatible wallet. The Sui ecosystem supports
                      several wallet options, but for this guide, we recommend using the official Sui Wallet.
                    </p>
                    <ul className="space-y-2 my-6">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Download and install the Sui Wallet extension from your browser's extension store</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Create a new wallet or import an existing one using your seed phrase</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          Ensure you have some SUI tokens for gas fees (you can get testnet tokens from the Sui faucet)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          Connect your wallet to our platform by clicking the "Connect Wallet" button in the top right
                          corner
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="relative h-48 md:h-auto rounded-xl overflow-hidden bg-zinc-800">
                    <div
                      className="absolute inset-0 bg-center bg-cover"
                      style={{
                        backgroundImage: "url('/placeholder.svg?height=300&width=300')",
                        backgroundSize: "cover",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60" />
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-10" />

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6 flex items-center">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 mr-3">
                    2
                  </span>
                  Configure Your Token
                </h2>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="relative h-48 md:h-auto rounded-xl overflow-hidden bg-zinc-800 order-last md:order-first">
                    <div
                      className="absolute inset-0 bg-center bg-cover"
                      style={{
                        backgroundImage: "url('/placeholder.svg?height=300&width=300')",
                        backgroundSize: "cover",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60" />
                  </div>
                  <div className="col-span-2">
                    <p>
                      Once your wallet is set up, you can begin configuring your token. Our platform makes this process
                      straightforward with an intuitive interface.
                    </p>

                    <div className="bg-zinc-800/50 rounded-xl p-6 my-6 border border-zinc-700">
                      <h4 className="text-lg font-semibold text-white mb-4">Token Parameters</h4>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <span className="w-32 text-zinc-400">Token name:</span>
                          <span className="text-white font-mono bg-zinc-700/50 px-2 py-1 rounded">MyToken</span>
                        </li>
                        <li className="flex items-center">
                          <span className="w-32 text-zinc-400">Token symbol:</span>
                          <span className="text-white font-mono bg-zinc-700/50 px-2 py-1 rounded">MTK</span>
                        </li>
                        <li className="flex items-center">
                          <span className="w-32 text-zinc-400">Total supply:</span>
                          <span className="text-white font-mono bg-zinc-700/50 px-2 py-1 rounded">1,000,000</span>
                        </li>
                        <li className="flex items-center">
                          <span className="w-32 text-zinc-400">Decimals:</span>
                          <span className="text-white font-mono bg-zinc-700/50 px-2 py-1 rounded">9</span>
                        </li>
                      </ul>
                    </div>

                    <p>You can also configure additional options based on your needs:</p>
                    <ul className="space-y-2 my-6">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong className="text-white">Mintable:</strong> Allow creating more tokens in the future
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong className="text-white">Burnable:</strong> Allow tokens to be permanently removed from
                          circulation
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong className="text-white">Pausable:</strong> Add the ability to pause transfers in
                          emergency situations
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-10" />

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6 flex items-center">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 mr-3">
                    3
                  </span>
                  Deploy Your Token
                </h2>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="col-span-2">
                    <p>With your token configured, you're ready to deploy it to the Sui blockchain.</p>
                    <ul className="space-y-2 my-6">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Review your token configuration to ensure everything is correct</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Click the "Deploy Token" button</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Confirm the transaction in your Sui Wallet</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          Wait for the transaction to be confirmed on the blockchain (usually takes a few seconds)
                        </span>
                      </li>
                    </ul>
                    <p>
                      Once the transaction is confirmed, your token will be live on the Sui blockchain! You'll receive
                      the contract address and can view your token on Sui Explorer.
                    </p>
                  </div>
                  <div className="relative h-48 md:h-auto rounded-xl overflow-hidden bg-zinc-800">
                    <div
                      className="absolute inset-0 bg-center bg-cover"
                      style={{
                        backgroundImage: "url('/placeholder.svg?height=300&width=300')",
                        backgroundSize: "cover",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 via-teal-500/20 to-purple-500/20 rounded-xl p-6 my-10 border border-teal-500/30">
                  <h3 className="text-xl font-bold text-white mb-4">Additional Tips for Success</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-white">Test on testnet first:</strong> Before deploying to mainnet, test
                        your token on Sui testnet
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-white">Consider token economics:</strong> Think carefully about your
                        token's supply and distribution
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-white">Prepare for listing:</strong> If you plan to list on DEXs,
                        prepare liquidity pools
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-white">Document your token:</strong> Create clear documentation for
                        users and potential investors
                      </span>
                    </li>
                  </ul>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">Conclusion</h2>
                <p>
                  Minting tokens on the Sui Network doesn't have to be complicated. With our platform, you can create
                  and deploy tokens in minutes without writing a single line of code. Whether you're building a DeFi
                  application, a game, or a community token, our tools make it easy to bring your vision to life on the
                  Sui blockchain.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Ready to create your own token?</h3>
                    <p className="text-zinc-400 m-0">Get started in minutes with our easy-to-use platform.</p>
                  </div>
                  <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white" asChild>
                    <Link href="/generator/mainnet" className="flex items-center">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
