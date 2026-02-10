import { NextResponse } from "next/server"
import { getArticleById, updateArticle, deleteArticle } from "@/lib/data"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const article = getArticleById(id)
  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json(article)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const article = updateArticle(id, body)
  if (!article) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json(article)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const deleted = deleteArticle(id)
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
