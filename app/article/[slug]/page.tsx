import { getArticleBySlug, getArticles } from "@/lib/data"
import { notFound } from "next/navigation"
import { ArticleClient } from "@/components/article-client"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return { title: "Not Found" }
  return {
    title: `${article.title} - Vorqenox`,
    description: article.description,
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()
  const allArticles = getArticles()
  const related = allArticles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, 3)

  return <ArticleClient article={article} relatedArticles={related} />
}
