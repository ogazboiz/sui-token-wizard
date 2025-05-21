"use client"

import type React from "react"

import { motion } from "framer-motion"
import { PlusCircle, Zap, Shield, Coins, Settings, ImageIcon, PaintBucket, Tags } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  type: "token" | "nft"
  color: "teal" | "blue" | "cyan" | "violet" | "purple" | "indigo" | "emerald" | "amber" | "rose"
  duration: number
  isHovered: boolean
}

interface Feature {
  name: string
  description: string
  icon: React.ReactNode
}

interface MousePosition {
  x: number
  y: number
}

export default function LandingHeroSection() {
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<"tokens" | "nft">("tokens")
  const [particles, setParticles] = useState<Particle[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = []
      // Reduce particle count on mobile
      const particleCount = isMobile ? 4 : 8
      const nftParticleCount = isMobile ? 2 : 4

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * (isMobile ? 6 : 8) + 4,
          type: "token",
          color:
            activeTab === "tokens"
              ? i % 3 === 0
                ? "teal"
                : i % 3 === 1
                  ? "blue"
                  : "cyan"
              : i % 3 === 0
                ? "violet"
                : i % 3 === 1
                  ? "purple"
                  : "indigo",
          duration: Math.random() * 15 + 10, // 10-25s
          isHovered: false,
        })
      }

      for (let i = particleCount; i < particleCount + nftParticleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * (isMobile ? 8 : 12) + 6,
          type: "nft",
          color:
            activeTab === "tokens"
              ? i % 4 === 0
                ? "emerald"
                : i % 4 === 1
                  ? "violet"
                  : i % 4 === 2
                    ? "amber"
                    : "rose"
              : i % 4 === 0
                ? "violet"
                : i % 4 === 1
                  ? "purple"
                  : i % 4 === 2
                    ? "indigo"
                    : "rose",
          duration: Math.random() * 13 + 10, // 10-23s
          isHovered: false,
        })
      }
      setParticles(newParticles)
    }

    generateParticles()
  }, [activeTab, isMobile])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        setMousePosition({ x: mouseX, y: mouseY })
        setParticles((prevParticles) =>
          prevParticles.map((particle) => {
            const particleX = (particle.x * rect.width) / 100
            const particleY = (particle.y * rect.height) / 100
            const distance = Math.sqrt(Math.pow(mouseX - particleX, 2) + Math.pow(mouseY - particleY, 2))
            return {
              ...particle,
              isHovered: distance < 80,
            }
          }),
        )
      }
    }

    // Only add mouse move listener on non-mobile devices
    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove)
      return () => window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isMobile])

  const handleCreateAction = () => {
    if (activeTab === "tokens") {
      router.push("/generator/mainnet")
    } else {
      router.push("/nft/generate")
    }
  }

  const tokenFeatures: Feature[] = [
    { name: "Fast", description: "Deploy in seconds", icon: <Zap className="text-teal-400" size={20} /> },
    { name: "Secure", description: "Audited contracts", icon: <Shield className="text-teal-400" size={20} /> },
    { name: "Low Cost", description: "Minimal gas fees", icon: <Coins className="text-teal-400" size={20} /> },
    { name: "Customizable", description: "Full token control", icon: <Settings className="text-teal-400" size={20} /> },
  ]

  const nftFeatures: Feature[] = [
    {
      name: "Creative",
      description: "Custom collections",
      icon: <PaintBucket className="text-violet-400" size={20} />,
    },
    { name: "Immutable", description: "Blockchain secured", icon: <Shield className="text-violet-400" size={20} /> },
    {
      name: "Media-rich",
      description: "Images, video, audio",
      icon: <ImageIcon className="text-violet-400" size={20} />,
    },
    { name: "Metadata", description: "Custom attributes", icon: <Tags className="text-violet-400" size={20} /> },
  ]

  const features: Feature[] = activeTab === "tokens" ? tokenFeatures : nftFeatures

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  const buttonVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: `0px 0px 15px 0px rgba(${activeTab === "tokens" ? "20, 184, 166" : "139, 92, 246"}, 0.5)`,
    },
    tap: { scale: 0.98 },
  }

  const glowVariants = {
    rest: { opacity: 0 },
    hover: { opacity: 0.8 },
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6">
      <motion.div
        className="w-full max-w-4xl relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        ref={containerRef}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-xl blur-3xl">
          <svg className="w-full h-full opacity-20">
            <defs>
              <radialGradient id="gradient-1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <motion.stop
                  offset="0%"
                  stopColor="#2DD4BF"
                  animate={{ stopOpacity: [0.6, 0.3, 0.6] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                />
                <motion.stop
                  offset="100%"
                  stopColor="#2DD4BF"
                  animate={{ stopOpacity: [0, 0.3, 0] }}
                  transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
                />
              </radialGradient>
              <radialGradient id="gradient-2" cx="50%" cy="50%" r="50%" fx="25%" fy="25%">
                <motion.stop
                  offset="0%"
                  stopColor="#3B82F6"
                  animate={{ stopOpacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY }}
                />
                <motion.stop
                  offset="100%"
                  stopColor="#3B82F6"
                  animate={{ stopOpacity: [0, 0.2, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                />
              </radialGradient>
            </defs>
            <motion.circle
              cx="30%"
              cy="40%"
              r="300"
              fill="url(#gradient-1)"
              animate={{ cx: ["30%", "35%", "25%", "30%"], cy: ["40%", "35%", "45%", "40%"], r: [300, 350, 280, 300] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror" }}
            />
            <motion.circle
              cx="70%"
              cy="60%"
              r="250"
              fill="url(#gradient-2)"
              animate={{ cx: ["70%", "65%", "75%", "70%"], cy: ["60%", "65%", "55%", "60%"], r: [250, 300, 230, 250] }}
              transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror" }}
            />
          </svg>
        </div>

        {/* Background decorative elements - hidden on mobile */}
        {!isMobile && (
          <svg
            className="absolute top-1/4 right-1/4 w-32 h-32 text-teal-500/5 opacity-20 hidden md:block"
            viewBox="0 0 100 100"
          >
            <motion.path
              d="M50 5 A45 45 0 1 1 5 50 A45 45 0 1 1 95 50 A45 45 0 1 1 50 5z M35 35 L65 35 L65 65 L35 65 z"
              fill="currentColor"
              animate={{ opacity: [0.1, 0.3, 0.1], rotate: 360 }}
              transition={{
                opacity: { duration: 8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
                rotate: { duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              }}
            />
          </svg>
        )}

        {/* Particles - rendered conditionally */}
        {particles.map((particle) => {
          if (particle.type === "token") {
            return (
              <motion.div
                key={particle.id}
                className="absolute z-0"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  opacity: particle.isHovered ? 1 : 0.8,
                  transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: `scale(${particle.isHovered ? 1.2 : 1})`,
                  filter: particle.isHovered
                    ? "drop-shadow(0px 0px 8px rgba(255,255,255,0.8))"
                    : "drop-shadow(0px 0px 2px rgba(255,255,255,0.3))",
                }}
                animate={{
                  x: particle.isHovered
                    ? 0
                    : [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
                  y: particle.isHovered
                    ? 0
                    : [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
                  opacity: particle.isHovered ? 1 : [0.3, 0.7, 0.3],
                  rotateY: particle.isHovered ? 0 : [0, 180, 360],
                  scale: particle.isHovered ? 1.2 : [0.9, 1.1, 0.9],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <svg width={particle.size * 2.5} height={particle.size * 2.5} viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill={`url(#token-grad-${particle.id})`}
                    stroke={
                      particle.color === "teal"
                        ? "#2DD4BF"
                        : particle.color === "blue"
                          ? "#3B82F6"
                          : particle.color === "cyan"
                            ? "#06B6D4"
                            : particle.color === "violet"
                              ? "#8B5CF6"
                              : particle.color === "purple"
                                ? "#A855F7"
                                : "#4F46E5"
                    }
                    strokeWidth="2"
                  />
                  <defs>
                    <radialGradient id={`token-grad-${particle.id}`} cx="40%" cy="40%" r="60%" fx="40%" fy="40%">
                      <stop
                        offset="0%"
                        stopColor={
                          particle.color === "teal"
                            ? "#2DD4BF"
                            : particle.color === "blue"
                              ? "#3B82F6"
                              : particle.color === "cyan"
                                ? "#06B6D4"
                                : particle.color === "violet"
                                  ? "#8B5CF6"
                                  : particle.color === "purple"
                                    ? "#A855F7"
                                    : "#4F46E5"
                        }
                        stopOpacity="0.7"
                      />
                      <stop
                        offset="100%"
                        stopColor={
                          particle.color === "teal"
                            ? "#0F766E"
                            : particle.color === "blue"
                              ? "#1D4ED8"
                              : particle.color === "cyan"
                                ? "#0E7490"
                                : particle.color === "violet"
                                  ? "#6D28D9"
                                  : particle.color === "purple"
                                    ? "#9333EA"
                                    : "#4338CA"
                        }
                        stopOpacity="0.9"
                      />
                    </radialGradient>
                  </defs>
                  <path
                    d={
                      particle.id % 3 === 0
                        ? "M35,35 L65,35 L65,65 L35,65 Z"
                        : particle.id % 3 === 1
                          ? "M50,30 L70,50 L50,70 L30,50 Z"
                          : "M33,50 A17,17 0 1,0 67,50 A17,17 0 1,0 33,50 Z"
                    }
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    opacity={particle.isHovered ? "1" : "0.8"}
                  />
                  {particle.id % 4 === 0 && (
                    <text
                      x="50"
                      y="60"
                      textAnchor="middle"
                      fill="white"
                      fontWeight="bold"
                      fontSize="32"
                      fontFamily="sans-serif"
                      opacity={particle.isHovered ? "1" : "0.9"}
                    >
                      S
                    </text>
                  )}
                </svg>
              </motion.div>
            )
          } else {
            return (
              <motion.div
                key={particle.id}
                className="absolute z-0"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  opacity: particle.isHovered ? 1 : 0.8,
                  transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: `scale(${particle.isHovered ? 1.2 : 1})`,
                  filter: particle.isHovered
                    ? "drop-shadow(0px 0px 8px rgba(255,255,255,0.8))"
                    : "drop-shadow(0px 0px 3px rgba(255,255,255,0.3))",
                }}
                animate={{
                  x: particle.isHovered
                    ? 0
                    : [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
                  y: particle.isHovered
                    ? 0
                    : [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
                  opacity: particle.isHovered ? 1 : [0.3, 0.7, 0.3],
                  rotate: particle.isHovered ? 0 : [0, 10, -10, 0],
                  scale: particle.isHovered ? 1.2 : [0.8, 1.1, 0.8],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <svg width={particle.size * 2.5} height={particle.size * 2.5} viewBox="0 0 100 100">
                  <rect
                    x="10"
                    y="10"
                    width="80"
                    height="80"
                    rx="5"
                    fill={`url(#nft-grad-${particle.id})`}
                    stroke={
                      particle.color === "emerald"
                        ? "#10B981"
                        : particle.color === "violet"
                          ? "#8B5CF6"
                          : particle.color === "amber"
                            ? "#F59E0B"
                            : particle.color === "rose"
                              ? "#F43F5E"
                              : particle.color === "purple"
                                ? "#A855F7"
                                : "#4F46E5"
                    }
                    strokeWidth="2"
                  />
                  <defs>
                    <linearGradient id={`nft-grad-${particle.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop
                        offset="0%"
                        stopColor={
                          particle.color === "emerald"
                            ? "#10B981"
                            : particle.color === "violet"
                              ? "#8B5CF6"
                              : particle.color === "amber"
                                ? "#F59E0B"
                                : particle.color === "rose"
                                  ? "#F43F5E"
                                  : particle.color === "purple"
                                    ? "#A855F7"
                                    : "#4F46E5"
                        }
                        stopOpacity={particle.isHovered ? "0.6" : "0.3"}
                      />
                      <stop
                        offset="100%"
                        stopColor={
                          particle.color === "emerald"
                            ? "#047857"
                            : particle.color === "violet"
                              ? "#6D28D9"
                              : particle.color === "amber"
                                ? "#B45309"
                                : particle.color === "rose"
                                  ? "#BE185D"
                                  : particle.color === "purple"
                                    ? "#9333EA"
                                    : "#4338CA"
                        }
                        stopOpacity={particle.isHovered ? "0.9" : "0.7"}
                      />
                    </linearGradient>
                  </defs>
                  {particle.id % 4 === 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="25"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      opacity={particle.isHovered ? "1" : "0.8"}
                    />
                  )}
                  {particle.id % 4 === 1 && (
                    <polygon
                      points="50,25 75,50 50,75 25,50"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      opacity={particle.isHovered ? "1" : "0.8"}
                    />
                  )}
                  {particle.id % 4 === 2 && (
                    <rect
                      x="30"
                      y="30"
                      width="40"
                      height="40"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      opacity={particle.isHovered ? "1" : "0.8"}
                    />
                  )}
                  {particle.id % 4 === 3 && (
                    <path
                      d="M30,30 Q50,20 70,30 Q80,50 70,70 Q50,80 30,70 Q20,50 30,30"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      opacity={particle.isHovered ? "1" : "0.8"}
                    />
                  )}
                </svg>
              </motion.div>
            )
          }
        })}

        {/* Decorative lines - simplified on mobile */}
        <svg className="absolute inset-0 w-full h-full overflow-visible z-0 opacity-10">
          <motion.path
            d="M30,30 L70,30 L90,60 L70,90 L30,90 L10,60 Z"
            fill="none"
            stroke={`rgba(${activeTab === "tokens" ? "45, 212, 191" : "139, 92, 246"}, 0.2)`}
            strokeWidth="0.5"
            strokeDasharray="6,4"
            animate={{ pathLength: [0, 1], opacity: [0.05, 0.2, 0.05] }}
            transition={{
              pathLength: { duration: 10, repeat: Number.POSITIVE_INFINITY },
              opacity: { duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
            }}
          />
          {!isMobile && (
            <>
              <motion.line
                x1="20%"
                y1="30%"
                x2="40%"
                y2="70%"
                stroke={`rgba(${activeTab === "tokens" ? "45, 212, 191" : "139, 92, 246"}, 0.5)`}
                strokeWidth="1"
                strokeDasharray="6,4"
                animate={{ pathLength: [0, 1, 0], opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.line
                x1="40%"
                y1="70%"
                x2="70%"
                y2="50%"
                stroke={`rgba(${activeTab === "tokens" ? "59, 130, 246" : "139, 92, 246"}, 0.5)`}
                strokeWidth="1"
                strokeDasharray="6,4"
                animate={{ pathLength: [0, 1, 0], opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 8, delay: 0.5, repeat: Number.POSITIVE_INFINITY }}
              />
            </>
          )}
        </svg>

        <motion.div
          className="relative bg-zinc-900/70 backdrop-blur-xs w-full mx-auto rounded-xl border border-zinc-800/80 p-4 sm:p-6 md:p-8 lg:p-10 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Tab switcher - repositioned for mobile */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex bg-zinc-800/80 rounded-full backdrop-blur-sm border border-zinc-700/30">
            <motion.button
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${activeTab === "tokens" ? "bg-teal-500/20 text-teal-400" : "text-zinc-400 hover:text-zinc-200"}`}
              onClick={() => setActiveTab("tokens")}
              whileTap={{ scale: 0.97 }}
            >
              Tokens
            </motion.button>
            <motion.button
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${activeTab === "nft" ? "bg-violet-500/20 text-violet-400" : "text-zinc-400 hover:text-zinc-200"}`}
              onClick={() => setActiveTab("nft")}
              whileTap={{ scale: 0.97 }}
            >
              NFT Collections
            </motion.button>
          </div>

          {/* Mouse follower glow - only on desktop */}
          {!isMobile && (
            <motion.div
              className={`absolute rounded-full w-64 h-64 bg-${activeTab === "tokens" ? "teal" : "violet"}-400/10 blur-3xl pointer-events-none z-0`}
              animate={{
                x: mousePosition.x - 128,
                y: mousePosition.y - 128,
                opacity: 0.3,
                transition: { type: "spring", damping: 25, stiffness: 50 },
              }}
            />
          )}

          {/* Background glows */}
          <motion.div
            className="absolute top-[-150px] right-[-150px] w-[300px] h-[300px] rounded-full bg-teal-500/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />

          <motion.div
            className="absolute bottom-[-150px] left-[-150px] w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, delay: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto text-center relative z-10"
          >
            {/* Title glow effect */}
            <motion.div
              className={`absolute w-64 h-16 bg-${activeTab === "tokens" ? "teal" : "violet"}-400/20 rounded-full blur-3xl left-1/2 -translate-x-1/2`}
              animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
              transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            />

            {/* Main heading - adjusted for mobile */}
            <motion.h1
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 mt-12 sm:mt-14 md:mt-16"
            >
              Create Sui {activeTab === "tokens" ? "Token" : "NFT Collection"}
              <br />
              <span
                className={`bg-clip-text text-transparent bg-gradient-to-r from-${activeTab === "tokens" ? "teal" : "violet"}-400 to-blue-400 relative`}
              >
                <motion.span
                  className={`absolute -inset-1 rounded-lg opacity-30 filter blur-sm bg-gradient-to-r from-${activeTab === "tokens" ? "teal" : "violet"}-400/30 to-blue-400/30 z-0`}
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                />
                <span className="relative z-10">in Minutes</span>
              </span>
            </motion.h1>

            {/* Description - adjusted for mobile */}
            <motion.p
              variants={itemVariants}
              className="text-zinc-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 mt-3 max-w-2xl mx-auto px-2"
            >
              {activeTab === "tokens"
                ? "Deploy your own custom token on the Sui blockchain with ease. Our simple, fast, and secure platform lets you bring your ideas to life."
                : "Launch your unique NFT collection on the Sui blockchain. Create customizable, secure, and media-rich NFTs effortlessly."}
            </motion.p>

            {/* CTA Button - resized for mobile */}
            <motion.div variants={itemVariants}>
              <motion.div className="relative inline-block" initial="rest" whileHover="hover" whileTap="tap">
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r from-${activeTab === "tokens" ? "teal" : "violet"}-400 to-blue-500 rounded-lg opacity-0`}
                  variants={glowVariants}
                />
                <motion.div
                  className={`absolute -inset-2 rounded-xl opacity-0 border border-${activeTab === "tokens" ? "teal" : "violet"}-400`}
                  animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.1, 0.8] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
                />
                <motion.div variants={buttonVariants}>
                  <Button
                    onClick={handleCreateAction}
                    className={`${activeTab === "tokens" ? "bg-teal-500 hover:bg-teal-600" : "bg-violet-500 hover:bg-violet-600"} text-white px-4 py-2 sm:px-6 rounded-lg`}
                  >
                    <PlusCircle className="mr-2" size={18} />
                    Create {activeTab === "tokens" ? "Token" : "NFT Collection"}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Features grid - responsive layout */}
            <motion.div
              variants={containerVariants}
              className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-2xl mx-auto"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="flex flex-col items-center group relative"
                >
                  {/* Connecting lines between features - desktop only */}
                  {!isMobile && index < features.length - 1 && (
                    <motion.div
                      className={`absolute top-6 w-full h-px bg-${activeTab === "tokens" ? "teal" : "violet"}-500/20 hidden md:block`}
                      style={{ left: "50%" }}
                      initial={{ width: 0, opacity: 0 }}
                      animate={{
                        width: "100%",
                        opacity: [0, 0.5, 0],
                        transition: {
                          width: { duration: 0.5, delay: 1 + index * 0.2 },
                          opacity: {
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                            delay: 1 + index * 0.2,
                          },
                        },
                      }}
                    />
                  )}

                  {/* Feature icon container - smaller on mobile */}
                  <motion.div
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg bg-zinc-800/80 backdrop-blur-sm flex items-center justify-center border border-zinc-700/50 transition-all duration-300 group-hover:border-${activeTab === "tokens" ? "teal" : "violet"}-500/50 group-hover:bg-zinc-800 relative overflow-hidden`}
                    whileHover={{
                      boxShadow: `0px 0px 12px 0px rgba(${activeTab === "tokens" ? "20, 184, 166" : "139, 92, 246"}, 0.3)`,
                      scale: 1.05,
                    }}
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{
                      duration: 2.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "mirror",
                      delay: index * 0.3,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br from-${activeTab === "tokens" ? "teal" : "violet"}-400/10 to-transparent`}
                      animate={{ rotate: [0, 360], opacity: [0.1, 0.3, 0.1] }}
                      transition={{
                        rotate: { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                        opacity: { duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" },
                      }}
                    />
                    {feature.icon}
                  </motion.div>

                  {/* Feature name and description - smaller text on mobile */}
                  <span className="mt-2 sm:mt-3 text-white text-xs sm:text-sm font-medium">{feature.name}</span>
                  <span className="text-zinc-400 text-xs mt-0.5 sm:mt-1">{feature.description}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
