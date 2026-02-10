"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Shield, ExternalLink, CheckCircle, Timer } from "lucide-react"
import Link from "next/link"
import type { Article } from "@/lib/data"

export function BridgeClient({ article }: { article: Article }) {
  const [timeLeft, setTimeLeft] = useState(10)
  const [isReady, setIsReady] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setIsReady(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Background glow */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,243,255,0.03) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
              <span className="text-sm font-bold neon-text">V</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              Vorqe<span className="neon-text">nox</span>
            </span>
          </Link>
        </div>

        {/* Main card */}
        <div
          className="overflow-hidden rounded-2xl border border-primary/30 bg-card"
          style={{ boxShadow: "0 0 40px rgba(0,243,255,0.05)" }}
        >
          <div className="border-b border-border/50 p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              {isReady ? (
                <CheckCircle className="h-8 w-8 text-primary" />
              ) : (
                <Timer className="h-8 w-8 text-primary" />
              )}
            </div>
            <h1 className="mb-2 text-xl font-bold text-foreground text-balance">
              {article.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isReady
                ? "Your download link is verified and ready"
                : "Verifying your access. Please wait..."}
            </p>
          </div>

          {!isReady && (
            <div className="px-8 py-6">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Verification in progress
                </span>
                <span className="text-xs font-mono text-primary">
                  {timeLeft}s
                </span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-primary"
                  animate={{
                    width: `${((10 - timeLeft) / 10) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                  style={{
                    boxShadow: "0 0 10px #00f3ff, 0 0 20px #00f3ff",
                  }}
                />
              </div>
            </div>
          )}

          <div className="p-8">
            {isReady ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <a
                  href={article.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-bold text-primary-foreground transition-all hover:opacity-90"
                  style={{
                    animation: "neon-pulse 2s ease-in-out infinite",
                  }}
                >
                  <ExternalLink className="h-5 w-5" />
                  Download Now
                </a>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  <span>Secured and verified link</span>
                </div>
              </motion.div>
            ) : (
              <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary py-4 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                Please wait for verification
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href={`/article/${article.slug}`}
            className="text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            Back to article
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
