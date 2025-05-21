import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User, ArrowRight, CheckCircle, AlertTriangle, Code } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"

export const metadata: Metadata = {
  title: "How to Create a Custom Sui Token Address with a Prefix or Suffix | Sui Token Creator",
  description:
    "Learn how to create custom Sui token addresses with specific prefixes or suffixes to make your token more recognizable and branded.",
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
                <Badge className="bg-pink-500/80 text-white border-none px-3 py-1">Memes</Badge>
              </div>
            </div>

            <div className="p-6 md:p-10">
              {/* Article header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  How to Create a Custom Sui Token Address with a Prefix or Suffix
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-zinc-400 text-sm mb-6 border-b border-zinc-800 pb-6">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-teal-400" />
                    12.05.2025
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-teal-400" />7 min read
                  </div>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-teal-400" />
                    By Sui Token Creator Team
                  </div>
                </div>
              </div>

              {/* Article content with enhanced styling */}
              <div className="prose prose-invert prose-lg max-w-none">
                <div className="bg-purple-500/10 border-l-4 border-purple-500 p-4 rounded-r-lg mb-8">
                  <p className="text-purple-300 m-0">
                    In the world of cryptocurrency, branding is everything. A custom token address with a recognizable
                    prefix or suffix can significantly enhance your token's brand identity and make it stand out in the
                    crowded crypto space.
                  </p>
                </div>

                <div className="grid md:grid-cols-5 gap-6 mb-10">
                  <div className="md:col-span-3">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                      Why Custom Token Addresses Matter
                    </h2>
                    <p>
                      On the Sui blockchain, creating tokens with custom addresses is possible through a technique known
                      as "vanity addresses." These addresses can help with:
                    </p>
                    <ul className="space-y-2 my-6">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong className="text-white">Brand recognition</strong> - Makes your token instantly
                          identifiable
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong className="text-white">Trust building</strong> - Shows attention to detail and
                          professionalism
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong className="text-white">Marketing advantage</strong> - Creates talking points and
                          memorability
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong className="text-white">Scam prevention</strong> - Helps users identify official tokens
                        </span>
                      </li>
                    </ul>
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

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Understanding Sui Token Addresses</h2>
                <p>
                  Before diving into the process of creating custom addresses, it's important to understand how Sui
                  token addresses work. Unlike some other blockchains, Sui uses object IDs as addresses, which are
                  32-byte (64 character) hexadecimal strings. These addresses typically start with "0x" followed by 64
                  hexadecimal characters.
                </p>

                <div className="bg-zinc-800 rounded-xl p-4 my-6 overflow-x-auto">
                  <div className="flex items-center mb-2">
                    <Code className="h-5 w-5 text-zinc-400 mr-2" />
                    <span className="text-zinc-400 text-sm">Standard Sui token address</span>
                  </div>
                  <pre className="text-teal-300 font-mono text-sm p-2 bg-zinc-900 rounded-lg overflow-x-auto">
                    <code>0x2::coin::Coin&lt;0x6e8bca70d370c2c4ff4c23de6d53ae6da074b7a6::mycoin::MYCOIN&gt;</code>
                  </pre>
                </div>

                <div className="grid md:grid-cols-2 gap-10 my-10">
                  <div className="bg-gradient-to-br from-purple-900/30 to-zinc-900 rounded-xl p-6 border border-purple-700/30">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 mr-3">
                        1
                      </span>
                      Using Our Platform's Custom Address Feature
                    </h3>
                    <p className="text-zinc-300">
                      The easiest way to create a token with a custom address is to use our platform's built-in feature:
                    </p>
                    <ol className="space-y-2 mt-4 ml-6 list-decimal text-zinc-300">
                      <li>Navigate to the "Create Token" section</li>
                      <li>Select either Standard or Essential token template</li>
                      <li>Fill in your token details (name, symbol, supply, etc.)</li>
                      <li>Expand the "Advanced Options" section</li>
                      <li>Enable "Custom Address" and enter your desired prefix or suffix</li>
                      <li>Our system will generate an address that includes your specified characters</li>
                      <li>Deploy your token as normal</li>
                    </ol>
                    <p className="text-zinc-400 text-sm mt-4">
                      Note: The process of finding a matching address can take some time depending on the complexity of
                      your desired pattern. Simpler patterns (like 3-4 character prefixes) will be found more quickly.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-teal-900/30 to-zinc-900 rounded-xl p-6 border border-teal-700/30">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 mr-3">
                        2
                      </span>
                      Using Vanity Address Generation
                    </h3>
                    <p className="text-zinc-300">
                      For more advanced users who want complete control over their token address, you can use a vanity
                      address generator:
                    </p>
                    <ol className="space-y-2 mt-4 ml-6 list-decimal text-zinc-300">
                      <li>Use a Sui-compatible vanity address generator tool</li>
                      <li>Specify your desired prefix or suffix pattern</li>
                      <li>Run the generator until it finds a matching private key</li>
                      <li>Import the generated private key into your wallet</li>
                      <li>Use this wallet to deploy your token</li>
                    </ol>
                    <p className="text-zinc-400 text-sm mt-4">
                      This method requires more technical knowledge but offers greater flexibility in choosing your
                      custom address.
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Popular Prefix and Suffix Patterns</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                  <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
                    <h4 className="text-lg font-semibold text-white mb-3">Brand-related prefixes</h4>
                    <p className="text-zinc-300 m-0">
                      If your token is called "MoonCoin," you might want an address starting with "moon" or "m00n"
                    </p>
                  </div>

                  <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
                    <h4 className="text-lg font-semibold text-white mb-3">Repeating patterns</h4>
                    <p className="text-zinc-300 m-0">
                      Addresses with repeating digits like "0x888..." or "0xaaa..." are visually distinctive
                    </p>
                  </div>

                  <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
                    <h4 className="text-lg font-semibold text-white mb-3">Meaningful numbers</h4>
                    <p className="text-zinc-300 m-0">
                      Some creators incorporate significant numbers like founding dates
                    </p>
                  </div>

                  <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
                    <h4 className="text-lg font-semibold text-white mb-3">Meme-worthy combinations</h4>
                    <p className="text-zinc-300 m-0">
                      For meme tokens, addresses containing "69," "420," or other culturally significant numbers
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-6 rounded-r-lg my-10">
                  <div className="flex items-start">
                    <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Limitations and Considerations</h3>
                      <ul className="space-y-2 text-zinc-300">
                        <li>The longer or more specific your desired pattern, the longer it will take to generate</li>
                        <li>Only hexadecimal characters (0-9, a-f) can be used in addresses</li>
                        <li>Case sensitivity doesn't matter as addresses are typically displayed in lowercase</li>
                        <li>
                          The computational effort required increases exponentially with the length of your pattern
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Security Considerations</h2>
                <p>When using custom addresses, always prioritize security:</p>
                <ul className="space-y-2 my-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-white">Never share your private key or seed phrase</strong> with anyone,
                      including tools that generate vanity addresses
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-white">Use trusted tools</strong> for generating vanity addresses,
                      preferably open-source and audited ones
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-white">Consider the trade-off</strong> between a perfect address and
                      security - sometimes a simpler pattern is safer
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong className="text-white">Always verify the final address</strong> before making it public or
                      using it for important transactions
                    </span>
                  </li>
                </ul>

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">Conclusion</h2>
                <p>
                  Creating a token with a custom address on the Sui Network can significantly enhance your project's
                  branding and recognition. Whether you use our platform's built-in feature or a specialized vanity
                  address generator, a memorable address can be a valuable asset for your token project.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Ready to create your token with a custom address?
                    </h3>
                    <p className="text-zinc-400 m-0">Get started in minutes with our easy-to-use platform.</p>
                  </div>
                  <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-white" asChild>
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
