import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export interface CameraRigState {
  /** Normalized horizontal pointer (-1 to 1) */
  pointerX: number
  /** Normalized vertical pointer (-1 to 1) */
  pointerY: number
  /** Normalized hero scroll progress (0 to 1) */
  scrollProgress: number
  /** Whether the user prefers reduced motion */
  reducedMotion: boolean
  /** Whether the primary interaction is touch */
  isTouch: boolean
}

/**
 * Tracks desktop pointer movement, touch exploration, hero scroll progress,
 * and `prefers-reduced-motion` using refs only (zero React re-renders).
 * Cleans up all DOM event listeners and media query listeners on unmount.
 */
export function useCameraInteraction() {
  const stateRef = useRef<CameraRigState>({
    pointerX: 0,
    pointerY: 0,
    scrollProgress: 0,
    reducedMotion: false,
    isTouch: false,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Reduced-motion preference listener
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    stateRef.current.reducedMotion = motionQuery.matches

    const handleMotionChange = (e: MediaQueryListEvent) => {
      stateRef.current.reducedMotion = e.matches
      if (e.matches) {
        stateRef.current.pointerX = 0
        stateRef.current.pointerY = 0
      }
    }
    motionQuery.addEventListener('change', handleMotionChange)

    // 2. Desktop pointer movement (normalized -1 to 1)
    const handlePointerMove = (e: PointerEvent) => {
      if (stateRef.current.reducedMotion) return
      if (e.pointerType === 'touch') {
        stateRef.current.isTouch = true
      } else {
        stateRef.current.isTouch = false
      }

      const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1
      const ny = -(e.clientY / Math.max(1, window.innerHeight)) * 2 + 1

      stateRef.current.pointerX = THREE.MathUtils.clamp(nx, -1, 1)
      stateRef.current.pointerY = THREE.MathUtils.clamp(ny, -1, 1)
    }

    // 3. Touch drag / move support for mobile & tablets with restrained range
    let touchStartX = 0
    let touchStartY = 0

    const handleTouchStart = (e: TouchEvent) => {
      if (stateRef.current.reducedMotion || e.touches.length === 0) return
      stateRef.current.isTouch = true
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (stateRef.current.reducedMotion || e.touches.length === 0) return
      stateRef.current.isTouch = true
      const dx = (e.touches[0].clientX - touchStartX) / Math.max(1, window.innerWidth)
      const dy = -(e.touches[0].clientY - touchStartY) / Math.max(1, window.innerHeight)

      // Restrained sensitivity on touch devices
      stateRef.current.pointerX = THREE.MathUtils.clamp(dx * 1.6, -0.65, 0.65)
      stateRef.current.pointerY = THREE.MathUtils.clamp(dy * 1.4, -0.5, 0.5)
    }

    const handleTouchEnd = () => {
      // Gently return toward center when touch is released
      stateRef.current.pointerX *= 0.5
      stateRef.current.pointerY *= 0.5
    }

    const handlePointerLeave = () => {
      stateRef.current.pointerX = 0
      stateRef.current.pointerY = 0
    }

    // 4. Scroll & wheel progress (0 -> 1) for smooth Hero camera transition
    // Works both when scrolling through a multi-section page AND via wheel scrub on the Hero
    let virtualScroll = 0

    const updatePageScroll = () => {
      const vh = Math.max(1, window.innerHeight)
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh)
      if (maxScroll > 10) {
        const pageProgress = THREE.MathUtils.clamp(window.scrollY / vh, 0, 1)
        stateRef.current.scrollProgress = pageProgress
        virtualScroll = pageProgress
      }
    }

    const handleWheel = (e: WheelEvent) => {
      if (stateRef.current.reducedMotion) return
      const vh = Math.max(1, window.innerHeight)
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh)
      if (maxScroll <= 10) {
        // When only the Hero section is present, allow subtle wheel-driven camera dolly transition
        virtualScroll = THREE.MathUtils.clamp(
          virtualScroll + e.deltaY * 0.0006,
          0,
          1,
        )
        stateRef.current.scrollProgress = virtualScroll
      }
    }

    updatePageScroll()

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('scroll', updatePageScroll, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('scroll', updatePageScroll)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return stateRef
}

