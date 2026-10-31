import { ContactShadows } from '@react-three/drei'

export function Lighting() {
  return (
    <group name="Lighting">
      {/* Soft Architectural Daylight Base */}
      <ambientLight intensity={0.65} color="#fbf9f3" />

      {/* Natural Sky-to-Floor Hemisphere Fill */}
      <hemisphereLight
        color="#ffffff"
        groundColor="#dcdad4"
        intensity={0.55}
      />

      {/* Primary Studio Window Key Light (Soft Shadows) */}
      <directionalLight
        position={[2.8, 3.8, 2.2]}
        intensity={1.35}
        color="#fbf9f3"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-camera-near={0.5}
        shadow-camera-far={10}
        shadow-camera-left={-2.5}
        shadow-camera-right={2.5}
        shadow-camera-top={2.5}
        shadow-camera-bottom={-2.5}
      />

      {/* Subtle Ambient Screen Fill on Desk & Character */}
      <pointLight
        position={[0, 1.15, -0.85]}
        intensity={0.35}
        distance={1.8}
        decay={2}
        color="#f5f3ee"
      />

      {/* Subtle Cool Rim Light from Behind-Right to Separate Character Silhouette */}
      <spotLight
        position={[-1.8, 2.6, 1.6]}
        angle={0.55}
        penumbra={0.9}
        intensity={0.6}
        color="#ffffff"
      />

      {/* Soft Museum-Grade Contact Shadows Anchoring Desk & Chair to Floor */}
      <ContactShadows
        position={[0, 0.005, -0.5]}
        opacity={0.38}
        scale={5.5}
        blur={2.2}
        far={2.5}
        resolution={256}
        color="#30312d"
      />
    </group>
  )
}

