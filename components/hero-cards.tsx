"use client"

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Star, Zap, Sparkles, Download } from "lucide-react"
import type { Article, SiteSettings } from "@/lib/data"

const categoryIcons: Record<string, React.ReactNode> = {
  "ai-tools": <Sparkles className="h-4 w-4" />,
  apps: <Zap className="h-4 w-4" />,
  games: <Star className="h-4 w-4" />,
  "gift-cards": <Star className="h-4 w-4" />,
}

function getCounterDisplay(article: Article): number | null {
  if (!article.counter?.enabled) return null
  if (article.counter.mode === "fixed") return article.counter.fixedValue
  const min = article.counter.randomMin
  const max = article.counter.randomMax
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M"
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k"
  return n.toString()
}

export function HeroCards({
  articles,
  settings,
}: {
  articles: Article[]
  settings?: SiteSettings | null
}) {
  const featured = articles.filter((a) => a.isFeatured).slice(0, 3)
  const showNeon = settings?.neonShowOnHome !== false
  const intensity = (settings?.neonIntensity ?? 70) / 100

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const counters = useMemo(() => {
    if (!mounted) return {}
    const map: Record<string, number | null> = {}
    for (const a of featured) {
      map[a.id] = getCounterDisplay(a)
    }
    return map
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, featured.map((a) => a.id).join(",")])

  if (featured.length === 0) return null

  const getCategoryNeonColor = (category: string) => {
    if (!settings?.neonCategoryColors) return settings?.neonColor || "#00f3ff"
    const found = settings.neonCategoryColors.find(
      (c) => c.category === category
    )
    return found?.color || settings?.neonColor || "#00f3ff"
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
          Featured
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-primary/50 to-transparent" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((article, i) => {
          const neonColor = getCategoryNeonColor(article.category)
          const counterVal = counters[article.id]

          return (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              style={{ perspective: "1000px" }}
            >
              <Link href={`/article/${article.slug}`} className="group block">
                <div
                  className="relative overflow-hidden rounded-2xl border transition-all duration-500"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderColor: showNeon
                      ? `${neonColor}33`
                      : "hsl(var(--border))",
                    boxShadow: showNeon
                      ? `0 0 ${20 * intensity}px ${neonColor}15, 0 0 ${40 * intensity}px ${neonColor}08, inset 0 1px 0 rgba(255,255,255,0.05)`
                      : "inset 0 1px 0 rgba(255,255,255,0.05)",
                    transform: "translateZ(0)",
                  }}
                  onMouseEnter={(e) => {
                    if (showNeon) {
                      e.currentTarget.style.borderColor = `${neonColor}66`
                      e.currentTarget.style.boxShadow = `0 0 ${30 * intensity}px ${neonColor}25, 0 0 ${60 * intensity}px ${neonColor}12, 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)`
                      e.currentTarget.style.transform =
                        "translateZ(0) translateY(-4px)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = showNeon
                      ? `${neonColor}33`
                      : "hsl(var(--border))"
                    e.currentTarget.style.boxShadow = showNeon
                      ? `0 0 ${20 * intensity}px ${neonColor}15, 0 0 ${40 * intensity}px ${neonColor}08, inset 0 1px 0 rgba(255,255,255,0.05)`
                      : "inset 0 1px 0 rgba(255,255,255,0.05)"
                    e.currentTarget.style.transform = "translateZ(0)"
                  }}
                >
                  {/* Glassmorphism overlay */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${neonColor}08 0%, transparent 50%, ${neonColor}04 100%)`,
                    }}
                  />

                  <div className="relative p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: `${neonColor}15`,
                          color: neonColor,
                        }}
                      >
                        {categoryIcons[article.category]}
                      </span>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: `${neonColor}15`,
                          color: neonColor,
                        }}
                      >
                        {article.category.replace("-", " ")}
                      </span>
                      {i === 0 && (
                        <span
                          className="ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold"
                          style={{
                            backgroundColor: `${neonColor}25`,
                            color: neonColor,
                          }}
                        >
                          HOT
                        </span>
                      )}
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                      {article.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {article.description}
                    </p>

                    {mounted && counterVal != null && (
                      <div className="mb-4 flex items-center gap-2">
                        <Download
                          className="h-3.5 w-3.5"
                          style={{ color: neonColor }}
                        />
                        <span
                          className="text-xs font-bold"
                          style={{ color: neonColor }}
                        >
                          {formatCount(counterVal)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {article.counter?.label || "Downloads"}
                        </span>
                      </div>
                    )}

                    <div
                      className="flex items-center gap-2 text-sm font-medium"
                      style={{ color: neonColor }}
                    >
                      <span>Get Now</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
