import { NextRequest, NextResponse } from 'next/server'
import { generatePersonalitySummary } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { badge1, badge2, badge3 } = body

    const summary = await generatePersonalitySummary(badge1, badge2, badge3)

    return NextResponse.json(summary)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 })
  }
}

