import { ArrowLeft, Calendar, Clock, User, ArrowRight, Code, CheckCircle, BookOpen, FileCode } from "lucide-react"

// Custom SVG Components for Token Standards Blog
const TokenStandardsHeroImage = () => (
  <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="standardsHeroGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#5c6bc0", stopOpacity:1}} />
        <stop offset="50%" style={{stopColor:"#3f51b5", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#303f9f", stopOpacity:1}} />
      </linearGradient>
      <linearGradient id="standardsHeroGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{stopColor:"#ffc107", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#ff9800", stopOpacity:1}} />
      </linearGradient>
      <linearGradient id="standardsHeroGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#ab47bc", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#8e24aa", stopOpacity:1}} />
      </linearGradient>
      <filter id="standardsGlow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    {/* Background */}
    <rect width="1000" height="500" fill="url(#standardsHeroGrad1)"/>
    
    {/* Geometric background pattern */}
    <g opacity="0.1">
      <circle cx="100" cy="100" r="40" fill="white"/>
      <circle cx="900" cy="400" r="50" fill="white"/>
      <circle cx="800" cy="80" r="30" fill="white"/>
      <polygon points="150,350 200,300 250,350 200,400" fill="white"/>
      <rect x="750" y="300" width="60" height="60" rx="10" fill="white"/>
    </g>
    
    {/* Main content area */}
    <rect x="80" y="100" width="840" height="300" rx="25" fill="white" opacity="0.95"/>
    
    {/* Title */}
    <text x="500" y="60" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="white">Token Standards on Sui Blockchain</text>
    
    {/* Central hexagon - representing standards */}
    <polygon points="500,160 540,180 540,220 500,240 460,220 460,180" fill="url(#standardsHeroGrad3)" opacity="0.9"/>
    <text x="500" y="195" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="white">TOKEN</text>
    <text x="500" y="210" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="white">STANDARD</text>
    
    {/* Connected nodes representing different standards */}
    {/* Coin Standard */}
    <circle cx="300" cy="200" r="30" fill="url(#standardsHeroGrad2)" opacity="0.9"/>
    <text x="300" y="195" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="white">COIN</text>
    <text x="300" y="208" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="white">STANDARD</text>
    <line x1="330" y1="200" x2="460" y2="200" stroke="#ffc107" strokeWidth="3" opacity="0.8"/>
    
    {/* NFT Standard */}
    <circle cx="700" cy="200" r="30" fill="#4caf50" opacity="0.9"/>
    <text x="700" y="195" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="white">NFT</text>
    <text x="700" y="208" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="white">STANDARD</text>
    <line x1="540" y1="200" x2="670" y2="200" stroke="#4caf50" strokeWidth="3" opacity="0.8"/>
    
    {/* Extensions */}
    <circle cx="400" cy="120" r="20" fill="#e91e63" opacity="0.8"/>
    <text x="400" y="127" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white">MINTABLE</text>
    <line x1="470" y1="170" x2="415" y2="135" stroke="#e91e63" strokeWidth="2" opacity="0.7"/>
    
    <circle cx="600" cy="120" r="20" fill="#ff5722" opacity="0.8"/>
    <text x="600" y="127" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white">BURNABLE</text>
    <line x1="530" y1="170" x2="585" y2="135" stroke="#ff5722" strokeWidth="2" opacity="0.7"/>
    
    <circle cx="400" cy="280" r="20" fill="#009688" opacity="0.8"/>
    <text x="400" y="287" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white">PAUSABLE</text>
    <line x1="470" y1="230" x2="415" y2="265" stroke="#009688" strokeWidth="2" opacity="0.7"/>
    
    <circle cx="600" cy="280" r="20" fill="#673ab7" opacity="0.8"/>
    <text x="600" y="287" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white">METADATA</text>
    <line x1="530" y1="230" x2="585" y2="265" stroke="#673ab7" strokeWidth="2" opacity="0.7"/>
    
    {/* Bottom elements */}
    <text x="500" y="340" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fill="#3f51b5" fontWeight="bold">🔒 Secure • 🚀 Flexible • 📚 Educational</text>
    
    {/* Floating elements */}
    <g filter="url(#standardsGlow)">
      <circle cx="150" cy="320" r="5" fill="#ffc107" opacity="0.8"/>
      <circle cx="850" cy="320" r="4" fill="#ab47bc" opacity="0.8"/>
      <circle cx="200" cy="380" r="3" fill="#4caf50" opacity="0.8"/>
      <circle cx="800" cy="370" r="6" fill="#3f51b5" opacity="0.8"/>
    </g>
    
    {/* SUI branding */}
    <circle cx="50" cy="50" r="25" fill="white" opacity="0.9"/>
    <text x="50" y="58" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#3f51b5">SUI</text>
  </svg>
)

const StandardsIntroImage = () => (
  <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="introGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#667eea", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#764ba2", stopOpacity:1}} />
      </linearGradient>
      <linearGradient id="introGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#ffc107", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#ff9800", stopOpacity:1}} />
      </linearGradient>
      <linearGradient id="introGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#4caf50", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#388e3c", stopOpacity:1}} />
      </linearGradient>
    </defs>
    
    {/* Background */}
    <rect width="300" height="300" fill="url(#introGrad1)"/>
    
    {/* Title */}
    <text x="150" y="30" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="white">Token Standards Guide</text>
    
    {/* Book/Guide representation */}
    <rect x="100" y="60" width="100" height="130" rx="8" fill="white" opacity="0.9"/>
    <rect x="105" y="65" width="90" height="120" rx="5" fill="url(#introGrad2)" opacity="0.8"/>
    
    {/* Book pages */}
    <rect x="110" y="75" width="80" height="3" rx="1" fill="white" opacity="0.7"/>
    <rect x="110" y="85" width="60" height="2" rx="1" fill="white" opacity="0.5"/>
    <rect x="110" y="92" width="70" height="2" rx="1" fill="white" opacity="0.5"/>
    <rect x="110" y="99" width="55" height="2" rx="1" fill="white" opacity="0.5"/>
    
    {/* Code symbols */}
    <rect x="110" y="110" width="25" height="15" rx="3" fill="#4caf50" opacity="0.8"/>
    <text x="122" y="121" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="white">{`{ }`}</text>
    
    <rect x="140" y="110" width="25" height="15" rx="3" fill="#2196f3" opacity="0.8"/>
    <text x="152" y="121" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="white">{`< >`}</text>
    
    <rect x="170" y="110" width="25" height="15" rx="3" fill="#9c27b0" opacity="0.8"/>
    <text x="182" y="121" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="white">fn</text>
    
    {/* Standards list */}
    <rect x="110" y="135" width="80" height="40" rx="5" fill="rgba(255,255,255,0.2)"/>
    <text x="150" y="148" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white">Standards:</text>
    <circle cx="120" cy="157" r="2" fill="#ffc107"/>
    <text x="128" y="160" fontFamily="Arial, sans-serif" fontSize="6" fill="white">Coin Standard</text>
    <circle cx="120" cy="167" r="2" fill="#4caf50"/>
    <text x="128" y="170" fontFamily="Arial, sans-serif" fontSize="6" fill="white">NFT Standard</text>
    
    {/* Features icons */}
    <g transform="translate(50, 210)">
      <circle cx="0" cy="0" r="15" fill="url(#introGrad3)" opacity="0.9"/>
      <text x="0" y="5" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fill="white">📚</text>
      <text x="0" y="25" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fill="white">Guide</text>
    </g>
    
    <g transform="translate(150, 210)">
      <circle cx="0" cy="0" r="15" fill="#2196f3" opacity="0.9"/>
      <text x="0" y="5" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fill="white">💻</text>
      <text x="0" y="25" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fill="white">Code</text>
    </g>
    
    <g transform="translate(250, 210)">
      <circle cx="0" cy="0" r="15" fill="#ff9800" opacity="0.9"/>
      <text x="0" y="5" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fill="white">✓</text>
      <text x="0" y="25" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fill="white">Best</text>
    </g>
    
    {/* Move language logo */}
    <rect x="220" y="60" width="60" height="30" rx="15" fill="rgba(255,255,255,0.9)"/>
    <text x="250" y="78" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#667eea">MOVE</text>
    
    {/* Decorative elements */}
    <circle cx="40" cy="80" r="3" fill="white" opacity="0.6"/>
    <circle cx="260" cy="120" r="2" fill="white" opacity="0.4"/>
    <circle cx="60" cy="160" r="2" fill="white" opacity="0.5"/>
    <circle cx="280" cy="170" r="3" fill="white" opacity="0.3"/>
    
    {/* Bottom text */}
    <text x="150" y="285" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fill="white" opacity="0.8">Comprehensive Learning</text>
  </svg>
)

const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${className}`}>
    {children}
  </span>
)

const Button = ({ children, size = "default", className = "", asChild, ...props }) => {
  const sizeClasses = {
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  }
  
  if (asChild && props.children) {
    return React.cloneElement(props.children, {
      className: `inline-flex items-center justify-center rounded-md font-medium transition-colors ${sizeClasses[size]} ${className}`,
      ...props
    })
  }
  
  return (
    <button 
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <button className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </button>

          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-xl">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <div className="absolute inset-0">
                <TokenStandardsHeroImage />
              </div>
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
                    <p className="text-zinc-300">
                      This article explores the main token standards on Sui, their features, and how they compare to
                      standards on other blockchains. Understanding these standards is crucial for developers,
                      investors, and users looking to participate in the Sui ecosystem.
                    </p>
                    <div className="flex flex-wrap gap-4 my-6">
                      <div className="flex items-center bg-zinc-800/50 rounded-lg px-4 py-2">
                        <BookOpen className="h-5 w-5 text-amber-400 mr-2" />
                        <span className="text-zinc-300">Comprehensive Guide</span>
                      </div>
                      <div className="flex items-center bg-zinc-800/50 rounded-lg px-4 py-2">
                        <FileCode className="h-5 w-5 text-amber-400 mr-2" />
                        <span className="text-zinc-300">Code Examples</span>
                      </div>
                      <div className="flex items-center bg-zinc-800/50 rounded-lg px-4 py-2">
                        <CheckCircle className="h-5 w-5 text-amber-400 mr-2" />
                        <span className="text-zinc-300">Best Practices</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 relative h-48 md:h-auto rounded-xl overflow-hidden bg-zinc-800">
                    <div className="absolute inset-0">
                      <StandardsIntroImage />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60" />
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-10" />

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">The Sui Coin Standard</h2>
                <p className="text-zinc-300">
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

                <p className="text-zinc-300">
                  The Coin standard is implemented through the <code className="bg-zinc-800 px-2 py-1 rounded text-teal-300">0x2::coin::Coin</code> module in the Sui framework.
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
                <p className="text-zinc-300">To create a custom token using the Coin standard, you need to:</p>
                <ol className="space-y-2 my-6 ml-6 list-decimal text-zinc-300">
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
                    <p className="text-zinc-300">
                      Non-fungible tokens (NFTs) on Sui are more flexible and powerful than their counterparts on other
                      blockchains like Ethereum's ERC-721 or ERC-1155. On Sui, NFTs are simply objects with unique
                      properties, and there are several standards and frameworks for creating them.
                    </p>

                    <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700 my-6">
                      <h4 className="text-lg font-semibold text-white mb-3">The main NFT standards on Sui include:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-amber-400 mr-2">•</span>
                          <span className="text-zinc-300">
                            <strong className="text-white">Sui Objects:</strong> The most basic form of NFTs, where each
                            object has a unique ID
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-400 mr-2">•</span>
                          <span className="text-zinc-300">
                            <strong className="text-white">Sui NFT Protocol:</strong> A more structured standard with
                            metadata, royalties, and marketplace integration
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-400 mr-2">•</span>
                          <span className="text-zinc-300">
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
                <p className="text-zinc-300">
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

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">
                  Why Sui's Approach is Different (And Better)
                </h2>
                
                <div className="bg-cyan-500/10 border-l-4 border-cyan-500 p-4 rounded-r-lg mb-6">
                  <p className="text-cyan-300 m-0">
                    <strong>The key difference:</strong> Most blockchains work like old bank ledgers - they just track balances. Sui treats each token as a unique digital object you actually own, like having physical items in your wallet.
                  </p>
                </div>

                <p className="text-zinc-300">
                  This difference might seem technical, but it has real benefits for everyday users:
                </p>

                <div className="overflow-x-auto my-8">
                  <table className="w-full border-collapse border border-zinc-700 rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-900/30 to-zinc-800">
                        <th className="border border-zinc-700 p-3 text-left text-white">What This Means For You</th>
                        <th className="border border-zinc-700 p-3 text-left text-white">Sui (Object-Based)</th>
                        <th className="border border-zinc-700 p-3 text-left text-white">Traditional (Account-Based)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-zinc-800/50">
                        <td className="border border-zinc-700 p-3 text-zinc-300">Transaction Speed</td>
                        <td className="border border-zinc-700 p-3 text-teal-400">
                          ⚡ Faster - multiple transactions can happen at once
                        </td>
                        <td className="border border-zinc-700 p-3 text-zinc-400">
                          🐌 Slower - transactions wait in line one by one
                        </td>
                      </tr>
                      <tr className="bg-zinc-900/50">
                        <td className="border border-zinc-700 p-3 text-zinc-300">Security</td>
                        <td className="border border-zinc-700 p-3 text-teal-400">
                          🛡️ Built-in protection against common hacks
                        </td>
                        <td className="border border-zinc-700 p-3 text-zinc-400">
                          ⚠️ Requires careful programming to avoid vulnerabilities
                        </td>
                      </tr>
                      <tr className="bg-zinc-800/50">
                        <td className="border border-zinc-700 p-3 text-zinc-300">Flexibility</td>
                        <td className="border border-zinc-700 p-3 text-teal-400">
                          🎨 Tokens can have unique features and behaviors
                        </td>
                        <td className="border border-zinc-700 p-3 text-zinc-400">
                          📋 Limited to standard templates
                        </td>
                      </tr>
                      <tr className="bg-zinc-900/50">
                        <td className="border border-zinc-700 p-3 text-zinc-300">Gas Fees</td>
                        <td className="border border-zinc-700 p-3 text-teal-400">
                          💰 More efficient = lower costs
                        </td>
                        <td className="border border-zinc-700 p-3 text-zinc-400">
                          💸 Can be expensive during busy times
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">
                  Simple Guidelines for Creating Your Own Tokens
                </h2>
                
                <div className="bg-green-500/10 border-l-4 border-green-500 p-4 rounded-r-lg mb-6">
                  <p className="text-green-300 m-0">
                    <strong>Good news:</strong> You don't need to understand all the technical details to create successful tokens. Focus on your project's goals and let the platform handle the complex stuff!
                  </p>
                </div>

                <p className="text-zinc-300">Here are the key decisions you need to make when creating tokens:</p>

                <div className="bg-gradient-to-br from-amber-900/20 to-zinc-900 rounded-xl p-6 border border-amber-700/30 my-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">🪙 For Digital Currencies (Fungible Tokens):</h3>
                      <ol className="space-y-3 ml-6 list-decimal">
                        <li>
                          <strong className="text-white">Choose your purpose:</strong>
                          <p className="text-zinc-300 mt-1 text-sm">
                            What will people use your token for? Payment, rewards, governance?
                          </p>
                        </li>
                        <li>
                          <strong className="text-white">Set your supply:</strong>
                          <p className="text-zinc-300 mt-1 text-sm">
                            How many tokens will exist? Can you create more later?
                          </p>
                        </li>
                        <li>
                          <strong className="text-white">Pick a name and symbol:</strong>
                          <p className="text-zinc-300 mt-1 text-sm">
                            Make it memorable and relevant to your project
                          </p>
                        </li>
                        <li>
                          <strong className="text-white">Test first:</strong>
                          <p className="text-zinc-300 mt-1 text-sm">
                            Always try your token on testnet before going live
                          </p>
                        </li>
                      </ol>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">🎨 For Digital Collectibles (NFTs):</h3>
                      <ol className="space-y-3 ml-6 list-decimal">
                        <li>
                          <strong className="text-white">Define your concept:</strong>
                          <p className="text-zinc-300 mt-1 text-sm">
                            Art, game items, membership cards, certificates?
                          </p>
                        </li>
                        <li>
                          <strong className="text-white">Plan your features:</strong>
                          <p className="text-zinc-300 mt-1 text-sm">
                            Will they change over time? Have special abilities?
                          </p>
                        </li>
                        <li>
                          <strong className="text-white">Consider royalties:</strong>
                          <p className="text-zinc-300 mt-1 text-sm">
                            Do you want to earn when people resell your NFTs?
                          </p>
                        </li>
                        <li>
                          <strong className="text-white">Think about utility:</strong>
                          <p className="text-zinc-300 mt-1 text-sm">
                            What benefits do owners get beyond just owning the NFT?
                          </p>
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">
                  Cool Features You Can't Get Elsewhere
                </h2>
                <p className="text-zinc-300">
                  Sui's unique design enables some pretty amazing features that are difficult or impossible on other blockchains:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                  <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
                    <h4 className="text-lg font-semibold text-white mb-3">🔧 Dynamic Properties</h4>
                    <p className="text-zinc-300 text-sm mb-2">
                      <strong>What it means:</strong> Add new features to existing tokens without changing their core structure.
                    </p>
                    <p className="text-zinc-300 text-sm">
                      <strong>Example:</strong> Add a "battle history" to game NFTs months after they were created.
                    </p>
                  </div>

                  <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
                    <h4 className="text-lg font-semibold text-white mb-3">🎁 Sponsored Transactions</h4>
                    <p className="text-zinc-300 text-sm mb-2">
                      <strong>What it means:</strong> Someone else can pay transaction fees for users.
                    </p>
                    <p className="text-zinc-300 text-sm">
                      <strong>Example:</strong> Your app pays gas fees so users can try it without owning any crypto first.
                    </p>
                  </div>

                  <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
                    <h4 className="text-lg font-semibold text-white mb-3">⚙️ Complex Transactions</h4>
                    <p className="text-zinc-300 text-sm mb-2">
                      <strong>What it means:</strong> Do multiple actions in a single transaction.
                    </p>
                    <p className="text-zinc-300 text-sm">
                      <strong>Example:</strong> Buy an NFT, upgrade it, and list it for sale - all in one click.
                    </p>
                  </div>

                  <div className="bg-zinc-800/50 rounded-xl p-5 border border-zinc-700">
                    <h4 className="text-lg font-semibold text-white mb-3">🌉 Easy Cross-Chain</h4>
                    <p className="text-zinc-300 text-sm mb-2">
                      <strong>What it means:</strong> Move tokens between different blockchains more easily.
                    </p>
                    <p className="text-zinc-300 text-sm">
                      <strong>Example:</strong> Use your Sui tokens on Ethereum apps without complex bridging.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/20 to-zinc-900 rounded-xl p-6 border border-blue-700/30 my-8">
                  <h3 className="text-xl font-bold text-white mb-4">💡 Real-World Success Example</h3>
                  <p className="text-zinc-300 mb-4">
                    <strong>Gaming Studio Case Study:</strong> A game company created character NFTs that:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">1.</span>
                      <span className="text-zinc-300">Level up and gain new abilities as players use them</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">2.</span>
                      <span className="text-zinc-300">Automatically earn royalties when players trade them</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">3.</span>
                      <span className="text-zinc-300">Work across multiple games in their ecosystem</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">4.</span>
                      <span className="text-zinc-300">Cost 90% less in transaction fees compared to Ethereum</span>
                    </li>
                  </ul>
                  <p className="text-zinc-300 mt-4 text-sm italic">
                    This wouldn't be possible on most other blockchains without complex workarounds.
                  </p>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">The Bottom Line</h2>
                
                <div className="bg-gradient-to-br from-green-900/20 to-zinc-900 rounded-xl p-6 border border-green-700/30 mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">🎯 What This All Means for You:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white font-semibold mb-2">If you're a creator or entrepreneur:</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          <span className="text-zinc-300">Faster, cheaper token creation</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          <span className="text-zinc-300">More creative possibilities for your project</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          <span className="text-zinc-300">Built-in security and user protection</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-2">If you're a user or investor:</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          <span className="text-zinc-300">Lower transaction fees</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          <span className="text-zinc-300">More unique and interactive digital assets</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          <span className="text-zinc-300">Better security against scams and hacks</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="text-zinc-300 text-lg">
                  Sui represents a fundamental shift in how digital assets work. Instead of just being numbers in a database, tokens become unique digital objects with their own identity and capabilities. This isn't just a technical improvement - it opens up entirely new possibilities for what digital assets can do.
                </p>

                <div className="bg-purple-500/10 border-l-4 border-purple-500 p-4 rounded-r-lg my-6">
                  <p className="text-purple-300 m-0">
                    <strong>The big picture:</strong> Sui's approach makes digital assets more like real-world objects - each one unique, with its own properties and abilities. This enables new types of applications and experiences that simply weren't possible before.
                  </p>
                </div>

                <p className="text-zinc-300">
                  Whether you're looking to create a simple digital currency for your community, launch a collection of dynamic NFTs that evolve over time, or build something entirely new, Sui's object-centric model and security features provide the foundation you need.
                </p>

                <p className="text-zinc-300">
                  The best part? You don't need to be a blockchain expert to get started. Our platform handles all the complex technical details, so you can focus on what matters most - bringing your vision to life.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Ready to create your own token on Sui?</h3>
                    <p className="text-zinc-400 m-0">Get started in minutes with our easy-to-use platform.</p>
                  </div>
                  <Button size="lg" className="bg-amber-500 cursor-pointer hover:bg-amber-600 text-white">
                    <div className="flex items-center">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
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