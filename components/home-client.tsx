"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroCards } from "@/components/hero-cards"
import { SwiperSection } from "@/components/swiper-section"
import { CategoryTabs } from "@/components/category-tabs"
import { AdSlot } from "@/components/ad-slot"
import { SocialProofToast } from "@/components/social-proof-toast"
import type { Article } from "@/lib/data"

export function HomeClient({ articles }: { articles: Article[] }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <AdSlot position="top" />
        <HeroCards articles={articles} />
        <SwiperSection articles={articles} />
        <AdSlot position="middle" />
        <CategoryTabs articles={articles} />
        <AdSlot position="bottom" />
      </main>

      <Footer />
      <SocialProofToast />
    </div>
  )
}
