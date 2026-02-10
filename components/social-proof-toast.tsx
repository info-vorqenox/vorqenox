"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, X } from "lucide-react"

interface ProofItem {
  id: string
  name: string
  giftCardType: string
  price: string
  timeAgo: string
}

export function SocialProofToast() {
  const [current, setCurrent] = useState<ProofItem | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const showNext = async () => {
      try {
        const res = await fetch("/api/social-proof")
        const items: ProofItem[] = await res.json()
        if (items.length === 0) return

        const randomItem = items[Math.floor(Math.random() * items.length)]
        setCurrent(randomItem)
        setDismissed(false)

        timeout = setTimeout(() => {
          setCurrent(null)
          timeout = setTimeout(showNext, Math.random() * 10000 + 8000)
        }, 5000)
      } catch {
        // silently fail
      }
    }

    timeout = setTimeout(showNext, 5000)

    return () => clearTimeout(timeout)
  }, [])

  if (dismissed) return null

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-4 left-4 z-50 flex max-w-xs items-center gap-3 rounded-xl border border-primary/30 bg-card/95 p-3 shadow-lg backdrop-blur-md"
          style={{ boxShadow: "0 0 20px rgba(0,243,255,0.1)" }}
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Gift className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground">
              {current.name}{" "}
              <span className="font-normal text-muted-foreground">received</span>
            </p>
            <p className="text-xs text-primary">
              {current.giftCardType} - {current.price}
            </p>
            <p className="text-[10px] text-muted-foreground">{current.timeAgo}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setCurrent(null)
              setDismissed(true)
            }}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
