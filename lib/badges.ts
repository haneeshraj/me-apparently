export interface Badge {
  id: number
  name: string
  description: string
  icon: string
  color: string
}

export const CORE_PERSONALITY_BADGES: Badge[] = [
  {
    id: 1,
    name: 'Soft Genius',
    description: 'Intelligent, thoughtful, and observant. Understands complex things but never needs to prove it.',
    icon: '🧠',
    color: '#8B5CF6',
  },
  {
    id: 2,
    name: 'Curious Nerd',
    description: 'Loves learning, niche interests, and rabbit holes. Finds joy in knowing too much.',
    icon: '🔬',
    color: '#3B82F6',
  },
  {
    id: 3,
    name: 'Quirky Optimist',
    description: 'Lighthearted, expressive, and emotionally open. Brings warmth into any room.',
    icon: '☀️',
    color: '#F59E0B',
  },
  {
    id: 4,
    name: 'Controlled Chaos',
    description: 'Appears put-together but thrives in creative unpredictability. Functional mess energy.',
    icon: '🌀',
    color: '#EF4444',
  },
  {
    id: 5,
    name: 'Quiet Intense',
    description: 'Feels deeply, speaks selectively, notices everything. Presence without noise.',
    icon: '🌙',
    color: '#6366F1',
  },
  {
    id: 6,
    name: 'Playful Thinker',
    description: 'Smart with humor. Uses wit as a thinking tool. Never boring.',
    icon: '🎭',
    color: '#EC4899',
  },
  {
    id: 7,
    name: 'Overthinking Romantic',
    description: 'Emotionally rich, reflective, prone to introspection and meaning-making.',
    icon: '💭',
    color: '#F472B6',
  },
  {
    id: 8,
    name: 'Calm Strategist',
    description: 'Grounded, forward-thinking, emotionally steady. Plans without stress.',
    icon: '🎯',
    color: '#10B981',
  },
  {
    id: 9,
    name: 'Creative Daydreamer',
    description: 'Imaginative, artistic, lives between ideas and reality. Sees possibilities everywhere.',
    icon: '✨',
    color: '#A855F7',
  },
  {
    id: 10,
    name: 'Low-Key Visionary',
    description: 'Big-picture thinker with quiet ambition. Builds slowly, but intentionally.',
    icon: '🌟',
    color: '#06B6D4',
  },
]

export const MUSIC_PERSONALITY_BADGES: Badge[] = [
  {
    id: 1,
    name: 'Late-Night Thinker',
    description: 'Listens in solitude. Music is reflection, not noise.',
    icon: '🌃',
    color: '#1E293B',
  },
  {
    id: 2,
    name: 'Main Character Energy',
    description: 'Lives cinematically. Soundtracks moments and emotions.',
    icon: '🎬',
    color: '#F59E0B',
  },
  {
    id: 3,
    name: 'Sonic Explorer',
    description: 'Constantly discovering. Genres are suggestions, not rules.',
    icon: '🔍',
    color: '#3B82F6',
  },
  {
    id: 4,
    name: 'Comfort Listener',
    description: 'Repeats favorites. Music is emotional safety.',
    icon: '🛋️',
    color: '#EC4899',
  },
  {
    id: 5,
    name: 'Chaos Shuffle',
    description: 'Unpredictable moods, impulsive listening. No pattern, all vibes.',
    icon: '🎲',
    color: '#EF4444',
  },
  {
    id: 6,
    name: 'Softcore Melancholic',
    description: 'Gentle sadness, emotional softness, healing through sound.',
    icon: '🌧️',
    color: '#8B5CF6',
  },
  {
    id: 7,
    name: 'Adrenaline Listener',
    description: 'High-energy, movement-driven, hype-focused music choices.',
    icon: '⚡',
    color: '#F59E0B',
  },
  {
    id: 8,
    name: 'Intentional Curator',
    description: 'Carefully crafted playlists. Controls emotional environments.',
    icon: '🎨',
    color: '#6366F1',
  },
  {
    id: 9,
    name: 'Nostalgia Trapped',
    description: 'Emotionally attached to the past. Music = time travel.',
    icon: '📻',
    color: '#F472B6',
  },
  {
    id: 10,
    name: 'Emotion Translator',
    description: 'Uses music to process, label, and understand feelings.',
    icon: '🎵',
    color: '#10B981',
  },
]

export const DATING_ENERGY_BADGES: Badge[] = [
  {
    id: 1,
    name: 'Slow-Burn Loyalist',
    description: 'Builds connection gradually. Deep commitment over instant sparks.',
    icon: '🔥',
    color: '#EF4444',
  },
  {
    id: 2,
    name: 'Hopeless Romantic',
    description: 'Idealistic, emotionally expressive, believes deeply in love.',
    icon: '💕',
    color: '#F472B6',
  },
  {
    id: 3,
    name: 'Emotionally Selective',
    description: 'High standards, guarded heart, intentional vulnerability.',
    icon: '🛡️',
    color: '#6366F1',
  },
  {
    id: 4,
    name: 'Independent Companion',
    description: 'Values space and autonomy alongside intimacy.',
    icon: '🦅',
    color: '#3B82F6',
  },
  {
    id: 5,
    name: 'Casual but Caring',
    description: 'Present-focused, low pressure, honest affection.',
    icon: '🌊',
    color: '#06B6D4',
  },
  {
    id: 6,
    name: 'Avoidant Softie',
    description: 'Appears detached but feels deeply beneath the surface.',
    icon: '🌙',
    color: '#8B5CF6',
  },
  {
    id: 7,
    name: 'Secure Connector',
    description: 'Emotionally balanced, communicative, grounded in relationships.',
    icon: '🤝',
    color: '#10B981',
  },
  {
    id: 8,
    name: 'Anxious Romantic',
    description: 'Feels intensely, seeks reassurance, deeply invested.',
    icon: '💫',
    color: '#F59E0B',
  },
  {
    id: 9,
    name: 'Situationship Survivor',
    description: 'Has learned from emotional ambiguity. Wiser than before.',
    icon: '🦋',
    color: '#EC4899',
  },
  {
    id: 10,
    name: 'Love on Their Own Terms',
    description: 'Defines love independently. Unconventional, self-directed.',
    icon: '💎',
    color: '#A855F7',
  },
]

