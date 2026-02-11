"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroCards } from "@/components/hero-cards"
import { SwiperSection } from "@/components/swiper-section"
import { CategoryTabs } from "@/components/category-tabs"
import { AdSlot } from "@/components/ad-slot"
import { SocialProofToast } from "@/components/social-proof-toast"
import type { Article, SiteSettings } from "@/lib/data"

export function HomeClient({ articles }: { articles: Article[] }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {})
  }, [])

  const adToggles = settings?.adToggles ?? { top: true, middle: true, bottom: true }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {adToggles.top && <AdSlot position="top" />}
        <HeroCards articles={articles} settings={settings} />
        <SwiperSection articles={articles} />
        {adToggles.middle && <AdSlot position="middle" />}
        <CategoryTabs articles={articles} />
        {adToggles.bottom && <AdSlot position="bottom" />}
      </main>

      <Footer settings={settings} />
      <SocialProofToast />
    </div>
  )
}
