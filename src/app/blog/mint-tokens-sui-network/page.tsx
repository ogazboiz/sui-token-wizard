import { ArrowLeft, Calendar, Clock, User, ArrowRight, CheckCircle } from "lucide-react"

// Custom SVG Components for Mint Tokens Blog
const MintTokensHeroImage = () => (
  <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="mintHeroGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#4fc3f7", stopOpacity:1}} />
        <stop offset="50%" style={{stopColor:"#29b6f6", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#0288d1", stopOpacity:1}} />
      </linearGradient>
      <linearGradient id="mintHeroGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{stopColor:"#26c6da", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#00bcd4", stopOpacity:1}} />
      </linearGradient>
      <filter id="mintGlow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <marker id="mintArrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="white"/>
      </marker>
    </defs>
    
    {/* Background */}
    <rect width="1000" height="500" fill="url(#mintHeroGrad1)"/>
    
    {/* Geometric background pattern */}
    <g opacity="0.1">
      <circle cx="150" cy="100" r="40" fill="white"/>
      <circle cx="850" cy="400" r="50" fill="white"/>
      <circle cx="800" cy="100" r="25" fill="white"/>
      <polygon points="100,350 150,300 200,350 150,400" fill="white"/>
    </g>
    
    {/* Main content area */}
    <rect x="100" y="120" width="800" height="260" rx="25" fill="white" opacity="0.95"/>
    
    {/* Title */}
    <text x="500" y="80" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="bold" fill="white">Mint Tokens on Sui Network</text>
    
    {/* 3 Steps Process */}
    <g>
      {/* Step 1 */}
      <circle cx="250" cy="200" r="35" fill="url(#mintHeroGrad2)" opacity="0.9"/>
      <text x="250" y="210" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="white">1</text>
      <text x="250" y="250" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#0288d1">Setup Wallet</text>
      
      {/* Arrow 1 */}
      <path d="M 290 200 L 360 200" stroke="#29b6f6" strokeWidth="4" fill="none" markerEnd="url(#mintArrowhead)"/>
      
      {/* Step 2 */}
      <circle cx="400" cy="200" r="35" fill="url(#mintHeroGrad2)" opacity="0.9"/>
      <text x="400" y="210" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="white">2</text>
      <text x="400" y="250" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#0288d1">Configure Token</text>
      
      {/* Arrow 2 */}
      <path d="M 440 200 L 510 200" stroke="#29b6f6" strokeWidth="4" fill="none" markerEnd="url(#mintArrowhead)"/>
      
      {/* Step 3 */}
      <circle cx="550" cy="200" r="35" fill="url(#mintHeroGrad2)" opacity="0.9"/>
      <text x="550" y="210" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="white">3</text>
      <text x="550" y="250" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#0288d1">Deploy Token</text>
      
      {/* Success indicator */}
      <circle cx="700" cy="200" r="25" fill="#4caf50" opacity="0.9"/>
      <text x="700" y="206" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fill="white">✓</text>
      <text x="700" y="235" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="bold" fill="#4caf50">Success!</text>
    </g>
    
    {/* Bottom text */}
    <text x="500" y="320" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fill="#0288d1" fontWeight="bold">🚀 Easy • 💨 Fast • 🔒 Secure</text>
    
    {/* Floating elements */}
    <g filter="url(#mintGlow)">
      <circle cx="180" cy="350" r="6" fill="#26c6da" opacity="0.8"/>
      <circle cx="820" cy="320" r="5" fill="#4fc3f7" opacity="0.8"/>
      <circle cx="300" cy="380" r="4" fill="#00bcd4" opacity="0.8"/>
      <circle cx="750" cy="370" r="7" fill="#29b6f6" opacity="0.8"/>
    </g>
    
    {/* SUI branding */}
    <circle cx="50" cy="50" r="25" fill="white" opacity="0.9"/>
    <text x="50" y="58" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#0288d1">SUI</text>
  </svg>
)

const WalletSetupImage = () => (
  <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="walletGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#667eea", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#764ba2", stopOpacity:1}} />
      </linearGradient>
      <linearGradient id="walletGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#4fc3f7", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#29b6f6", stopOpacity:1}} />
      </linearGradient>
    </defs>
    
    {/* Background */}
    <rect width="300" height="300" fill="url(#walletGrad1)"/>
    
    {/* Title */}
    <text x="150" y="30" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white">Wallet Setup</text>
    
    {/* Wallet icon */}
    <rect x="100" y="80" width="100" height="70" rx="15" fill="white" opacity="0.9"/>
    <rect x="110" y="90" width="80" height="50" rx="8" fill="url(#walletGrad2)" opacity="0.8"/>
    
    {/* Wallet details */}
    <rect x="115" y="95" width="50" height="8" rx="4" fill="white" opacity="0.7"/>
    <rect x="115" y="108" width="35" height="6" rx="3" fill="white" opacity="0.5"/>
    <rect x="115" y="119" width="45" height="6" rx="3" fill="white" opacity="0.5"/>
    <circle cx="175" cy="115" r="8" fill="white" opacity="0.8"/>
    
    {/* Connection indicator */}
    <circle cx="150" cy="180" r="20" fill="#4caf50" opacity="0.9"/>
    <text x="150" y="186" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="14" fill="white" fontWeight="bold">✓</text>
    
    {/* Steps */}
    <rect x="50" y="220" width="200" height="20" rx="10" fill="white" opacity="0.9"/>
    <text x="150" y="233" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fill="#667eea" fontWeight="bold">Download • Install • Connect</text>
    
    {/* SUI tokens indicator */}
    <circle cx="80" cy="260" r="15" fill="#ffd700" opacity="0.9"/>
    <text x="80" y="266" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fill="white" fontWeight="bold">SUI</text>
    <text x="150" y="265" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fill="white">Gas Fees Ready</text>
    
    {/* Decorative elements */}
    <circle cx="50" cy="100" r="4" fill="white" opacity="0.6"/>
    <circle cx="250" cy="120" r="3" fill="white" opacity="0.4"/>
    <circle cx="70" cy="180" r="2" fill="white" opacity="0.5"/>
  </svg>
)

const TokenConfigImage = () => (
  <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="configGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#f093fb", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#f5576c", stopOpacity:1}} />
      </linearGradient>
      <linearGradient id="configGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#4facfe", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#00f2fe", stopOpacity:1}} />
      </linearGradient>
    </defs>
    
    {/* Background */}
    <rect width="300" height="300" fill="url(#configGrad1)"/>
    
    {/* Title */}
    <text x="150" y="30" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white">Token Configuration</text>
    
    {/* Configuration form */}
    <rect x="30" y="50" width="240" height="200" rx="15" fill="white" opacity="0.95"/>
    
    {/* Form fields */}
    <text x="40" y="75" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#f5576c">Token Name:</text>
    <rect x="40" y="80" width="220" height="18" rx="9" fill="#f0f0f0"/>
    <text x="50" y="92" fontFamily="monospace" fontSize="9" fill="#333">MyToken</text>
    
    <text x="40" y="115" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#f5576c">Symbol:</text>
    <rect x="40" y="120" width="220" height="18" rx="9" fill="#f0f0f0"/>
    <text x="50" y="132" fontFamily="monospace" fontSize="9" fill="#333">MTK</text>
    
    <text x="40" y="155" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#f5576c">Supply:</text>
    <rect x="40" y="160" width="220" height="18" rx="9" fill="#f0f0f0"/>
    <text x="50" y="172" fontFamily="monospace" fontSize="9" fill="#333">1,000,000</text>
    
    <text x="40" y="195" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#f5576c">Decimals:</text>
    <rect x="40" y="200" width="220" height="18" rx="9" fill="#f0f0f0"/>
    <text x="50" y="212" fontFamily="monospace" fontSize="9" fill="#333">9</text>
    
    {/* Options checkboxes */}
    <rect x="40" y="225" width="10" height="10" rx="2" fill="url(#configGrad2)"/>
    <text x="55" y="234" fontFamily="Arial, sans-serif" fontSize="8" fill="#f5576c">Mintable</text>
    
    <rect x="120" y="225" width="10" height="10" rx="2" fill="url(#configGrad2)"/>
    <text x="135" y="234" fontFamily="Arial, sans-serif" fontSize="8" fill="#f5576c">Burnable</text>
    
    <rect x="200" y="225" width="10" height="10" rx="2" fill="#ddd"/>
    <text x="215" y="234" fontFamily="Arial, sans-serif" fontSize="8" fill="#999">Pausable</text>
    
    {/* Token preview */}
    <circle cx="150" cy="275" r="15" fill="url(#configGrad2)"/>
    <text x="150" y="281" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fill="white" fontWeight="bold">MTK</text>
  </svg>
)

const DeployTokenImage = () => (
  <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="deployGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#a8edea", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#fed6e3", stopOpacity:1}} />
      </linearGradient>
      <linearGradient id="deployGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#ff9a9e", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#fecfef", stopOpacity:1}} />
      </linearGradient>
      <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#667eea", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#764ba2", stopOpacity:1}} />
      </linearGradient>
    </defs>
    
    {/* Background */}
    <rect width="300" height="300" fill="url(#deployGrad1)"/>
    
    {/* Title */}
    <text x="150" y="30" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#667eea">Deploy to Blockchain</text>
    
    {/* Rocket */}
    <ellipse cx="150" cy="120" rx="20" ry="50" fill="url(#rocketGrad)"/>
    <polygon points="130,80 150,60 170,80" fill="#ff6b6b"/>
    <circle cx="140" cy="110" r="3" fill="white" opacity="0.8"/>
    <circle cx="160" cy="110" r="3" fill="white" opacity="0.8"/>
    <polygon points="130,170 140,185 150,170" fill="#ff9500"/>
    <polygon points="150,170 160,185 170,170" fill="#ff9500"/>
    
    {/* Blockchain representation */}
    <rect x="50" y="200" width="40" height="25" rx="5" fill="url(#deployGrad2)" opacity="0.8"/>
    <rect x="100" y="200" width="40" height="25" rx="5" fill="url(#deployGrad2)" opacity="0.8"/>
    <rect x="150" y="200" width="40" height="25" rx="5" fill="url(#deployGrad2)" opacity="0.8"/>
    <rect x="200" y="200" width="40" height="25" rx="5" fill="url(#deployGrad2)" opacity="0.8"/>
    
    {/* Chain links */}
    <line x1="90" y1="212" x2="100" y2="212" stroke="#667eea" strokeWidth="2"/>
    <line x1="140" y1="212" x2="150" y2="212" stroke="#667eea" strokeWidth="2"/>
    <line x1="190" y1="212" x2="200" y2="212" stroke="#667eea" strokeWidth="2"/>
    
    {/* Block numbers */}
    <text x="70" y="216" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="white">1</text>
    <text x="120" y="216" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="white">2</text>
    <text x="170" y="216" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="white">3</text>
    <text x="220" y="216" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="white">4</text>
    
    {/* Success indicator */}
    <circle cx="150" cy="160" r="12" fill="#4caf50"/>
    <text x="150" y="166" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fill="white">✓</text>
    
    {/* Deploy button */}
    <rect x="100" y="250" width="100" height="30" rx="15" fill="url(#rocketGrad)"/>
    <text x="150" y="269" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fill="white" fontWeight="bold">Deploy Token</text>
    
    {/* Smoke/exhaust */}
    <circle cx="135" cy="185" r="3" fill="#ddd" opacity="0.6"/>
    <circle cx="165" cy="190" r="2" fill="#ddd" opacity="0.4"/>
    <circle cx="145" cy="195" r="2" fill="#ddd" opacity="0.5"/>
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
                <MintTokensHeroImage />
              </div>
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
                    <p className="text-zinc-300">
                      Before you can mint tokens on Sui, you'll need a compatible wallet. The Sui ecosystem supports
                      several wallet options, but for this guide, we recommend using the official Sui Wallet.
                    </p>
                    <ul className="space-y-2 my-6">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-300">Download and install the Sui Wallet extension from your browser's extension store</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-300">Create a new wallet or import an existing one using your seed phrase</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-300">
                          Ensure you have some SUI tokens for gas fees (you can get testnet tokens from the Sui faucet)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-300">
                          Connect your wallet to our platform by clicking the "Connect Wallet" button in the top right
                          corner
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="relative h-48 md:h-auto rounded-xl overflow-hidden bg-zinc-800">
                    <div className="absolute inset-0">
                      <WalletSetupImage />
                    </div>
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
                    <div className="absolute inset-0">
                      <TokenConfigImage />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60" />
                  </div>
                  <div className="col-span-2">
                    <p className="text-zinc-300">
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

                    <p className="text-zinc-300">You can also configure additional options based on your needs:</p>
                    <ul className="space-y-2 my-6">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-300">
                          <strong className="text-white">Mintable:</strong> Allow creating more tokens in the future
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-300">
                          <strong className="text-white">Burnable:</strong> Allow tokens to be permanently removed from
                          circulation
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-300">
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
                    <p className="text-zinc-300">With your token configured, you're ready to deploy it to the Sui blockchain.</p>
                    <ul className="space-y-2 my-6">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-300">Review your token configuration to ensure everything is correct</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-300">Click the "Deploy Token" button</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-300">Confirm the transaction in your Sui Wallet</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-300">
                          Wait for the transaction to be confirmed on the blockchain (usually takes a few seconds)
                        </span>
                      </li>
                    </ul>
                    <p className="text-zinc-300">
                      Once the transaction is confirmed, your token will be live on the Sui blockchain! You'll receive
                      the contract address and can view your token on Sui Explorer.
                    </p>
                  </div>
                  <div className="relative h-48 md:h-auto rounded-xl overflow-hidden bg-zinc-800">
                    <div className="absolute inset-0">
                      <DeployTokenImage />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/20 via-teal-500/20 to-purple-500/20 rounded-xl p-6 my-10 border border-teal-500/30">
                  <h3 className="text-xl font-bold text-white mb-4">Additional Tips for Success</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-zinc-300">
                        <strong className="text-white">Test on testnet first:</strong> Before deploying to mainnet, test
                        your token on Sui testnet
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-zinc-300">
                        <strong className="text-white">Consider token economics:</strong> Think carefully about your
                        token's supply and distribution
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-zinc-300">
                        <strong className="text-white">Prepare for listing:</strong> If you plan to list on DEXs,
                        prepare liquidity pools
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-zinc-300">
                        <strong className="text-white">Document your token:</strong> Create clear documentation for
                        users and potential investors
                      </span>
                    </li>
                  </ul>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">Conclusion</h2>
                <p className="text-zinc-300">
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
                  <Button size="lg" className="cursor-pointer bg-teal-500 hover:bg-teal-600 text-white">
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