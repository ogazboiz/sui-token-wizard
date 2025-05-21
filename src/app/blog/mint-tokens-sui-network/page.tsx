import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
          <Link href="/" className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>

          <div className="bg-zinc-900 rounded-xl p-6 md:p-10 border border-zinc-800">
            <div className="mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                How to Mint Tokens on Sui Network in 3 steps
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-sm mb-6">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  15.05.2025
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />5 min read
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  By Sui Token Creator Team
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="bg-zinc-800 text-zinc-300 border-zinc-700">
                  Guide
                </Badge>
                <Badge variant="outline" className="bg-zinc-800 text-zinc-300 border-zinc-700">
                  Sui
                </Badge>
              </div>

              <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
                <div
                  className="absolute inset-0 bg-center bg-cover"
                  style={{ backgroundImage: "url('/placeholder.svg?height=500&width=1000')" }}
                />
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <h2>Introduction to Sui Token Minting</h2>
              <p>
                The Sui blockchain offers a powerful and flexible platform for creating and managing tokens. Whether
                you're looking to launch a new cryptocurrency, create utility tokens for your dApp, or mint NFTs, Sui
                provides the infrastructure you need. In this guide, we'll walk through the process of minting tokens on
                the Sui Network in just three simple steps.
              </p>

              <h2>Step 1: Set Up Your Sui Wallet</h2>
              <p>
                Before you can mint tokens on Sui, you'll need a compatible wallet. The Sui ecosystem supports several
                wallet options, but for this guide, we recommend using the official Sui Wallet.
              </p>
              <ul>
                <li>Download and install the Sui Wallet extension from your browser's extension store</li>
                <li>Create a new wallet or import an existing one using your seed phrase</li>
                <li>Ensure you have some SUI tokens for gas fees (you can get testnet tokens from the Sui faucet)</li>
                <li>
                  Connect your wallet to our platform by clicking the "Connect Wallet" button in the top right corner
                </li>
              </ul>

              <h2>Step 2: Configure Your Token</h2>
              <p>
                Once your wallet is set up, you can begin configuring your token. Our platform makes this process
                straightforward with an intuitive interface.
              </p>
              <ul>
                <li>Navigate to the "Create Token" section</li>
                <li>Choose between Standard or Essential token templates based on your needs</li>
                <li>
                  Set your token parameters:
                  <ul>
                    <li>Token name (e.g., "MyToken")</li>
                    <li>Token symbol (e.g., "MTK")</li>
                    <li>Total supply (e.g., 1,000,000)</li>
                    <li>Decimals (typically 9 for Sui tokens)</li>
                  </ul>
                </li>
                <li>
                  Configure additional options if needed:
                  <ul>
                    <li>Mintable: Allow creating more tokens in the future</li>
                    <li>Burnable: Allow tokens to be permanently removed from circulation</li>
                    <li>Pausable: Add the ability to pause transfers in emergency situations</li>
                  </ul>
                </li>
              </ul>

              <h2>Step 3: Deploy Your Token</h2>
              <p>With your token configured, you're ready to deploy it to the Sui blockchain.</p>
              <ul>
                <li>Review your token configuration to ensure everything is correct</li>
                <li>Click the "Deploy Token" button</li>
                <li>Confirm the transaction in your Sui Wallet</li>
                <li>Wait for the transaction to be confirmed on the blockchain (usually takes a few seconds)</li>
              </ul>
              <p>
                Once the transaction is confirmed, your token will be live on the Sui blockchain! You'll receive the
                contract address and can view your token on Sui Explorer.
              </p>

              <h2>Additional Tips for Success</h2>
              <p>Here are some additional tips to ensure your token launch is successful:</p>
              <ul>
                <li>Test on testnet first: Before deploying to mainnet, test your token on Sui testnet</li>
                <li>Consider token economics: Think carefully about your token's supply and distribution</li>
                <li>Prepare for listing: If you plan to list on DEXs, prepare liquidity pools</li>
                <li>Document your token: Create clear documentation for users and potential investors</li>
              </ul>

              <h2>Conclusion</h2>
              <p>
                Minting tokens on the Sui Network doesn't have to be complicated. With our platform, you can create and
                deploy tokens in minutes without writing a single line of code. Whether you're building a DeFi
                application, a game, or a community token, our tools make it easy to bring your vision to life on the
                Sui blockchain.
              </p>
              <p>
                Ready to create your own token?{" "}
                <Link href="/generator/mainnet" className="text-teal-400 hover:text-teal-300">
                  Get started now
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
