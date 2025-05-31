"use client"
import { Suspense, useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import dynamic from 'next/dynamic'
import { Toaster } from "@/components/ui/sonner"
import Footer from "@/components/footer"
import { motion, AnimatePresence } from "framer-motion"
import  AnimatedLogoLoader  from "@/components/AnimatedLogoLoader" 

// Dynamic imports with better loading states
const HeroSection = dynamic(() => import('@/components/hero-section'), { 
  ssr: false,
  loading: () => <HeroSkeleton />
})

const LandingContractTemplates = dynamic(() => import('@/components/landing-contract-template'), { 
  ssr: false,
  loading: () => <SectionSkeleton />
})

const ActiveWalletsExplorers = dynamic(() => import('@/components/Active-WalletsExplorers'), { 
  ssr: false,
  loading: () => <SectionSkeleton />
})

const FeaturesSection = dynamic(() => import('@/components/features-section'), { 
  ssr: false,
  loading: () => <FeaturesSkeleton />
})

const BlogSection = dynamic(() => import('@/components/blog-section'), { 
  ssr: false,
  loading: () => <SectionSkeleton />
})

const FaqSection = dynamic(() => import('@/components/faq-section'), { 
  ssr: false,
  loading: () => <SectionSkeleton />
})

// Skeleton Components
function HeroSkeleton() {
  return (
    <div className="h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center">
          {/* Tab switcher skeleton */}
          <div className="flex justify-center mb-8">
            <div className="bg-zinc-800/80 rounded-full p-1 flex gap-1">
              <div className="h-8 w-20 bg-zinc-700 rounded-full animate-pulse"></div>
              <div className="h-8 w-24 bg-zinc-700 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Title skeleton */}
          <div className="space-y-4 mb-8">
            <div className="h-12 bg-zinc-800 rounded-lg animate-pulse mx-auto max-w-xl"></div>
            <div className="h-8 bg-zinc-800 rounded-lg animate-pulse mx-auto max-w-lg"></div>
          </div>
          
          {/* Description skeleton */}
          <div className="space-y-3 mb-8 max-w-2xl mx-auto">
            <div className="h-4 bg-zinc-800 rounded animate-pulse"></div>
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-4/5 mx-auto"></div>
          </div>
          
          {/* Button skeleton */}
          <div className="h-12 w-48 bg-zinc-800 rounded-lg animate-pulse mx-auto mb-8"></div>
          
          {/* Features grid skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-zinc-800 rounded-lg animate-pulse mb-2"></div>
                <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse mb-1"></div>
                <div className="h-2 w-20 bg-zinc-800 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionSkeleton() {
  return (
    <div className="px-4 py-16">
      <div className="text-center mb-8">
        <div className="h-8 w-64 bg-zinc-800 rounded-lg animate-pulse mx-auto mb-2"></div>
        <div className="w-48 h-1 bg-zinc-800 rounded-full animate-pulse mx-auto"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-zinc-800 rounded-xl p-6 animate-pulse">
            <div className="h-32 bg-zinc-700 rounded-lg mb-4"></div>
            <div className="h-6 bg-zinc-700 rounded mb-2"></div>
            <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FeaturesSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="w-12 h-12 bg-zinc-800 rounded animate-pulse mx-auto mb-4"></div>
        <div className="h-8 w-32 bg-zinc-800 rounded-lg animate-pulse mx-auto mb-4"></div>
        <div className="space-y-2 max-w-2xl mx-auto">
          <div className="h-4 bg-zinc-800 rounded animate-pulse"></div>
          <div className="h-4 bg-zinc-800 rounded animate-pulse w-4/5 mx-auto"></div>
          <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/5 mx-auto"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 animate-pulse">
            <div className="w-14 h-14 rounded-lg bg-zinc-700 mb-4"></div>
            <div className="h-6 bg-zinc-700 rounded mb-2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-zinc-700 rounded"></div>
              <div className="h-4 bg-zinc-700 rounded w-4/5"></div>
              <div className="h-4 bg-zinc-700 rounded w-3/5"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// // Full page loading component with better UX
// function FullPageLoader() {
//   const [loadingText, setLoadingText] = useState("Loading")
  
//   useEffect(() => {
//     const texts = ["Loading", "Preparing Experience", "Almost Ready"]
//     let index = 0
//     const interval = setInterval(() => {
//       index = (index + 1) % texts.length
//       setLoadingText(texts[index])
//     }, 1000)
    
//     return () => clearInterval(interval)
//   }, [])
  
//   return (
//     <motion.div 
//       className="fixed inset-0 bg-zinc-950 z-50 flex items-center justify-center"
//       initial={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="text-center">
//         <div className="relative">
//           {/* Animated logo or spinner */}
//           <motion.div
//             className="w-16 h-16 border-4 border-zinc-700 border-t-teal-500 rounded-full mx-auto"
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           />
          
//           {/* Pulsing rings */}
//           <motion.div
//             className="absolute inset-0 w-16 h-16 border-2 border-teal-500/30 rounded-full mx-auto"
//             animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
//             transition={{ duration: 2, repeat: Infinity }}
//           />
//         </div>
        
//         <motion.p
//           className="text-white text-lg font-medium mt-6"
//           key={loadingText}
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -10 }}
//         >
//           {loadingText}
//         </motion.p>
        
//         <motion.div
//           className="mt-4 w-48 h-1 bg-zinc-800 rounded-full mx-auto overflow-hidden"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5 }}
//         >
//           <motion.div
//             className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
//             animate={{ x: ["-100%", "100%"] }}
//             transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
//           />
//         </motion.div>
//       </div>
//     </motion.div>
//   )
// }

export default function Home() {
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  
  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
    }, 4000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-zinc-950">
      <AnimatePresence>
        {isInitialLoading && <AnimatedLogoLoader />}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isInitialLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <Navbar />
        
        <Suspense fallback={<HeroSkeleton />}>
          <HeroSection />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <LandingContractTemplates />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <ActiveWalletsExplorers />
        </Suspense>
        
        <Suspense fallback={<FeaturesSkeleton />}>
          <FeaturesSection />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <BlogSection />
        </Suspense>
        
        <Suspense fallback={<SectionSkeleton />}>
          <FaqSection />
        </Suspense>
        
        <Footer />
      </motion.div>
      
      <Toaster />
    </main>
  )
}