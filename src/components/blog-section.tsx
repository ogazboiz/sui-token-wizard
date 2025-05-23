import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  date: string
  image: string
  tags: string[]
  url: string
}

// Custom SVG Images as components
const MintTokensImage = () => (
  <svg viewBox="0 0 350 200" className="w-full h-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#4fc3f7", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#29b6f6", stopOpacity:1}} />
      </linearGradient>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="white"/>
      </marker>
    </defs>
    <rect width="350" height="200" fill="url(#grad1)"/>
    <circle cx="70" cy="100" r="25" fill="white" opacity="0.9"/>
    <circle cx="175" cy="100" r="25" fill="white" opacity="0.9"/>
    <circle cx="280" cy="100" r="25" fill="white" opacity="0.9"/>
    <text x="70" y="107" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#29b6f6">1</text>
    <text x="175" y="107" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#29b6f6">2</text>
    <text x="280" y="107" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="#29b6f6">3</text>
    <path d="M 100 100 L 145 100" stroke="white" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)"/>
    <path d="M 205 100 L 250 100" stroke="white" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)"/>
    <text x="175" y="40" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white">MINT TOKENS</text>
    <text x="175" y="170" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="14" fill="white">Simple 3-Step Process</text>
    <circle cx="30" cy="30" r="15" fill="white" opacity="0.8"/>
    <text x="30" y="36" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#29b6f6">SUI</text>
  </svg>
)

const CustomAddressImage = () => (
  <svg viewBox="0 0 350 200" className="w-full h-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#ab47bc", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#8e24aa", stopOpacity:1}} />
      </linearGradient>
    </defs>
    <rect width="350" height="200" fill="url(#grad3)"/>
    <rect x="25" y="80" width="300" height="40" rx="20" fill="white" opacity="0.9"/>
    <text x="175" y="103" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="#8e24aa">0xCUSTOM...TOKEN</text>
    <rect x="40" y="85" width="60" height="30" rx="15" fill="#ff6b6b" opacity="0.8"/>
    <text x="70" y="103" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="white">PREFIX</text>
    <rect x="250" y="85" width="60" height="30" rx="15" fill="#4ecdc4" opacity="0.8"/>
    <text x="280" y="103" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="white">SUFFIX</text>
    <text x="175" y="40" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white">CUSTOM ADDRESS</text>
    <text x="175" y="160" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="14" fill="white">Personalize Your Token</text>
    <circle cx="50" cy="50" r="3" fill="white" opacity="0.6"/>
    <circle cx="300" cy="160" r="3" fill="white" opacity="0.6"/>
    <circle cx="320" cy="50" r="2" fill="white" opacity="0.4"/>
  </svg>
)

const TopProjectsImage = () => (
  <svg viewBox="0 0 350 200" className="w-full h-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#ff7043", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#f4511e", stopOpacity:1}} />
      </linearGradient>
    </defs>
    <rect width="350" height="200" fill="url(#grad4)"/>
    <ellipse cx="175" cy="90" rx="30" ry="25" fill="#ffd700"/>
    <rect x="165" y="110" width="20" height="15" fill="#ffd700"/>
    <rect x="160" y="125" width="30" height="8" fill="#ffb300"/>
    <polygon points="175,70 177,76 183,76 178,80 180,86 175,82 170,86 172,80 167,76 173,76" fill="white"/>
    <rect x="60" y="140" width="40" height="30" fill="white" opacity="0.8"/>
    <rect x="100" y="130" width="40" height="40" fill="white" opacity="0.9"/>
    <rect x="140" y="120" width="40" height="50" fill="white"/>
    <rect x="180" y="130" width="40" height="40" fill="white" opacity="0.9"/>
    <rect x="220" y="140" width="40" height="30" fill="white" opacity="0.8"/>
    <text x="80" y="158" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#f4511e">5</text>
    <text x="120" y="153" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#f4511e">4</text>
    <text x="160" y="148" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#f4511e">3</text>
    <text x="200" y="153" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#f4511e">2</text>
    <text x="240" y="158" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#f4511e">1</text>
    <text x="175" y="30" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white">TOP 5 PROJECTS</text>
    <text x="175" y="50" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fill="white">2025 Watchlist</text>
  </svg>
)

const TokenStandardsImage = () => (
  <svg viewBox="0 0 350 200" className="w-full h-full" preserveAspectRatio="none">
    <defs>
      <linearGradient id="grad5" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#5c6bc0", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#3f51b5", stopOpacity:1}} />
      </linearGradient>
    </defs>
    <rect width="350" height="200" fill="url(#grad5)"/>
    <polygon points="175,50 210,70 210,110 175,130 140,110 140,70" fill="white" opacity="0.9"/>
    <circle cx="175" cy="90" r="25" fill="#3f51b5"/>
    <text x="175" y="87" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="white">TOKEN</text>
    <text x="175" y="98" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="white">STANDARD</text>
    <circle cx="80" cy="90" r="15" fill="white" opacity="0.8"/>
    <circle cx="270" cy="90" r="15" fill="white" opacity="0.8"/>
    <circle cx="175" cy="150" r="15" fill="white" opacity="0.8"/>
    <line x1="140" y1="90" x2="95" y2="90" stroke="white" strokeWidth="2" opacity="0.7"/>
    <line x1="210" y1="90" x2="255" y2="90" stroke="white" strokeWidth="2" opacity="0.7"/>
    <line x1="175" y1="130" x2="175" y2="135" stroke="white" strokeWidth="2" opacity="0.7"/>
    <text x="80" y="95" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#3f51b5">MINT</text>
    <text x="270" y="95" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#3f51b5">BURN</text>
    <text x="175" y="155" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="#3f51b5">TRANSFER</text>
    <text x="175" y="25" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white">TOKEN STANDARDS</text>
    <text x="175" y="185" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fill="white">Educational Guide</text>
  </svg>
)

const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${className}`}>
    {children}
  </span>
)

const blogPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "How to Mint Tokens on Sui Network in 3 steps",
    date: "15.05.2025",
    image: "mint-tokens", // Custom SVG identifier
    tags: ["Guide", "Sui"],
    url: "/blog/mint-tokens-sui-network",
  },
  {
    id: "post-2",
    title: "How to Create a Custom Sui Token Address with a Prefix or Suffix",
    date: "12.05.2025",
    image: "custom-address", // Custom SVG identifier
    tags: ["Guide", "Sui", "Memes"],
    url: "/blog/custom-sui-token-address",
  },
  {
    id: "post-3",
    title: "Top 5 Sui Token Projects to Watch in 2025",
    date: "08.05.2025",
    image: "top-projects", // Custom SVG identifier
    tags: ["Insights", "Sui", "Projects"],
    url: "/blog/top-sui-token-projects",
  },
  {
    id: "post-4",
    title: "Understanding Token Standards on Sui Blockchain",
    date: "01.05.2025",
    image: "token-standards", // Custom SVG identifier
    tags: ["Education", "Standards"],
    url: "/blog/understanding-sui-token-standards",
  },
]

// Helper function to render the appropriate SVG component
const renderImage = (imageId: string) => {
  switch (imageId) {
    case "mint-tokens":
      return <MintTokensImage />
    case "custom-address":
      return <CustomAddressImage />
    case "top-projects":
      return <TopProjectsImage />
    case "token-standards":
      return <TokenStandardsImage />
    default:
      return <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-zinc-400">No Image</div>
  }
}

export default function BlogSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slidesPerView, setSlidesPerView] = useState(2)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Update slides per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesPerView(1)
      } else {
        setSlidesPerView(2)
      }
    }
    
    // Initial call
    handleResize()
    
    // Add event listener
    window.addEventListener("resize", handleResize)
    
    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  
  // Auto-play functionality
  useEffect(() => {
    const startAutoPlay = () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current)
      }
      
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const maxIndex = blogPosts.length - slidesPerView
          if (prevIndex >= maxIndex) {
            return 0 // Loop back to start
          }
          return prevIndex + 1
        })
      }, 5000) // Change slide every 5 seconds
    }
    
    startAutoPlay()
    
    // Stop auto-play when component unmounts
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current)
      }
    }
  }, [slidesPerView])
  
  // Handle manual navigation
  const handlePrev = () => {
    const maxIndex = blogPosts.length - slidesPerView
    
    setCurrentIndex((prevIndex) => {
      if (prevIndex <= 0) {
        return maxIndex // Loop to end
      }
      return prevIndex - 1
    })
    
    // Reset auto-play timer when manually navigating
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current)
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const maxIndex = blogPosts.length - slidesPerView
          if (prevIndex >= maxIndex) {
            return 0
          }
          return prevIndex + 1
        })
      }, 5000)
    }
  }
  
  const handleNext = () => {
    const maxIndex = blogPosts.length - slidesPerView
    
    setCurrentIndex((prevIndex) => {
      if (prevIndex >= maxIndex) {
        return 0 // Loop to start
      }
      return prevIndex + 1
    })
    
    // Reset auto-play timer when manually navigating
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current)
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const maxIndex = blogPosts.length - slidesPerView
          if (prevIndex >= maxIndex) {
            return 0
          }
          return prevIndex + 1
        })
      }, 5000)
    }
  }
  
  // Calculate slide width percentage based on slides per view
  const slideWidth = 100 / slidesPerView

  return (

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Latest Articles</h2>
          <div className="mt-2 w-16 h-1 bg-purple-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons - Always visible */}
          <button
            onClick={handlePrev}
            className="absolute cursor-pointer left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 bg-zinc-800/80 hover:bg-zinc-700 rounded-full p-2 text-white transition-colors shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-2 cursor-pointer md:-right-4 top-1/2 -translate-y-1/2 z-20 bg-zinc-800/80 hover:bg-zinc-700 rounded-full p-2 text-white transition-colors shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Carousel Container */}
          <div 
            ref={carouselRef} 
            className="overflow-hidden relative"
          >
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * slideWidth}%)` }}
              >
                {blogPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="flex-shrink-0 px-3"
                    style={{ width: `${slideWidth}%` }}
                  >
                    <div className="block h-full">
                      <Link href={post.url} className="block h-full cursor-pointer">
                      <div className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 h-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="relative h-48 overflow-hidden">
                          {renderImage(post.image)}
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-70" />
                          <div className="absolute bottom-0 left-0 p-4">
                            <h3 className="text-lg font-bold text-white line-clamp-2">{post.title}</h3>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                            <div className="flex items-center text-zinc-400 text-sm">
                              <Calendar size={14} className="mr-1" />
                              {post.date}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {post.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  className="bg-zinc-700/50 text-zinc-300 border border-zinc-600 text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center text-teal-400 hover:text-teal-300 cursor-pointer">
                            <span className="mr-1">Read more</span>
                            <ArrowRight size={14} />
                          </div>
                        </div>
                      </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Pagination Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: blogPosts.length - slidesPerView + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  
                  // Reset auto-play timer
                  if (autoPlayTimerRef.current) {
                    clearInterval(autoPlayTimerRef.current)
                    autoPlayTimerRef.current = setInterval(() => {
                      setCurrentIndex((prevIndex) => {
                        const maxIndex = blogPosts.length - slidesPerView
                        if (prevIndex >= maxIndex) {
                          return 0
                        }
                        return prevIndex + 1
                      })
                    }, 5000)
                  }
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex === index ? "bg-purple-500 w-6" : "bg-zinc-600"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
  )
}