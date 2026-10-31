import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { STORY_STEPS, type StoryStep } from '@/data/storySteps'

interface StoryScrollContextValue {
  currentStepIndex: number
  currentStep: StoryStep
  totalSteps: number
  goToStep: (index: number) => void
  nextStep: () => void
  prevStep: () => void
  isScrollingLocked: boolean
}

const StoryScrollContext = createContext<StoryScrollContextValue | null>(null)

export function StoryScrollProvider({ children }: { children: ReactNode }) {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const isTransitioningRef = useRef<boolean>(false)
  const touchStartYRef = useRef<number | null>(null)

  const totalSteps = STORY_STEPS.length

  const goToStep = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(totalSteps - 1, index))
      setCurrentStepIndex(clamped)
    },
    [totalSteps]
  )

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.min(totalSteps - 1, prev + 1))
  }, [totalSteps])

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1))
  }, [])

  // Wheel scrubbing handler with debounced step navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Don't trigger if user is interacting with an internal scrollable panel (like About Me pages)
      const target = e.target as HTMLElement | null
      if (target?.closest('.allow-scroll') || target?.closest('textarea') || target?.closest('input')) {
        return
      }

      if (Math.abs(e.deltaY) < 22) return // ignore micro trackpad jitters

      if (isTransitioningRef.current) return

      if (e.deltaY > 0) {
        // Scroll down -> Next step
        isTransitioningRef.current = true
        setCurrentStepIndex((prev) => Math.min(totalSteps - 1, prev + 1))
        setTimeout(() => {
          isTransitioningRef.current = false
        }, 650)
      } else if (e.deltaY < 0) {
        // Scroll up -> Prev step
        isTransitioningRef.current = true
        setCurrentStepIndex((prev) => Math.max(0, prev - 1))
        setTimeout(() => {
          isTransitioningRef.current = false
        }, 650)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        nextStep()
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        prevStep()
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartYRef.current === null) return
      const deltaY = touchStartYRef.current - e.changedTouches[0].clientY
      touchStartYRef.current = null

      if (Math.abs(deltaY) > 40 && !isTransitioningRef.current) {
        isTransitioningRef.current = true
        if (deltaY > 0) {
          nextStep()
        } else {
          prevStep()
        }
        setTimeout(() => {
          isTransitioningRef.current = false
        }, 650)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [nextStep, prevStep, totalSteps])

  const currentStep = STORY_STEPS[currentStepIndex]

  return (
    <StoryScrollContext.Provider
      value={{
        currentStepIndex,
        currentStep,
        totalSteps,
        goToStep,
        nextStep,
        prevStep,
        isScrollingLocked: isTransitioningRef.current,
      }}
    >
      {children}
    </StoryScrollContext.Provider>
  )
}

export function useStoryScroll() {
  const context = useContext(StoryScrollContext)
  if (!context) {
    throw new Error('useStoryScroll must be used within a StoryScrollProvider')
  }
  return context
}
