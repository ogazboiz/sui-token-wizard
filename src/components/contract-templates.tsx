"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface TemplateFeature {
  name: string
  included: boolean
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
    name: "Standard Token",
    price: "0.01 SUI",
    discount: 50,
    description:
      "Meet the Standard token – your go-to solution for creating tokens with ease. It comes with all the standard features of the Sui standard and offers extra option like supply limits. Craft your token your way and start your crypto adventure effortlessly!",
    features: [
      { name: "Basic Token Functionality", included: true },
      { name: "Supply Limits", included: true },
      { name: "Mintable", included: false },
      { name: "Burnable", included: false },
      { name: "Pausable", included: false },
      { name: "Blacklist", included: false },
    ],
    tags: ["sui-standard", "supply-limits"],
    imageSrc: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "essential",
    name: "Essential Token",
    price: "0.02 SUI",
    discount: 60,
    popular: true,
    description:
      "Discover the perfect Essential token that comes with all the basics from the Sui standard, plus extra features! Customize your token by setting supply limits, ownership parameters, and even consider its mintable, burnable, pausable, and blacklist functionalities. Create your unique token with ease!",
    features: [
      { name: "Basic Token Functionality", included: true },
      { name: "Supply Limits", included: true },
      { name: "Mintable", included: true },
      { name: "Burnable", included: true },
      { name: "Pausable", included: true },
      { name: "Blacklist", included: true },
    ],
    tags: ["sui-standard", "supply-limits", "ownership", "mintable", "burnable", "pausable", "blacklist"],
    imageSrc: "/placeholder.svg?height=120&width=120",
  },
]

export default function ContractTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const router = useRouter()

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId)
    // In a real app, you would navigate to the token form with the selected template
    // router.push(`/token-form?template=${templateId}`)
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white">Select contract template</h2>
        <div className="mt-2 w-48 h-1 bg-purple-500 mx-auto rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            className={`bg-zinc-800 rounded-xl overflow-hidden border ${
              selectedTemplate === template.id ? "border-teal-500" : "border-zinc-700"
            } transition-all hover:border-teal-500`}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`relative p-6 ${template.id === "standard" ? "bg-indigo-900/20" : "bg-fuchsia-900/20"}`}>
              <div className="absolute inset-0 opacity-10">
                {template.id === "standard" ? (
                  <div className="absolute inset-0 bg-indigo-500/10 pattern-dots pattern-indigo-500 pattern-bg-transparent pattern-size-4 pattern-opacity-10"></div>
                ) : (
                  <div className="absolute inset-0 bg-fuchsia-500/10 pattern-dots pattern-fuchsia-500 pattern-bg-transparent pattern-size-4 pattern-opacity-10"></div>
                )}
              </div>

              <div className="relative flex justify-between items-start">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm">
                  {template.id === "standard" ? <div className="text-3xl">😊</div> : <div className="text-3xl">😎</div>}
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
                onClick={() => handleSelectTemplate(template.id)}
                className={`w-full ${
                  template.id === "essential"
                    ? "bg-teal-500 hover:bg-teal-600 text-white"
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
