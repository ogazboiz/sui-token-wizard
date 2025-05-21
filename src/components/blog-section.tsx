"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  date: string
  image: string
  tags: string[]
  url: string
}

const blogPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "How to Mint Tokens on Sui Network in 3 steps",
    date: "15.05.2025",
    image: "/placeholder.svg?height=200&width=350",
    tags: ["Guide", "Sui"],
    url: "/blog/mint-tokens-sui-network",
  },
  {
    id: "post-2",
    title: "How to Create a Custom Sui Token Address with a Prefix or Suffix",
    date: "12.05.2025",
    image: "/placeholder.svg?height=200&width=350",
    tags: ["Guide", "Sui", "Memes"],
    url: "/blog/custom-sui-token-address",
  },
  {
    id: "post-3",
    title: "Top 5 Sui Token Projects to Watch in 2025",
    date: "08.05.2025",
    image: "/placeholder.svg?height=200&width=350",
    tags: ["Insights", "Sui", "Projects"],
    url: "/blog/top-sui-token-projects",
  },
  {
    id: "post-4",
    title: "Understanding Token Standards on Sui Blockchain",
    date: "01.05.2025",
    image: "/placeholder.svg?height=200&width=350",
    tags: ["Education", "Standards"],
    url: "/blog/understanding-sui-token-standards",
  },
]

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
          className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 bg-zinc-800/80 hover:bg-zinc-700 rounded-full p-2 text-white transition-colors shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 bg-zinc-800/80 hover:bg-zinc-700 rounded-full p-2 text-white transition-colors shadow-lg"
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
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * slideWidth}%` }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.5 
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(e, info) => {
                if (info.offset.x > 100) {
                  handlePrev()
                } else if (info.offset.x < -100) {
                  handleNext()
                }
              }}
            >
              {blogPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${slideWidth}%` }}
                >
                  <Link href={post.url} className="block h-full">
                    <motion.div
                      className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 h-full shadow-lg"
                      whileHover={{ y: -5 }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <div
                          className="absolute inset-0 bg-center bg-cover"
                          style={{ backgroundImage: `url(${post.image})` }}
                        />
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
                                variant="outline"
                                className="bg-zinc-700/50 text-zinc-300 border-zinc-600 text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center text-teal-400 hover:text-teal-300">
                          <span className="mr-1">Read more</span>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              ))}
            </motion.div>
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