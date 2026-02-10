"use client"

import React from "react"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Star, Zap, Sparkles } from "lucide-react"
import type { Article } from "@/lib/data"

const categoryIcons: Record<string, React.ReactNode> = {
  "ai-tools": <Sparkles className="h-4 w-4" />,
  apps: <Zap className="h-4 w-4" />,
  games: <Star className="h-4 w-4" />,
  "gift-cards": <Star className="h-4 w-4" />,
}

const categoryGradients: Record<string, string> = {
  "ai-tools": "from-cyan-500/20 via-blue-500/10 to-transparent",
  apps: "from-emerald-500/20 via-cyan-500/10 to-transparent",
  games: "from-purple-500/20 via-pink-500/10 to-transparent",
  "gift-cards": "from-amber-500/20 via-orange-500/10 to-transparent",
}

export function HeroCards({ articles }: { articles: Article[] }) {
  const featured = articles.filter((a) => a.isFeatured).slice(0, 3)

  if (featured.length === 0) return null

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
        {featured.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
          >
            <Link href={`/article/${article.slug}`} className="group block">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-primary/50">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[article.category]} opacity-50`}
                />
                <div className="relative p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {categoryIcons[article.category]}
                    </span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {article.category.replace("-", " ")}
                    </span>
                    {i === 0 && (
                      <span className="ml-auto rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        HOT
                      </span>
                    )}
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                    {article.title}
                  </h3>
                  <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {article.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <span>Get Now</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    boxShadow: "inset 0 0 30px rgba(0,243,255,0.05)",
                  }}
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
