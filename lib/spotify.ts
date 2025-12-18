const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || ''
const SPOTIFY_REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/spotify/callback'

export function getSpotifyAuthUrl(): string {
  const scopes = 'user-top-read'
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: scopes,
    redirect_uri: SPOTIFY_REDIRECT_URI,
  })
  return `https://accounts.spotify.com/authorize?${params.toString()}`
}

export interface SpotifyTrack {
  name: string
  artist: string
  genre?: string
  album?: string
  imageUrl?: string
}

export async function getTopTracks(accessToken: string): Promise<SpotifyTrack[]> {
  try {
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch top tracks')
    }

    const data = await response.json()
    return data.items.map((item: any) => ({
      name: item.name,
      artist: item.artists[0]?.name || 'Unknown Artist',
      album: item.album?.name,
      imageUrl: item.album?.images[0]?.url,
    }))
  } catch (error) {
    console.error('Error fetching top tracks:', error)
    return []
  }
}

