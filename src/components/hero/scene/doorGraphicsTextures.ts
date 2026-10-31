import * as THREE from 'three'

/**
 * Creates architectural wall signage plaque placed to the left of the door,
 * just like the architectural sign visible in the user reference image:
 * "ROOM 01 // BENNY R"
 * "UI/UX DESIGNER & WEB DESIGNER"
 * With QR/Barcode block, room ID, and status indicator.
 */
export function createWallSignTexture(): THREE.CanvasTexture {
  const width = 512
  const height = 280
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Sleek black anodized aluminum surface
  ctx.fillStyle = '#181917'
  ctx.fillRect(0, 0, width, height)

  // Subtle border
  ctx.strokeStyle = '#2e302b'
  ctx.lineWidth = 3
  ctx.strokeRect(10, 10, width - 20, height - 20)

  // Status green / yellow dot
  ctx.fillStyle = '#f5d000'
  ctx.beginPath()
  ctx.arc(36, 42, 6, 0, Math.PI * 2)
  ctx.fill()

  // Status text
  ctx.fillStyle = '#a1a1aa'
  ctx.font = '700 13px "JetBrains Mono", monospace'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('STUDIO 01 • ACTIVE WORKSPACE', 52, 42)

  // Divider
  ctx.strokeStyle = '#30322d'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(30, 70)
  ctx.lineTo(width - 30, 70)
  ctx.stroke()

  // Primary Name
  ctx.fillStyle = '#ffffff'
  ctx.font = '800 36px "Space Grotesk", sans-serif'
  ctx.fillText('BENNY R', 30, 114)

  // Title
  ctx.fillStyle = '#3eb49a' // Matching teal accent
  ctx.font = '700 18px "Space Grotesk", sans-serif'
  ctx.fillText('UI/UX DESIGNER & WEB DESIGNER', 30, 156)

  // Description / Specs
  ctx.fillStyle = '#a1a1aa'
  ctx.font = '500 13px "JetBrains Mono", monospace'
  ctx.fillText('CREATIVE DIRECTION • FRONTEND • 3D', 30, 192)

  // Bottom barcode / architectural registration mark
  ctx.fillStyle = '#ffffff'
  for (let x = 30; x < 180; x += 4) {
    const barW = Math.random() > 0.5 ? 2.5 : 1
    ctx.fillRect(x, 224, barW, 22)
  }

  ctx.fillStyle = '#71717a'
  ctx.font = '600 11px "JetBrains Mono", monospace'
  ctx.fillText('ID: BNY-2026-DES', 200, 235)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

/**
 * Creates glass decal graphic (frosted studio monogram & safety manifestation bands)
 * visible on the rounded glass window pane of the door.
 */
export function createGlassDecalTexture(): THREE.CanvasTexture {
  const width = 512
  const height = 512
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Transparent background
  ctx.clearRect(0, 0, width, height)

  // Subtle frosted safety manifestation dashed line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)'
  ctx.lineWidth = 3
  ctx.setLineDash([14, 10])
  ctx.beginPath()
  ctx.moveTo(40, height / 2 + 60)
  ctx.lineTo(width - 40, height / 2 + 60)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(40, height / 2 + 80)
  ctx.lineTo(width - 40, height / 2 + 80)
  ctx.stroke()
  ctx.setLineDash([])

  // Center frosted architectural monogram icon
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
  ctx.lineWidth = 3.5
  ctx.beginPath()
  ctx.arc(width / 2, height / 2 - 20, 48, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
  ctx.font = '800 36px "Space Grotesk", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('B', width / 2, height / 2 - 18)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}

/**
 * Creates graphic decals for the door bottom / kick-panel:
 * Architectural caution stripes, room coordinates, and entry icons.
 */
export function createDoorBottomDecalTexture(): THREE.CanvasTexture {
  const width = 512
  const height = 256
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, width, height)

  // Subtle dark graphic strip
  ctx.fillStyle = 'rgba(24, 25, 23, 0.25)'
  ctx.fillRect(20, 20, width - 40, 50)

  ctx.fillStyle = '#ffffff'
  ctx.font = '700 16px "JetBrains Mono", monospace'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('ZONE: DESIGN & ARCHITECTURE', 36, 45)

  // Electric yellow warning accent badge
  ctx.fillStyle = '#f5d000'
  ctx.fillRect(width - 110, 30, 75, 30)

  ctx.fillStyle = '#181917'
  ctx.font = '800 13px "JetBrains Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText('ROOM 01', width - 72.5, 45)

  // Bottom technical grid marks
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(20, 100)
  ctx.lineTo(width - 20, 100)
  ctx.stroke()

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'
  ctx.font = '500 12px "JetBrains Mono", monospace'
  ctx.textAlign = 'left'
  ctx.fillText('SPEC // LAB-CLEAN-ROOM AESTHETIC', 24, 130)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}

