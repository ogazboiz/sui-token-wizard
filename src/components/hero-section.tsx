'use client';
import { motion } from "framer-motion";
import { PlusCircle, Zap, Shield, Coins, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  // Removed unused isHovered state

  const handleCreateToken = () => {
    console.log("Navigating to token creation page");
    // Navigation would go here in Next.js
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, boxShadow: "0px 0px 15px 0px rgba(20, 184, 166, 0.5)" },
    tap: { scale: 0.98 }
  };

  const glowVariants = {
    rest: { opacity: 0 },
    hover: { opacity: 0.8 }
  };

  const features = [
    { name: "Fast", description: "Deploy in seconds", icon: <Zap className="text-teal-400" size={24} /> },
    { name: "Secure", description: "Audited contracts", icon: <Shield className="text-teal-400" size={24} /> },
    { name: "Low Cost", description: "Minimal gas fees", icon: <Coins className="text-teal-400" size={24} /> },
    { name: "Customizable", description: "Full token control", icon: <Settings className="text-teal-400" size={24} /> }
  ];

  return (
    <div className="container max-w-6xl  mx-auto px-4 py-8 md:py-16">
      <motion.div
        className="mt-8 md:mt-12 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-xl blur-3xl" />

        <motion.div
          className="relative bg-zinc-900/70 backdrop-blur-sm rounded-xl border border-zinc-800/80 p-8 md:p-12 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute top-[-150px] right-[-150px] w-[300px] h-[300px] rounded-full bg-teal-500/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />

          <motion.div
            className="absolute bottom-[-150px] left-[-150px] w-[300px] h-[300px] rounded-full bg-blue-500/10 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 10,
              delay: 1,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />

          {/* Existing animated background blob */}
          <motion.div
            className="absolute bottom-[-100px] right-[10%] w-[250px] h-[250px] rounded-full bg-teal-400/12 blur-3xl"
            animate={{
              x: [0, 15, -10, 0],
              y: [0, -10, 15, 0],
              scale: [1, 1.15, 1],
              opacity: [0.25, 0.45, 0.25]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            }}
          />

          {/* New animated background element for a "video-like" feel */}
          <motion.div
            className="absolute top-[10%] left-[5%] w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-3xl" // Using purple for variety
            animate={{
              x: [0, -20, 10, 0],
              y: [0, 25, -15, 0],
              rotate: [0, 10, -5, 0],
              scale: [1, 1.1, 0.95, 1],
              opacity: [0.2, 0.35, 0.15, 0.2]
            }}
            transition={{
              duration: 15, // Slower, more fluid movement
              repeat: Infinity,
              repeatType: "mirror",
              ease: "circInOut" // Smoother easing
            }}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto text-center relative z-10"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
            >
              Create Sui Token
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400">
                in Minutes
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-zinc-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto"
            >
              Deploy your own custom token on the Sui blockchain with ease. Our simple, fast, and secure platform lets
              you bring your ideas to life.
            </motion.p>

            <motion.div variants={itemVariants}>
              <motion.div
                className="relative inline-block"
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg opacity-0"
                  variants={glowVariants}
                />
                <motion.div variants={buttonVariants}>
                  <Button
                    onClick={handleCreateToken}
                    className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white text-lg px-8 py-6 h-auto rounded-lg relative z-10 transition-all duration-300"
                  >
                    <PlusCircle className="mr-2" size={24} />
                    Create token
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={containerVariants} // For initial staggered appearance
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants} // For initial item appearance
                  whileHover={{ y: -5 }} // Keep existing hover for the whole group
                  className="flex flex-col items-center group"
                >
                  <motion.div
                    className="w-16 h-16 rounded-lg bg-zinc-800/80 backdrop-blur-sm flex items-center justify-center border border-zinc-700/50 transition-all duration-300 group-hover:border-teal-500/50 group-hover:bg-zinc-800"
                    whileHover={{ // Keep existing hover for the icon box
                      boxShadow: "0px 0px 12px 0px rgba(20, 184, 166, 0.3)",
                      scale: 1.05
                    }}
                    // Add continuous animation
                    animate={{
                      scale: [1, 1.04, 1], // Subtle pulse
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: index * 0.3, // Stagger the start of the continuous animation
                      ease: "easeInOut"
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                  <span className="mt-3 text-white font-medium">{feature.name}</span>
                  <span className="text-zinc-400 text-sm mt-1">{feature.description}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;