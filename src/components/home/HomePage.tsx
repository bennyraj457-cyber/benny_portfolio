import { useState } from 'react'
import { ABOUT_ME_CONTENT } from '@/data/aboutMeContent'
import { entranceAudio } from '@/utils/entranceAudio'

interface HomePageProps {
  onEnter: () => void
}

export function HomePage({ onEnter }: HomePageProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleEnterClick = () => {
    // Play subtle entrance click/audio
    try {
      entranceAudio.playKnock()
    } catch {
      // Audio autoplay policy fallback
    }

    setIsTransitioning(true)
    setTimeout(() => {
      onEnter()
    }, 450)
  }

  return (
    <div
      className={`relative min-h-screen w-full bg-[#141513] text-[#fbf9f3] flex flex-col justify-between selection:bg-[#f5d000] selection:text-[#181917] overflow-x-hidden transition-all duration-500 ease-out ${
        isTransitioning ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Architectural Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Atmospheric Ambient Glows */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[360px] bg-[#f5d000]/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-[420px] h-[280px] bg-[#439d8e]/12 rounded-full blur-[120px]" />

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-[#f5d000]/10 border border-[#f5d000]/40 flex items-center justify-center font-mono font-bold text-xs text-[#f5d000] shadow-[0_0_15px_rgba(245,208,0,0.2)]">
            BR
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xs tracking-[0.2em] uppercase font-bold text-[#fbf9f3]">
              BENNY R
            </span>
            <span className="text-[10px] font-mono text-[#a1a1aa] tracking-widest uppercase">
              STUDIO 01
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-[#a1a1aa] border border-white/10 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full">
          <span className="h-2 w-2 rounded-full bg-[#f5d000] animate-pulse" />
          <span>Interactive 3D Portfolio</span>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-10 py-12 flex flex-col items-center text-center my-auto">
        {/* Role Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#f5d000]/30 bg-[#f5d000]/10 px-4 py-1.5 text-xs font-mono tracking-[0.2em] text-[#f5d000] uppercase mb-6 shadow-sm">
          <span>{ABOUT_ME_CONTENT.role}</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#fbf9f3] max-w-3xl leading-[1.1] mb-6">
          Designing Digital <span className="italic text-[#f5d000]">Experiences</span> Through Space & Code.
        </h1>

        {/* Subtitle / Bio snippet */}
        <p className="text-sm sm:text-base md:text-lg text-[#dcdad4]/85 max-w-2xl font-sans leading-relaxed mb-10">
          Step into a fully interactive 3D studio workspace featuring real-time room exploration, interactive bookshelf skills, live music gramophone, motorcycle showcase, and curated projects.
        </p>

        {/* Enter Studio CTA Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleEnterClick}
            className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-4.5 rounded-full bg-[#f5d000] text-[#141513] font-mono text-xs sm:text-sm font-bold tracking-[0.16em] uppercase shadow-[0_0_35px_rgba(245,208,0,0.35)] hover:shadow-[0_0_50px_rgba(245,208,0,0.55)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span>ENTER STUDIO</span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
              →
            </span>
          </button>

          <span className="text-[11px] font-mono tracking-widest text-[#a1a1aa] uppercase mt-2">
            Opens the Door Wall Section
          </span>
        </div>

        {/* Key Features Quick Tags */}
        <div className="mt-14 flex flex-wrap justify-center gap-3 sm:gap-4 max-w-2xl text-xs font-mono text-[#dcdad4]/70">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/5">
            <span className="text-[#f5d000]">✦</span>
            <span>3D Studio Door Entrance</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/5">
            <span className="text-[#439d8e]">✦</span>
            <span>1970 CB750 & Patio</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/5">
            <span className="text-[#f5d000]">✦</span>
            <span>Interactive Library</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/5">
            <span className="text-[#439d8e]">✦</span>
            <span>Vinyl Gramophone</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#71717a] border-t border-white/5 gap-3">
        <div>© {new Date().getFullYear()} Benny R. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <span>Crafted with Three.js & React</span>
        </div>
      </footer>
    </div>
  )
}
