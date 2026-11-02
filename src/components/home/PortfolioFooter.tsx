import { ABOUT_ME_CONTENT } from '@/data/aboutMeContent'
import { CONTACT_CONTENT } from '@/data/contactContent'
import { STORY_STEPS } from '@/data/storySteps'

interface PortfolioFooterProps {
  onBackToTop?: () => void
  onReEnterStudio?: () => void
}

export function PortfolioFooter({ onBackToTop, onReEnterStudio }: PortfolioFooterProps) {
  const handleScrollTop = () => {
    if (onBackToTop) {
      onBackToTop()
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleScrollToStudio = () => {
    if (onReEnterStudio) {
      onReEnterStudio()
    } else {
      const studioEl = document.getElementById('studio-workspace')
      if (studioEl) {
        studioEl.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer
      id="portfolio-footer"
      className="relative w-full bg-[#141513] text-[#fbf9f3] border-t border-white/10 overflow-hidden select-none"
    >
      {/* Background Architectural Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Ambient Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[560px] h-[260px] bg-[#f5d000]/10 rounded-full blur-[130px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 pt-20 pb-12">
        {/* Top Call-To-Action Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pb-16 border-b border-white/10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f5d000]/30 bg-[#f5d000]/10 px-3.5 py-1 text-[11px] font-mono tracking-[0.2em] text-[#f5d000] uppercase mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f5d000] animate-pulse" />
              <span>END OF STUDIO TOUR • AVAILABLE FOR PROJECTS</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-[#fbf9f3] leading-[1.15]">
              Thanks for visiting <span className="italic text-[#f5d000]">Studio 01</span>. Let&apos;s build something remarkable.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#dcdad4]/75 font-sans max-w-xl leading-relaxed">
              {CONTACT_CONTENT.message.replace(/^"|"$/g, '')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={CONTACT_CONTENT.ctaHref}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#f5d000] text-[#141513] font-mono text-xs font-bold tracking-[0.16em] uppercase shadow-[0_0_30px_rgba(245,208,0,0.3)] hover:shadow-[0_0_45px_rgba(245,208,0,0.5)] hover:scale-105 active:scale-95 transition-all"
            >
              <span>{CONTACT_CONTENT.ctaLabel}</span>
              <span>↗</span>
            </a>

            <button
              type="button"
              onClick={handleScrollToStudio}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-[#fbf9f3] font-mono text-xs font-semibold tracking-[0.14em] uppercase transition-all"
            >
              <span>↑</span>
              <span>RE-ENTER 3D STUDIO</span>
            </button>
          </div>
        </div>

        {/* Middle Columns: Studio Stations & Capabilities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14 border-b border-white/10">
          {/* Column 1: Brand Identity */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[#f5d000]/10 border border-[#f5d000]/40 flex items-center justify-center font-mono font-bold text-xs text-[#f5d000]">
                BR
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs tracking-[0.2em] uppercase font-bold text-[#fbf9f3]">
                  BENNY R
                </span>
                <span className="text-[10px] font-mono text-[#a1a1aa] tracking-widest uppercase">
                  {ABOUT_ME_CONTENT.role}
                </span>
              </div>
            </div>
            <p className="text-xs text-[#a1a1aa] leading-relaxed mt-2">
              Interactive 3D architectural workspace crafted with React, Three.js, React Three Fiber, and Tailwind CSS.
            </p>
          </div>

          {/* Column 2: What I Do */}
          <div>
            <h3 className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#f5d000] uppercase mb-4">
              DISCIPLINES
            </h3>
            <ul className="space-y-2.5 text-xs font-mono text-[#dcdad4]/80">
              {ABOUT_ME_CONTENT.whatIDoItems.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-[#439d8e]">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Studio Stations */}
          <div>
            <h3 className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#f5d000] uppercase mb-4">
              3D STUDIO STATIONS
            </h3>
            <ul className="space-y-2 text-xs font-mono text-[#dcdad4]/80">
              {STORY_STEPS.slice(0, 6).map((s) => (
                <li key={s.id} className="truncate">
                  0{s.stepNumber}. {s.title}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Direct Contact */}
          <div>
            <h3 className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#f5d000] uppercase mb-4">
              DIRECT CONTACT
            </h3>
            <ul className="space-y-2.5 text-xs font-mono text-[#dcdad4]/80">
              {CONTACT_CONTENT.channels.map((ch) => (
                <li key={ch.id}>
                  <a
                    href={ch.href}
                    className="hover:text-[#f5d000] transition-colors flex flex-col"
                  >
                    <span className="text-[10px] text-[#a1a1aa] uppercase">{ch.label}</span>
                    <span className="font-semibold text-[#fbf9f3]">{ch.value}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#71717a] gap-4">
          <div>© {new Date().getFullYear()} Benny R. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span>Crafted with Three.js &amp; React</span>
            <button
              type="button"
              onClick={handleScrollTop}
              className="inline-flex items-center gap-1.5 text-[#fbf9f3] hover:text-[#f5d000] transition-colors"
            >
              <span>BACK TO TOP</span>
              <span>↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

