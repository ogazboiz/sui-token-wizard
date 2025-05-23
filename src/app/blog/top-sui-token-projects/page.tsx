import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User, Star, ArrowRight, TrendingUp, Shield, Zap, Users, Leaf } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"

export const metadata: Metadata = {
  title: "Top 5 Sui Token Projects to Watch in 2025 | Sui Token Creator",
  description:
    "Discover the most promising Sui token projects to watch in 2025, from DeFi innovations to gaming tokens and more.",
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
                <Badge className="bg-blue-500/80 text-white border-none px-3 py-1">Insights</Badge>
                <Badge className="bg-purple-500/80 text-white border-none px-3 py-1">Sui</Badge>
                <Badge className="bg-teal-500/80 text-white border-none px-3 py-1">Projects</Badge>
              </div>
            </div>

            <div className="p-6 md:p-10">
              {/* Article header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Top 5 Sui Token Projects to Watch in 2025
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-zinc-400 text-sm mb-6 border-b border-zinc-800 pb-6">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-teal-400" />
                    08.05.2025
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-teal-400" />
                    10 min read
                  </div>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-teal-400" />
                    By Sui Token Creator Team
                  </div>
                </div>
              </div>

              {/* Article content with enhanced styling */}
              <div className="prose prose-invert prose-lg max-w-none">
                <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-r-lg mb-8">
                  <p className="text-blue-300 m-0">
                    The Sui blockchain has experienced tremendous growth since its launch, establishing itself as a
                    major player in the Layer 1 space. As we look ahead to 2025, several token projects on the Sui
                    blockchain stand out for their innovation, utility, and potential for growth.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-10">
                  <div className="md:col-span-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">The Sui Ecosystem in 2025</h2>
                    <p>
                      With its unique object-centric model, parallel execution, and Move programming language, Sui
                      offers developers powerful tools to build the next generation of decentralized applications. The
                      ecosystem has matured significantly, with several key projects leading the way in different
                      sectors:
                    </p>
                    <ul className="space-y-2 my-6">
                      <li className="flex items-start">
                        <TrendingUp className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong className="text-white">DeFi</strong> - Decentralized exchanges, lending platforms, and
                          yield aggregators
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Users className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong className="text-white">Gaming</strong> - On-chain games with true asset ownership
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Shield className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong className="text-white">Identity</strong> - Self-sovereign identity solutions
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Leaf className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong className="text-white">Sustainability</strong> - Environmental impact tracking and
                          carbon credits
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

                {/* Project 1 */}
                <div className="bg-gradient-to-br from-blue-900/20 to-zinc-900 rounded-xl p-6 border border-blue-700/30 mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 mr-3">
                        1
                      </span>
                      SuiSwap Finance (SWAP)
                    </h2>
                    <div className="flex items-center">
                      <Star className="text-yellow-500 h-5 w-5" />
                      <Star className="text-yellow-500 h-5 w-5" />
                      <Star className="text-yellow-500 h-5 w-5" />
                      <Star className="text-yellow-500 h-5 w-5" />
                      <Star className="text-yellow-500 h-5 w-5" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <p>
                        SuiSwap has emerged as the leading decentralized exchange (DEX) on the Sui Network. What sets
                        SuiSwap apart from other DEXs is its innovative approach to liquidity provision and trading.
                      </p>

                      <div className="bg-zinc-800/50 rounded-lg p-4 my-4">
                        <h4 className="text-lg font-semibold text-white mb-2">Key features:</h4>
                        <ul className="space-y-1">
                          <li className="flex items-start">
                            <span className="text-blue-400 mr-2">•</span>
                            <span>Concentrated liquidity pools that maximize capital efficiency</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-400 mr-2">•</span>
                            <span>Multi-token pools that reduce slippage for related assets</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-400 mr-2">•</span>
                            <span>Flash loans with no upfront collateral</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-400 mr-2">•</span>
                            <span>Governance system that allows SWAP holders to vote on protocol changes</span>
                          </li>
                        </ul>
                      </div>

                      <p>
                        With daily trading volumes exceeding $500 million and over $2 billion in total value locked
                        (TVL), SuiSwap has become the backbone of DeFi on Sui. The SWAP token has seen consistent growth
                        as the platform continues to innovate and attract users from other chains.
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
                </div>

                {/* Project 2 */}
                <div className="bg-gradient-to-br from-purple-900/20 to-zinc-900 rounded-xl p-6 border border-purple-700/30 mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 mr-3">
                        2
                      </span>
                      SuiLend (LEND)
                    </h2>
                    <div className="flex items-center">
                      <Star className="text-yellow-500 h-5 w-5" />
                      <Star className="text-yellow-500 h-5 w-5" />
                      <Star className="text-yellow-500 h-5 w-5" />
                      <Star className="text-yellow-500 h-5 w-5" />
                      <Star className="text-zinc-600 h-5 w-5" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
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
                    <div className="md:col-span-2">
                      <p>
                        SuiLend has revolutionized lending and borrowing on the Sui blockchain with its innovative risk
                        assessment model and dynamic interest rates.
                      </p>

                      <div className="bg-zinc-800/50 rounded-lg p-4 my-4">
                        <h4 className="text-lg font-semibold text-white mb-2">Key features:</h4>
                        <ul className="space-y-1">
                          <li className="flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            <span>AI-powered risk assessment for borrowers</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            <span>Isolated lending markets to contain risk</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            <span>Cross-chain collateral options</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            <span>Interest rate optimization algorithm</span>
                          </li>
                        </ul>
                      </div>

                      <p>
                        What makes SuiLend particularly interesting is its use of the Move language's resource-oriented
                        programming model to create secure lending pools with minimal risk of exploits. The LEND token
                        serves both as a governance token and as a way to reduce borrowing fees and earn a share of
                        protocol revenue.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Project 3 */}
                <div className="bg-gradient-to-br from-pink-900/20 to-zinc-900 rounded-xl p-6 border border-pink-700/30 mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 mr-3">
                        3
                      </span>
                      EternalRealms (REALM)
                    </h2>
                    <div className="flex items-center">
                      <Star className="text-yellow-500 h-5 w-5" />
                      <Star className="text-yellow-500 h-5 w-5" />
                      <Star className="text-yellow-500 h-5 w-5" />
                      <Star className="text-yellow-500 h-5 w-5" />
                      <Star className="text-zinc-600 h-5 w-5" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <p>
                        Gaming on blockchain has found a new home with EternalRealms, a massively multiplayer online
                        role-playing game (MMORPG) built entirely on Sui. The game leverages Sui's high throughput and
                        low latency to deliver a gaming experience comparable to traditional games while offering true
                        ownership of in-game assets.
                      </p>

                      <div className="bg-zinc-800/50 rounded-lg p-4 my-4">
                        <h4 className="text-lg font-semibold text-white mb-2">Key features:</h4>
                        <ul className="space-y-1">
                          <li className="flex items-start">
                            <span className="text-pink-400 mr-2">•</span>
                            <span>Fully on-chain game mechanics</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-pink-400 mr-2">•</span>
                            <span>Player-owned and created lands and items</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-pink-400 mr-2">•</span>
                            <span>Dynamic NFT characters that evolve based on gameplay</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-pink-400 mr-2">•</span>
                            <span>Play-to-earn mechanics that reward skilled players</span>
                          </li>
                        </ul>
                      </div>

                      <p>
                        The REALM token is used for governance, staking, and as the primary currency within the game.
                        With over 500,000 daily active users and partnerships with major gaming studios, EternalRealms
                        is positioned to bring blockchain gaming to the mainstream.
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
                </div>

                {/* Project 4 */}
                <div className="bg-gradient-to-br from-teal-900/20 to-zinc-900 rounded-xl p-6 border border-teal-700/30 mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 mr-3">
                        4
                      </span>
                      SuiIdentity (SID)
                    </h2>
                    <div className="flex items-center">
                      <Star className="text-yellow-500 h-5 w-5" />
                      <Star className="text-yellow-500 h-5 w-5" />
                      <Star className="text-yellow-500 h-5 w-5" />
                      <Star className="text-yellow-500 h-5 w-5" />
                      <Star className="text-yellow-500 h-5 w-5" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
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
                    <div className="md:col-span-2">
                      <p>
                        Digital identity is a critical component of Web3, and SuiIdentity is leading the way with its
                        comprehensive identity solution built on Sui.
                      </p>

                      <div className="bg-zinc-800/50 rounded-lg p-4 my-4">
                        <h4 className="text-lg font-semibold text-white mb-2">Key features:</h4>
                        <ul className="space-y-1">
                          <li className="flex items-start">
                            <span className="text-teal-400 mr-2">•</span>
                            <span>Self-sovereign identity that users fully control</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-teal-400 mr-2">•</span>
                            <span>Verifiable credentials for KYC, credit scoring, and more</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-teal-400 mr-2">•</span>
                            <span>Privacy-preserving zero-knowledge proofs</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-teal-400 mr-2">•</span>
                            <span>Cross-chain identity verification</span>
                          </li>
                        </ul>
                      </div>

                      <p>
                        The SID token is used to pay for identity verification services and to participate in the
                        governance of the protocol. With regulations around digital identity increasing globally,
                        SuiIdentity is well-positioned to become the standard for blockchain identity verification.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Project 5 */}
                <div className="bg-gradient-to-br from-green-900/20 to-zinc-900 rounded-xl p-6 border border-green-700/30 mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 text-green-400 mr-3">
                        5
                      </span>
                      GreenSui (GREEN)
                    </h2>
                    <div className="flex items-center">
                      <Star className="text-yellow-500 h-5 w-5" />
                      <Star className="text-yellow-500 h-5 w-5" />
                      <Star className="text-yellow-500 h-5 w-5" />
                      <Star className="text-zinc-600 h-5 w-5" />
                      <Star className="text-zinc-600 h-5 w-5" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <p>
                        As environmental concerns around blockchain continue to grow, GreenSui has emerged as a leading
                        solution for carbon offsetting and environmental impact tracking on the Sui blockchain.
                      </p>

                      <div className="bg-zinc-800/50 rounded-lg p-4 my-4">
                        <h4 className="text-lg font-semibold text-white mb-2">Key features:</h4>
                        <ul className="space-y-1">
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2">•</span>
                            <span>Tokenized carbon credits verified by third-party auditors</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2">•</span>
                            <span>Real-time tracking of environmental impact</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2">•</span>
                            <span>Integration with major corporations for ESG reporting</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-400 mr-2">•</span>
                            <span>Funding for renewable energy projects</span>
                          </li>
                        </ul>
                      </div>

                      <p>
                        The GREEN token represents carbon credits and can be used by individuals and businesses to
                        offset their carbon footprint. While still in its early stages, GreenSui has already partnered
                        with several Fortune 500 companies and environmental organizations, making it a project with
                        significant real-world impact.
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
                </div>

                <div className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 rounded-xl p-6 my-10 border border-blue-500/30">
                  <h3 className="text-xl font-bold text-white mb-4">How to Invest in These Projects</h3>
                  <p className="text-zinc-300">
                    If you're interested in investing in these promising Sui token projects, here are some options:
                  </p>
                  <ul className="space-y-2 mt-4">
                    <li className="flex items-start">
                      <Zap className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Purchase tokens directly on SuiSwap or other DEXs</span>
                    </li>
                    <li className="flex items-start">
                      <Zap className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Participate in staking and liquidity provision to earn rewards</span>
                    </li>
                    <li className="flex items-start">
                      <Zap className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Join governance by holding governance tokens and participating in voting</span>
                    </li>
                    <li className="flex items-start">
                      <Zap className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Consider dollar-cost averaging to manage volatility</span>
                    </li>
                  </ul>
                  <p className="text-zinc-300 mt-4">
                    Remember that all investments carry risk, especially in the cryptocurrency space. Always do your own
                    research (DYOR) and never invest more than you can afford to lose.
                  </p>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">Conclusion</h2>
                <p>
                  The Sui ecosystem is flourishing with innovative projects that leverage the blockchain's unique
                  capabilities. From DeFi to gaming, identity, and environmental solutions, these top 5 projects
                  represent the diversity and potential of the Sui Network. As we move through 2025, these projects are
                  likely to play a significant role in shaping the future of the Sui ecosystem and the broader
                  blockchain landscape.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Want to create your own token on Sui?</h3>
                    <p className="text-zinc-400 m-0">Get started in minutes with our easy-to-use platform.</p>
                  </div>
                  <Button size="lg" className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white" asChild>
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
