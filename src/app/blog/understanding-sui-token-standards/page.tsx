import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
          <Link href="/" className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>

          <div className="bg-zinc-900 rounded-xl p-6 md:p-10 border border-zinc-800">
            <div className="mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                Understanding Token Standards on Sui Blockchain
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-sm mb-6">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  01.05.2025
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  12 min read
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  By Sui Token Creator Team
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="bg-zinc-800 text-zinc-300 border-zinc-700">
                  Education
                </Badge>
                <Badge variant="outline" className="bg-zinc-800 text-zinc-300 border-zinc-700">
                  Standards
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
              <h2>Introduction to Sui Token Standards</h2>
              <p>
                Token standards are the backbone of blockchain ecosystems, providing consistent interfaces and
                behaviors for digital assets. On the Sui blockchain, token standards leverage the unique features
                of the Move programming language to offer enhanced security, flexibility, and functionality
                compared to other blockchains.
              </p>

              <h2>The Sui Coin Standard</h2>
              <p>
                The most basic and widely used token standard on Sui is the Coin standard, defined in the Sui
                framework. This standard is analogous to ERC-20 on Ethereum but with significant improvements
                in terms of security and functionality.
              </p>
              <p><strong>Key features of the Sui Coin standard:</strong></p>
              <ul>
                <li><strong>Object-centric model:</strong> Unlike account-based models, Sui tokens are objects</li>
                <li><strong>Type safety:</strong> Move's type system prevents common vulnerabilities</li>
                <li><strong>Built-in treasury:</strong> For controlled minting</li>
                <li><strong>Metadata:</strong> Rich token metadata support</li>
              </ul>
              <pre><code>{`struct Coin<T> has key, store {
    id: UID,
    balance: Balance<T>,
}

struct Balance<T> has store {
    value: u64,
}`}</code></pre>

              <h2>Creating Custom Tokens with the Coin Standard</h2>
              <p>To create a custom token using the Coin standard, you need to:</p>
              <ol>
                <li>Define a token type</li>
                <li>Initialize the coin with metadata</li>
                <li>Create a treasury cap</li>
              </ol>
              <pre><code>{`// Define the token type
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
    transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
    transfer::public_share_object(metadata);
}`}</code></pre>

              <h2>NFT Standards on Sui</h2>
              <p>Sui NFTs are flexible and powerful, modeled as unique objects.</p>
              <ul>
                <li><strong>Sui Objects:</strong> Unique ID objects</li>
                <li><strong>Sui NFT Protocol:</strong> With metadata and royalties</li>
                <li><strong>Dynamic NFTs:</strong> Change based on external interactions</li>
              </ul>
              <pre><code>{`struct MyNFT has key, store {
    id: UID,
    name: String,
    description: String,
    url: Url,
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
}`}</code></pre>

              <h2>Fungible Token Extensions</h2>
              <ul>
                <li><strong>Mintable</strong></li>
                <li><strong>Burnable</strong></li>
                <li><strong>Pausable</strong></li>
                <li><strong>Capped Supply</strong></li>
                <li><strong>Access Control</strong></li>
              </ul>

              <h2>Comparing Sui Token Standards with Other Blockchains</h2>
              <table className="border-collapse border border-zinc-700 my-4">
                <thead>
                  <tr className="bg-zinc-800">
                    <th className="border border-zinc-700 p-2">Feature</th>
                    <th className="border border-zinc-700 p-2">Sui (Coin)</th>
                    <th className="border border-zinc-700 p-2">Ethereum (ERC-20)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-zinc-700 p-2">Programming Model</td>
                    <td className="border border-zinc-700 p-2">Object-centric</td>
                    <td className="border border-zinc-700 p-2">Account-based</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-700 p-2">Security</td>
                    <td className="border border-zinc-700 p-2">Type safe</td>
                    <td className="border border-zinc-700 p-2">Reentrancy risks</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-700 p-2">Gas Efficiency</td>
                    <td className="border border-zinc-700 p-2">High</td>
                    <td className="border border-zinc-700 p-2">Variable</td>
                  </tr>
                </tbody>
              </table>

              <h2>Conclusion</h2>
              <p>
                Sui's token standards offer powerful tools for secure and efficient digital asset creation.
                Ready to launch your own? <Link href="/generator/mainnet" className="text-teal-400 hover:text-teal-300">Get started now</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
