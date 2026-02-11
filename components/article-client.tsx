"use client"

import React, { useState, useEffect, useMemo } from "react"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Monitor,
  HardDrive,
  Tag,
  Box,
  Calendar,
  Download,
  Mail,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CountdownEngine } from "@/components/countdown-engine"
import { AdSlot } from "@/components/ad-slot"
import { SocialProofToast } from "@/components/social-proof-toast"
import type { Article, SiteSettings } from "@/lib/data"

function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M"
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k"
  return n.toString()
}

const specIconMap: Record<string, React.ReactNode> = {
  Version: <Tag className="h-4 w-4" />,
  Platform: <Monitor className="h-4 w-4" />,
  Size: <HardDrive className="h-4 w-4" />,
  License: <Box className="h-4 w-4" />,
  Quality: <Monitor className="h-4 w-4" />,
  Screens: <Monitor className="h-4 w-4" />,
  Downloads: <HardDrive className="h-4 w-4" />,
  Value: <Tag className="h-4 w-4" />,
  Delivery: <Box className="h-4 w-4" />,
  Validity: <Calendar className="h-4 w-4" />,
}

export function ArticleClient({
  article,
  relatedArticles,
}: {
  article: Article
  relatedArticles: Article[]
}) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {})
  }, [])

  const adToggles = settings?.adToggles ?? { top: true, middle: true, bottom: true }

  const counterVal = useMemo(() => {
    if (!article.counter?.enabled) return null
    if (article.counter.mode === "fixed") return article.counter.fixedValue
    const min = article.counter.randomMin
    const max = article.counter.randomMax
    return Math.floor(Math.random() * (max - min + 1)) + min
  }, [article.counter])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {article.enableAds && adToggles.top && <AdSlot position="top" />}

        <div className="mx-auto max-w-4xl px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm">
              <Link
                href="/"
                className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Home
              </Link>
              <span className="text-muted-foreground/50">/</span>
              <span className="text-primary capitalize">
                {article.category.replace("-", " ")}
              </span>
            </div>

            {/* Title */}
            <div className="mb-8">
              <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {article.category.replace("-", " ")}
              </span>
              <h1 className="mb-3 text-3xl font-bold text-foreground md:text-4xl text-balance">
                {article.title}
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground text-pretty">
                {article.description}
              </p>
              {counterVal != null && (
                <div className="mt-3 flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" />
                  <span className="text-sm font-bold text-primary">
                    {formatCount(counterVal)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {article.counter?.label || "Downloads"}
                  </span>
                </div>
              )}
            </div>

            {/* Specs grid */}
            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {article.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
                >
                  <div className="flex items-center gap-2 text-primary">
                    {specIconMap[spec.label] || <Tag className="h-4 w-4" />}
                    <span className="text-xs text-muted-foreground">
                      {spec.label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="mb-8 rounded-2xl border border-border bg-card p-6">
              <div className="prose prose-invert max-w-none">
                {article.content.split("\n").map((line, i) => {
                  const key = `line-${i}`
                  if (line.startsWith("- ")) {
                    return (
                      <div
                        key={key}
                        className="flex items-start gap-2 py-1"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        <span className="text-sm leading-relaxed text-muted-foreground">
                          {line.slice(2)}
                        </span>
                      </div>
                    )
                  }
                  if (line.trim() === "") {
                    return <div key={key} className="h-3" />
                  }
                  return (
                    <p
                      key={key}
                      className="text-sm leading-relaxed text-muted-foreground"
                    >
                      {line}
                    </p>
                  )
                })}
              </div>
            </div>

            {article.enableAds && adToggles.middle && <AdSlot position="middle" />}

            {/* Countdown Engine */}
            {article.enableTimer && (
              <div className="my-8">
                <CountdownEngine
                  articleSlug={article.slug}
                  downloadUrl={article.downloadUrl}
                />
              </div>
            )}

            {/* Blinking Email Activation Warning */}
            <div className="my-8 overflow-hidden rounded-2xl border-2 border-red-500/60 bg-card p-6" style={{ animation: "blink-red-border 1.5s ease-in-out infinite" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15">
                  <Mail className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-400" dir="rtl">{"مطلوب: ادخل بريدك الالكتروني لاستلام كود التفعيل"}</h3>
                  <p className="text-xs text-red-400/70" dir="rtl">{"سيتم ارسال كود التفعيل الى بريدك الالكتروني خلال دقائق"}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 rounded-xl border border-red-500/30 bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/50"
                  dir="ltr"
                />
                <button
                  type="button"
                  className="rounded-xl bg-red-500 px-6 py-3 text-sm font-bold text-foreground transition-all hover:bg-red-600"
                  style={{ boxShadow: "0 0 15px rgba(239,68,68,0.3)" }}
                >
                  {"ارسال"}
                </button>
              </div>
            </div>

            {article.enableAds && adToggles.bottom && <AdSlot position="bottom" />}

            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-4 text-lg font-bold text-foreground">
                  Related <span className="neon-text">Articles</span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedArticles.map((ra) => (
                    <Link
                      key={ra.id}
                      href={`/article/${ra.slug}`}
                      className="group rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40"
                    >
                      <h3 className="mb-1 text-sm font-bold text-foreground transition-colors group-hover:text-primary line-clamp-1">
                        {ra.title}
                      </h3>
                      <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">
                        {ra.description}
                      </p>
                      <span className="flex items-center gap-1 text-xs font-medium text-primary">
                        Read More
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer settings={settings} />
      <SocialProofToast />
    </div>
  )
}
