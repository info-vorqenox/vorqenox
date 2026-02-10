import { NextResponse } from "next/server"
import { getSocialProof, updateSocialProof } from "@/lib/data"

export async function GET() {
  return NextResponse.json(getSocialProof())
}

export async function PUT(request: Request) {
  const body = await request.json()
  const proof = updateSocialProof(body)
  return NextResponse.json(proof)
}
