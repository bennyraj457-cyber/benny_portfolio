import { useEffect, useRef } from 'react'
import { useStoryScroll } from '@/context/StoryScrollContext'
import { useRoomEntrance } from '@/context/RoomEntranceContext'
import { useWorkspaceFocus } from '@/context/WorkspaceFocusContext'
import { STORY_STEPS, type StoryStepId } from '@/data/storySteps'

/**
 * Synchronizes discrete story steps with 3D room entrance and object focus states:
 * Step 0 ('door'): Exit back to door view
 * Step 1 ('room-overview'): Inside room, overview camera
 * Step 2 ('notebook'): Opens About Me notebook
 * Step 3 ('bookshelf'): Opens Skills bookshelf
 * Step 4 ('music-player'): Opens Vintage Gramophone music player
 * Step 5 ('smartphone'): Opens Contact smartphone
 * Step 6 ('wall-art'): Focuses Framed Wall Art gallery
 * Step 7 ('wall-note'): Focuses Studio Notice wall note
 */
export function StoryScrollBridge() {
  const { currentStep, currentStepIndex, goToStep } = useStoryScroll()
  const { stage, handleDoorClick, exitToDoor } = useRoomEntrance()
  const {
    activeObject,
    openNotebook,
    openBookshelf,
    openMusicPlayer,
    openSmartphone,
    openWallArt,
    openWallNote,
    openBikeShowroom,
    returnToWorkspace,
  } = useWorkspaceFocus()

  const lastDrivenStepRef = useRef<StoryStepId>(currentStep.id)

  // 1. When currentStep changes via Next/Prev/Dot click, drive the 3D scene
  useEffect(() => {
    const stepId = currentStep.id
    lastDrivenStepRef.current = stepId

    if (stepId === 'door') {
      returnToWorkspace()
      if (stage !== 'ENTRANCE' && stage !== 'EXITING_ROOM') {
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
    } else if (stepId === 'bike-showroom') {
      openBikeShowroom()
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
    } else if (stepId === 'wall-note') {
      openWallNote()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep.id])

  // 2. When user manually clicks the 3D door or interactive 3D objects, sync the step index so Next/Prev stay in order
  useEffect(() => {
    if (stage === 'DOOR_OPENING' && currentStep.id === 'door') {
      const overviewIdx = STORY_STEPS.findIndex((s) => s.id === 'room-overview')
      if (overviewIdx !== -1) goToStep(overviewIdx)
      return
    }

    if (stage === 'EXITING_ROOM' && currentStep.id !== 'door') {
      goToStep(0)
      return
    }

    if (stage === 'WORKSPACE') {
      let targetStepId: StoryStepId = 'room-overview'
      if (activeObject === 'bike-showroom') targetStepId = 'bike-showroom'
      else if (activeObject === 'about-me-notebook') targetStepId = 'notebook'
      else if (activeObject === 'bookshelf') targetStepId = 'bookshelf'
      else if (activeObject === 'music-player') targetStepId = 'music-player'
      else if (activeObject === 'contact-smartphone') targetStepId = 'smartphone'
      else if (activeObject === 'wall-art') targetStepId = 'wall-art'
      else if (activeObject === 'wall-note') targetStepId = 'wall-note'

      if (targetStepId !== currentStep.id) {
        const idx = STORY_STEPS.findIndex((s) => s.id === targetStepId)
        if (idx !== -1 && idx !== currentStepIndex) {
          goToStep(idx)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, activeObject])

  return null
}

