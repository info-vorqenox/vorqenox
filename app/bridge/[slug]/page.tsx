import { getArticleBySlug } from "@/lib/data"
import { notFound } from "next/navigation"
import { BridgeClient } from "@/components/bridge-client"
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
    title: `Download ${article.title} - Vorqenox`,
    description: `Access your secure download link for ${article.title}`,
  }
}

export default async function BridgePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  return <BridgeClient article={article} />
}
