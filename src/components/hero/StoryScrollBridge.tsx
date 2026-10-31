import { useEffect } from 'react'
import { useStoryScroll } from '@/context/StoryScrollContext'
import { useRoomEntrance } from '@/context/RoomEntranceContext'
import { useWorkspaceFocus } from '@/context/WorkspaceFocusContext'

/**
 * Synchronizes discrete story scroll steps with 3D room entrance and object focus states:
 * Step 0 ('door'): Exit back to door view
 * Step 1 ('room-overview'): Inside room, overview camera
 * Step 2 ('notebook'): Opens About Me notebook
 * Step 3 ('bookshelf'): Opens Skills bookshelf
 * Step 4 ('music-player'): Opens Vintage Gramophone music player
 * Step 5 ('smartphone'): Opens Contact smartphone
 * Step 6 ('wall-art'): Focuses Framed Wall Art gallery
 */
export function StoryScrollBridge() {
  const { currentStep } = useStoryScroll()
  const { stage, handleDoorClick, exitToDoor } = useRoomEntrance()
  const {
    openNotebook,
    openBookshelf,
    openMusicPlayer,
    openSmartphone,
    openWallArt,
    returnToWorkspace,
  } = useWorkspaceFocus()

  useEffect(() => {
    const stepId = currentStep.id

    if (stepId === 'door') {
      returnToWorkspace()
      if (stage !== 'ENTRANCE') {
        exitToDoor()
      }
      return
    }

    // For all steps beyond the door: if currently at door entrance, trigger entrance
    if (stage === 'ENTRANCE') {
      handleDoorClick()
    }

    if (stepId === 'room-overview') {
      returnToWorkspace()
    } else if (stepId === 'notebook') {
      openNotebook()
    } else if (stepId === 'bookshelf') {
      openBookshelf()
    } else if (stepId === 'music-player') {
      openMusicPlayer()
    } else if (stepId === 'smartphone') {
      openSmartphone()
    } else if (stepId === 'wall-art') {
      openWallArt()
    }
  }, [
    currentStep.id,
    stage,
    handleDoorClick,
    exitToDoor,
    openNotebook,
    openBookshelf,
    openMusicPlayer,
    openSmartphone,
    openWallArt,
    returnToWorkspace,
  ])

  return null
}

