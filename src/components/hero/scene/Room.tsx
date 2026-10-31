import { Wall } from './Wall'
import { Floor } from './Floor'
import { Desk } from './Desk'
import { Chair } from './Chair'
// import { Character } from './Character'
import { ComputerSetup } from './ComputerSetup'
import { RoomDoor } from './RoomDoor'

export function Room() {
  return (
    <group name="Room">
      {/* Subtle atmospheric depth fog matching the Stitch surface palette */}
      <fog attach="fog" args={['#f0eee8', 5.5, 13]} />
      <Floor />
      <Wall />
      <Desk />
      <ComputerSetup />
      <Chair />
      <RoomDoor />
      {/* Character removed per user request */}
    </group>
  )
}

