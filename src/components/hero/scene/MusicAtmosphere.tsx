import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import {
  getBuiltInLyricsForTrack,
  parseLrcLyrics,
  type LyricLine,
} from '@/data/songLyrics'

interface MusicAtmosphereProps {
  isPlaying: boolean
  currentTime: number
  trackTitle: string
  artist: string
  isMusicPlayerOpen: boolean
}

const PARTICLE_SYMBOLS = ['♪', '♫', '♬', '♩', '✦']

interface NoteParticleData {
  id: number
  symbol: string
  phaseOffset: number
  speed: number
  swayRadius: number
  swayFreq: number
  color: string
  scale: number
}

const NOTE_PARTICLES: NoteParticleData[] = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  symbol: PARTICLE_SYMBOLS[i % PARTICLE_SYMBOLS.length],
  phaseOffset: i / 10,
  speed: 0.28 + (i % 3) * 0.06,
  swayRadius: 0.032 + (i % 4) * 0.012,
  swayFreq: 2.2 + (i % 3) * 0.6,
  color: i % 2 === 0 ? '#f5d000' : i % 3 === 0 ? '#ffb703' : '#ffffff',
  scale: 0.85 + (i % 3) * 0.2,
}))

/**
 * Renders:
 * 1. Continuous 3D musical note particles rising from the music player when playing
 * 2. Active song lyric line floating in mid-air with white text and an electric yellow text outline/border
 */
export function MusicAtmosphere({
  isPlaying,
  currentTime,
  trackTitle,
  artist,
  isMusicPlayerOpen,
}: MusicAtmosphereProps) {
  const [lyrics, setLyrics] = useState<LyricLine[]>(() =>
    getBuiltInLyricsForTrack(trackTitle, artist),
  )

  const particleRefs = useRef<(HTMLDivElement | null)[]>([])
  const particleGroupRefs = useRef<(THREE.Group | null)[]>([])

  // Load built-in synced lyrics or fetch from LRCLIB API for any future Supabase songs
  useEffect(() => {
    let isMounted = true
    const builtIn = getBuiltInLyricsForTrack(trackTitle, artist)
    setLyrics(builtIn)

    const isBuiltInMatch =
      `${trackTitle} ${artist}`.toLowerCase().includes('thug') ||
      `${trackTitle} ${artist}`.toLowerCase().includes('cena')

    if (isBuiltInMatch) return

    async function fetchExternalLyrics() {
      try {
        const q = encodeURIComponent(`${trackTitle} ${artist}`)
        const res = await fetch(`https://lrclib.net/api/search?q=${q}`)
        if (!res.ok) return
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          const item = data.find((d) => d.syncedLyrics) || data[0]
          if (item?.syncedLyrics && isMounted) {
            const parsed = parseLrcLyrics(item.syncedLyrics)
            if (parsed.length > 0) {
              setLyrics(parsed)
            }
          }
        }
      } catch {
        // Keep built-in fallback
      }
    }

    fetchExternalLyrics()

    return () => {
      isMounted = false
    }
  }, [trackTitle, artist])

  // Determine the single currently active lyric line based on currentTime
  const activeLyric = useMemo(() => {
    if (!lyrics || lyrics.length === 0) return null
    let idx = 0
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTime >= lyrics[i].time) {
        idx = i
      } else {
        break
      }
    }
    return lyrics[idx]
  }, [lyrics, currentTime])

  // Animate floating musical notes when playing
  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    NOTE_PARTICLES.forEach((p, idx) => {
      const grp = particleGroupRefs.current[idx]
      const domEl = particleRefs.current[idx]
      if (!grp || !domEl) return

      if (!isPlaying) {
        domEl.style.opacity = '0'
        return
      }

      // Life cycle from 0 (turntable origin) to 1 (high in the air)
      const life = (t * p.speed + p.phaseOffset) % 1
      const y = 0.19 + life * 0.36
      const angle = t * p.swayFreq + p.id * 1.4
      const x = Math.cos(angle) * p.swayRadius * (0.4 + life * 0.9)
      const z = Math.sin(angle) * p.swayRadius * (0.4 + life * 0.9)

      grp.position.set(x, y, z)

      // Smooth fade-in at birth and fade-out at top
      const alpha =
        life < 0.18
          ? life / 0.18
          : life > 0.75
            ? (1 - life) / 0.25
            : 1

      const scale = p.scale * (0.7 + life * 0.5)
      domEl.style.opacity = String((alpha * 0.92).toFixed(2))
      domEl.style.transform = `scale(${scale.toFixed(2)}) rotate(${Math.sin(angle) * 16}deg)`
    })
  })

  return (
    <group name="MusicPlayerAtmosphere">
      {/* 1. Floating Musical Note & Sparkle Particles */}
      {NOTE_PARTICLES.map((p, idx) => (
        <group
          key={p.id}
          ref={(el) => {
            particleGroupRefs.current[idx] = el
          }}
          position={[0, 0.2, 0]}
        >
          <Html
            center
            distanceFactor={isMusicPlayerOpen ? 1.15 : 1.8}
            className="pointer-events-none select-none"
            zIndexRange={[35, 0]}
          >
            <div
              ref={(el) => {
                particleRefs.current[idx] = el
              }}
              style={{
                color: p.color,
                opacity: 0,
                textShadow: '0 0 10px rgba(245, 208, 0, 0.85), 0 2px 6px rgba(0,0,0,0.6)',
              }}
              className="font-bold text-lg transition-none will-change-transform"
            >
              {p.symbol}
            </div>
          </Html>
        </group>
      ))}

      {/* 2. Only the Active Lyric Line Floating in Air (Warm Espresso & Antique Gold matching the Gramophone & Room) */}
      {isPlaying && activeLyric && (
        <Html
          position={[0, 0.3, 0]}
          center
          distanceFactor={isMusicPlayerOpen ? 0.92 : 1.65}
          className="pointer-events-none select-none"
          zIndexRange={[40, 0]}
        >
          <div className="flex items-center justify-center w-[340px] sm:w-[440px] text-center">
            <p
              key={activeLyric.time}
              style={{
                color: '#2e1a0f',
                textShadow:
                  '-1.2px -1.2px 0 #fbf9f3, 1.2px -1.2px 0 #fbf9f3, -1.2px 1.2px 0 #fbf9f3, 1.2px 1.2px 0 #fbf9f3, 0 3px 10px rgba(197, 152, 75, 0.45)',
              }}
              className="font-serif italic text-base sm:text-lg font-bold tracking-wide leading-snug transition-all duration-300"
            >
              {activeLyric.text}
            </p>
          </div>
        </Html>
      )}
    </group>
  )
}
