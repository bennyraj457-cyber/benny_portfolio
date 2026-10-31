import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import * as THREE from 'three'

const MODEL_PATH = '/models/male-character.glb'

const X_AXIS = new THREE.Vector3(1, 0, 0)
const Y_AXIS = new THREE.Vector3(0, 1, 0)
const Z_AXIS = new THREE.Vector3(0, 0, 1)

interface CharacterErrorBoundaryProps {
  children: ReactNode
}

interface CharacterErrorBoundaryState {
  hasError: boolean
}

class CharacterErrorBoundary extends Component<
  CharacterErrorBoundaryProps,
  CharacterErrorBoundaryState
> {
  constructor(props: CharacterErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): CharacterErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}

interface SeatedBones {
  spine?: THREE.Object3D
  chest?: THREE.Object3D
  neck?: THREE.Object3D
  head?: THREE.Object3D
  forearmLeft?: THREE.Object3D
  forearmRight?: THREE.Object3D
  handLeft?: THREE.Object3D
  handRight?: THREE.Object3D
  fingerLeft?: THREE.Object3D
  fingerRight?: THREE.Object3D
  baseQuats: Map<string, THREE.Quaternion>
}

function rotateBoneLocal(
  bone: THREE.Object3D | undefined,
  axis: THREE.Vector3,
  angle: number,
) {
  if (!bone) return
  const q = new THREE.Quaternion().setFromAxisAngle(axis, angle)
  bone.quaternion.multiply(q)
}

function GLBCharacterModel() {
  const groupRef = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(MODEL_PATH)

  // Deep-clone the rigged scene with SkeletonUtils so SkinnedMesh & Bones stay bound cleanly
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { actions } = useAnimations(animations, groupRef)

  // Inspect animations: only play if an explicit sitting/typing clip exists
  useEffect(() => {
    const sittingClip = animations.find((clip) =>
      /sit|seat|work|type|typing|desk/i.test(clip.name),
    )
    if (sittingClip && actions[sittingClip.name]) {
      actions[sittingClip.name]?.reset().fadeIn(0.3).play()
    }
  }, [animations, actions])

  // Apply seated working posture to the 33-joint skeleton and preserve original textures/materials
  const seatedBones = useMemo<SeatedBones>(() => {
    // Enable shadow casting/receiving on all skinned meshes while preserving original materials & embedded textures
    clonedScene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.frustumCulled = false
      }
    })

    const pelvis = clonedScene.getObjectByName('pelvis_01')
    const spine = clonedScene.getObjectByName('spine_02')
    const chest = clonedScene.getObjectByName('chest_03')
    const neck = clonedScene.getObjectByName('neck_04')
    const head = clonedScene.getObjectByName('head_05')

    const upperArmLeft = clonedScene.getObjectByName('upper_arm_left_07')
    const forearmLeft = clonedScene.getObjectByName('forearm_left_08')
    const handLeft = clonedScene.getObjectByName('hand_left_09')
    const fingerLeft = clonedScene.getObjectByName('f_middle01L_012')

    const upperArmRight = clonedScene.getObjectByName('upper_arm_right_014')
    const forearmRight = clonedScene.getObjectByName('forearm_right_015')
    const handRight = clonedScene.getObjectByName('hand_right_016')
    const fingerRight = clonedScene.getObjectByName('f_middle01R_019')

    const thighLeft = clonedScene.getObjectByName('thigh_left_020')
    const shinLeft = clonedScene.getObjectByName('shinL_021')
    const footLeft = clonedScene.getObjectByName('foot_left_022')

    const thighRight = clonedScene.getObjectByName('thigh_right_023')
    const shinRight = clonedScene.getObjectByName('shinR_024')
    const footRight = clonedScene.getObjectByName('foot_right_025')

    // Only apply procedural seated rig posture if no embedded sitting animation clip is present
    const hasSittingClip = animations.some((clip) =>
      /sit|seat|work|type|typing|desk/i.test(clip.name),
    )

    if (!hasSittingClip) {
      // 1. Align pelvis with the office chair seat cushion
      if (pelvis) {
        pelvis.position.set(0, 0.03, 0.72)
      }

      // 2. Bend hips (thighs forward horizontally) and knees (shins down to the floor)
      rotateBoneLocal(thighLeft, X_AXIS, -1.42)
      rotateBoneLocal(thighRight, X_AXIS, -1.42)
      rotateBoneLocal(thighLeft, Z_AXIS, 0.12)
      rotateBoneLocal(thighRight, Z_AXIS, -0.12)

      rotateBoneLocal(shinLeft, X_AXIS, 1.48)
      rotateBoneLocal(shinRight, X_AXIS, 1.48)

      rotateBoneLocal(footLeft, X_AXIS, -0.08)
      rotateBoneLocal(footRight, X_AXIS, -0.08)

      // 3. Natural ergonomic spine, chest, and neck posture facing the monitor
      rotateBoneLocal(spine, X_AXIS, 0.14)
      rotateBoneLocal(chest, X_AXIS, 0.12)
      rotateBoneLocal(neck, X_AXIS, -0.22)

      // 4. Left arm & hand resting flat on the mechanical keyboard (x = -0.11..-0.02, y = 0.77..0.82, z = -0.82)
      rotateBoneLocal(upperArmLeft, X_AXIS, 0.25)
      rotateBoneLocal(upperArmLeft, Z_AXIS, -0.05)
      rotateBoneLocal(forearmLeft, X_AXIS, 1.32)
      rotateBoneLocal(forearmLeft, Z_AXIS, -0.26)
      rotateBoneLocal(handLeft, X_AXIS, 0.25)
      rotateBoneLocal(handLeft, Y_AXIS, -0.45)
      rotateBoneLocal(fingerLeft, X_AXIS, 0.05)

      // 5. Right arm & hand resting directly on the wireless mouse on the desk (x = 0.19..0.24, y = 0.78..0.84, z = -0.82)
      rotateBoneLocal(upperArmRight, X_AXIS, 0.25)
      rotateBoneLocal(upperArmRight, Z_AXIS, 0.02)
      rotateBoneLocal(forearmRight, X_AXIS, 1.32)
      rotateBoneLocal(forearmRight, Z_AXIS, -0.14)
      rotateBoneLocal(handRight, X_AXIS, 0.25)
      rotateBoneLocal(handRight, Y_AXIS, 0.45)
      rotateBoneLocal(fingerRight, X_AXIS, 0.05)
    }

    const baseQuats = new Map<string, THREE.Quaternion>()
    ;[
      spine,
      chest,
      neck,
      head,
      forearmLeft,
      forearmRight,
      handLeft,
      handRight,
      fingerLeft,
      fingerRight,
    ].forEach((b) => {
      if (b) baseQuats.set(b.name, b.quaternion.clone())
    })

    return {
      spine,
      chest,
      neck,
      head,
      forearmLeft,
      forearmRight,
      handLeft,
      handRight,
      fingerLeft,
      fingerRight,
      baseQuats,
    }
  }, [clonedScene, animations])

  // Subtle lifelike working animation on the skeleton:
  // - Left hand actively typing across the mechanical keyboard
  // - Right hand gripping and gliding/clicking the mouse on the desk
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const {
      chest,
      head,
      forearmLeft,
      forearmRight,
      handLeft,
      handRight,
      fingerLeft,
      fingerRight,
      baseQuats,
    } = seatedBones

    if (chest) {
      const base = baseQuats.get(chest.name)
      if (base) {
        const breath = new THREE.Quaternion().setFromAxisAngle(
          X_AXIS,
          Math.sin(t * 1.8) * 0.014,
        )
        chest.quaternion.copy(base).multiply(breath)
      }
    }

    if (head) {
      const base = baseQuats.get(head.name)
      if (base) {
        const scanY = new THREE.Quaternion().setFromAxisAngle(
          Y_AXIS,
          Math.sin(t * 0.7) * 0.075 + Math.cos(t * 0.3) * 0.035,
        )
        const nodX = new THREE.Quaternion().setFromAxisAngle(
          X_AXIS,
          Math.sin(t * 1.3) * 0.02,
        )
        head.quaternion.copy(base).multiply(scanY).multiply(nodX)
      }
    }

    // Left forearm, wrist, and fingers: active keyboard typing cadence
    if (forearmLeft) {
      const base = baseQuats.get(forearmLeft.name)
      if (base) {
        const pitchQ = new THREE.Quaternion().setFromAxisAngle(
          X_AXIS,
          Math.sin(t * 11.5) * 0.024 + Math.cos(t * 7.2) * 0.016,
        )
        const traverseQ = new THREE.Quaternion().setFromAxisAngle(
          Z_AXIS,
          Math.sin(t * 2.4) * 0.035,
        )
        forearmLeft.quaternion.copy(base).multiply(pitchQ).multiply(traverseQ)
      }
    }

    if (handLeft) {
      const base = baseQuats.get(handLeft.name)
      if (base) {
        const wristQ = new THREE.Quaternion().setFromAxisAngle(
          X_AXIS,
          Math.cos(t * 14.0) * 0.04,
        )
        handLeft.quaternion.copy(base).multiply(wristQ)
      }
    }

    if (fingerLeft) {
      const base = baseQuats.get(fingerLeft.name)
      if (base) {
        const keystrokeQ = new THREE.Quaternion().setFromAxisAngle(
          X_AXIS,
          Math.sin(t * 16.0) * 0.08 + Math.cos(t * 11.0) * 0.05,
        )
        fingerLeft.quaternion.copy(base).multiply(keystrokeQ)
      }
    }

    // Right forearm, wrist, and fingers: holding & gliding the mouse on the desk
    if (forearmRight) {
      const base = baseQuats.get(forearmRight.name)
      if (base) {
        // Smooth lateral mouse tracking across the desk pad
        const glideLateral = new THREE.Quaternion().setFromAxisAngle(
          Z_AXIS,
          Math.sin(t * 1.3) * 0.03 + Math.cos(t * 0.7) * 0.02,
        )
        const glideDepth = new THREE.Quaternion().setFromAxisAngle(
          X_AXIS,
          Math.sin(t * 0.9) * 0.012,
        )
        forearmRight.quaternion.copy(base).multiply(glideLateral).multiply(glideDepth)
      }
    }

    if (handRight) {
      const base = baseQuats.get(handRight.name)
      if (base) {
        const microPivot = new THREE.Quaternion().setFromAxisAngle(
          Z_AXIS,
          Math.cos(t * 1.3) * 0.025,
        )
        handRight.quaternion.copy(base).multiply(microPivot)
      }
    }

    if (fingerRight) {
      const base = baseQuats.get(fingerRight.name)
      if (base) {
        // Periodic subtle mouse click pulse
        const clickPulse = Math.pow(Math.max(0, Math.sin(t * 3.2)), 8) * 0.07
        const clickQ = new THREE.Quaternion().setFromAxisAngle(X_AXIS, clickPulse)
        fingerRight.quaternion.copy(base).multiply(clickQ)
      }
    }
  })

  return (
    <group
      ref={groupRef}
      name="Character"
      position={[0, 0, -0.5]}
      rotation={[0, Math.PI, 0]}
      scale={0.78}
      dispose={null}
    >
      <primitive object={clonedScene} />
    </group>
  )
}

export function Character() {
  return (
    <CharacterErrorBoundary>
      <Suspense fallback={null}>
        <GLBCharacterModel />
      </Suspense>
    </CharacterErrorBoundary>
  )
}

useGLTF.preload(MODEL_PATH)
