import { useCallback, useEffect, useState } from 'react'
import { PLAYLIST, type Track } from '@/data/playlist'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export interface MusicPlayerState {
  playlist: Track[]
  currentTrackIndex: number
  currentTrack: Track
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number // 0 to 1
  isLoadingPlaylist: boolean
  togglePlay: () => void
  nextTrack: () => void
  prevTrack: () => void
  seekTo: (time: number) => void
  setVolume: (vol: number) => void
}

let sharedAudio: HTMLAudioElement | null = null

/**
 * Updates sound balance based on camera distance to the music player.
 * Player is located at (0.62, 0.88, -1.02).
 */
export function updateAudioListener(camX: number, camY: number, camZ: number) {
  if (!sharedAudio) return

  // Distance between camera and physical music player on desk
  const dx = camX - 0.62
  const dy = camY - 0.88
  const dz = camZ - (-1.02)
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

  // Camera close-up is ~0.6m, default workspace is ~2.5m
  // Smoothly adjust volume so it's noticeably louder and clearer up-close
  // and softer at the default distance, giving a realistic room acoustic presence
  const currentBaseVol = Number(sharedAudio.dataset.baseVolume ?? 0.8)
  const distanceFactor = Math.max(0.45, Math.min(1.0, 1.25 / Math.max(0.7, dist)))
  sharedAudio.volume = Math.max(0, Math.min(1, currentBaseVol * distanceFactor))
}

export function useMusicPlayer(): MusicPlayerState {
  const [playlist, setPlaylist] = useState<Track[]>(PLAYLIST)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(PLAYLIST[0]?.duration || 10.8)
  const [volume, setVolumeState] = useState(0.8)
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(isSupabaseConfigured)

  const currentTrack = playlist[currentTrackIndex] || PLAYLIST[0]

  // 1. Fetch songs from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return

    let isMounted = true

    async function fetchSongs() {
      try {
        const { data, error } = await supabase!
          .from('songs')
          .select('*')
          .order('order_index', { ascending: true })

        if (error) {
          console.warn('Supabase fetch error, fallback to local playlist:', error.message)
          return
        }

        if (data && data.length > 0 && isMounted) {
          const supabaseTracks: Track[] = data.map((item) => ({
            id: item.id,
            title: item.title,
            artist: item.artist,
            duration: Number(item.duration) || 0,
            src: item.src,
            coverLabel: item.cover_label || 'CHILL',
          }))

          setPlaylist(supabaseTracks)
          setCurrentTrackIndex(0)
        }
      } catch (err) {
        console.warn('Supabase fetch failed:', err)
      } finally {
        if (isMounted) setIsLoadingPlaylist(false)
      }
    }

    fetchSongs()

    return () => {
      isMounted = false
    }
  }, [])

  // 2. Initialize shared audio element once
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!sharedAudio) {
      sharedAudio = new Audio()
      sharedAudio.preload = 'auto'
      sharedAudio.dataset.baseVolume = '0.8'
    }

    const audio = sharedAudio

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration)
      }
    }

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration)
      }
    }

    const onEnded = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % playlist.length)
    }

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('durationchange', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('durationchange', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [playlist.length])

  // 3. Sync track src whenever currentTrack changes
  useEffect(() => {
    if (!sharedAudio || !currentTrack) return
    const audio = sharedAudio
    const wasPlaying = isPlaying

    if (audio.src !== currentTrack.src) {
      audio.src = currentTrack.src
      audio.currentTime = 0
      setCurrentTime(0)

      if (wasPlaying) {
        audio.play().catch((err) => {
          console.warn('Audio play error:', err)
          setIsPlaying(false)
        })
      }
    }
  }, [currentTrack?.src, currentTrackIndex, isPlaying])

  const togglePlay = useCallback(() => {
    if (!sharedAudio || !currentTrack) return
    const audio = sharedAudio

    if (!audio.src || audio.src !== currentTrack.src) {
      audio.src = currentTrack.src
    }

    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
        })
        .catch((err) => {
          console.warn('Audio play blocked or missing:', err)
          setIsPlaying(false)
        })
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }, [currentTrack])

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length)
  }, [playlist.length])

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length)
  }, [playlist.length])

  const seekTo = useCallback((time: number) => {
    if (!sharedAudio) return
    sharedAudio.currentTime = time
    setCurrentTime(time)
  }, [])

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol))
    setVolumeState(clamped)
    if (sharedAudio) {
      sharedAudio.dataset.baseVolume = String(clamped)
      sharedAudio.volume = clamped
    }
  }, [])

  return {
    playlist,
    currentTrackIndex,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoadingPlaylist,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
  }
}
