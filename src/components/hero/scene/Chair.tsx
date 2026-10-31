import { useMemo } from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Procedural woven cane/rattan mesh texture generator (octagonal cane weave pattern)
 */
function createCaneMeshTexture(): THREE.CanvasTexture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Warm natural cane base background
  ctx.fillStyle = '#dec89e'
  ctx.fillRect(0, 0, size, size)

  const cellSize = 32
  const half = cellSize / 2

  ctx.lineWidth = 3
  ctx.strokeStyle = '#bfa575'

  // Woven cane grid pattern
  for (let x = 0; x < size; x += cellSize) {
    for (let y = 0; y < size; y += cellSize) {
      // Octagonal hole pattern
      ctx.fillStyle = '#3a2d1d' // Dark background through cane holes
      ctx.beginPath()
      ctx.arc(x + half, y + half, 6, 0, Math.PI * 2)
      ctx.fill()

      // Horizontal and vertical cane strands
      ctx.strokeStyle = '#cbaf7c'
      ctx.strokeRect(x + 3, y + 3, cellSize - 6, cellSize - 6)

      // Diagonal cross strands
      ctx.strokeStyle = '#e7d5ad'
      ctx.beginPath()
      ctx.moveTo(x, y + half)
      ctx.lineTo(x + half, y)
      ctx.lineTo(x + cellSize, y + half)
      ctx.lineTo(x + half, y + cellSize)
      ctx.closePath()
      ctx.stroke()
    }
  }

  // Fine organic surface variation
  ctx.fillStyle = 'rgba(100, 75, 40, 0.08)'
  for (let i = 0; i < 400; i++) {
    const rx = Math.random() * size
    const ry = Math.random() * size
    ctx.fillRect(rx, ry, Math.random() * 4, Math.random() * 4)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2.5, 1.6)
  texture.anisotropy = 8
  return texture
}

/**
 * Procedural subtle wood grain texture generator
 */
function createWoodTexture(): THREE.CanvasTexture {
  const width = 512
  const height = 512
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Base warm rich teak / walnut color
  ctx.fillStyle = '#7a4823'
  ctx.fillRect(0, 0, width, height)

  // Longitudinal wood grain lines
  for (let y = 0; y < height; y++) {
    const n = Math.sin(y * 0.08) * Math.cos(y * 0.02)
    const val = 0.5 + 0.5 * Math.sin(y * 0.25 + n * 4)
    ctx.fillStyle = val > 0.6 ? 'rgba(55, 30, 12, 0.22)' : 'rgba(145, 90, 48, 0.15)'
    ctx.fillRect(0, y, width, 1)
  }

  // Subtle streaks
  ctx.fillStyle = 'rgba(40, 20, 8, 0.12)'
  for (let i = 0; i < 50; i++) {
    const ry = Math.random() * height
    ctx.fillRect(0, ry, width, Math.random() * 3 + 1)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.anisotropy = 4
  return texture
}

/**
 * Procedural linen / woven upholstery fabric texture generator
 */
function createFabricTexture(): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Cream/beige natural linen base
  ctx.fillStyle = '#ece5d8'
  ctx.fillRect(0, 0, size, size)

  // Linen warp and weft
  ctx.fillStyle = 'rgba(180, 168, 145, 0.25)'
  for (let x = 0; x < size; x += 3) {
    ctx.fillRect(x, 0, 1, size)
  }
  ctx.fillStyle = 'rgba(150, 138, 115, 0.22)'
  for (let y = 0; y < size; y += 3) {
    ctx.fillRect(0, y, size, 1)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)
  texture.anisotropy = 4
  return texture
}

export function Chair() {
  const caneTexture = useMemo(() => createCaneMeshTexture(), [])
  const woodTexture = useMemo(() => createWoodTexture(), [])
  const fabricTexture = useMemo(() => createFabricTexture(), [])

  // Mid-century Pierre Jeanneret style "Compass" / inverted-V teak & cane armchair
  // Positioned at [0, 0, -0.50] matching character and desk composition
  return (
    <group name="Chair" position={[0, 0, -0.5]} rotation={[0, Math.PI, 0]}>
      {/* ========================================================= */}
      {/* 1. SEAT CUSHION & SUPPORT FRAME                          */}
      {/* ========================================================= */}
      {/* Wooden Seat Frame Base */}
      <RoundedBox
        args={[0.54, 0.045, 0.52]}
        position={[0, 0.435, 0.01]}
        radius={0.008}
        smoothness={3}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          map={woodTexture}
          color="#854d27"
          roughness={0.42}
          metalness={0.06}
        />
      </RoundedBox>

      {/* Cream / Beige Thick Upholstered Cushion with soft rounded contour */}
      <RoundedBox
        args={[0.49, 0.075, 0.48]}
        position={[0, 0.48, 0.01]}
        radius={0.035}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          map={fabricTexture}
          color="#efe9dd"
          roughness={0.88}
          metalness={0.02}
        />
      </RoundedBox>

      {/* ========================================================= */}
      {/* 2. CHARACTERISTIC INVERTED-V "COMPASS" SIDE LEGS          */}
      {/* ========================================================= */}
      {[-0.265, 0.265].map((xSide, i) => (
        <group key={`leg-assembly-${i}`} position={[xSide, 0, 0]}>
          {/* Front Tapered Leg (slanted forward ~9 deg) */}
          <mesh
            position={[0, 0.22, 0.20]}
            rotation={[0.16, 0, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.042, 0.46, 0.045]} />
            <meshStandardMaterial
              map={woodTexture}
              color="#854d27"
              roughness={0.4}
              metalness={0.06}
            />
          </mesh>

          {/* Rear Tapered Leg (slanted backward ~14 deg) */}
          <mesh
            position={[0, 0.21, -0.19]}
            rotation={[-0.24, 0, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.042, 0.45, 0.045]} />
            <meshStandardMaterial
              map={woodTexture}
              color="#854d27"
              roughness={0.4}
              metalness={0.06}
            />
          </mesh>

          {/* Upright Armrest Support Strut (connecting inverted-V apex to armrest) */}
          <mesh
            position={[0, 0.54, 0.05]}
            rotation={[-0.04, 0, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.038, 0.25, 0.042]} />
            <meshStandardMaterial
              map={woodTexture}
              color="#854d27"
              roughness={0.4}
              metalness={0.06}
            />
          </mesh>

          {/* Horizontal Side Stretcher / Seat Rail Support */}
          <mesh
            position={[0, 0.42, 0.01]}
            rotation={[0, 0, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.04, 0.04, 0.44]} />
            <meshStandardMaterial
              map={woodTexture}
              color="#7c4622"
              roughness={0.4}
              metalness={0.06}
            />
          </mesh>

          {/* Solid Wooden Armrest (Signature angled profile) */}
          <RoundedBox
            args={[0.065, 0.032, 0.48]}
            position={[0, 0.655, 0.03]}
            radius={0.008}
            smoothness={3}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              map={woodTexture}
              color="#8a512a"
              roughness={0.38}
              metalness={0.06}
            />
          </RoundedBox>
        </group>
      ))}

      {/* Under-Seat Cross Stretcher Rails for stability */}
      <mesh position={[0, 0.16, -0.05]} castShadow>
        <boxGeometry args={[0.49, 0.024, 0.032]} />
        <meshStandardMaterial map={woodTexture} color="#7c4622" roughness={0.45} />
      </mesh>

      {/* ========================================================= */}
      {/* 3. WOVEN CANE & SOLID WOOD RECTANGULAR BACKREST           */}
      {/* ========================================================= */}
      {/* Tilted ~12 degrees backward for ergonomic mid-century stance */}
      <group position={[0, 0.72, -0.21]} rotation={[-0.22, 0, 0]}>
        {/* Outer Wooden Backrest Frame */}
        {/* Top Rail */}
        <RoundedBox
          args={[0.48, 0.046, 0.032]}
          position={[0, 0.16, 0]}
          radius={0.005}
          smoothness={3}
          castShadow
        >
          <meshStandardMaterial map={woodTexture} color="#854d27" roughness={0.4} />
        </RoundedBox>

        {/* Bottom Rail */}
        <RoundedBox
          args={[0.48, 0.046, 0.032]}
          position={[0, -0.16, 0]}
          radius={0.005}
          smoothness={3}
          castShadow
        >
          <meshStandardMaterial map={woodTexture} color="#854d27" roughness={0.4} />
        </RoundedBox>

        {/* Left Stile */}
        <RoundedBox
          args={[0.046, 0.36, 0.032]}
          position={[-0.217, 0, 0]}
          radius={0.005}
          smoothness={3}
          castShadow
        >
          <meshStandardMaterial map={woodTexture} color="#854d27" roughness={0.4} />
        </RoundedBox>

        {/* Right Stile */}
        <RoundedBox
          args={[0.046, 0.36, 0.032]}
          position={[0.217, 0, 0]}
          radius={0.005}
          smoothness={3}
          castShadow
        >
          <meshStandardMaterial map={woodTexture} color="#854d27" roughness={0.4} />
        </RoundedBox>

        {/* Natural Woven Cane / Rattan Mesh Panel */}
        <mesh position={[0, 0, 0.002]} castShadow receiveShadow>
          <planeGeometry args={[0.39, 0.28]} />
          <meshStandardMaterial
            map={caneTexture}
            color="#ebd8b5"
            roughness={0.75}
            metalness={0.03}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Subtle decorative cane inner beading spline */}
        <mesh position={[0, 0, 0.005]}>
          <ringGeometry args={[0.13, 0.134, 4]} />
          <meshBasicMaterial color="#bfa575" wireframe />
        </mesh>

        {/* Structural rear support upright brackets connecting backrest to frame */}
        {[-0.18, 0.18].map((xB, idx) => (
          <mesh key={`bracket-${idx}`} position={[xB, -0.21, 0.04]} rotation={[0.22, 0, 0]} castShadow>
            <boxGeometry args={[0.028, 0.14, 0.032]} />
            <meshStandardMaterial map={woodTexture} color="#7c4622" roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
