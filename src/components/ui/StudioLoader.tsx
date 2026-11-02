import { useState, useEffect } from 'react'

interface StudioLoaderProps {
  onComplete?: () => void
  isReady?: boolean
}

export function StudioLoader({ onComplete, isReady = false }: StudioLoaderProps) {
  const [progress, setProgress] = useState(15)
  const [statusText, setStatusText] = useState('Initializing 3D Room...')
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [forceReady, setForceReady] = useState(false)

  useEffect(() => {
    // Safety timeout: never allow the loader to stay stuck on slow networks or blocked assets
    const safetyTimer = setTimeout(() => {
      setForceReady(true)
    }, 2400)

    // Progress interval simulating resource setup
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 92) {
          const next = prev + Math.max(2, Math.floor((94 - prev) * 0.22))
          if (next > 45 && next <= 75) {
            setStatusText('Building 3D Studio...')
          } else if (next > 75) {
            setStatusText('Preparing Lighting & Models...')
          }
          return next
        }
        return prev
      })
    }, 90)

    return () => {
      clearTimeout(safetyTimer)
      clearInterval(interval)
    }
  }, [])

  const effectiveReady = isReady || forceReady

  // When scene signals ready (or forced complete)
  useEffect(() => {
    if (effectiveReady) {
      setProgress(100)
      setStatusText('Studio Ready')
      const timer = setTimeout(() => {
        setIsFadingOut(true)
        const completeTimer = setTimeout(() => {
          onComplete?.()
        }, 400)
        return () => clearTimeout(completeTimer)
      }, 140)
      return () => clearTimeout(timer)
    }
  }, [effectiveReady, onComplete])

  return (
    <div
      role="status"
      aria-label="Loading 3D Studio"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_45%,#232421_0%,#141513_100%)] font-mono text-[#fbf9f3] transition-all duration-500 select-none ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Animated Emblem */}
      <div className="relative mb-7 flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-[1.5px] border-[#f5d000]/25 border-t-[#f5d000] animate-spin" />
        <div
          className="absolute inset-3 rounded-full border-[1.5px] border-dashed border-[#439d8e]/50"
          style={{ animation: 'spin 3.2s linear infinite reverse' }}
        />
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border-[1.5px] border-[#f5d000] bg-[#f5d000]/10 font-mono text-base font-bold text-[#f5d000] shadow-[0_0_25px_rgba(245,208,0,0.3)]">
          BR
        </div>
      </div>

      <h2 className="mb-1.5 font-serif text-2xl font-medium tracking-wide text-[#fbf9f3]">
        Benny R
      </h2>
      <p className="mb-6 font-mono text-[11px] tracking-[0.22em] text-[#fbf9f3]/60 uppercase">
        3D Creative Studio &amp; Lab
      </p>

      {/* Loading Progress Bar */}
      <div className="flex w-64 flex-col items-center gap-2.5">
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#439d8e] to-[#f5d000] shadow-[0_0_12px_rgba(245,208,0,0.65)] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex w-full justify-between font-mono text-[10px] tracking-widest text-[#f5d000] uppercase">
          <span>{statusText}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  )
}
