import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { HomePage } from '@/components/home/HomePage'
import { PortfolioFooter } from '@/components/home/PortfolioFooter'

// Dynamically code-split the entire Three.js / WebGL 3D Workspace bundle so the initial Hero Page loads & paints instantaneously!
const HeroWorkspace = lazy(() =>
  import('@/components/hero/HeroWorkspace').then((mod) => ({ default: mod.HeroWorkspace })),
)

export function App() {
  const [mount3D, setMount3D] = useState(false)
  const studioPlaceholderRef = useRef<HTMLDivElement>(null)

  // Prefetch the 3D Workspace chunk during browser idle time or as the user approaches the studio section
  useEffect(() => {
    let mounted = true
    const activate = () => {
      if (mounted) setMount3D(true)
    }

    // 1. Trigger as soon as user scrolls slightly or interacts
    const onFirstScroll = () => {
      if (window.scrollY > 40) {
        activate()
      }
    }
    window.addEventListener('scroll', onFirstScroll, { passive: true })

    // 2. Also warm up during idle time after initial Hero LCP paint (900ms)
    const timer = setTimeout(activate, 900)

    return () => {
      mounted = false
      window.removeEventListener('scroll', onFirstScroll)
      clearTimeout(timer)
    }
  }, [])

  const scrollToStudio = useCallback(() => {
    setMount3D(true)
    const studioEl =
      document.getElementById('studio-workspace') || studioPlaceholderRef.current
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const scrollToHero = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <main className="min-h-screen bg-[#141513] text-on-surface">
      {/* 1. Opening Hero Section (Instant First Contentful Paint & LCP) */}
      <HomePage onEnter={scrollToStudio} />

      {/* 2. Scroll-Driven 3D Studio Workspace Section (Lazy-loaded & Viewport-Gated) */}
      <div ref={studioPlaceholderRef}>
        <Suspense
          fallback={
            <section
              id="studio-workspace"
              aria-label="Loading 3D Creative Workspace"
              className="relative w-full h-[1000vh] bg-[#f0eee8]"
            >
              <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center bg-[#f0eee8]">
                <div className="flex flex-col items-center gap-3 font-mono text-xs tracking-[0.2em] text-[#181917]/70 uppercase">
                  <div className="h-6 w-6 rounded-full border-2 border-[#181917]/20 border-t-[#f5d000] animate-spin" />
                  <span>Preparing 3D Studio...</span>
                </div>
              </div>
            </section>
          }
        >
          {mount3D ? (
            <HeroWorkspace onBackToHome={scrollToHero} />
          ) : (
            <section
              id="studio-workspace"
              aria-label="3D Creative Workspace Scroll Tour"
              className="relative w-full h-[1000vh] bg-[#f0eee8]"
            />
          )}
        </Suspense>
      </div>

      {/* 3. Portfolio Footer Section (Reached after exiting the 3D Wall Door) */}
      <PortfolioFooter onBackToTop={scrollToHero} onReEnterStudio={scrollToStudio} />
    </main>
  )
}

export default App
