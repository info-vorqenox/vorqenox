import { getArticles } from "@/lib/data"
import { HomeClient } from "@/components/home-client"

export default function Home() {
  const articles = getArticles()
  return <HomeClient articles={articles} />
}
