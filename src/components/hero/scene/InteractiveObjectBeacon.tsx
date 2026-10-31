import { type ReactNode } from 'react'
import { Html } from '@react-three/drei'

export interface InteractiveObjectBeaconProps {
  /** 3D local offset where the indicator badge floats */
  position?: [number, number, number]
  /** Short primary label text, e.g. "ABOUT ME" */
  label: string
  /** Very small sub-note, e.g. "Click to open notebook" */
  note: string
  /** Material icon or emoji character */
  icon: string | ReactNode
  /** Whether the parent object is hovered */
  isHovered: boolean
  /** Whether this object or another object is currently open */
  isOpen: boolean
  /** Whether any other experience is open (which hides all indicators) */
  isAnyObjectOpen?: boolean
  /** Custom distance scale factor for Drei Html (default 2.4) */
  distanceFactor?: number
}

/**
 * Universal ambient & hover interactive 3D beacon indicator.
 * Displays a pulse ring + subtle icon badge in the workspace,
 * and seamlessly expands to reveal the small note when hovered.
 */
export function InteractiveObjectBeacon({
  position = [0, 0.15, 0],
  label,
  note,
  icon,
  isHovered,
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
      <div
        className={`group flex items-center transition-all duration-300 transform -translate-y-1 ${
          isHovered
            ? 'scale-105 opacity-100 shadow-[0_8px_24px_rgba(245,208,0,0.35)]'
            : 'scale-90 opacity-80 hover:opacity-100'
        }`}
      >
        <div className="flex items-center gap-2 rounded-full border border-[#f5d000]/60 bg-[#161714]/95 px-2.5 py-1 backdrop-blur-md shadow-lg transition-colors duration-200">
          {/* Subtle breathing glowing icon dot */}
          <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-[#f5d000] text-[#161714] text-[11px] font-bold shadow-sm">
            {!isHovered && (
              <span className="absolute inset-0 rounded-full bg-[#f5d000] animate-ping opacity-40" />
            )}
            <span className="relative z-10 flex items-center justify-center leading-none">
              {icon}
            </span>
          </div>

          {/* Label and Small Note */}
          <div className="flex flex-col text-left pr-1">
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="font-mono text-[10px] font-bold tracking-wider text-[#f5d000] uppercase whitespace-nowrap">
                {label}
              </span>
            </div>
            {/* Very small secondary note */}
            <span
              className={`font-sans text-[9px] tracking-normal leading-tight text-[#dcdad4] whitespace-nowrap transition-all duration-200 ${
                isHovered ? 'max-h-4 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              {note}
            </span>
          </div>
        </div>
      </div>
    </Html>
  )
}

