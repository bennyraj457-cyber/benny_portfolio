import { Html } from '@react-three/drei'

export interface InteractiveObjectBeaconProps {
  /** 3D local offset where the indicator dot floats */
  position?: [number, number, number]
  /** Whether the parent object is hovered */
  isHovered?: boolean
  /** Whether this object is currently open/focused */
  isOpen: boolean
  /** Whether any other experience is open (which hides all indicators) */
  isAnyObjectOpen?: boolean
  /** Custom distance scale factor for Drei Html (default 2.4) */
  distanceFactor?: number
}

/**
 * Minimalist, elegant electric-yellow interactive dot indicator.
 * Floats above interactive 3D items with a soft ambient pulse ring,
 * showing visitors that the object is interactive and clickable without any text clutter.
 */
export function InteractiveObjectBeacon({
  position = [0, 0.15, 0],
  isHovered = false,
  isOpen,
  isAnyObjectOpen = false,
  distanceFactor = 2.4,
}: InteractiveObjectBeaconProps) {
  // Hide beacon entirely while any focused object view is active
  if (isAnyObjectOpen || isOpen) return null

  return (
    <Html
      position={position}
      center
      distanceFactor={distanceFactor}
      className="pointer-events-none select-none"
      zIndexRange={[50, 0]}
    >
      <div className="relative flex items-center justify-center">
        {/* Outer ambient radar/breathing pulse ring */}
        <span
          className={`absolute rounded-full bg-[#f5d000] transition-opacity duration-300 ${
            isHovered
              ? 'h-6 w-6 opacity-60 animate-ping'
              : 'h-5 w-5 opacity-40 animate-ping'
          }`}
        />

        {/* Outer soft glowing aura */}
        <span
          className={`absolute rounded-full bg-[#f5d000]/25 transition-all duration-300 ${
            isHovered ? 'h-6 w-6 scale-125' : 'h-4 w-4 scale-100'
          }`}
        />

        {/* Core Electric-Yellow Dot */}
        <span
          className={`relative rounded-full bg-[#f5d000] border border-[#181917]/80 shadow-[0_0_10px_#f5d000] transition-all duration-300 ${
            isHovered ? 'h-3.5 w-3.5 scale-125' : 'h-2.5 w-2.5 scale-100'
          }`}
        />
      </div>
    </Html>
  )
}
