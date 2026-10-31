import { createContext, useContext, useState, type ReactNode } from 'react'

interface StudioLightingContextType {
  isNightMode: boolean
  toggleDayNight: () => void
  setNightMode: (night: boolean) => void
}

const StudioLightingContext = createContext<StudioLightingContextType | null>(null)

export function StudioLightingProvider({ children }: { children: ReactNode }) {
  // Check local time: if late evening (after 7 PM or before 6 AM), default to cozy night mode, else day
  const [isNightMode, setIsNightMode] = useState<boolean>(() => {
    const hour = new Date().getHours()
    return hour >= 19 || hour < 6
  })

  const toggleDayNight = () => {
    setIsNightMode((prev) => !prev)
  }

  return (
    <StudioLightingContext.Provider
      value={{
        isNightMode,
        toggleDayNight,
        setNightMode: setIsNightMode,
      }}
    >
      {children}
    </StudioLightingContext.Provider>
  )
}

export function useStudioLighting() {
  const context = useContext(StudioLightingContext)
  if (!context) {
    throw new Error('useStudioLighting must be used within a StudioLightingProvider')
  }
  return context
}
