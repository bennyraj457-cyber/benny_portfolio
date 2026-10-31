import {
  createContext,
  useCallback,
  useContext,
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

  const totalSteps = STORY_STEPS.length

  const goToStep = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(totalSteps - 1, index))
      setCurrentStepIndex(clamped)
    },
    [totalSteps]
  )

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => (prev + 1) % totalSteps)
  }, [totalSteps])

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => (prev - 1 + totalSteps) % totalSteps)
  }, [totalSteps])

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
        isScrollingLocked: false,
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
