import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useCameraInteraction } from '@/hooks/useCameraInteraction'
import { useWorkspaceFocus } from '@/context/WorkspaceFocusContext'
import { useRoomEntrance } from '@/context/RoomEntranceContext'
import { updateAudioListener } from '@/hooks/useMusicPlayer'

// Strict spatial safety bounds so the camera never clips walls, floor, or furniture
// and never orbits around to the front of the character
const BOUNDS = {
  minAzimuth: -0.26, // ~ -15 deg max horizontal arc
  maxAzimuth: 0.26, // ~ +15 deg max horizontal arc
  minY: 1.42, // Safely above chair & desk plane
  maxY: 2.15, // Safely below ceiling
  minZ: 1.48, // Strictly behind the seated chair position
  maxZ: 2.75,
} as const

// 0. Entrance Door Coordinates:
// Door is at [0, 0, 3.65], height 2.45
// Camera outside facing door:
const ENTRANCE_CAMERA_DESKTOP_POS = new THREE.Vector3(0, 1.45, 5.25)
const ENTRANCE_CAMERA_MOBILE_POS = new THREE.Vector3(0, 1.45, 5.65)
const ENTRANCE_LOOK_AT = new THREE.Vector3(0, 1.35, 3.65)

// 1. Notebook world coordinates:
// Desk is at [0, 0, -0.90]
// Notebook is at local [-0.68, 0.759, 0.12] -> world [-0.68, 0.759, -0.78]
const NOTEBOOK_CAMERA_DESKTOP_POS = new THREE.Vector3(-0.755, 1.18, -0.58)
const NOTEBOOK_CAMERA_MOBILE_POS = new THREE.Vector3(-0.755, 1.32, -0.53)
const NOTEBOOK_LOOK_AT = new THREE.Vector3(-0.755, 0.768, -0.795)
const NOTEBOOK_UP = new THREE.Vector3(0, 0.85, -0.52).normalize()

// 2. Smartphone world coordinates:
// Desk is at [0, 0, -0.90]
// Smartphone is at local [0.56, 0.759, 0.23] -> world [0.56, 0.759, -0.67]
const SMARTPHONE_CAMERA_DESKTOP_POS = new THREE.Vector3(0.56, 1.015, -0.565)
const SMARTPHONE_CAMERA_MOBILE_POS = new THREE.Vector3(0.56, 1.075, -0.545)
const SMARTPHONE_LOOK_AT = new THREE.Vector3(0.56, 0.768, -0.675)
const SMARTPHONE_UP = new THREE.Vector3(0, 0.88, -0.47).normalize()

// 3. Music Player world coordinates:
// Desk is at [0, 0, -0.90]
// Music Player is at local [0.62, 0.759, -0.12] -> world [0.62, 0.88, -1.02]
// Balanced viewing distance to comfortably view the gramophone bell, cabinet and controls without being too close
const MUSIC_PLAYER_CAMERA_DESKTOP_POS = new THREE.Vector3(0.55, 1.12, -0.42)
const MUSIC_PLAYER_CAMERA_MOBILE_POS = new THREE.Vector3(0.55, 1.18, -0.38)
const MUSIC_PLAYER_LOOK_AT = new THREE.Vector3(0.62, 0.90, -1.02)
const MUSIC_PLAYER_UP = new THREE.Vector3(0, 0.92, -0.39).normalize()

// 4. Bookshelf & Skill Books world coordinates:
// Wall Shelf is at [-0.78, 1.75, -1.3]
// Books center is around [-0.91, 1.84, -1.3]
// Bookshelf Stage 1 framing: comfortable viewing distance to see all 5 books and the shelf
const BOOKSHELF_CAMERA_DESKTOP_POS = new THREE.Vector3(-0.91, 1.85, -0.65)
const BOOKSHELF_CAMERA_MOBILE_POS = new THREE.Vector3(-0.91, 1.85, -0.52)
const BOOKSHELF_LOOK_AT = new THREE.Vector3(-0.91, 1.845, -1.3)
const BOOKSHELF_UP = new THREE.Vector3(0, 1, 0)

// 5. Pinned Wall Note world coordinates:
// Note is at [0.78, 1.84, -1.37]
// Camera placed directly in front of the note at eye level for comfortable reading
const WALL_NOTE_CAMERA_DESKTOP_POS = new THREE.Vector3(0.78, 1.84, -0.92)
const WALL_NOTE_CAMERA_MOBILE_POS = new THREE.Vector3(0.78, 1.84, -0.82)
const WALL_NOTE_LOOK_AT = new THREE.Vector3(0.78, 1.84, -1.37)
const WALL_NOTE_UP = new THREE.Vector3(0, 1, 0)

// Individual Book Stage 2 Close-Up framing:
// Book pages are tilted at world [-0.84, 1.83, -1.02]
// Camera placed directly in front and slightly elevated looking straight down-angle at the pages
const BOOK_OPEN_CAMERA_DESKTOP_POS = new THREE.Vector3(-0.90, 1.94, -0.62)
const BOOK_OPEN_CAMERA_MOBILE_POS = new THREE.Vector3(-0.90, 1.96, -0.52)
const BOOK_OPEN_LOOK_AT = new THREE.Vector3(-0.90, 1.83, -1.02)
const BOOK_OPEN_UP = new THREE.Vector3(0, 0.95, -0.31).normalize()

export function Camera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const { size } = useThree()
  const isMobile = size.width < 768

  const interactionRef = useCameraInteraction()
  const { activeObject, activeBook, isAnyObjectOpen } = useWorkspaceFocus()
  const { stage, completeEntrance, completeExit, isReducedMotion } = useRoomEntrance()

  // Default third-person elevated position behind the chair
  const defaultPos = isMobile
    ? new THREE.Vector3(0.2, 1.85, 2.55)
    : new THREE.Vector3(0.28, 1.75, 2.05)

  // Default focal point looking at the desk and monitor
  const defaultLookAt = new THREE.Vector3(0, 0.92, -0.75)

  // Entrance transition state
  const isEntranceMode = stage !== 'WORKSPACE'
  // entranceT: 0 = at entrance outside door, 1 = entered room at defaultPos
  const entranceTRef = useRef<number>(stage === 'WORKSPACE' ? 1 : 0)
  const entranceTravelDelayRef = useRef<number>(0)

  // Smoothed internal vectors & scalars stored in refs to avoid allocations or React re-renders
  const currentPosRef = useRef<THREE.Vector3>(
    stage === 'WORKSPACE'
      ? defaultPos.clone()
      : (isMobile ? ENTRANCE_CAMERA_MOBILE_POS : ENTRANCE_CAMERA_DESKTOP_POS).clone(),
  )
  const currentLookAtRef = useRef<THREE.Vector3>(
    stage === 'WORKSPACE' ? defaultLookAt.clone() : ENTRANCE_LOOK_AT.clone(),
  )
  const currentUpRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1, 0))
  const focusBlendRef = useRef<number>(0)

  // Remember the most recently targeted object's camera pose so returning to workspace
  // interpolates smoothly from whichever object was just open
  const activeGoalPosRef = useRef<THREE.Vector3>(NOTEBOOK_CAMERA_DESKTOP_POS.clone())
  const activeGoalLookRef = useRef<THREE.Vector3>(NOTEBOOK_LOOK_AT.clone())
  const activeGoalUpRef = useRef<THREE.Vector3>(NOTEBOOK_UP.clone())

  const smoothedPointerRef = useRef<{ x: number; y: number; scroll: number }>({
    x: 0,
    y: 0,
    scroll: 0,
  })

  // Reusable scratch vectors to avoid GC pressure in useFrame
  const workspacePosScratch = useRef<THREE.Vector3>(new THREE.Vector3())
  const workspaceLookScratch = useRef<THREE.Vector3>(new THREE.Vector3())
  const targetPosScratch = useRef<THREE.Vector3>(new THREE.Vector3())
  const targetLookScratch = useRef<THREE.Vector3>(new THREE.Vector3())
  const targetUpScratch = useRef<THREE.Vector3>(new THREE.Vector3(0, 1, 0))
  const defaultUpScratch = useRef<THREE.Vector3>(new THREE.Vector3(0, 1, 0))
  const lastAudioUpdatePos = useRef<THREE.Vector3>(new THREE.Vector3())

  useFrame(({ clock }, delta) => {
    if (!cameraRef.current) return

    const dt = Math.min(delta, 0.1)
    const { pointerX, pointerY, scrollProgress, reducedMotion, isTouch } =
      interactionRef.current

    // Entrance / Exit Camera Traversal:
    if (stage === 'ENTRANCE' || stage === 'VISITOR_SELECTION') {
      entranceTRef.current = 0
      entranceTravelDelayRef.current = 0
    } else if (stage === 'DOOR_OPENING' || stage === 'ENTERING_ROOM') {
      entranceTravelDelayRef.current += dt
      // Start moving camera through doorway after door starts opening
      if (entranceTravelDelayRef.current > 0.65 || isReducedMotion) {
        const travelSpeed = isReducedMotion ? 2.5 : 0.65
        entranceTRef.current = Math.min(1, entranceTRef.current + travelSpeed * dt)
        if (entranceTRef.current >= 0.999) {
          entranceTRef.current = 1
          completeEntrance()
        }
      }
    } else if (stage === 'EXITING_ROOM') {
      // Smoothly reverse camera traversal backwards through the doorway to the outside
      const exitSpeed = isReducedMotion ? 3.0 : 0.75
      entranceTRef.current = Math.max(0, entranceTRef.current - exitSpeed * dt)
      if (entranceTRef.current <= 0.001) {
        entranceTRef.current = 0
        completeExit()
      }
    } else if (stage === 'WORKSPACE') {
      entranceTRef.current = 1
    }

    // Responsive pointer damping for smooth workspace parallax without lag
    const damp = 1 - Math.exp((isTouch ? 10.0 : 8.0) * -dt)

    // Update the active object target coordinates whenever an object is focused
    if (activeObject === 'about-me-notebook') {
      activeGoalPosRef.current.copy(
        isMobile ? NOTEBOOK_CAMERA_MOBILE_POS : NOTEBOOK_CAMERA_DESKTOP_POS,
      )
      activeGoalLookRef.current.copy(NOTEBOOK_LOOK_AT)
      activeGoalUpRef.current.copy(NOTEBOOK_UP)
    } else if (activeObject === 'contact-smartphone') {
      activeGoalPosRef.current.copy(
        isMobile ? SMARTPHONE_CAMERA_MOBILE_POS : SMARTPHONE_CAMERA_DESKTOP_POS,
      )
      activeGoalLookRef.current.copy(SMARTPHONE_LOOK_AT)
      activeGoalUpRef.current.copy(SMARTPHONE_UP)
    } else if (activeObject === 'music-player') {
      activeGoalPosRef.current.copy(
        isMobile ? MUSIC_PLAYER_CAMERA_MOBILE_POS : MUSIC_PLAYER_CAMERA_DESKTOP_POS,
      )
      activeGoalLookRef.current.copy(MUSIC_PLAYER_LOOK_AT)
      activeGoalUpRef.current.copy(MUSIC_PLAYER_UP)
    } else if (activeObject === 'wall-note') {
      activeGoalPosRef.current.copy(
        isMobile ? WALL_NOTE_CAMERA_MOBILE_POS : WALL_NOTE_CAMERA_DESKTOP_POS,
      )
      activeGoalLookRef.current.copy(WALL_NOTE_LOOK_AT)
      activeGoalUpRef.current.copy(WALL_NOTE_UP)
    } else if (activeObject === 'bookshelf') {
      if (activeBook !== null) {
        // Stage 2: Camera frames the selected floating open book
        activeGoalPosRef.current.copy(
          isMobile ? BOOK_OPEN_CAMERA_MOBILE_POS : BOOK_OPEN_CAMERA_DESKTOP_POS,
        )
        activeGoalLookRef.current.copy(BOOK_OPEN_LOOK_AT)
        activeGoalUpRef.current.copy(BOOK_OPEN_UP)
      } else {
        // Stage 1: Camera frames the entire bookshelf & all 5 books
        activeGoalPosRef.current.copy(
          isMobile ? BOOKSHELF_CAMERA_MOBILE_POS : BOOKSHELF_CAMERA_DESKTOP_POS,
        )
        activeGoalLookRef.current.copy(BOOKSHELF_LOOK_AT)
        activeGoalUpRef.current.copy(BOOKSHELF_UP)
      }
    }

    // Transition progress (0 = Workspace view, 1 = Object Close-Up view)
    const targetFocus = isAnyObjectOpen ? 1 : 0
    const transitionRate = (isAnyObjectOpen ? 2.4 : 2.8) * Math.min(delta, 0.05)

    if (focusBlendRef.current < targetFocus) {
      focusBlendRef.current = Math.min(targetFocus, focusBlendRef.current + transitionRate)
    } else if (focusBlendRef.current > targetFocus) {
      focusBlendRef.current = Math.max(targetFocus, focusBlendRef.current - transitionRate)
    }

    // Smooth hermite ease-in-out curve on the linear progress: f = 3f^2 - 2f^3
    const f = THREE.MathUtils.smoothstep(focusBlendRef.current, 0, 1)

    // 1. Interpolate pointer/touch input signals smoothly
    // Disable workspace pointer/scroll movement while at entrance or any interactive desk object is open
    const targetPX = reducedMotion || isAnyObjectOpen || isEntranceMode ? 0 : pointerX
    const targetPY = reducedMotion || isAnyObjectOpen || isEntranceMode ? 0 : pointerY
    const targetScroll = reducedMotion || isAnyObjectOpen || isEntranceMode ? 0 : scrollProgress

    smoothedPointerRef.current.x = THREE.MathUtils.lerp(
      smoothedPointerRef.current.x,
      targetPX,
      damp,
    )
    smoothedPointerRef.current.y = THREE.MathUtils.lerp(
      smoothedPointerRef.current.y,
      targetPY,
      damp,
    )
    smoothedPointerRef.current.scroll = THREE.MathUtils.lerp(
      smoothedPointerRef.current.scroll,
      targetScroll,
      damp,
    )

    const px = smoothedPointerRef.current.x
    const py = smoothedPointerRef.current.y
    const s = smoothedPointerRef.current.scroll

    // 2. Base coordinates adjusted for viewport size & subtle scroll transition
    const baseRadius = (isMobile ? 2.55 : 2.05) - s * 0.28
    const baseY = (isMobile ? 1.85 : 1.75) - s * 0.08
    const baseX = (isMobile ? 0.2 : 0.28) * (1 - s * 0.35)

    // 3. Restrained horizontal arc rotation (azimuth) around the workspace center
    const maxYaw = isTouch ? 0.14 : 0.22
    const azimuth = THREE.MathUtils.clamp(
      px * maxYaw,
      BOUNDS.minAzimuth,
      BOUNDS.maxAzimuth,
    )

    // 4. Subtle vertical elevation shift (polar pitch)
    const maxElevation = isTouch ? 0.08 : 0.14
    const elevationOffset = THREE.MathUtils.clamp(
      py * maxElevation,
      -0.14,
      0.16,
    )

    // 5. Subtle ambient breathing drift when reducedMotion is false and no object is focused
    const t = clock.getElapsedTime()
    const idleX =
      reducedMotion || isAnyObjectOpen || isEntranceMode
        ? 0
        : Math.sin(t * 0.45) * 0.012
    const idleY =
      reducedMotion || isAnyObjectOpen || isEntranceMode
        ? 0
        : Math.cos(t * 0.38) * 0.008

    // Compute orbited workspace camera position along a constrained rear arc
    const desiredX = baseX + Math.sin(azimuth) * baseRadius * 0.85 + idleX
    const desiredZ = Math.cos(azimuth) * baseRadius
    const desiredY = baseY + elevationOffset + idleY

    // Clamp workspace position strictly within room & furniture safety bounds
    const clampedX = THREE.MathUtils.clamp(desiredX, -0.65, 0.85)
    const clampedY = THREE.MathUtils.clamp(desiredY, BOUNDS.minY, BOUNDS.maxY)
    const clampedZ = THREE.MathUtils.clamp(desiredZ, BOUNDS.minZ, BOUNDS.maxZ)

    workspacePosScratch.current.set(clampedX, clampedY, clampedZ)

    // 6. Workspace lookAt target with subtle counter-parallax
    const lookX = defaultLookAt.x + px * (isTouch ? 0.05 : 0.09)
    const lookY =
      defaultLookAt.y + py * (isTouch ? 0.04 : 0.07) + s * 0.06
    const lookZ = defaultLookAt.z - s * 0.08
    workspaceLookScratch.current.set(lookX, lookY, lookZ)

    // 7. Calculate direct target pose using clean interpolated vectors
    // Lift the camera smoothly in an arc over desk edge during close-up travel
    targetPosScratch.current.lerpVectors(
      workspacePosScratch.current,
      activeGoalPosRef.current,
      f,
    )
    targetPosScratch.current.y += Math.sin(f * Math.PI) * 0.12

    targetLookScratch.current.lerpVectors(
      workspaceLookScratch.current,
      activeGoalLookRef.current,
      f,
    )

    targetUpScratch.current
      .lerpVectors(defaultUpScratch.current, activeGoalUpRef.current, f)
      .normalize()

    // 8. Entrance Travel Interpolation:
    // When entranceTRef < 1, interpolate between entrance camera and target workspace camera
    const entranceT = entranceTRef.current
    if (entranceT < 1) {
      // Smooth cubic ease-in-out curve
      const smoothEntranceT = entranceT * entranceT * (3 - 2 * entranceT)

      const startPos = isMobile
        ? ENTRANCE_CAMERA_MOBILE_POS
        : ENTRANCE_CAMERA_DESKTOP_POS
      const startLook = ENTRANCE_LOOK_AT

      // Smooth camera arc through the doorway:
      // Trajectory moves from Z = 5.25 -> through door opening at Z = 3.65 -> into room at Z = 2.05
      const posX = THREE.MathUtils.lerp(startPos.x, targetPosScratch.current.x, smoothEntranceT)
      const posY = THREE.MathUtils.lerp(startPos.y, targetPosScratch.current.y, smoothEntranceT)
      const posZ = THREE.MathUtils.lerp(startPos.z, targetPosScratch.current.z, smoothEntranceT)

      const lkX = THREE.MathUtils.lerp(startLook.x, targetLookScratch.current.x, smoothEntranceT)
      const lkY = THREE.MathUtils.lerp(startLook.y, targetLookScratch.current.y, smoothEntranceT)
      const lkZ = THREE.MathUtils.lerp(startLook.z, targetLookScratch.current.z, smoothEntranceT)

      currentPosRef.current.set(posX, posY, posZ)
      currentLookAtRef.current.set(lkX, lkY, lkZ)
      currentUpRef.current.set(0, 1, 0)
    } else {
      // Normal Workspace / Object Focus Camera
      currentPosRef.current.copy(targetPosScratch.current)
      currentLookAtRef.current.copy(targetLookScratch.current)
      currentUpRef.current.copy(targetUpScratch.current)
    }

    cameraRef.current.position.copy(currentPosRef.current)
    cameraRef.current.up.copy(currentUpRef.current)
    cameraRef.current.lookAt(currentLookAtRef.current)

    // Update acoustic distance only if camera moved noticeably
    if (lastAudioUpdatePos.current.distanceToSquared(currentPosRef.current) > 0.0004) {
      lastAudioUpdatePos.current.copy(currentPosRef.current)
      updateAudioListener(
        currentPosRef.current.x,
        currentPosRef.current.y,
        currentPosRef.current.z,
      )
    }
  })

  const initialCamPos =
    stage === 'WORKSPACE'
      ? defaultPos
      : isMobile
      ? ENTRANCE_CAMERA_MOBILE_POS
      : ENTRANCE_CAMERA_DESKTOP_POS

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[initialCamPos.x, initialCamPos.y, initialCamPos.z]}
      fov={isMobile ? 52 : 45}
      near={0.04}
      far={30}
    />
  )
}
