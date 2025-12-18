import { NextRequest, NextResponse } from 'next/server'
import { assignCorePersonalityBadge, assignMusicPersonalityBadge, assignDatingEnergyBadge } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, answers, spotifyData } = body

    let result

    if (type === 'core') {
      result = await assignCorePersonalityBadge(answers)
    } else if (type === 'music') {
      result = await assignMusicPersonalityBadge(spotifyData || null, answers || null)
    } else if (type === 'dating') {
      result = await assignDatingEnergyBadge(answers)
    } else {
      return NextResponse.json({ error: 'Invalid badge type' }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Failed to assign badge' }, { status: 500 })
  }
}

