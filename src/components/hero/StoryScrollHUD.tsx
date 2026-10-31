import { useStoryScroll } from '@/context/StoryScrollContext'
import { STORY_STEPS } from '@/data/storySteps'

/**
 * Clean architectural HUD for scroll-triggered studio storytelling:
 * - Left/Right progress dots
 * - Current station title and step counter
 * - Quick jump navigation
 */
export function StoryScrollHUD() {
  const { currentStepIndex, goToStep, nextStep, prevStep } = useStoryScroll()

  return (
    <div className="pointer-events-none absolute inset-0 z-30 select-none">
      {/* 1. Left Edge: Vertical Step Navigation Dots with Active Heading Info */}
      <div className="pointer-events-auto absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3.5 p-2 rounded-full bg-white/40 backdrop-blur-md border border-black/5 shadow-sm">
        {STORY_STEPS.map((step, idx) => {
          const isActive = idx === currentStepIndex
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => goToStep(idx)}
              className="group relative flex items-center"
              title={`${step.stepNumber}. ${step.title}`}
            >
              <span
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-7 bg-[#f5d000] shadow-[0_0_8px_#f5d000]'
                    : 'w-2.5 bg-black/25 hover:bg-black/50'
                }`}
              />

              {/* Heading info shown on the active link (and on hover for other links) */}
              <span
                className={`pointer-events-none absolute left-10 transition-all duration-200 whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-mono shadow-sm ${
                  isActive
                    ? 'opacity-100 translate-x-0 bg-white/90 text-[#181917] font-semibold border border-black/10 backdrop-blur-md'
                    : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 bg-[#181917] text-white'
                }`}
              >
                {step.title}
              </span>
            </button>
          )
        })}
      </div>

      {/* 2. Bottom Center: Clean Prev / Next Navigation Buttons */}
      <div className="absolute bottom-6 inset-x-0 flex flex-col items-center">
        <div className="pointer-events-auto flex items-center gap-3 bg-white/85 backdrop-blur-md px-3 py-2 rounded-full border border-black/10 shadow-md transition-all duration-300">
          {/* Previous step button */}
          <button
            type="button"
            onClick={prevStep}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3.5 py-1.5 rounded-full border border-black/10 bg-black/5 text-[#181917] hover:bg-[#181917] hover:text-white active:scale-95 transition-all"
            title="Previous Part"
          >
            <span>←</span>
            <span>PREV</span>
          </button>

          {/* Next step button */}
          <button
            type="button"
            onClick={nextStep}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-4 py-1.5 rounded-full bg-[#f5d000] text-[#181917] shadow-sm hover:bg-[#181917] hover:text-[#f5d000] active:scale-95 transition-all"
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

