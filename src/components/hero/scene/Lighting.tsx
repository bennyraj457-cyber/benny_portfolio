import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { useStudioLighting } from '@/context/StudioLightingContext'

export function Lighting() {
  const { isNightMode } = useStudioLighting()

  // References to smoothly transition light values
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const hemiRef = useRef<THREE.HemisphereLight>(null)
  const sunDirRef = useRef<THREE.DirectionalLight>(null)
  const screenFillRef = useRef<THREE.PointLight>(null)
  const rimSpotRef = useRef<THREE.SpotLight>(null)

  // Night Mode target colors and intensities
  const targetAmbientColor = useMemoColor(isNightMode ? '#1a1f2c' : '#fbf9f3')
  const targetAmbientIntensity = isNightMode ? 0.22 : 0.65

  const targetHemiSkyColor = useMemoColor(isNightMode ? '#222d42' : '#ffffff')
  const targetHemiGroundColor = useMemoColor(isNightMode ? '#10141d' : '#dcdad4')
  const targetHemiIntensity = isNightMode ? 0.18 : 0.55

  const targetSunColor = useMemoColor(isNightMode ? '#3f5982' : '#fbf9f3')
  const targetSunIntensity = isNightMode ? 0.15 : 1.35

  const targetScreenIntensity = isNightMode ? 0.85 : 0.35
  const targetScreenColor = useMemoColor(isNightMode ? '#a0c4ff' : '#f5f3ee')

  useFrame((_, delta) => {
    const rate = 4 // smooth transition speed

    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.damp(ambientRef.current.intensity, targetAmbientIntensity, rate, delta)
      ambientRef.current.color.lerp(targetAmbientColor, delta * rate)
    }

    if (hemiRef.current) {
      hemiRef.current.intensity = THREE.MathUtils.damp(hemiRef.current.intensity, targetHemiIntensity, rate, delta)
      hemiRef.current.color.lerp(targetHemiSkyColor, delta * rate)
      hemiRef.current.groundColor.lerp(targetHemiGroundColor, delta * rate)
    }

    if (sunDirRef.current) {
      sunDirRef.current.intensity = THREE.MathUtils.damp(sunDirRef.current.intensity, targetSunIntensity, rate, delta)
      sunDirRef.current.color.lerp(targetSunColor, delta * rate)
    }

    if (screenFillRef.current) {
      screenFillRef.current.intensity = THREE.MathUtils.damp(screenFillRef.current.intensity, targetScreenIntensity, rate, delta)
      screenFillRef.current.color.lerp(targetScreenColor, delta * rate)
    }

    if (rimSpotRef.current) {
      const targetRim = isNightMode ? 0.25 : 0.6
      rimSpotRef.current.intensity = THREE.MathUtils.damp(rimSpotRef.current.intensity, targetRim, rate, delta)
    }
  })

  return (
    <group name="Lighting">
      {/* Dynamic Base Ambient (Day: warm cream, Night: deep midnight blue) */}
      <ambientLight ref={ambientRef} intensity={0.65} color="#fbf9f3" />

      {/* Sky-to-Floor Hemisphere Fill */}
      <hemisphereLight
        ref={hemiRef}
        color="#ffffff"
        groundColor="#dcdad4"
        intensity={0.55}
      />

      {/* Primary Studio Key Light (Day: bright sunlight through window, Night: moon/sky glow) */}
      <directionalLight
        ref={sunDirRef}
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

      {/* Monitor Screen Dynamic Fill Glow (Bright & cool-blue in midnight dev mode) */}
      <pointLight
        ref={screenFillRef}
        position={[0, 1.15, -0.85]}
        intensity={0.35}
        distance={2.2}
        decay={2}
        color="#f5f3ee"
      />

      {/* Rim Light from Behind-Right to Separate Silhouette */}
      <spotLight
        ref={rimSpotRef}
        position={[-1.8, 2.6, 1.6]}
        angle={0.55}
        penumbra={0.9}
        intensity={0.6}
        color="#ffffff"
      />

      {/* Soft Museum-Grade Contact Shadows Anchoring Desk & Chair to Floor */}
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={isNightMode ? 0.35 : 0.6}
        scale={10}
        blur={2.2}
        far={3.5}
        color="#15171a"
      />
    </group>
  )
}

function useMemoColor(hex: string) {
  const ref = useRef<THREE.Color>(new THREE.Color(hex))
  ref.current.set(hex)
  return ref.current
}
