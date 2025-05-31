import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Animated Logo Component
export default function AnimatedLogoLoader() {
  const [loadingText, setLoadingText] = useState("Initializing Magic");
  
  useEffect(() => {
    const texts = [
      "Initializing Magic", 
      "Brewing Tokens", 
      "Casting Spells", 
      "Almost Ready"
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setLoadingText(texts[index]);
    }, 1200);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 bg-zinc-950 z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center">
        {/* Animated Logo Container */}
        <div className="relative mb-8">
          {/* Magical sparkles around the logo */}
          <motion.div
            className="absolute -top-8 -left-8 w-4 h-4"
            animate={{ 
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-full h-full bg-purple-400 transform rotate-45"></div>
            <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-purple-400 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 h-full w-0.5 bg-purple-400 transform -translate-x-1/2 -translate-y-1/2"></div>
          </motion.div>

          <motion.div
            className="absolute -top-4 -right-12 w-3 h-3"
            animate={{ 
              scale: [1, 1.8, 1],
              rotate: [0, -180, -360],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
          >
            <div className="w-full h-full bg-purple-400 transform rotate-45"></div>
            <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-purple-400 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 h-full w-0.5 bg-purple-400 transform -translate-x-1/2 -translate-y-1/2"></div>
          </motion.div>

          <motion.div
            className="absolute -bottom-6 -left-6 w-2 h-2"
            animate={{ 
              scale: [1, 2, 1],
              rotate: [0, 90, 180],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
          >
            <div className="w-full h-full bg-purple-400 transform rotate-45"></div>
            <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-purple-400 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 h-full w-0.5 bg-purple-400 transform -translate-x-1/2 -translate-y-1/2"></div>
          </motion.div>

          {/* Main Logo */}
          <motion.div 
            className="relative"
            animate={{ 
              scale: [1, 1.05, 1],
              rotateY: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Wizard Hat */}
            <motion.div 
              className="relative mx-auto mb-4"
              style={{ width: '120px', height: '120px' }}
              animate={{
                rotate: [0, 2, 0, -2, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Hat Base (Cauldron) */}
              <motion.div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                style={{
                  width: '80px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
                  borderRadius: '40px 40px 20px 20px',
                  border: '3px solid #0f766e'
                }}
                animate={{
                  scale: [1, 1.02, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Cauldron liquid effect */}
                <motion.div
                  className="absolute top-2 left-1/2 transform -translate-x-1/2"
                  style={{
                    width: '60px',
                    height: '20px',
                    background: 'linear-gradient(90deg, #2dd4bf 0%, #0891b2 50%, #2dd4bf 100%)',
                    borderRadius: '50%',
                    opacity: 0.8
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Magical bubble effects */}
                <motion.div
                  className="absolute top-1 left-4 w-2 h-2 bg-white rounded-full opacity-60"
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.6, 0, 0.6]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.3
                  }}
                />
                <motion.div
                  className="absolute top-2 right-6 w-1.5 h-1.5 bg-white rounded-full opacity-50"
                  animate={{
                    y: [0, -6, 0],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: 0.8
                  }}
                />
              </motion.div>

              {/* Wizard Hat Cone */}
              <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                style={{
                  width: '0',
                  height: '0',
                  borderLeft: '45px solid transparent',
                  borderRight: '45px solid transparent',
                  borderBottom: '70px solid #14b8a6',
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                }}
                animate={{
                  rotate: [0, 1, 0, -1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Hat Brim */}
              <motion.div
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
                style={{
                  width: '100px',
                  height: '12px',
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
                  borderRadius: '50px',
                  border: '2px solid #0f766e'
                }}
                animate={{
                  scaleX: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Magical wand effect */}
              <motion.div
                className="absolute top-4 right-2 w-1 h-8 bg-gradient-to-t from-amber-400 to-yellow-300 rounded-full opacity-80"
                animate={{
                  rotate: [0, 10, 0, -10, 0],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Wand star */}
              <motion.div
                className="absolute top-2 right-1 w-3 h-3"
                animate={{
                  rotate: [0, 180, 360],
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-full h-full bg-yellow-300 transform rotate-45"></div>
                <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-yellow-300 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 h-full w-0.5 bg-yellow-300 transform -translate-x-1/2 -translate-y-1/2"></div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Glowing ring effect around logo */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-teal-500/30"
            style={{ width: '160px', height: '160px', margin: 'auto' }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 360]
            }}
            transition={{
              scale: { duration: 2, repeat: Infinity },
              opacity: { duration: 2, repeat: Infinity },
              rotate: { duration: 8, repeat: Infinity, ease: "linear" }
            }}
          />
        </div>

        {/* Brand Text */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2"
            animate={{
              scale: [1, 1.02, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Sui Token Wizard
          </motion.h1>
          
          {/* Slogan */}
          <motion.p 
            className="text-lg font-medium bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent"
            animate={{
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Magic in Every Mint
          </motion.p>
        </motion.div>
        
        {/* Loading Text */}
        <motion.p
          className="text-white text-lg font-medium mb-6"
          key={loadingText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          {loadingText}
        </motion.p>
        
        {/* Loading Progress Bar */}
        <motion.div
          className="w-64 h-2 bg-zinc-800 rounded-full mx-auto overflow-hidden"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 rounded-full"
            animate={{ 
              x: ["-100%", "100%"],
              background: [
                "linear-gradient(to right, #14b8a6, #3b82f6, #8b5cf6)",
                "linear-gradient(to right, #8b5cf6, #14b8a6, #3b82f6)",
                "linear-gradient(to right, #3b82f6, #8b5cf6, #14b8a6)"
              ]
            }}
            transition={{ 
              x: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              background: { duration: 3, repeat: Infinity }
            }}
          />
        </motion.div>

        {/* Magical particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + (i % 3) * 20}%`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Example usage in your main component
// s