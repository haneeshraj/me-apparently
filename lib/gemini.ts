import { GoogleGenAI } from '@google/genai'

// Get all available API keys
function getApiKeys(): string[] {
  const keys: string[] = []
  
  // Try numbered keys first (GEMINI_API_KEY_1, GEMINI_API_KEY_2, etc.)
  for (let i = 1; i <= 4; i++) {
    const key = process.env[`GEMINI_API_KEY_${i}`]
    if (key) keys.push(key)
  }
  
  // Fallback to legacy keys if no numbered keys found
  if (keys.length === 0) {
    const legacyKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY
    if (legacyKey) keys.push(legacyKey)
  }
  
  return keys
}

// Try API call with multiple keys until one works
async function tryWithMultipleKeys<T>(
  apiCall: (ai: GoogleGenAI) => Promise<T>
): Promise<T> {
  const apiKeys = getApiKeys()
  
  if (apiKeys.length === 0) {
    throw new Error('No Gemini API keys configured')
  }
  
  let lastError: Error | null = null
  
  for (const apiKey of apiKeys) {
    try {
      const ai = new GoogleGenAI({ apiKey })
      return await apiCall(ai)
    } catch (error) {
      lastError = error as Error
      console.warn(`API key failed, trying next key...`, error)
      continue
    }
  }
  
  // All keys failed
  throw lastError || new Error('All API keys failed')
}

export interface BadgeAssignment {
  badgeId: number
  badgeType: 'core' | 'music' | 'dating'
  reasoning: string
  analytics: Array<{ trait: string; percentage: number }>
}

export async function assignCorePersonalityBadge(answers: string[]): Promise<BadgeAssignment> {
  const prompt = `You are analyzing personality quiz answers to assign one of 10 Core Personality badges.

Badge Options:
1. Soft Genius - Intelligent, thoughtful, and observant. Understands complex things but never needs to prove it.
2. Curious Nerd - Loves learning, niche interests, and rabbit holes. Finds joy in knowing too much.
3. Quirky Optimist - Lighthearted, expressive, and emotionally open. Brings warmth into any room.
4. Controlled Chaos - Appears put-together but thrives in creative unpredictability. Functional mess energy.
5. Quiet Intense - Feels deeply, speaks selectively, notices everything. Presence without noise.
6. Playful Thinker - Smart with humor. Uses wit as a thinking tool. Never boring.
7. Overthinking Romantic - Emotionally rich, reflective, prone to introspection and meaning-making.
8. Calm Strategist - Grounded, forward-thinking, emotionally steady. Plans without stress.
9. Creative Daydreamer - Imaginative, artistic, lives between ideas and reality. Sees possibilities everywhere.
10. Low-Key Visionary - Big-picture thinker with quiet ambition. Builds slowly, but intentionally.

User's answers: ${answers.join(' | ')}

Respond ONLY with a JSON object in this exact format:
{
  "badgeId": <number 1-10>,
  "reasoning": "<brief explanation of why this badge fits>",
  "analytics": [
    {"trait": "<quirky trait name>", "percentage": <number 0-100>},
    {"trait": "<quirky trait name>", "percentage": <number 0-100>},
    {"trait": "<quirky trait name>", "percentage": <number 0-100>}
  ]
}

For analytics, use quirky, unserious trait names like "overthinking energy", "chaos tolerance", "main character vibes", "emotional damage", etc. Make them fun and relatable.`

  try {
    const result = await tryWithMultipleKeys(async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: prompt,
      })
      
      const text = response.text || '' || ''
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          badgeId: parsed.badgeId,
          badgeType: 'core' as const,
          reasoning: parsed.reasoning,
          analytics: parsed.analytics || [
            { trait: 'vibes', percentage: 75 },
            { trait: 'chaos energy', percentage: 50 },
            { trait: 'overthinking', percentage: 60 }
          ],
        }
      }
      
      // Fallback to random badge if parsing fails
      const randomBadgeId = Math.floor(Math.random() * 10) + 1
      return {
        badgeId: randomBadgeId,
        badgeType: 'core' as const,
        reasoning: 'Random assignment',
        analytics: [
          { trait: 'vibes', percentage: Math.floor(Math.random() * 30) + 60 },
          { trait: 'chaos energy', percentage: Math.floor(Math.random() * 30) + 40 },
          { trait: 'overthinking', percentage: Math.floor(Math.random() * 30) + 50 }
        ],
      }
    })
    
    return result
  } catch (error) {
    console.error('All Gemini API keys failed:', error)
    const randomBadgeId = Math.floor(Math.random() * 10) + 1
    return {
      badgeId: randomBadgeId,
      badgeType: 'core',
      reasoning: 'Random assignment due to error',
      analytics: [
        { trait: 'vibes', percentage: Math.floor(Math.random() * 30) + 60 },
        { trait: 'chaos energy', percentage: Math.floor(Math.random() * 30) + 40 },
        { trait: 'overthinking', percentage: Math.floor(Math.random() * 30) + 50 }
      ],
    }
  }
}

export async function assignMusicPersonalityBadge(
  answers: string[]
): Promise<BadgeAssignment> {
  const prompt = `You are analyzing music vibe answers to assign one of 10 Music Personality badges.

Badge Options:
1. Late-Night Thinker - Listens in solitude. Music is reflection, not noise.
2. Main Character Energy - Lives cinematically. Soundtracks moments and emotions.
3. Sonic Explorer - Constantly discovering. Genres are suggestions, not rules.
4. Comfort Listener - Repeats favorites. Music is emotional safety.
5. Chaos Shuffle - Unpredictable moods, impulsive listening. No pattern, all vibes.
6. Softcore Melancholic - Gentle sadness, emotional softness, healing through sound.
7. Adrenaline Listener - High-energy, movement-driven, hype-focused music choices.
8. Intentional Curator - Carefully crafted playlists. Controls emotional environments.
9. Nostalgia Trapped - Emotionally attached to the past. Music = time travel.
10. Emotion Translator - Uses music to process, label, and understand feelings.

User's answers: ${answers.join(' | ')}

Respond ONLY with a JSON object:
{
  "badgeId": <number 1-10>,
  "reasoning": "<brief explanation>",
  "analytics": [
    {"trait": "<quirky trait name>", "percentage": <number 0-100>},
    {"trait": "<quirky trait name>", "percentage": <number 0-100>},
    {"trait": "<quirky trait name>", "percentage": <number 0-100>}
  ]
}

For analytics, use quirky, unserious trait names like "sad boi hours", "playlist obsession", "genre hopping", "repeat one syndrome", etc.`

  try {
    const result = await tryWithMultipleKeys(async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: prompt,
      })
      
      const text = response.text || ''
      
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          badgeId: parsed.badgeId,
          badgeType: 'music' as const,
          reasoning: parsed.reasoning,
          analytics: parsed.analytics || [
            { trait: 'sad boi hours', percentage: 70 },
            { trait: 'playlist obsession', percentage: 85 },
            { trait: 'genre hopping', percentage: 45 }
          ],
        }
      }
      
      const randomBadgeId = Math.floor(Math.random() * 10) + 1
      return {
        badgeId: randomBadgeId,
        badgeType: 'music' as const,
        reasoning: 'Random assignment',
        analytics: [
          { trait: 'sad boi hours', percentage: Math.floor(Math.random() * 30) + 60 },
          { trait: 'playlist obsession', percentage: Math.floor(Math.random() * 30) + 70 },
          { trait: 'genre hopping', percentage: Math.floor(Math.random() * 40) + 30 }
        ],
      }
    })
    
    return result
  } catch (error) {
    console.error('All Gemini API keys failed:', error)
    const randomBadgeId = Math.floor(Math.random() * 10) + 1
    return {
      badgeId: randomBadgeId,
      badgeType: 'music',
      reasoning: 'Random assignment due to error',
      analytics: [
        { trait: 'sad boi hours', percentage: Math.floor(Math.random() * 30) + 60 },
        { trait: 'playlist obsession', percentage: Math.floor(Math.random() * 30) + 70 },
        { trait: 'genre hopping', percentage: Math.floor(Math.random() * 40) + 30 }
      ],
    }
  }
}

export async function assignDatingEnergyBadge(answers: string[]): Promise<BadgeAssignment> {

  const prompt = `You are analyzing dating preference answers to assign one of 10 Dating Energy badges.

Badge Options:
1. Slow-Burn Loyalist - Builds connection gradually. Deep commitment over instant sparks.
2. Hopeless Romantic - Idealistic, emotionally expressive, believes deeply in love.
3. Emotionally Selective - High standards, guarded heart, intentional vulnerability.
4. Independent Companion - Values space and autonomy alongside intimacy.
5. Casual but Caring - Present-focused, low pressure, honest affection.
6. Avoidant Softie - Appears detached but feels deeply beneath the surface.
7. Secure Connector - Emotionally balanced, communicative, grounded in relationships.
8. Anxious Romantic - Feels intensely, seeks reassurance, deeply invested.
9. Situationship Survivor - Has learned from emotional ambiguity. Wiser than before.
10. Love on Their Own Terms - Defines love independently. Unconventional, self-directed.

User's answers: ${answers.join(' | ')}

Respond ONLY with a JSON object:
{
  "badgeId": <number 1-10>,
  "reasoning": "<brief explanation>",
  "analytics": [
    {"trait": "<quirky trait name>", "percentage": <number 0-100>},
    {"trait": "<quirky trait name>", "percentage": <number 0-100>},
    {"trait": "<quirky trait name>", "percentage": <number 0-100>}
  ]
}

For analytics, use quirky, unserious trait names like "emotional damage", "commitment issues", "hopeless romantic energy", "red flag detector", etc.`

  try {
    const result = await tryWithMultipleKeys(async (ai) => {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: prompt,
      })
      
      const text = response.text || ''
      
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          badgeId: parsed.badgeId,
          badgeType: 'dating' as const,
          reasoning: parsed.reasoning,
          analytics: parsed.analytics || [
            { trait: 'emotional damage', percentage: 65 },
            { trait: 'hopeless romantic energy', percentage: 80 },
            { trait: 'commitment issues', percentage: 40 }
          ],
        }
      }
      
      const randomBadgeId = Math.floor(Math.random() * 10) + 1
      return {
        badgeId: randomBadgeId,
        badgeType: 'dating' as const,
      reasoning: 'Random assignment',
      analytics: [
        { trait: 'emotional damage', percentage: Math.floor(Math.random() * 30) + 50 },
        { trait: 'hopeless romantic energy', percentage: Math.floor(Math.random() * 30) + 65 },
        { trait: 'commitment issues', percentage: Math.floor(Math.random() * 40) + 30 }
      ],
    }
    })
    
    return result
  } catch (error) {
    console.error('All Gemini API keys failed:', error)
    const randomBadgeId = Math.floor(Math.random() * 10) + 1
    return {
      badgeId: randomBadgeId,
      badgeType: 'dating',
      reasoning: 'Random assignment due to error',
      analytics: [
        { trait: 'emotional damage', percentage: Math.floor(Math.random() * 30) + 50 },
        { trait: 'hopeless romantic energy', percentage: Math.floor(Math.random() * 30) + 65 },
        { trait: 'commitment issues', percentage: Math.floor(Math.random() * 40) + 30 }
      ],
    }
  }
}

export interface PersonalitySummary {
  summary: string[]
  traits: string[]
  warning: string
}

export async function generatePersonalitySummary(
  badge1: { name: string; description: string },
  badge2: { name: string; description: string },
  badge3: { name: string; description: string }
): Promise<PersonalitySummary> {
  const prompt = `Generate a clear, readable personality summary based on these three badges. Write in plain, conversational language - NOT poetic or flowery.

Badge 1: ${badge1.name} - ${badge1.description}
Badge 2: ${badge2.name} - ${badge2.description}
Badge 3: ${badge3.name} - ${badge3.description}

Create:
1. 6-8 clear sentences that explain what this personality combination means in everyday terms. Be specific and easy to understand. Base it on the badge descriptions.
2. 3 key traits that emerge from this combination
3. 1 playful warning about this personality type

Respond ONLY with a JSON object:
{
  "summary": ["sentence 1", "sentence 2", "sentence 3", "sentence 4", "sentence 5", "sentence 6"],
  "traits": ["trait 1", "trait 2", "trait 3"],
  "warning": "playful warning text"
}`

  try {
    const result = await tryWithMultipleKeys(async (ai) => {
      const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    })
    
    const text = response.text || ''
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        summary: parsed.summary || parsed.poeticLines || [],
        traits: parsed.traits || [],
        warning: parsed.warning || 'Handle with care.',
      }
    }
    
    return {
      summary: [
        `You're a ${badge1.name.toLowerCase()} who approaches music like a ${badge2.name.toLowerCase()}.`,
        `In relationships, you bring ${badge3.name.toLowerCase()} energy.`,
        'This combination creates a unique personality that stands out.',
        'You balance deep thinking with emotional expression.',
        'Your approach to life is thoughtful but not overly serious.',
        'People appreciate your authenticity and genuine nature.',
      ],
      traits: ['Thoughtful', 'Authentic', 'Balanced'],
      warning: 'May cause excessive self-reflection.',
    }
    })
    
    return result
  } catch (error) {
    console.error('All Gemini API keys failed:', error)
    return {
      summary: [
        `You're a ${badge1.name.toLowerCase()} who approaches music like a ${badge2.name.toLowerCase()}.`,
        `In relationships, you bring ${badge3.name.toLowerCase()} energy.`,
        'This combination creates a unique personality that stands out.',
        'You balance deep thinking with emotional expression.',
        'Your approach to life is thoughtful but not overly serious.',
        'People appreciate your authenticity and genuine nature.',
      ],
      traits: ['Thoughtful', 'Authentic', 'Balanced'],
      warning: 'May cause excessive self-reflection.',
    }
  }
}
