import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
          <Link href="/" className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>

          <div className="bg-zinc-900 rounded-xl p-6 md:p-10 border border-zinc-800">
            <div className="mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                Top 5 Sui Token Projects to Watch in 2025
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-sm mb-6">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  08.05.2025
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  10 min read
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  By Sui Token Creator Team
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="bg-zinc-800 text-zinc-300 border-zinc-700">
                  Insights
                </Badge>
                <Badge variant="outline" className="bg-zinc-800 text-zinc-300 border-zinc-700">
                  Sui
                </Badge>
                <Badge variant="outline" className="bg-zinc-800 text-zinc-300 border-zinc-700">
                  Projects
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
              <h2>The Sui Ecosystem in 2025</h2>
              <p>
                The Sui blockchain has experienced tremendous growth since its launch, establishing itself as a major
                player in the Layer 1 space. With its unique object-centric model, parallel execution, and Move
                programming language, Sui offers developers powerful tools to build the next generation of decentralized
                applications. As we look ahead to 2025, several token projects on the Sui blockchain stand out for their
                innovation, utility, and potential for growth.
              </p>

              <h2>1. SuiSwap Finance (SWAP)</h2>
              <div className="flex items-center mb-4">
                <Star className="text-yellow-500 mr-1" />
                <Star className="text-yellow-500 mr-1" />
                <Star className="text-yellow-500 mr-1" />
                <Star className="text-yellow-500 mr-1" />
                <Star className="text-yellow-500" />
              </div>
              <p>
                SuiSwap has emerged as the leading decentralized exchange (DEX) on the Sui Network. What sets SuiSwap
                apart from other DEXs is its innovative approach to liquidity provision and trading.
              </p>
              <p>
                <strong>Key features:</strong>
              </p>
              <ul>
                <li>Concentrated liquidity pools that maximize capital efficiency</li>
                <li>Multi-token pools that reduce slippage for related assets</li>
                <li>Flash loans with no upfront collateral</li>
                <li>Governance system that allows SWAP holders to vote on protocol changes</li>
              </ul>
              <p>
                With daily trading volumes exceeding $500 million and over $2 billion in total value locked (TVL),
                SuiSwap has become the backbone of DeFi on Sui. The SWAP token has seen consistent growth as the
                platform continues to innovate and attract users from other chains.
              </p>

              <h2>2. SuiLend (LEND)</h2>
              <div className="flex items-center mb-4">
                <Star className="text-yellow-500 mr-1" />
                <Star className="text-yellow-500 mr-1" />
                <Star className="text-yellow-500 mr-1" />
                <Star className="text-yellow-500 mr-1" />
                <Star className="text-zinc-600" />
              </div>
              <p>
                SuiLend has revolutionized lending and borrowing on the Sui blockchain with its innovative risk
                assessment model and dynamic interest rates.
              </p>
              <p>
                <strong>Key features:</strong>
              </p>
              <ul>
                <li>AI-powered risk assessment for borrowers</li>
                <li>Isolated lending markets to contain risk</li>
                <li>Cross-chain collateral options</li>
                <li>Interest rate optimization algorithm</li>
              </ul>
              <p>
                What makes SuiLend particularly interesting is its use of the Move language's resource-oriented
                programming model to create secure lending pools with minimal risk of exploits. The LEND token serves
                both as a governance token and as a way to reduce borrowing fees and earn a share of protocol revenue.
              </p>

              <h2>3. EternalRealms (REALM)</h2>
              <div className="flex items-center mb-4">
                <Star className="text-yellow-500 mr-1" />
                <Star className="text-yellow-500 mr-1" />
                <Star className="text-yellow-500 mr-1" />
                <Star className="text-yellow-500 mr-1" />
                <Star className="text-zinc-600" />
              </div>
              <p>
                Gaming on blockchain has found a new home with EternalRealms, a massively multiplayer online
                role-playing game (MMORPG) built entirely on Sui. The game leverages Sui's high throughput and low
                latency to deliver a gaming experience comparable to traditional games while offering true ownership of
                in-game assets.
              </p>
              <p>
                <strong>Key features:</strong>
              </p>
              <ul>
                <li>Fully on-chain game mechanics</li>
                <li>Player-owned and created lands and items</li>
                <li>Dynamic NFT characters that evolve based on gameplay</li>
                <li>Play-to-earn mechanics that reward skilled players</li>
              </ul>
              <p>
                The REALM token is used for governance, staking, and as the primary currency within the game. With over
                500,000 daily active users and partnerships with major gaming studios, EternalRealms is positioned to
                bring blockchain gaming to the mainstream.
              </p>

              <h2>4. SuiIdentity (SID)</h2>
              <div className="flex items-center mb-4">
                <Star className="text-yellow-500 mr-1" />
                <Star className="text-yellow-500 mr-1" />
                <Star className="text-yellow-500 mr-1" />
                <Star className="text-yellow-500 mr-1" />
                <Star className="text-yellow-500" />
              </div>
              <p>
                Digital identity is a critical component of Web3, and SuiIdentity is leading the way with its
                comprehensive identity solution built on Sui.
              </p>
              <p>
                <strong>Key features:</strong>
              </p>
              <ul>
                <li>Self-sovereign identity that users fully control</li>
                <li>Verifiable credentials for KYC, credit scoring, and more</li>
                <li>Privacy-preserving zero-knowledge proofs</li>
                <li>Cross-chain identity verification</li>
              </ul>
              <p>
                The SID token is used to pay for identity verification services and to participate in the governance of
                the protocol. With regulations around digital identity increasing globally, SuiIdentity is
                well-positioned to become the standard for blockchain identity verification.
              </p>

              <h2>5. GreenSui (GREEN)</h2>
              <div className="flex items-center mb-4">
                <Star className="text-yellow-500 mr-1" />
                <Star className="text-yellow-500 mr-1" />
                <Star className="text-yellow-500 mr-1" />
                <Star className="text-zinc-600 mr-1" />
                <Star className="text-zinc-600" />
              </div>
              <p>
                As environmental concerns around blockchain continue to grow, GreenSui has emerged as a leading solution
                for carbon offsetting and environmental impact tracking on the Sui blockchain.
              </p>
              <p>
                <strong>Key features:</strong>
              </p>
              <ul>
                <li>Tokenized carbon credits verified by third-party auditors</li>
                <li>Real-time tracking of environmental impact</li>
                <li>Integration with major corporations for ESG reporting</li>
                <li>Funding for renewable energy projects</li>
              </ul>
              <p>
                The GREEN token represents carbon credits and can be used by individuals and businesses to offset their
                carbon footprint. While still in its early stages, GreenSui has already partnered with several Fortune
                500 companies and environmental organizations, making it a project with significant real-world impact.
              </p>

              <h2>How to Invest in These Projects</h2>
              <p>If you're interested in investing in these promising Sui token projects, here are some options:</p>
              <ul>
                <li>Purchase tokens directly on SuiSwap or other DEXs</li>
                <li>Participate in staking and liquidity provision to earn rewards</li>
                <li>Join governance by holding governance tokens and participating in voting</li>
                <li>Consider dollar-cost averaging to manage volatility</li>
              </ul>
              <p>
                Remember that all investments carry risk, especially in the cryptocurrency space. Always do your own
                research (DYOR) and never invest more than you can afford to lose.
              </p>

              <h2>Conclusion</h2>
              <p>
                The Sui ecosystem is flourishing with innovative projects that leverage the blockchain's unique
                capabilities. From DeFi to gaming, identity, and environmental solutions, these top 5 projects represent
                the diversity and potential of the Sui Network. As we move through 2025, these projects are likely to
                play a significant role in shaping the future of the Sui ecosystem and the broader blockchain landscape.
              </p>
              <p>
                Want to create your own token on Sui?{" "}
                <Link href="/generator/mainnet" className="text-teal-400 hover:text-teal-300">
                  Get started now
                </Link>{" "}
                with our easy-to-use platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
