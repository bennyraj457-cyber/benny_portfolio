import { useState } from 'react'
import { HeroWorkspace } from '@/components/hero/HeroWorkspace'
import { HomePage } from '@/components/home/HomePage'

export function App() {
  const [hasEnteredPortfolio, setHasEnteredPortfolio] = useState(false)

  return (
    <main className="min-h-screen bg-surface text-on-surface">
      {hasEnteredPortfolio ? (
        <HeroWorkspace onBackToHome={() => setHasEnteredPortfolio(false)} />
      ) : (
        <HomePage onEnter={() => setHasEnteredPortfolio(true)} />
      )}
    </main>
  )
}

export default App
