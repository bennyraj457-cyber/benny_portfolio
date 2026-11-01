import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Camera, Lighting, Room } from './scene'
import { WorkspaceFocusProvider, useWorkspaceFocus } from '@/context/WorkspaceFocusContext'
import { RoomEntranceProvider, useRoomEntrance } from '@/context/RoomEntranceContext'
import { StudioLightingProvider } from '@/context/StudioLightingContext'
import { StoryScrollProvider } from '@/context/StoryScrollContext'
import { StoryScrollHUD } from './StoryScrollHUD'
import { StoryScrollBridge } from './StoryScrollBridge'
import { EntranceOverlay } from './EntranceOverlay'

interface ErrorBoundaryProps {
  fallback: ReactNode
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class SceneErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    )
  } catch {
    return false
  }
}

/**
 * Architectural Fallback View for devices that cannot handle real-time 3D WebGL.
 * Preserves the exact third-person over-the-shoulder workspace composition in SVG/CSS.
 */
export function WorkspaceFallback() {
  return (
    <div className="relative w-full h-full min-h-screen flex items-center justify-center bg-surface-container overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface-container-low to-surface-container-high" />
      <svg
        viewBox="0 0 800 500"
        className="relative z-10 w-full h-full max-w-3xl opacity-90"
        aria-label="Architectural 3D Workspace Fallback"
      >
        {/* Back Wall & Recessed Panel */}
        <rect x="80" y="30" width="640" height="310" rx="8" fill="#eae8e2" />
        {/* Desk Surface */}
        <polygon points="140,290 660,290 730,360 70,360" fill="#fbf9f3" stroke="#cfc6ab" strokeWidth="2" />
        {/* Ultra-Wide Monitor */}
        <rect x="250" y="135" width="300" height="125" rx="6" fill="#30312d" stroke="#dcdad4" strokeWidth="4" />
        <rect x="262" y="145" width="120" height="105" rx="2" fill="#1b1c19" />
        <rect x="275" y="160" width="65" height="6" fill="#f5d000" />
        <rect x="275" y="175" width="90" height="5" fill="#dcdad4" />
        <rect x="275" y="190" width="75" height="5" fill="#cbe6d0" />
        <rect x="392" y="145" width="146" height="105" rx="2" fill="#242521" />
        <circle cx="465" cy="197" r="28" fill="none" stroke="#f5d000" strokeWidth="2" />
        {/* Seated Person Silhouette (From Behind) & Ergonomic Chair */}
        <circle cx="400" cy="235" r="34" fill="#1b1c19" />
        <path d="M335,340 C335,285 465,285 465,340 Z" fill="#dcdad4" />
        <rect x="342" y="310" width="116" height="145" rx="14" fill="#30312d" />
        <rect x="378" y="325" width="44" height="90" rx="6" fill="#dcdad4" />
      </svg>
    </div>
  )
}

function BackToWorkspaceControl() {
  const { isAnyObjectOpen, returnToWorkspace } = useWorkspaceFocus()
  const { stage, exitToDoor } = useRoomEntrance()

  // Don't show workspace controls while still in entrance sequence
  if (stage !== 'WORKSPACE') {
    return null
  }

  const handleExitClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    returnToWorkspace()
    exitToDoor()
  }

  return (
    <>
      {/* Top Right Exit to Door Button when in normal Workspace */}
      {!isAnyObjectOpen && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 animate-fade-in pt-[env(safe-area-inset-top,0px)] pr-[env(safe-area-inset-right,0px)]">
          <button
            type="button"
            onClick={handleExitClick}
            className="group inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-black/10 bg-white/80 hover:bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-mono tracking-wider text-[#181917] shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#f5d000] hover:scale-105 active:scale-95 touch-manipulation"
            title="Exit Room back to the Door"
          >
            <span className="text-xs sm:text-sm transition-transform group-hover:-translate-x-0.5">←</span>
            <span className="font-semibold uppercase">EXIT ROOM</span>
          </button>
        </div>
      )}
    </>
  )
}

/**
 * Dismisses the initial HTML studio loader only after the 3D scene has actually
 * rendered several frames to the GPU, eliminating any white/blank screen flash.
 */
function SceneReadyNotifier() {
  const frameCountRef = useRef(0)
  const dismissedRef = useRef(false)

  useFrame(() => {
    if (dismissedRef.current) return
    frameCountRef.current += 1

    if (frameCountRef.current >= 2) {
      dismissedRef.current = true
      const win = window as unknown as { __loaderInterval?: number }
      if (win.__loaderInterval) {
        clearInterval(win.__loaderInterval)
      }
      const fill = document.getElementById('initial-loader-fill')
      const pctEl = document.getElementById('initial-loader-pct')
      const txtEl = document.getElementById('initial-loader-text')
      if (fill) fill.style.width = '100%'
      if (pctEl) pctEl.textContent = '100%'
      if (txtEl) txtEl.textContent = 'Studio Ready'

      setTimeout(() => {
        const loader = document.getElementById('initial-loader')
        if (loader) {
          loader.classList.add('loader-hidden')
          setTimeout(() => loader.remove(), 450)
        }
      }, 100)
    }
  })

  return null
}

export function WorkspaceCanvas() {
  const [webglSupported, setWebglSupported] = useState<boolean>(true)

  useEffect(() => {
    const supported = checkWebGLSupport()
    setWebglSupported(supported)
    if (!supported) {
      document.getElementById('initial-loader')?.classList.add('loader-hidden')
    }
  }, [])

  if (!webglSupported) {
    return <WorkspaceFallback />
  }

  return (
    <SceneErrorBoundary fallback={<WorkspaceFallback />}>
      <StudioLightingProvider>
        <RoomEntranceProvider>
          <WorkspaceFocusProvider>
            <StoryScrollProvider>
          <div className="relative w-full h-full min-h-screen bg-[#f0eee8]">
            <Suspense
              fallback={<div className="w-full h-full min-h-screen bg-[#181917]" />}
            >
              <Canvas
                shadows
                dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.35)]}
                gl={{
                  antialias: true,
                  powerPreference: 'high-performance',
                  alpha: false,
                  stencil: false,
                  depth: true,
                }}
              >
                <color attach="background" args={['#f0eee8']} />
                <Camera />
                <Lighting />
                <Room />
                <SceneReadyNotifier />
              </Canvas>
            </Suspense>
            <EntranceOverlay />
            <BackToWorkspaceControl />
            <StoryScrollHUD />
            <StoryScrollBridge />
          </div>
            </StoryScrollProvider>
          </WorkspaceFocusProvider>
        </RoomEntranceProvider>
      </StudioLightingProvider>
    </SceneErrorBoundary>
  )
}
