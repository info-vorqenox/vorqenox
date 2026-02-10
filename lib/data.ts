// In-memory data store for the platform (will persist during server runtime)
// In production, replace with a database

export interface Article {
  id: string
  title: string
  slug: string
  description: string
  content: string
  category: "apps" | "games" | "ai-tools" | "gift-cards"
  imageUrl: string
  isFeatured: boolean
  specs: { label: string; value: string }[]
  downloadUrl: string
  enableAds: boolean
  enableTimer: boolean
  enableViralLock: boolean
  createdAt: string
  updatedAt: string
}

export interface SiteSettings {
  siteName: string
  logoUrl: string
  neonColor: string
  socialLinks: {
    twitter: string
    telegram: string
    youtube: string
    instagram: string
  }
}

export interface SocialProofItem {
  id: string
  name: string
  giftCardType: string
  price: string
  timeAgo: string
}

// Default demo articles
const defaultArticles: Article[] = [
  {
    id: "1",
    title: "ChatGPT Pro - Unlimited AI Power",
    slug: "chatgpt-pro-unlimited",
    description:
      "Unlock the full potential of ChatGPT with Pro access. No limits, no restrictions.",
    content:
      "ChatGPT Pro gives you unlimited access to the most powerful AI language model. With advanced reasoning, code generation, and creative writing capabilities, this is the ultimate tool for professionals and creators alike.\n\nFeatures include:\n- Unlimited message cap\n- Priority access during peak times\n- Advanced data analysis\n- Image generation with DALL-E\n- Custom GPT creation",
    category: "ai-tools",
    imageUrl: "",
    isFeatured: true,
    specs: [
      { label: "Version", value: "4.5 Turbo" },
      { label: "Platform", value: "Web / iOS / Android" },
      { label: "Size", value: "Cloud-based" },
      { label: "License", value: "Premium" },
    ],
    downloadUrl: "https://example.com/chatgpt",
    enableAds: true,
    enableTimer: true,
    enableViralLock: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Spotify Premium - Ad-Free Music",
    slug: "spotify-premium-ad-free",
    description:
      "Stream millions of songs ad-free with Spotify Premium. Download music for offline listening.",
    content:
      "Enjoy an enhanced music experience with Spotify Premium. Stream over 100 million tracks without interruption, download your favorites for offline listening, and enjoy superior audio quality.\n\nWhat you get:\n- Ad-free music streaming\n- Offline downloads\n- High quality audio (320kbps)\n- Unlimited skips\n- Cross-device sync",
    category: "apps",
    imageUrl: "",
    isFeatured: true,
    specs: [
      { label: "Version", value: "8.9.2" },
      { label: "Platform", value: "All Platforms" },
      { label: "Size", value: "150 MB" },
      { label: "License", value: "Premium" },
    ],
    downloadUrl: "https://example.com/spotify",
    enableAds: true,
    enableTimer: true,
    enableViralLock: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "GTA VI Mobile - Early Access",
    slug: "gta-vi-mobile-early-access",
    description:
      "Experience the next generation of open-world gaming on mobile. GTA VI is here.",
    content:
      "Grand Theft Auto VI brings the legendary franchise to a whole new level. Explore a massive open world, engage in thrilling missions, and experience next-gen graphics on your mobile device.\n\nHighlights:\n- Massive open world map\n- Next-gen graphics engine\n- Online multiplayer\n- Regular content updates\n- Controller support",
    category: "games",
    imageUrl: "",
    isFeatured: true,
    specs: [
      { label: "Version", value: "1.0 Beta" },
      { label: "Platform", value: "Android / iOS" },
      { label: "Size", value: "2.8 GB" },
      { label: "License", value: "Free-to-Play" },
    ],
    downloadUrl: "https://example.com/gtavi",
    enableAds: true,
    enableTimer: true,
    enableViralLock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "$100 Amazon Gift Card Generator",
    slug: "amazon-gift-card-100",
    description:
      "Get your Amazon Gift Card worth $100. Limited time offer with instant delivery.",
    content:
      "Claim your $100 Amazon Gift Card and shop for anything you want. From electronics to fashion, books to home essentials - the possibilities are endless.\n\nHow it works:\n- Complete the verification\n- Receive your unique code\n- Redeem on Amazon\n- Start shopping immediately\n- Valid worldwide",
    category: "gift-cards",
    imageUrl: "",
    isFeatured: false,
    specs: [
      { label: "Value", value: "$100 USD" },
      { label: "Platform", value: "Amazon Global" },
      { label: "Delivery", value: "Instant" },
      { label: "Validity", value: "12 Months" },
    ],
    downloadUrl: "https://example.com/amazon",
    enableAds: true,
    enableTimer: true,
    enableViralLock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Midjourney V6 - AI Art Generator",
    slug: "midjourney-v6-ai-art",
    description:
      "Create stunning AI-generated artwork with Midjourney V6. Photorealistic results in seconds.",
    content:
      "Midjourney V6 represents a quantum leap in AI image generation. Create breathtaking photorealistic images, artistic masterpieces, and creative designs with simple text prompts.\n\nCapabilities:\n- Photorealistic image generation\n- Style mixing and blending\n- Upscaling to 4K resolution\n- Batch generation\n- Custom training support",
    category: "ai-tools",
    imageUrl: "",
    isFeatured: false,
    specs: [
      { label: "Version", value: "6.0" },
      { label: "Platform", value: "Discord / Web" },
      { label: "Quality", value: "4K Output" },
      { label: "License", value: "Subscription" },
    ],
    downloadUrl: "https://example.com/midjourney",
    enableAds: true,
    enableTimer: true,
    enableViralLock: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Netflix Premium - 4K Streaming",
    slug: "netflix-premium-4k",
    description:
      "Watch unlimited movies and shows in 4K Ultra HD. Netflix Premium at your fingertips.",
    content:
      "Enjoy the best of entertainment with Netflix Premium. Stream thousands of movies, TV shows, and documentaries in stunning 4K Ultra HD quality.\n\nBenefits:\n- 4K Ultra HD streaming\n- Multiple device support\n- Download for offline viewing\n- No advertisements\n- Exclusive originals",
    category: "apps",
    imageUrl: "",
    isFeatured: false,
    specs: [
      { label: "Quality", value: "4K Ultra HD" },
      { label: "Screens", value: "4 Simultaneous" },
      { label: "Downloads", value: "Unlimited" },
      { label: "License", value: "Premium" },
    ],
    downloadUrl: "https://example.com/netflix",
    enableAds: true,
    enableTimer: true,
    enableViralLock: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const defaultSocialProof: SocialProofItem[] = [
  {
    id: "1",
    name: "Ahmed K.",
    giftCardType: "Amazon Gift Card",
    price: "$50",
    timeAgo: "2 min ago",
  },
  {
    id: "2",
    name: "Sarah M.",
    giftCardType: "iTunes Gift Card",
    price: "$25",
    timeAgo: "5 min ago",
  },
  {
    id: "3",
    name: "Omar R.",
    giftCardType: "Google Play Card",
    price: "$100",
    timeAgo: "8 min ago",
  },
  {
    id: "4",
    name: "Fatima A.",
    giftCardType: "Steam Wallet",
    price: "$50",
    timeAgo: "12 min ago",
  },
  {
    id: "5",
    name: "Youssef B.",
    giftCardType: "PlayStation Card",
    price: "$75",
    timeAgo: "15 min ago",
  },
]

const defaultSettings: SiteSettings = {
  siteName: "Vorqenox",
  logoUrl: "",
  neonColor: "#00f3ff",
  socialLinks: {
    twitter: "",
    telegram: "",
    youtube: "",
    instagram: "",
  },
}

// In-memory store
let articles: Article[] = [...defaultArticles]
let settings: SiteSettings = { ...defaultSettings }
let socialProof: SocialProofItem[] = [...defaultSocialProof]

// Articles CRUD
export function getArticles(): Article[] {
  return articles
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug)
}

export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id)
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((a) => a.isFeatured)
}

export function getArticlesByCategory(category: string): Article[] {
  return articles.filter((a) => a.category === category)
}

export function createArticle(article: Omit<Article, "id" | "createdAt" | "updatedAt">): Article {
  const newArticle: Article = {
    ...article,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  articles.push(newArticle)
  return newArticle
}

export function updateArticle(
  id: string,
  data: Partial<Omit<Article, "id" | "createdAt">>
): Article | null {
  const index = articles.findIndex((a) => a.id === id)
  if (index === -1) return null
  articles[index] = {
    ...articles[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  return articles[index]
}

export function deleteArticle(id: string): boolean {
  const len = articles.length
  articles = articles.filter((a) => a.id !== id)
  return articles.length < len
}

// Settings
export function getSettings(): SiteSettings {
  return settings
}

export function updateSettings(data: Partial<SiteSettings>): SiteSettings {
  settings = { ...settings, ...data }
  return settings
}

// Social Proof
export function getSocialProof(): SocialProofItem[] {
  return socialProof
}

export function updateSocialProof(items: SocialProofItem[]): SocialProofItem[] {
  socialProof = items
  return socialProof
}
