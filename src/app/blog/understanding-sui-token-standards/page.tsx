import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User, ArrowRight, Code, CheckCircle, BookOpen, FileCode } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"

export const metadata: Metadata = {
  title: "Understanding Token Standards on Sui Blockchain | Sui Token Creator",
  description:
    "A comprehensive guide to understanding the different token standards on the Sui blockchain, their features, and use cases.",
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
                <Badge className="bg-amber-500/80 text-white border-none px-3 py-1">Education</Badge>
                <Badge className="bg-purple-500/80 text-white border-none px-3 py-1">Standards</Badge>
              </div>
            </div>

            <div className="p-6 md:p-10">
              {/* Article header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Understanding Token Standards on Sui Blockchain
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-zinc-400 text-sm mb-6 border-b border-zinc-800 pb-6">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-teal-400" />
                    01.05.2025
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-teal-400" />
                    12 min read
                  </div>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-teal-400" />
                    By Sui Token Creator Team
                  </div>
                </div>
              </div>

              {/* Article content with enhanced styling */}
              <div className="prose prose-invert prose-lg max-w-none">
                <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 rounded-r-lg mb-8">
                  <p className="text-amber-300 m-0">
                    Token standards are the backbone of blockchain ecosystems, providing consistent interfaces and
                    behaviors for digital assets. On the Sui blockchain, token standards leverage the unique features of
                    the Move programming language to offer enhanced security, flexibility, and functionality compared to
                    other blockchains.
                  </p>
                </div>

                <div className="grid md:grid-cols-5 gap-6 mb-10">
                  <div className="md:col-span-3">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                      Introduction to Sui Token Standards
                    </h2>
                    <p>
                      This article explores the main token standards on Sui, their features, and how they compare to
                      standards on other blockchains. Understanding these standards is crucial for developers,
                      investors, and users looking to participate in the Sui ecosystem.
                    </p>
                    <div className="flex flex-wrap gap-4 my-6">
                      <div className="flex items-center bg-zinc-800/50 rounded-lg px-4 py-2">
                        <BookOpen className="h-5 w-5 text-amber-400 mr-2" />
                        <span>Comprehensive Guide</span>
                      </div>
                      <div className="flex items-center bg-zinc-800/50 rounded-lg px-4 py-2">
                        <FileCode className="h-5 w-5 text-amber-400 mr-2" />
                        <span>Code Examples</span>
                      </div>
                      <div className="flex items-center bg-zinc-800/50 rounded-lg px-4 py-2">
                        <CheckCircle className="h-5 w-5 text-amber-400 mr-2" />
                        <span>Best Practices</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 relative h-48 md:h-auto rounded-xl overflow-hidden bg-zinc-800">
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

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">The Sui Coin Standard</h2>
                <p>
                  The most basic and widely used token standard on Sui is the Coin standard, defined in the Sui
                  framework. This standard is analogous to ERC-20 on Ethereum but with significant improvements in terms
                  of security and functionality.
                </p>

                <div className="bg-gradient-to-br from-purple-900/30 to-zinc-900 rounded-xl p-6 border border-purple-700/30 my-6">
                  <h3 className="text-xl font-bold text-white mb-4">Key features of the Sui Coin standard:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-white">Object-centric model:</strong>
                        <p className="text-zinc-300 mt-1">
                          Unlike account-based models in other blockchains, Sui tokens are objects that can be owned and
                          transferred
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-white">Type safety:</strong>
                        <p className="text-zinc-300 mt-1">
                          Move's type system prevents common vulnerabilities like reentrancy attacks
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-white">Built-in treasury:</strong>
                        <p className="text-zinc-300 mt-1">
                          The standard includes a treasury capability for controlled minting
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-white">Metadata:</strong>
                        <p className="text-zinc-300 mt-1">Rich metadata can be attached to token definitions</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <p>
                  The Coin standard is implemented through the <code>0x2::coin::Coin</code> module in the Sui framework.
                  Here's a simplified example of what a Coin type looks like:
                </p>

                <div className="bg-zinc-800 rounded-xl p-4 my-6 overflow-x-auto">
                  <div className="flex items-center mb-2">
                    <Code className="h-5 w-5 text-zinc-400 mr-2" />
                    <span className="text-zinc-400 text-sm">Coin structure in Move</span>
                  </div>
                  <pre className="text-teal-300 font-mono text-sm p-4 bg-zinc-900 rounded-lg overflow-x-auto">
                    <code>{`struct Coin<T> has key, store {
    id: UID,
    balance: Balance<T>,
}

struct Balance<T> has store {
    value: u64,
}`}</code>
                  </pre>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">
                  Creating Custom Tokens with the Coin Standard
                </h2>
                <p>To create a custom token using the Coin standard, you need to:</p>
                <ol className="space-y-2 my-6 ml-6 list-decimal">
                  <li>Define a token type (a struct that serves as a type parameter)</li>
                  <li>Initialize the coin with metadata</li>
                  <li>Create a treasury cap for controlled minting</li>
                </ol>

                <div className="bg-zinc-800 rounded-xl p-4 my-6 overflow-x-auto">
                  <div className="flex items-center mb-2">
                    <Code className="h-5 w-5 text-zinc-400 mr-2" />
                    <span className="text-zinc-400 text-sm">Creating a custom token</span>
                  </div>
                  <pre className="text-teal-300 font-mono text-sm p-4 bg-zinc-900 rounded-lg overflow-x-auto">
                    <code>{`// Define the token type
struct MYCOIN has drop {}

// Initialize the coin
public fun init(ctx: &mut TxContext) {
    let (treasury_cap, metadata) = coin::create_currency<MYCOIN>(
        MYCOIN {},
        9, // decimals
        b"MYCOIN", // symbol
        b"My Coin", // name
        b"A sample coin on Sui", // description
        option::none(), // icon URL
        ctx,
    );
    
    // Transfer the treasury cap to the sender
    transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
    
    // Share the metadata object
    transfer::public_share_object(metadata);
}`}</code>
                  </pre>
                </div>

                <div className="grid md:grid-cols-2 gap-10 my-10">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">NFT Standards on Sui</h2>
                    <p>
                      Non-fungible tokens (NFTs) on Sui are more flexible and powerful than their counterparts on other
                      blockchains like Ethereum's ERC-721 or ERC-1155. On Sui, NFTs are simply objects with unique
                      properties, and there are several standards and frameworks for creating them.
                    </p>

                    <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700 my-6">
                      <h4 className="text-lg font-semibold text-white mb-3">The main NFT standards on Sui include:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-amber-400 mr-2">•</span>
                          <span>
                            <strong className="text-white">Sui Objects:</strong> The most basic form of NFTs, where each
                            object has a unique ID
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-400 mr-2">•</span>
                          <span>
                            <strong className="text-white">Sui NFT Protocol:</strong> A more structured standard with
                            metadata, royalties, and marketplace integration
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-400 mr-2">•</span>
                          <span>
                            <strong className="text-white">Dynamic NFTs:</strong> NFTs that can change their properties
                            based on external events or user interactions
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="bg-zinc-800 rounded-xl p-4 overflow-x-auto h-full">
                      <div className="flex items-center mb-2">
                        <Code className="h-5 w-5 text-zinc-400 mr-2" />
                        <span className="text-zinc-400 text-sm">Creating a basic NFT</span>
                      </div>
                      <pre className="text-teal-300 font-mono text-sm p-4 bg-zinc-900 rounded-lg overflow-x-auto h-[calc(100%-2rem)]">
                        <code>{`struct MyNFT has key, store {
    id: UID,
    name: String,
    description: String,
    url: Url,
    // Additional properties as needed
}

public fun mint_nft(
    name: String,
    description: String,
    url: Url,
    ctx: &mut TxContext
): MyNFT {
    MyNFT {
        id: object::new(ctx),
        name,
        description,
        url,
    }
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">Fungible Token Extensions</h2>
                <p>
                  Beyond the basic Coin standard, Sui supports various extensions for fungible tokens that add
                  functionality similar to what you might find in ERC-20 extensions on Ethereum.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                  <div className="bg-gradient-to-br from-purple-900/20 to-zinc-900 rounded-xl p-5 border border-purple-700/30">
                    <h4 className="text-lg font-semibold text-white mb-3">Mintable</h4>
                    <p className="text-zinc-300 text-sm">
                      Allows new tokens to be created after the initial supply, giving flexibility for future expansion.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-red-900/20 to-zinc-900 rounded-xl p-5 border border-red-700/30">
                    <h4 className="text-lg font-semibold text-white mb-3">Burnable</h4>
                    <p className="text-zinc-300 text-sm">
                      Allows tokens to be permanently removed from circulation, potentially increasing value of
                      remaining tokens.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-900/20 to-zinc-900 rounded-xl p-5 border border-yellow-700/30">
                    <h4 className="text-lg font-semibold text-white mb-3">Pausable</h4>
                    <p className="text-zinc-300 text-sm">
                      Allows token transfers to be temporarily suspended, useful for emergency situations or upgrades.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-900/20 to-zinc-900 rounded-xl p-5 border border-blue-700/30">
                    <h4 className="text-lg font-semibold text-white mb-3">Capped Supply</h4>
                    <p className="text-zinc-300 text-sm">
                      Enforces a maximum token supply, creating scarcity and potentially supporting token value.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-900/20 to-zinc-900 rounded-xl p-5 border border-green-700/30">
                    <h4 className="text-lg font-semibold text-white mb-3">Access Control</h4>
                    <p className="text-zinc-300 text-sm">
                      Restricts certain operations to authorized addresses, enhancing security and governance.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-teal-900/20 to-zinc-900 rounded-xl p-5 border border-teal-700/30">
                    <h4 className="text-lg font-semibold text-white mb-3">Metadata</h4>
                    <p className="text-zinc-300 text-sm">
                      Enhanced metadata capabilities for richer token information and integration with applications.
                    </p>
                  </div>
                </div>

                <p>
                  These extensions can be implemented by wrapping the basic Coin functionality with additional
                  capabilities and restrictions.
                </p>

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">
                  Comparing Sui Token Standards with Other Blockchains
                </h2>
                <p>
                  To understand the advantages of Sui token standards, it's helpful to compare them with standards on
                  other popular blockchains:
                </p>

                <div className="overflow-x-auto my-8">
                  <table className="w-full border-collapse border border-zinc-700 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-900/30 to-zinc-800">
                        <th className="border border-zinc-700 p-3 text-left">Feature</th>
                        <th className="border border-zinc-700 p-3 text-left">Sui (Coin)</th>
                        <th className="border border-zinc-700 p-3 text-left">Ethereum (ERC-20)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-zinc-800/50">
                        <td className="border border-zinc-700 p-3">Programming Model</td>
                        <td className="border border-zinc-700 p-3">Object-centric</td>
                        <td className="border border-zinc-700 p-3">Account-based</td>
                      </tr>
                      <tr className="bg-zinc-900/50">
                        <td className="border border-zinc-700 p-3">Security</td>
                        <td className="border border-zinc-700 p-3 text-teal-400">
                          Type safety prevents common vulnerabilities
                        </td>
                        <td className="border border-zinc-700 p-3 text-zinc-400">
                          Vulnerable to reentrancy and other attacks
                        </td>
                      </tr>
                      <tr className="bg-zinc-800/50">
                        <td className="border border-zinc-700 p-3">Transaction Speed</td>
                        <td className="border border-zinc-700 p-3 text-teal-400">
                          High throughput with parallel execution
                        </td>
                        <td className="border border-zinc-700 p-3 text-zinc-400">
                          Limited by block space and gas wars
                        </td>
                      </tr>
                      <tr className="bg-zinc-900/50">
                        <td className="border border-zinc-700 p-3">Gas Efficiency</td>
                        <td className="border border-zinc-700 p-3 text-teal-400">
                          More efficient due to Move's design
                        </td>
                        <td className="border border-zinc-700 p-3 text-zinc-400">
                          Can be expensive during network congestion
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">
                  Best Practices for Token Creation on Sui
                </h2>
                <p>When creating tokens on Sui, consider these best practices:</p>

                <div className="bg-gradient-to-br from-amber-900/20 to-zinc-900 rounded-xl p-6 border border-amber-700/30 my-8">
                  <ol className="space-y-4 ml-6 list-decimal">
                    <li>
                      <strong className="text-white">Choose the right standard:</strong>
                      <p className="text-zinc-300 mt-1">
                        Select the token standard that best fits your use case. For fungible tokens, the Coin standard
                        is usually appropriate, while for NFTs, consider the complexity and features you need.
                      </p>
                    </li>
                    <li>
                      <strong className="text-white">Security first:</strong>
                      <p className="text-zinc-300 mt-1">
                        Leverage Move's security features and consider formal verification. The type safety of Move
                        helps prevent many common vulnerabilities, but careful design is still essential.
                      </p>
                    </li>
                    <li>
                      <strong className="text-white">Plan for upgrades:</strong>
                      <p className="text-zinc-300 mt-1">
                        Consider how your token might need to evolve over time. Design with flexibility in mind,
                        potentially using upgrade mechanisms or modular approaches.
                      </p>
                    </li>
                    <li>
                      <strong className="text-white">Test thoroughly:</strong>
                      <p className="text-zinc-300 mt-1">
                        Use Sui's testing framework to validate your token's behavior. Comprehensive testing can catch
                        issues before deployment and build confidence in your implementation.
                      </p>
                    </li>
                    <li>
                      <strong className="text-white">Document clearly:</strong>
                      <p className="text-zinc-300 mt-1">
                        Provide clear documentation for users and integrators. Good documentation helps adoption and
                        reduces support burden.
                      </p>
                    </li>
                  </ol>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">
                  The Future of Token Standards on Sui
                </h2>
                <p>
                  The Sui ecosystem is still evolving, and we can expect to see new token standards and extensions
                  emerge as the platform matures. Some areas of active development include:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                  <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
                    <h4 className="text-lg font-semibold text-white mb-3">Interoperability standards</h4>
                    <p className="text-zinc-300 m-0">
                      Making it easier to bridge tokens between Sui and other blockchains
                    </p>
                  </div>

                  <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
                    <h4 className="text-lg font-semibold text-white mb-3">Programmable tokens</h4>
                    <p className="text-zinc-300 m-0">Tokens with built-in logic and state transitions</p>
                  </div>

                  <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
                    <h4 className="text-lg font-semibold text-white mb-3">Soulbound tokens</h4>
                    <p className="text-zinc-300 m-0">
                      Non-transferable tokens representing credentials or achievements
                    </p>
                  </div>

                  <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
                    <h4 className="text-lg font-semibold text-white mb-3">Privacy-preserving tokens</h4>
                    <p className="text-zinc-300 m-0">Tokens with enhanced privacy features</p>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">Conclusion</h2>
                <p>
                  Token standards on the Sui blockchain leverage the unique features of the Move programming language to
                  provide enhanced security, flexibility, and functionality. Whether you're creating fungible tokens or
                  NFTs, understanding these standards is essential for building successful projects on Sui.
                </p>
                <p>
                  By choosing the right standard and following best practices, you can create tokens that are secure,
                  efficient, and aligned with your project's goals. As the Sui ecosystem continues to grow, we can
                  expect to see even more innovative token standards emerge.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Ready to create your own token on Sui?</h3>
                    <p className="text-zinc-400 m-0">Get started in minutes with our easy-to-use platform.</p>
                  </div>
                  <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white" asChild>
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
