import { useMemo, useRef, useState, useCallback, useEffect } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useRoomEntrance } from '@/context/RoomEntranceContext'
import { entranceAudio } from '@/utils/entranceAudio'
import { EntranceWallDecor } from './EntranceWallDecor'
import {
  createGlassDecalTexture,
  createDoorBottomDecalTexture,
} from './doorGraphicsTextures'

export function RoomDoor() {
  const { stage, handleDoorClick, isReducedMotion } = useRoomEntrance()

  const [isHandleHovered, setIsHandleHovered] = useState(false)
  const [isDoorHovered, setIsDoorHovered] = useState(false)

  const doorPivotRef = useRef<THREE.Group>(null)
  const handlePivotRef = useRef<THREE.Group>(null)
  const indicatorRingRef = useRef<THREE.MeshBasicMaterial>(null)

  // Procedural textures
  const glassDecalTexture = useMemo(() => createGlassDecalTexture(), [])
  const doorBottomDecalTexture = useMemo(() => createDoorBottomDecalTexture(), [])

  // Animation state values
  const doorAngleRef = useRef(0)
  const handleAngleRef = useRef(0)
  const unlockTriggeredRef = useRef(false)
  const swingTriggeredRef = useRef(false)

  // Dimensions
  const doorWidth = 1.15
  const doorHeight = 2.45
  const doorThickness = 0.048
  const doorZ = 3.65 // Front wall position

  // Laboratory / Medical Clean-room Teal colors from user reference image:
  // Door Slab color: #439d8e (Clean room powder-coated satin teal)
  // Frame color: #358276 (Slightly darker matching frame teal)
  const doorTeal = '#439d8e'
  const frameTeal = '#358276'

  // Window aperture dimensions
  const winW = 0.46
  const winH = 0.78
  const winY = 0.44 // Center height of window relative to door center

  const isClickable = stage === 'ENTRANCE'

  const onPointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      if (isClickable) {
        setIsDoorHovered(true)
        document.body.style.cursor = 'pointer'
      }
    },
    [isClickable],
  )

  const onPointerOut = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setIsDoorHovered(false)
    setIsHandleHovered(false)
    document.body.style.cursor = 'auto'
  }, [])

  const onHandlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      if (isClickable) {
        setIsHandleHovered(true)
        document.body.style.cursor = 'pointer'
      }
    },
    [isClickable],
  )

  const onClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      if (isClickable) {
        entranceAudio.playKnock()
        handleDoorClick()
        document.body.style.cursor = 'auto'
      }
    },
    [isClickable, handleDoorClick],
  )

  // Reset triggers and door angles when returning to ENTRANCE
  useEffect(() => {
    if (stage === 'ENTRANCE') {
      unlockTriggeredRef.current = false
      swingTriggeredRef.current = false
      doorAngleRef.current = 0
      handleAngleRef.current = 0
      if (doorPivotRef.current) {
        doorPivotRef.current.rotation.y = 0
      }
      if (handlePivotRef.current) {
        handlePivotRef.current.rotation.z = 0
      }
    }
  }, [stage])

  // Trigger unlock sound when stage changes to DOOR_OPENING
  useEffect(() => {
    if (stage === 'DOOR_OPENING' && !unlockTriggeredRef.current) {
      unlockTriggeredRef.current = true
      entranceAudio.playHandleTurn()
      setTimeout(() => {
        entranceAudio.playUnlock()
      }, 250)
      setTimeout(() => {
        entranceAudio.playDoorSwing()
        swingTriggeredRef.current = true
      }, 600)
    }
  }, [stage])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1)

    // Pulse the indicator ring around handle when at entrance
    if (indicatorRingRef.current && isClickable) {
      const pulse = 0.4 + 0.45 * Math.sin(state.clock.elapsedTime * 4.5)
      indicatorRingRef.current.opacity = isHandleHovered || isDoorHovered ? 0.95 : pulse
    }

    // Handle rotation when unlocking (rotates ~35 degrees down)
    const targetHandleAngle =
      stage === 'DOOR_OPENING' || stage === 'ENTERING_ROOM' || stage === 'WORKSPACE'
        ? 0.58
        : 0

    handleAngleRef.current = THREE.MathUtils.damp(
      handleAngleRef.current,
      targetHandleAngle,
      stage === 'EXITING_ROOM' ? 2.5 : 6.0,
      dt,
    )

    if (handlePivotRef.current) {
      handlePivotRef.current.rotation.z = -handleAngleRef.current
    }

    // Door swing rotation around left hinge (-doorWidth / 2)
    const targetDoorAngle =
      stage === 'DOOR_OPENING' || stage === 'ENTERING_ROOM' || stage === 'WORKSPACE'
        ? -Math.PI * 0.6
        : 0

    if (stage === 'ENTRANCE') {
      doorAngleRef.current = THREE.MathUtils.damp(doorAngleRef.current, 0, 15.0, dt)
    } else if (stage === 'EXITING_ROOM') {
      // Smoothly swing the door closed behind camera as camera glides outside
      doorAngleRef.current = THREE.MathUtils.damp(doorAngleRef.current, 0, 1.8, dt)
    } else if (swingTriggeredRef.current || isReducedMotion || stage === 'WORKSPACE') {
      const swingSpeed = isReducedMotion ? 20.0 : 2.2
      doorAngleRef.current = THREE.MathUtils.damp(
        doorAngleRef.current,
        targetDoorAngle,
        swingSpeed,
        dt,
      )
    }

    if (doorPivotRef.current) {
      doorPivotRef.current.rotation.y = doorAngleRef.current
    }
  })

  // Calculating pieces around the window cutout
  // Door center is at (0,0). Window is at (0, winY), size (winW, winH).
  const topH = doorHeight / 2 - (winY + winH / 2)
  const bottomH = winY - winH / 2 - (-doorHeight / 2)
  const sideW = (doorWidth - winW) / 2

  return (
    <group name="RoomEntranceEnvironment" position={[0, 0, doorZ]}>
      {/* 1. Surrounding Clean Architectural Walls (Clean White Panel Aesthetic as in reference image) */}
      {/* Left Wall Slice */}
      <mesh position={[-2.4, doorHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[3.6, 3.6, 0.1]} />
        <meshStandardMaterial color="#f8f8f6" roughness={0.9} metalness={0.02} />
      </mesh>
      {/* Right Wall Slice */}
      <mesh position={[2.4, doorHeight / 2, 0]} receiveShadow>
        <boxGeometry args={[3.6, 3.6, 0.1]} />
        <meshStandardMaterial color="#f8f8f6" roughness={0.9} metalness={0.02} />
      </mesh>
      {/* Top Header Wall Above Door */}
      <mesh position={[0, doorHeight + 0.55, 0]} receiveShadow>
        <boxGeometry args={[doorWidth + 0.18, 1.1, 0.1]} />
        <meshStandardMaterial color="#f8f8f6" roughness={0.9} metalness={0.02} />
      </mesh>

      {/* Wall Vertical Panel Seam / Shadow Lines (Architectural cleanroom panel joints) */}
      <mesh position={[-0.78, doorHeight / 2, 0.052]}>
        <planeGeometry args={[0.003, 3.6]} />
        <meshBasicMaterial color="#dcdad4" />
      </mesh>
      <mesh position={[0.78, doorHeight / 2, 0.052]}>
        <planeGeometry args={[0.003, 3.6]} />
        <meshBasicMaterial color="#dcdad4" />
      </mesh>

      {/* 2. Architectural Clean-Room Matching Teal Frame / Architrave */}
      {/* Left Jamb */}
      <mesh position={[-doorWidth / 2 - 0.045, doorHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.09, doorHeight + 0.09, 0.12]} />
        <meshStandardMaterial color={frameTeal} roughness={0.5} metalness={0.12} />
      </mesh>
      {/* Right Jamb */}
      <mesh position={[doorWidth / 2 + 0.045, doorHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.09, doorHeight + 0.09, 0.12]} />
        <meshStandardMaterial color={frameTeal} roughness={0.5} metalness={0.12} />
      </mesh>
      {/* Top Header Jamb */}
      <mesh position={[0, doorHeight + 0.045, 0]} castShadow receiveShadow>
        <boxGeometry args={[doorWidth + 0.18, 0.09, 0.12]} />
        <meshStandardMaterial color={frameTeal} roughness={0.5} metalness={0.12} />
      </mesh>

      {/* Clean-Room Curved Floor Baseboard / Coving (as seen in user photo) */}
      <mesh position={[0, 0.04, 0.052]} receiveShadow>
        <boxGeometry args={[doorWidth + 0.22, 0.08, 0.015]} />
        <meshStandardMaterial color="#eae8e2" roughness={0.4} />
      </mesh>

      {/* Architectural Entrance Wall Decor (Sconce, Plaque, Plant) */}
      <EntranceWallDecor />

      {/* 3. Swiveling Clean-Room Teal Door Assembly with Glass Window */}
      <group
        ref={doorPivotRef}
        position={[-doorWidth / 2, 0, 0]}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
      >
        {/* Door Container (Centered around doorWidth/2, doorHeight/2) */}
        <group position={[doorWidth / 2, doorHeight / 2, 0]}>
          {/* A. Solid Panels around the Window Cutout */}
          {/* 1. Top Panel above window */}
          <mesh position={[0, doorHeight / 2 - topH / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[doorWidth - 0.01, topH, doorThickness]} />
            <meshStandardMaterial color={doorTeal} roughness={0.5} metalness={0.1} />
          </mesh>

          {/* 2. Bottom Panel below window */}
          <mesh position={[0, -doorHeight / 2 + bottomH / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[doorWidth - 0.01, bottomH, doorThickness]} />
            <meshStandardMaterial color={doorTeal} roughness={0.5} metalness={0.1} />
          </mesh>

          {/* 3. Left Side Panel next to window */}
          <mesh position={[-doorWidth / 2 + sideW / 2 + 0.005, winY, 0]} castShadow receiveShadow>
            <boxGeometry args={[sideW, winH, doorThickness]} />
            <meshStandardMaterial color={doorTeal} roughness={0.5} metalness={0.1} />
          </mesh>

          {/* 4. Right Side Panel next to window */}
          <mesh position={[doorWidth / 2 - sideW / 2 - 0.005, winY, 0]} castShadow receiveShadow>
            <boxGeometry args={[sideW, winH, doorThickness]} />
            <meshStandardMaterial color={doorTeal} roughness={0.5} metalness={0.1} />
          </mesh>

          {/* B. Glass Window Pane with Black Rounded Rubber Gasket Frame (Photo Match) */}
          <group position={[0, winY, 0]}>
            {/* Outer Matte Black Rubber Gasket Bevel Border (Frame around the opening, hollow center) */}
            {/* Top Gasket Strip */}
            <mesh position={[0, winH / 2 + 0.015, 0]}>
              <boxGeometry args={[winW + 0.06, 0.03, doorThickness + 0.008]} />
              <meshStandardMaterial color="#1a1b18" roughness={0.8} metalness={0.15} />
            </mesh>
            {/* Bottom Gasket Strip */}
            <mesh position={[0, -winH / 2 - 0.015, 0]}>
              <boxGeometry args={[winW + 0.06, 0.03, doorThickness + 0.008]} />
              <meshStandardMaterial color="#1a1b18" roughness={0.8} metalness={0.15} />
            </mesh>
            {/* Left Gasket Strip */}
            <mesh position={[-winW / 2 - 0.015, 0, 0]}>
              <boxGeometry args={[0.03, winH, doorThickness + 0.008]} />
              <meshStandardMaterial color="#1a1b18" roughness={0.8} metalness={0.15} />
            </mesh>
            {/* Right Gasket Strip */}
            <mesh position={[winW / 2 + 0.015, 0, 0]}>
              <boxGeometry args={[0.03, winH, doorThickness + 0.008]} />
              <meshStandardMaterial color="#1a1b18" roughness={0.8} metalness={0.15} />
            </mesh>

            {/* Clear Transparent Glass Pane - See directly into workspace */}
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[winW + 0.01, winH + 0.01]} />
              <meshPhysicalMaterial
                color="#e8f4f8"
                transparent
                opacity={0.22}
                roughness={0.05}
                metalness={0.1}
                clearcoat={1}
                clearcoatRoughness={0.1}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>

            {/* Subtle Frosted Safety Manifestation Decal with Studio Monogram */}
            <mesh position={[0, 0, 0.002]}>
              <planeGeometry args={[winW - 0.02, winH - 0.02]} />
              <meshBasicMaterial
                map={glassDecalTexture}
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>

            {/* Diagonal Sun / Studio Window Glimmer on Glass */}
            <mesh position={[-winW * 0.15, winH * 0.2, 0.003]} rotation={[0, 0, -0.6]}>
              <planeGeometry args={[0.035, 0.28]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.35} depthWrite={false} />
            </mesh>
          </group>

          {/* D. Lower Door Architectural Graphics Decal */}
          <group position={[0, -0.72, doorThickness / 2 + 0.003]}>
            <mesh position={[0, 0, 0.001]}>
              <planeGeometry args={[doorWidth - 0.2, 0.22]} />
              <meshBasicMaterial
                map={doorBottomDecalTexture}
                transparent
                opacity={0.9}
                side={THREE.FrontSide}
              />
            </mesh>
          </group>

          {/* E. Modern Stainless Steel Door Handle & Keyhole (Photo Match) */}
          <group position={[doorWidth / 2 - 0.13, -0.08, doorThickness / 2 + 0.004]}>
            {/* Stainless Steel Circular Rosette / Rose Plate */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.028, 0.028, 0.006, 24]} />
              <meshStandardMaterial color="#c8cbce" metalness={0.92} roughness={0.2} />
            </mesh>

            {/* Stainless Steel Keyhole Escutcheon Rosette directly below handle */}
            <mesh position={[0, -0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.022, 0.022, 0.006, 24]} />
              <meshStandardMaterial color="#c8cbce" metalness={0.92} roughness={0.2} />
            </mesh>
            {/* Key Cylinder */}
            <mesh position={[0, -0.09, 0.004]}>
              <circleGeometry args={[0.008, 16]} />
              <meshBasicMaterial color="#1a1b18" />
            </mesh>

            {/* Glowing Interaction Indicator Ring around Handle */}
            {isClickable && (
              <mesh position={[0, 0, 0.004]}>
                <ringGeometry args={[0.034, 0.044, 32]} />
                <meshBasicMaterial
                  ref={indicatorRingRef}
                  color="#f5d000"
                  transparent
                  opacity={0.7}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* Rotating Ergonomic L-Shaped Lever Handle (Photo Match) */}
            <group
              ref={handlePivotRef}
              position={[0, 0, 0.012]}
              onPointerOver={onHandlePointerOver}
            >
              {/* Spindle shaft */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.009, 0.009, 0.026, 16]} />
                <meshStandardMaterial color="#d8dade" metalness={0.95} roughness={0.15} />
              </mesh>
              {/* Horizontal ergonomic stainless lever bar */}
              <RoundedBox
                args={[0.135, 0.018, 0.018]}
                position={[-0.058, 0, 0.014]}
                radius={0.004}
                smoothness={3}
                castShadow
              >
                <meshStandardMaterial
                  color="#d4d7db"
                  roughness={0.18}
                  metalness={0.94}
                />
              </RoundedBox>
              {/* Electric Yellow Tip Accent on Handle */}
              <mesh position={[-0.124, 0, 0.014]}>
                <boxGeometry args={[0.006, 0.016, 0.016]} />
                <meshBasicMaterial color="#f5d000" />
              </mesh>
            </group>
          </group>

          {/* Interior Door Handle on Inside Face (-Z) */}
          <group position={[doorWidth / 2 - 0.13, -0.08, -doorThickness / 2 - 0.004]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.028, 0.028, 0.006, 24]} />
              <meshStandardMaterial color="#c8cbce" metalness={0.92} roughness={0.2} />
            </mesh>
            <mesh position={[-0.058, 0, -0.022]}>
              <boxGeometry args={[0.135, 0.018, 0.018]} />
              <meshStandardMaterial color="#d4d7db" roughness={0.2} metalness={0.94} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  )
}
