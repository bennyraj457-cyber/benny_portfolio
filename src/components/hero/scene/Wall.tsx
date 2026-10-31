import { RoundedBox } from '@react-three/drei'
import { InteractiveBookshelf } from './InteractiveBookshelf'
import { PinnedWallNote } from './PinnedWallNote'

const SLAT_POSITIONS = [
  -2.4, -2.28, -2.16, -2.04, -1.92, -1.8, -1.68, -1.56, -1.44, -1.32,
]

export function Wall() {
  return (
    <group name="Wall">
      {/* Main Back Wall - Warm Plaster / Archival Surface */}
      <mesh position={[0, 2.2, -1.45]} receiveShadow>
        <boxGeometry args={[10, 4.6, 0.12]} />
        <meshStandardMaterial
          color="#f0eee8"
          roughness={0.88}
          metalness={0.02}
        />
      </mesh>

      {/* Architectural Baseboard / Skirting Board */}
      <mesh position={[0, 0.06, -1.38]} receiveShadow castShadow>
        <boxGeometry args={[10, 0.12, 0.03]} />
        <meshStandardMaterial
          color="#fbf9f3"
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {/* Recessed Architectural Wall Panel Behind Desk */}
      <mesh position={[0, 1.65, -1.385]} receiveShadow>
        <boxGeometry args={[2.5, 2.5, 0.015]} />
        <meshStandardMaterial
          color="#eae8e2"
          roughness={0.82}
          metalness={0.03}
        />
      </mesh>

      {/* Left Architectural Vertical Fluted Slat Paneling */}
      <group position={[0, 1.75, -1.37]}>
        {SLAT_POSITIONS.map((x) => (
          <mesh key={x} position={[x, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.06, 3.5, 0.04]} />
            <meshStandardMaterial
              color="#dcdad4"
              roughness={0.7}
              metalness={0.06}
            />
          </mesh>
        ))}
      </group>

      {/* Minimalist Framed Architectural Print (Right Side of Wall) */}
      <group position={[1.55, 1.68, -1.37]}>
        {/* Outer Frame (#30312d inverse-surface) */}
        <RoundedBox args={[0.56, 0.74, 0.025]} radius={0.008} smoothness={2} castShadow>
          <meshStandardMaterial color="#30312d" roughness={0.4} metalness={0.2} />
        </RoundedBox>
        {/* Archival Matting (#fbf9f3) */}
        <mesh position={[0, 0, 0.014]}>
          <planeGeometry args={[0.5, 0.68]} />
          <meshStandardMaterial color="#fbf9f3" roughness={0.9} />
        </mesh>
        {/* Minimalist Geometric Study Inside Frame */}
        <mesh position={[0, 0.02, 0.016]}>
          <planeGeometry args={[0.32, 0.44]} />
          <meshStandardMaterial color="#eae8e2" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.02, 0.018]}>
          <circleGeometry args={[0.09, 32]} />
          <meshStandardMaterial color="#30312d" roughness={0.6} />
        </mesh>
        <mesh position={[0.05, -0.05, 0.019]}>
          <circleGeometry args={[0.025, 24]} />
          <meshStandardMaterial color="#f5d000" roughness={0.4} />
        </mesh>
      </group>

      {/* Floating Minimalist Wall Shelf (Top Left Above Desk) with Interactive Bookshelf */}
      <InteractiveBookshelf />

      {/* Realistic 3D Pinned Construction Memo Note on Wall */}
      <PinnedWallNote position={[0.78, 1.84, -1.37]} rotation={[0, 0, 0.045]} />
    </group>
  )
}

