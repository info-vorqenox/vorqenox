"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Shield, Lock } from "lucide-react"
import Link from "next/link"

export function CountdownEngine({
  articleSlug,
  downloadUrl,
}: {
  articleSlug: string
  downloadUrl: string
}) {
  const [totalTime] = useState(
    () => Math.floor(Math.random() * (90 - 29 + 1)) + 29
  )
  const [timeLeft, setTimeLeft] = useState(totalTime)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setIsComplete(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const progress = ((totalTime - timeLeft) / totalTime) * 100

  return (
    <div className="overflow-hidden rounded-2xl border border-primary/30 bg-card">
      <div className="border-b border-border/50 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {isComplete ? (
              <Shield className="h-5 w-5" />
            ) : (
              <Lock className="h-5 w-5" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {isComplete ? "Link Secured" : "Securing Link..."}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isComplete
                ? "Your download link is ready"
                : "Please wait while we prepare your secure link"}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            style={{
              boxShadow: "0 0 10px #00f3ff, 0 0 20px #00f3ff",
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2s linear infinite",
            }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {isComplete
              ? "Complete"
              : `${Math.round(progress)}% - ${timeLeft}s remaining`}
          </span>
          <span className="text-xs font-mono text-primary">
            {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
            {String(timeLeft % 60).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="p-6">
        {isComplete ? (
          <Link
            href={`/bridge/${articleSlug}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-all hover:opacity-90 animate-neon-pulse"
          >
            <Shield className="h-4 w-4" />
            Access Download
          </Link>
        ) : (
          <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-3.5 text-sm font-medium text-muted-foreground">
            <Lock className="h-4 w-4" />
            Waiting for verification...
          </div>
        )}
      </div>
    </div>
  )
}
