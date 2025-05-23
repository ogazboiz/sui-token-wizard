import { ArrowLeft, Calendar, Clock, User, ArrowRight, CheckCircle, AlertTriangle, Code } from "lucide-react"
import Link from "next/link"

// Custom SVG Components
const HeroImage = () => (
  <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="heroGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#ab47bc", stopOpacity:1}} />
        <stop offset="50%" style={{stopColor:"#8e24aa", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#6a1b9a", stopOpacity:1}} />
      </linearGradient>
      <linearGradient id="heroGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{stopColor:"#4fc3f7", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#29b6f6", stopOpacity:1}} />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#4fc3f7"/>
      </marker>
    </defs>
    
    {/* Background */}
    <rect width="1000" height="500" fill="url(#heroGrad1)"/>
    
    {/* Geometric background pattern */}
    <g opacity="0.1">
      <circle cx="100" cy="100" r="50" fill="white"/>
      <circle cx="900" cy="400" r="60" fill="white"/>
      <circle cx="800" cy="80" r="30" fill="white"/>
      <polygon points="200,300 250,250 300,300 250,350" fill="white"/>
    </g>
    
    {/* Main content area */}
    <rect x="100" y="150" width="800" height="200" rx="20" fill="white" opacity="0.95"/>
    
    {/* Title */}
    <text x="500" y="100" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="bold" fill="white">Custom Token Address Creation</text>
    
    {/* Address examples */}
    <g>
      {/* Before arrow */}
      <text x="150" y="200" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="#8e24aa">Standard Address:</text>
      <rect x="150" y="210" width="300" height="30" rx="15" fill="#f5f5f5" stroke="#8e24aa" strokeWidth="1"/>
      <text x="300" y="230" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#666">0x3a7f8b2c9d4e5f6a8b9c0d1e2f3g4h5i...</text>
      
      {/* Arrow */}
      <path d="M 480 225 L 520 225" stroke="#4fc3f7" strokeWidth="4" fill="none" markerEnd="url(#arrowhead)"/>
      <text x="500" y="245" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#4fc3f7">CUSTOMIZE</text>
      
      {/* After arrow */}
      <text x="550" y="200" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="#8e24aa">Custom Address:</text>
      <rect x="550" y="210" width="300" height="30" rx="15" fill="url(#heroGrad2)" opacity="0.9"/>
      <text x="700" y="230" textAnchor="middle" fontFamily="monospace" fontSize="10" fill="white" fontWeight="bold">0xCUSTOM...TOKEN</text>
      
      {/* Highlight custom parts */}
      <rect x="565" y="215" width="60" height="20" rx="10" fill="#ff6b6b" opacity="0.8"/>
      <text x="595" y="227" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white">PREFIX</text>
      
      <rect x="780" y="215" width="55" height="20" rx="10" fill="#4ecdc4" opacity="0.8"/>
      <text x="807" y="227" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white">SUFFIX</text>
    </g>
    
    {/* Bottom elements */}
    <text x="500" y="290" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fill="#8e24aa" fontWeight="bold">✨ Brand Recognition • 🔒 Trust Building • 🚀 Marketing Advantage</text>
    
    {/* Floating elements */}
    <g filter="url(#glow)">
      <circle cx="150" cy="350" r="8" fill="#4fc3f7" opacity="0.8"/>
      <circle cx="850" cy="350" r="6" fill="#ff6b6b" opacity="0.8"/>
      <circle cx="300" cy="400" r="5" fill="#4ecdc4" opacity="0.8"/>
      <circle cx="700" cy="380" r="7" fill="#ab47bc" opacity="0.8"/>
    </g>
    
    {/* SUI branding */}
    <circle cx="50" cy="50" r="25" fill="white" opacity="0.9"/>
    <text x="50" y="58" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#8e24aa">SUI</text>
  </svg>
)

const ContentImage = () => (
  <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="contentGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#667eea", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#764ba2", stopOpacity:1}} />
      </linearGradient>
      <linearGradient id="contentGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#f093fb", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#f5576c", stopOpacity:1}} />
      </linearGradient>
    </defs>
    
    {/* Background */}
    <rect width="300" height="300" fill="url(#contentGrad1)"/>
    
    {/* Title */}
    <text x="150" y="30" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white">Address Patterns</text>
    
    {/* Pattern examples */}
    {/* Pattern 1 */}
    <rect x="20" y="50" width="260" height="35" rx="17" fill="white" opacity="0.9"/>
    <text x="30" y="65" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#667eea">Brand Prefix:</text>
    <text x="150" y="75" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#333">0xMOON...a7f8b2c9d</text>
    <rect x="40" y="68" width="35" height="12" rx="6" fill="#ff6b6b" opacity="0.8"/>
    <text x="57" y="76" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="bold" fill="white">MOON</text>
    
    {/* Pattern 2 */}
    <rect x="20" y="95" width="260" height="35" rx="17" fill="white" opacity="0.9"/>
    <text x="30" y="110" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#667eea">Repeating:</text>
    <text x="150" y="120" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#333">0x888...888</text>
    <rect x="40" y="113" width="25" height="12" rx="6" fill="#4ecdc4" opacity="0.8"/>
    <text x="52" y="121" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="bold" fill="white">888</text>
    <rect x="210" y="113" width="25" height="12" rx="6" fill="#4ecdc4" opacity="0.8"/>
    <text x="222" y="121" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="bold" fill="white">888</text>
    
    {/* Pattern 3 */}
    <rect x="20" y="140" width="260" height="35" rx="17" fill="white" opacity="0.9"/>
    <text x="30" y="155" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#667eea">Lucky Numbers:</text>
    <text x="150" y="165" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#333">0x...420...69...</text>
    <rect x="90" y="158" width="25" height="12" rx="6" fill="#ffd700" opacity="0.8"/>
    <text x="102" y="166" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="bold" fill="white">420</text>
    <rect x="180" y="158" width="20" height="12" rx="6" fill="#ffd700" opacity="0.8"/>
    <text x="190" y="166" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="bold" fill="white">69</text>
    
    {/* Pattern 4 */}
    <rect x="20" y="185" width="260" height="35" rx="17" fill="white" opacity="0.9"/>
    <text x="30" y="200" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#667eea">Custom Suffix:</text>
    <text x="150" y="210" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#333">0x3a7f...TOKEN</text>
    <rect x="210" y="203" width="40" height="12" rx="6" fill="#ab47bc" opacity="0.8"/>
    <text x="230" y="211" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="bold" fill="white">TOKEN</text>
    
    {/* Central decorative element */}
    <circle cx="150" cy="250" r="25" fill="url(#contentGrad2)" opacity="0.8"/>
    <text x="150" y="256" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="white">0x</text>
    
    {/* Surrounding smaller circles */}
    <circle cx="100" cy="250" r="8" fill="white" opacity="0.7"/>
    <circle cx="200" cy="250" r="8" fill="white" opacity="0.7"/>
    <circle cx="150" cy="200" r="6" fill="white" opacity="0.6"/>
    <circle cx="150" cy="300" r="6" fill="white" opacity="0.6"/>
    
    {/* Bottom text */}
    <text x="150" y="285" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fill="white" opacity="0.8">Endless Possibilities</text>
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
        <Link href="/" className="mb-4">
          <button className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </button>
        </Link>
          {/* Blog post container */}

          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-xl overflow-hidden border border-zinc-800 shadow-xl">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 overflow-hidden">
              <div className="absolute inset-0">
                <HeroImage />
              </div>
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
                    <p className="text-zinc-300">
                      On the Sui blockchain, creating tokens with custom addresses is possible through a technique known
                      as "vanity addresses." These addresses can help with:
                    </p>
                    <ul className="space-y-2 my-6">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-300">
                          <strong className="text-white">Brand recognition</strong> - Makes your token instantly
                          identifiable
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-300">
                          <strong className="text-white">Trust building</strong> - Shows attention to detail and
                          professionalism
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-300">
                          <strong className="text-white">Marketing advantage</strong> - Creates talking points and
                          memorability
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-zinc-300">
                          <strong className="text-white">Scam prevention</strong> - Helps users identify official tokens
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="md:col-span-2 relative h-48 md:h-auto rounded-xl overflow-hidden bg-zinc-800">
                    <div className="absolute inset-0">
                      <ContentImage />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60" />
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-10" />

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Understanding Sui Token Addresses</h2>
                <p className="text-zinc-300">
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
                <p className="text-zinc-300">When using custom addresses, always prioritize security:</p>
                <ul className="space-y-2 my-6">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-zinc-300">
                      <strong className="text-white">Never share your private key or seed phrase</strong> with anyone,
                      including tools that generate vanity addresses
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-zinc-300">
                      <strong className="text-white">Use trusted tools</strong> for generating vanity addresses,
                      preferably open-source and audited ones
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-zinc-300">
                      <strong className="text-white">Consider the trade-off</strong> between a perfect address and
                      security - sometimes a simpler pattern is safer
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-zinc-300">
                      <strong className="text-white">Always verify the final address</strong> before making it public or
                      using it for important transactions
                    </span>
                  </li>
                </ul>

                <h2 className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">Conclusion</h2>
                <p className="text-zinc-300">
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
                  <Button size="lg" className="cursor-pointer bg-purple-500 hover:bg-purple-600 text-white">
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