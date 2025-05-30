"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import TokenFormStandard from "@/components/generator/token-form-standard"
import TokenFormRegulated from "@/components/generator/token-form-regulated"
import TokenFormClosedLoop from "@/components/generator/token-form-closed-loop"
import { useRouter } from "next/navigation"
import { ConnectButton } from "@mysten/dapp-kit"
import { useWalletConnection } from "@/components/hooks/useWalletConnection"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface TemplateFeature {
  name: string
  included: boolean
}
interface ContractTemplatesProps {
  network?: "testnet" | "devnet" | "mainnet"
  isLandingPage?: boolean
  selectedTemplate?: string | null
  onTemplateSelect?: (templateId: string | null) => void
  onTokenCreated?: (tokenData: { name: string; symbol: string; supply: number; [key: string]: unknown }) => void
}
interface ContractTemplate {
  id: string
  name: string
  price: string
  discount: number
  popular?: boolean
  description: string
  features: TemplateFeature[]
  tags: string[]
  imageSrc: string
}

const templates: ContractTemplate[] = [
  {
    id: "standard",
    name: "Standard Coin",
    price: "0.01 SUI",
    discount: 50,
    description:
      "Meet the Standard coin – your go-to solution for creating coins with ease. It comes with all the standard features of the Sui standard and offers extra option like supply limits. Craft your coin your way and start your crypto adventure effortlessly!",
    features: [
      { name: "Basic Token Functionality", included: true },
      { name: "Supply Limits", included: true },
      { name: "Mintable", included: false },
      { name: "Burnable", included: false },
      { name: "Pausable", included: false },
      { name: "Denylist", included: false },
    ],
    tags: ["sui-standard", "supply-limits"],
    imageSrc: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "regulated",
    name: "Regulated Coin",
    price: "0.02 SUI",
    discount: 60,
    popular: true,
    description:
      "Discover the perfect regulated coin that comes with all the basics from the Sui standard, plus extra features! Customize your coin by setting supply limits, ownership parameters, and even consider its mintable, burnable, pausable, and denylist functionalities. Create your unique coin with ease!",
    features: [
      { name: "Basic Token Functionality", included: true },
      { name: "Supply Limits", included: true },
      { name: "Mintable", included: true },
      { name: "Burnable", included: true },
      { name: "Pausable", included: true },
      { name: "Denylist", included: true },
    ],
    tags: ["sui-standard", "supply-limits", "ownership", "mintable", "burnable", "pausable", "denylist"],
    imageSrc: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "closed-loop",
    name: "Closed-Loop Token",
    price: "0.05 SUI",
    discount: 40,
    description:
      "Create a sophisticated closed-loop token system with advanced circulation controls, restricted transfers, and ecosystem management features. Perfect for loyalty programs, gaming economies, and controlled token ecosystems with enhanced security and compliance features.",
    features: [
      { name: "Basic Token Functionality", included: true },
      { name: "Supply Limits", included: true },
      { name: "Mintable", included: true },
      { name: "Burnable", included: true },
      { name: "Pausable", included: true },
      { name: "Denylist", included: true },
      { name: "Allowlist", included: true },
      { name: "Transfer Restrictions", included: true },
    ],
    tags: ["sui-standard", "supply-limits", "allowlist", "transfer-restrictions", "ecosystem-control"],
    imageSrc: "/placeholder.svg?height=120&width=120",
  },
]

export default function ContractTemplates({
  network = "testnet",
  isLandingPage = false,
  selectedTemplate = null,
  onTemplateSelect,
}: ContractTemplatesProps) {
  const router = useRouter()
  const { isConnected, isReady } = useWalletConnection()

  const handleSelectTemplate = (templateId: string) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first to create a token")
      return
    }
    onTemplateSelect?.(templateId)
  }

  const handleBack = () => {
    onTemplateSelect?.(null)
  }

  const handleSwitchTemplate = (templateId: string) => {
    onTemplateSelect?.(templateId)
  }

  const handleTemplateClick = (templateId: string) => {
    if (isLandingPage) {
      if (!isConnected) {
        toast.error("Please connect your wallet first to create a token")
        return
      }
      router.push(`/generator/${network}?template=${templateId}`)
      return
    }
    handleSelectTemplate(templateId)
  }

  // Show loading state while checking wallet connection
  if (!isReady) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    )
  }

  // Render forms only when not on landing page and template is selected
  if (!isLandingPage && selectedTemplate === "standard") {
    return <TokenFormStandard network={network} onBack={handleBack} onSwitchTemplate={handleSwitchTemplate} />
  }

  if (!isLandingPage && selectedTemplate === "regulated") {
    return <TokenFormRegulated network={network} onBack={handleBack} onSwitchTemplate={handleSwitchTemplate} />
  }

  if (!isLandingPage && selectedTemplate === "closed-loop") {
    return <TokenFormClosedLoop network={network} onBack={handleBack} onSwitchTemplate={handleSwitchTemplate} />
  }

  return (
    <div className={isLandingPage ? "container mx-auto px-4 py-16" : ""}>
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white">Select contract template</h2>
        <div className="mt-2 w-48 h-1 bg-purple-500 mx-auto rounded-full"></div>

        {!isConnected && (
          <div className="mt-6 max-w-md mx-auto">
            <Alert className="bg-zinc-800 border-zinc-700">
              <Terminal className="h-4 w-4 text-teal-500" />
              <AlertTitle className="text-white">Wallet Not Connected</AlertTitle>
              <AlertDescription className="text-zinc-400">
                You need to connect your wallet to create tokens.
                <div className="mt-4 flex justify-center">
                  <ConnectButton
                    connectText="Connect Wallet"
                    className="bg-teal-500 cursor-pointer hover:bg-teal-600 text-white"
                  />
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto gap-6">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            className={`bg-zinc-800 rounded-xl overflow-hidden border ${selectedTemplate === template.id ? "border-teal-500" : "border-zinc-700"
              } transition-all hover:border-teal-500`}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`relative p-6 ${
              template.id === "standard" ? "bg-indigo-900/20" : 
              template.id === "regulated" ? "bg-fuchsia-900/20" : 
              "bg-emerald-900/20"
            }`}>
              <div className="absolute inset-0 opacity-10">
                {template.id === "standard" ? (
                  <div className="absolute inset-0 bg-indigo-500/10 pattern-dots pattern-indigo-500 pattern-bg-transparent pattern-size-4 pattern-opacity-10"></div>
                ) : template.id === "regulated" ? (
                  <div className="absolute inset-0 bg-fuchsia-500/10 pattern-dots pattern-fuchsia-500 pattern-bg-transparent pattern-size-4 pattern-opacity-10"></div>
                ) : (
                  <div className="absolute inset-0 bg-emerald-500/10 pattern-dots pattern-emerald-500 pattern-bg-transparent pattern-size-4 pattern-opacity-10"></div>
                )}
              </div>
              <div className="relative flex justify-between items-start">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm">
                  {template.id === "standard" ? (
                    <div className="text-3xl">😊</div>
                  ) : template.id === "regulated" ? (
                    <div className="text-3xl">😎</div>
                  ) : (
                    <div className="text-3xl">🚀</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="bg-zinc-900/60 backdrop-blur-sm px-3 py-1 rounded-lg inline-block">
                    <span className="text-zinc-400 text-sm">Price: </span>
                    <span className="text-white font-medium">{template.price}</span>
                  </div>
                  {template.popular && (
                    <div className="mt-2 bg-yellow-500/80 text-black text-xs font-bold px-2 py-1 rounded-md inline-block">
                      Popular
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3 inline-block bg-zinc-900/60 backdrop-blur-sm px-3 py-1 rounded-lg">
                <span className="text-teal-400 font-medium">Discount: {template.discount}%</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{template.name}</h3>
              <p className="text-zinc-400 text-sm mb-4">{template.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-zinc-700/50 text-zinc-300 border-zinc-600">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button
                onClick={() => handleTemplateClick(template.id)}
                className={`w-full cursor-pointer ${
                  template.id === "regulated"
                    ? "bg-teal-500 hover:bg-teal-600 text-white"
                    : template.id === "closed-loop"
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-zinc-700 hover:bg-zinc-600 text-white"
                }`}
              >
                Create token
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}