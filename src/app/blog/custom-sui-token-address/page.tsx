import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
          <Link href="/" className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>

          <div className="bg-zinc-900 rounded-xl p-6 md:p-10 border border-zinc-800">
            <div className="mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                How to Create a Custom Sui Token Address with a Prefix or Suffix
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-sm mb-6">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  12.05.2025
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />7 min read
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
                <Badge variant="outline" className="bg-zinc-800 text-zinc-300 border-zinc-700">
                  Memes
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
              <h2>Why Custom Token Addresses Matter</h2>
              <p>
                In the world of cryptocurrency, branding is everything. A custom token address with a recognizable
                prefix or suffix can significantly enhance your token's brand identity and make it stand out in the
                crowded crypto space. On the Sui blockchain, creating tokens with custom addresses is possible through a
                technique known as "vanity addresses."
              </p>

              <h2>Understanding Sui Token Addresses</h2>
              <p>
                Before diving into the process of creating custom addresses, it's important to understand how Sui token
                addresses work. Unlike some other blockchains, Sui uses object IDs as addresses, which are 32-byte (64
                character) hexadecimal strings. These addresses typically start with "0x" followed by 64 hexadecimal
                characters.
              </p>
              <p>For example, a standard Sui token address might look like:</p>
              <pre>
                <code>0x2::coin::Coin&lt;0x6e8bca70d370c2c4ff4c23de6d53ae6da074b7a6::mycoin::MYCOIN&gt;</code>
              </pre>

              <h2>Method 1: Using Our Platform's Custom Address Feature</h2>
              <p>The easiest way to create a token with a custom address is to use our platform's built-in feature:</p>
              <ol>
                <li>Navigate to the "Create Token" section</li>
                <li>Select either Standard or Essential token template</li>
                <li>Fill in your token details (name, symbol, supply, etc.)</li>
                <li>Expand the "Advanced Options" section</li>
                <li>Enable "Custom Address" and enter your desired prefix or suffix</li>
                <li>Our system will generate an address that includes your specified characters</li>
                <li>Deploy your token as normal</li>
              </ol>
              <p>
                Note: The process of finding a matching address can take some time depending on the complexity of your
                desired pattern. Simpler patterns (like 3-4 character prefixes) will be found more quickly.
              </p>

              <h2>Method 2: Using Vanity Address Generation</h2>
              <p>
                For more advanced users who want complete control over their token address, you can use a vanity address
                generator:
              </p>
              <ol>
                <li>Use a Sui-compatible vanity address generator tool</li>
                <li>Specify your desired prefix or suffix pattern</li>
                <li>Run the generator until it finds a matching private key</li>
                <li>Import the generated private key into your wallet</li>
                <li>Use this wallet to deploy your token</li>
              </ol>
              <p>
                This method requires more technical knowledge but offers greater flexibility in choosing your custom
                address.
              </p>

              <h2>Popular Prefix and Suffix Patterns</h2>
              <p>When choosing a custom pattern for your token address, consider these popular options:</p>
              <ul>
                <li>
                  <strong>Brand-related prefixes:</strong> If your token is called "MoonCoin," you might want an address
                  starting with "moon" or "m00n"
                </li>
                <li>
                  <strong>Repeating patterns:</strong> Addresses with repeating digits like "0x888..." or "0xaaa..." are
                  visually distinctive
                </li>
                <li>
                  <strong>Meaningful numbers:</strong> Some creators incorporate significant numbers like founding dates
                </li>
                <li>
                  <strong>Meme-worthy combinations:</strong> For meme tokens, addresses containing "69," "420," or other
                  culturally significant numbers can enhance brand identity
                </li>
              </ul>

              <h2>Limitations and Considerations</h2>
              <p>When creating custom token addresses, keep these limitations in mind:</p>
              <ul>
                <li>The longer or more specific your desired pattern, the longer it will take to generate</li>
                <li>Only hexadecimal characters (0-9, a-f) can be used in addresses</li>
                <li>Case sensitivity doesn't matter as addresses are typically displayed in lowercase</li>
                <li>The computational effort required increases exponentially with the length of your pattern</li>
              </ul>

              <h2>Security Considerations</h2>
              <p>When using custom addresses, always prioritize security:</p>
              <ul>
                <li>Never share your private key or seed phrase</li>
                <li>Use trusted tools for generating vanity addresses</li>
                <li>Consider the trade-off between a perfect address and security</li>
                <li>Always verify the final address before making it public</li>
              </ul>

              <h2>Conclusion</h2>
              <p>
                Creating a token with a custom address on the Sui Network can significantly enhance your project's
                branding and recognition. Whether you use our platform's built-in feature or a specialized vanity
                address generator, a memorable address can be a valuable asset for your token project.
              </p>
              <p>
                Ready to create your token with a custom address?{" "}
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
