import { NextRequest, NextResponse } from 'next/server'

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || ''
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || ''
const SPOTIFY_REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 'http://localhost:3000/api/spotify/callback'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const error = request.nextUrl.searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL('/quiz/music-personality?error=auth_failed', request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL('/quiz/music-personality?error=no_code', request.url))
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Token exchange failed')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Fetch top tracks
    const tracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!tracksResponse.ok) {
      throw new Error('Failed to fetch tracks')
    }

    const tracksData = await tracksResponse.json()
    interface SpotifyArtist {
      name: string;
    }

    interface SpotifyImage {
      url: string;
    }

    interface SpotifyAlbum {
      name: string;
      images: SpotifyImage[];
    }

    interface SpotifyTrack {
      name: string;
      artists: SpotifyArtist[];
      album: SpotifyAlbum;
    }

    interface SpotifyTracksResponse {
      items: SpotifyTrack[];
    }

    const tracks = (tracksData as SpotifyTracksResponse).items.map((item: SpotifyTrack) => ({
      name: item.name,
      artist: item.artists[0]?.name || 'Unknown Artist',
      album: item.album?.name,
      imageUrl: item.album?.images[0]?.url,
    }))

    // Store in sessionStorage via redirect with data
    const tracksJson = encodeURIComponent(JSON.stringify(tracks))
    return NextResponse.redirect(new URL(`/quiz/music-personality?spotify_success=true&tracks=${tracksJson}`, request.url))
  } catch (error) {
    console.error('Spotify callback error:', error)
    return NextResponse.redirect(new URL('/quiz/music-personality?error=callback_failed', request.url))
  }
}

