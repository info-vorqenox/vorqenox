import { NextResponse } from "next/server"
import { getSettings, updateSettings } from "@/lib/data"

export async function GET() {
  return NextResponse.json(getSettings())
}

export async function PUT(request: Request) {
  const body = await request.json()
  const settings = updateSettings(body)
  return NextResponse.json(settings)
}
