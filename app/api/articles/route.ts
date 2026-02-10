import { NextResponse } from "next/server"
import {
  getArticles,
  createArticle,
  getArticlesByCategory,
  getFeaturedArticles,
} from "@/lib/data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const featured = searchParams.get("featured")

  if (featured === "true") {
    return NextResponse.json(getFeaturedArticles())
  }
  if (category) {
    return NextResponse.json(getArticlesByCategory(category))
  }
  return NextResponse.json(getArticles())
}

export async function POST(request: Request) {
  const body = await request.json()
  const article = createArticle(body)
  return NextResponse.json(article, { status: 201 })
}
