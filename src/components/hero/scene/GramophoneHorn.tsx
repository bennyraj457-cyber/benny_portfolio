import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Procedural lathe geometry for a continuous, smooth, scalloped flower petal gramophone bell.
 * Matches the reference image with 8 gently undulating fluted petal ridges and a trumpet flare.
 */
export function createGramophoneFlutedBellGeometry(): THREE.BufferGeometry {
  const radialSegments = 72
  const heightSegments = 36
  const numPetals = 8

  // We build a parametric mesh where the radius at each height level smoothly undulates
  // with cos(numPetals * theta) to produce the scalloped flower bell in the reference image.
  const vertices: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  // Profile curve from narrow throat (v=0) to wide flared flower rim (v=1)
  for (let j = 0; j <= heightSegments; j++) {
    const v = j / heightSegments
    // Exponential bell flare
    const y = v * 0.095
    // Base radius from throat (0.012m) flaring out to 0.076m
    const baseRadius = 0.012 + Math.pow(v, 2.2) * 0.064
    // Scalloped petal amplitude increases near the rim (up to 7.5mm crest/trough)
    const petalAmp = Math.pow(v, 1.8) * 0.0075

    for (let i = 0; i <= radialSegments; i++) {
      const u = i / radialSegments
      const theta = u * Math.PI * 2

      // Petal undulation: 8 gentle flower scallops
      const scallop = Math.cos(numPetals * theta) * petalAmp
      const r = baseRadius + scallop

      const x = Math.cos(theta) * r
      const z = Math.sin(theta) * r

      vertices.push(x, y, z)
      uvs.push(u, v)

      // Initial rough normal (will compute vertex normals cleanly at end)
      normals.push(Math.cos(theta), 0.5, Math.sin(theta))
    }
  }

  // Generate triangle strip indices
  for (let j = 0; j < heightSegments; j++) {
    for (let i = 0; i < radialSegments; i++) {
      const a = j * (radialSegments + 1) + i
      const b = (j + 1) * (radialSegments + 1) + i
      const c = (j + 1) * (radialSegments + 1) + (i + 1)
      const d = j * (radialSegments + 1) + (i + 1)

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return geometry
}

export function GramophoneHorn() {
  const bellGeometry = useMemo(() => createGramophoneFlutedBellGeometry(), [])

  return (
    <group position={[-0.045, 0.18, -0.01]}>
      {/* 1. Vertical Curved Neck Base */}
      <mesh position={[0, 0.035, 0]} castShadow>
        <cylinderGeometry args={[0.011, 0.014, 0.07, 24]} />
        <meshStandardMaterial
          color="#b86940"
          roughness={0.28}
          metalness={0.82}
        />
      </mesh>

      {/* 2. Angled Horn Assembly tilted forward toward listener like the reference */}
      <group position={[0, 0.075, 0.012]} rotation={[0.48, 0, 0]}>
        {/* Continuous 8-Petal Scalloped Flower Gramophone Bell */}
        <mesh geometry={bellGeometry} castShadow receiveShadow>
          <meshStandardMaterial
            color="#c47449"
            roughness={0.24}
            metalness={0.86}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Rolled Brass / Copper Lip at the outer rim */}
        <mesh position={[0, 0.095, 0]}>
          <torusGeometry args={[0.076, 0.0024, 16, 64]} />
          <meshStandardMaterial
            color="#d48255"
            roughness={0.22}
            metalness={0.88}
          />
        </mesh>

        {/* Central Throat Sound Aperture (Dark inner depth) */}
        <mesh position={[0, 0.004, 0]}>
          <circleGeometry args={[0.012, 24]} />
          <meshStandardMaterial color="#1a0d06" roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}

