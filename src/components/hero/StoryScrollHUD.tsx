import { useStoryScroll } from '@/context/StoryScrollContext'
import { STORY_STEPS } from '@/data/storySteps'

/**
 * Clean architectural HUD for scroll-triggered studio storytelling:
 * - Left/Right progress dots
 * - Current station title and step counter
 * - Quick jump navigation
 */
export function StoryScrollHUD() {
  const { currentStepIndex, currentStep, totalSteps, goToStep, nextStep, prevStep } =
    useStoryScroll()

  return (
    <div className="pointer-events-none absolute inset-0 z-30 select-none">
      {/* 1. Top Center: Current Story Station Badge */}
      <div className="absolute top-6 inset-x-0 flex justify-center">
        <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-black/10 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-md transition-all duration-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f5d000] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f5d000]" />
          </span>

          <span className="font-mono text-xs font-semibold tracking-wider text-[#181917] uppercase">
            {currentStep.category}
          </span>

          <span className="text-black/20 text-xs">|</span>

          <span className="font-mono text-[11px] text-[#71717a] tracking-widest">
            0{currentStepIndex + 1} / 0{totalSteps}
          </span>
        </div>
      </div>

      {/* 2. Left Edge: Vertical Step Navigation Dots */}
      <div className="pointer-events-auto absolute left-6 top-1/2 -translate-y-1/2 hidden sm:flex flex-col gap-3.5 p-2 rounded-full bg-white/40 backdrop-blur-md border border-black/5 shadow-sm">
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

              {/* Tooltip on hover */}
              <span className="pointer-events-none absolute left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap rounded-md bg-[#181917] px-2.5 py-1 text-[11px] font-mono text-white shadow-md">
                {step.title}
              </span>
            </button>
          )
        })}
      </div>

      {/* 3. Bottom Center: Step Title & Scroll Scrub Hint */}
      <div className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-2">
        <div className="pointer-events-auto flex items-center gap-4 bg-white/75 backdrop-blur-md px-5 py-2.5 rounded-full border border-black/10 shadow-sm transition-all duration-300">
          {/* Previous step arrow */}
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className={`text-xs font-mono px-2 py-1 rounded transition-colors ${
              currentStepIndex === 0
                ? 'text-black/20 cursor-not-allowed'
                : 'text-black/80 hover:bg-black/5 active:scale-95'
            }`}
            title="Previous Station (Up)"
          >
            ↑ PREV
          </button>

          <div className="text-center px-2">
            <h2 className="text-xs font-bold tracking-wider text-[#181917] uppercase">
              {currentStep.title}
            </h2>
            <p className="text-[10px] text-[#71717a] font-mono">{currentStep.hint}</p>
          </div>

          {/* Next step arrow */}
          <button
            type="button"
            onClick={nextStep}
            disabled={currentStepIndex === totalSteps - 1}
            className={`text-xs font-mono px-2 py-1 rounded transition-colors ${
              currentStepIndex === totalSteps - 1
                ? 'text-black/20 cursor-not-allowed'
                : 'text-black/80 hover:bg-black/5 active:scale-95'
            }`}
            title="Next Station (Down)"
          >
            NEXT ↓
          </button>
        </div>
      </div>
    </div>
  )
}

