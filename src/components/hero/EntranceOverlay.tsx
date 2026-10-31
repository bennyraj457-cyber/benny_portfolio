import { useRoomEntrance } from '@/context/RoomEntranceContext'

export function EntranceOverlay() {
  const { stage, isReducedMotion } = useRoomEntrance()

  // If already in workspace, don't show entrance overlay elements
  if (stage === 'WORKSPACE') {
    return null
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex flex-col justify-between p-6 sm:p-10 select-none">
      {/* 1. Header Studio Badge */}
      <div className="flex items-center justify-start w-full">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f5d000] shadow-[0_0_8px_#f5d000]" />
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-[#1b1c19] bg-white/70 backdrop-blur-md px-3 py-1 rounded-full border border-black/10">
            STUDIO 01 // ENTRANCE
          </span>
        </div>
      </div>

      {/* 2. Minimal Bottom Hint */}
      <div className="text-center w-full">
        <span className="font-mono text-[11px] tracking-[0.2em] text-[#71717a] uppercase bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-black/5">
          {stage === 'ENTRANCE'
            ? 'CLICK THE DOOR OR HANDLE TO ENTER'
            : isReducedMotion
            ? 'ENTERING WORKSPACE'
            : 'OPENING DOOR & ENTERING ROOM...'}
        </span>
      </div>
    </div>
  )
}
