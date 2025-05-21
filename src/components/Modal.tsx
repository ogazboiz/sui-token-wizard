"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type EcosystemItem = {
  name: string
  logo: string
  color: string
  link: string
  platform?: string // Only for wallets
}

interface EcosystemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  items: EcosystemItem[]
}

export default function EcosystemModal({ open, onOpenChange, title, items }: EcosystemModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto bg-zinc-900 text-white border border-zinc-700">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.name} className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${item.color}`}
              >
                {item.logo}
              </div>
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                {item.platform && (
                  <p className="text-xs text-zinc-400">{item.platform}</p>
                )}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 text-xs hover:underline"
                >
                  {item.link.replace("https://", "")}
                </a>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
