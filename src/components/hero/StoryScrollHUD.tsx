import { useStoryScroll } from '@/context/StoryScrollContext'

/**
 * Clean architectural HUD for scroll-triggered studio storytelling:
 * - Left/Right progress dots
 * - Current station title and step counter
 * - Quick jump navigation
 */
export function StoryScrollHUD() {
  const { nextStep, prevStep } = useStoryScroll()

  return (
    <div className="pointer-events-none absolute inset-0 z-30 select-none">
      {/* Bottom Center: Clean Prev / Next Navigation Buttons */}
      <div className="absolute bottom-4 sm:bottom-6 inset-x-0 flex flex-col items-center pb-[env(safe-area-inset-bottom,0px)]">
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-md px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border border-black/10 shadow-lg transition-all duration-300">
          {/* Previous step button */}
          <button
            type="button"
            onClick={prevStep}
            className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-mono font-semibold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-black/10 bg-black/5 text-[#181917] hover:bg-[#181917] hover:text-white active:scale-95 transition-all touch-manipulation"
            title="Previous Part"
          >
            <span>←</span>
            <span>PREV</span>
          </button>

          {/* Next step button */}
          <button
            type="button"
            onClick={nextStep}
            className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-mono font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#f5d000] text-[#181917] shadow-sm hover:bg-[#181917] hover:text-[#f5d000] active:scale-95 transition-all touch-manipulation"
            title="Next Part"
          >
            <span>NEXT</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

