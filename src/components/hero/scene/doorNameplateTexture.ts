import * as THREE from 'three'

/**
 * Creates ultra-sharp high-DPI architectural brass/matte-black door nameplate:
 * "BENNY R"
 * "UI/UX Designer & Web Designer"
 */
export function createDoorNameplateTexture(): THREE.CanvasTexture {
  const width = 1024
  const height = 360
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Deep matte obsidian/charcoal base (#161714)
  ctx.fillStyle = '#161714'
  ctx.fillRect(0, 0, width, height)

  // Subtle metallic plate brushed texture
  ctx.fillStyle = 'rgba(255, 255, 255, 0.025)'
  for (let x = 0; x < width; x += 4) {
    ctx.fillRect(x, 0, 1.5, height)
  }

  // Outer Electric Yellow Accent Border
  ctx.strokeStyle = '#f5d000'
  ctx.lineWidth = 6
  ctx.strokeRect(20, 20, width - 40, height - 40)

  // Inner Fine Metallic Border
  ctx.strokeStyle = 'rgba(245, 208, 0, 0.35)'
  ctx.lineWidth = 2
  ctx.strokeRect(32, 32, width - 64, height - 64)

  // Four Corner Screw Mounts / Brass Rivets
  const rivetOffset = 38
  const rivetRadius = 6
  const rivets = [
    [rivetOffset, rivetOffset],
    [width - rivetOffset, rivetOffset],
    [rivetOffset, height - rivetOffset],
    [width - rivetOffset, height - rivetOffset],
  ]

  rivets.forEach(([rx, ry]) => {
    ctx.fillStyle = '#f5d000'
    ctx.beginPath()
    ctx.arc(rx, ry, rivetRadius, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#161714'
    ctx.beginPath()
    ctx.arc(rx, ry, 2.5, 0, Math.PI * 2)
    ctx.fill()
  })

  // Studio Tag at Top Center
  ctx.fillStyle = '#f5d000'
  ctx.font = '800 20px "JetBrains Mono", monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('• STUDIO 01 •', width / 2, 70)

  // Primary Name: BENNY R (Bold, High Contrast White)
  ctx.fillStyle = '#ffffff'
  ctx.font = '900 68px "Space Grotesk", sans-serif'
  ctx.fillText('BENNY R', width / 2, 145)

  // Subtle Accent Divider Line
  ctx.strokeStyle = '#f5d000'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(width / 2 - 140, 200)
  ctx.lineTo(width / 2 + 140, 200)
  ctx.stroke()

  ctx.fillStyle = '#f5d000'
  ctx.beginPath()
  ctx.arc(width / 2, 200, 4, 0, Math.PI * 2)
  ctx.fill()

  // Subtitle / Title: UI/UX Designer & Web Designer
  ctx.fillStyle = '#dcdad4'
  ctx.font = '700 32px "Space Grotesk", sans-serif'
  ctx.fillText('UI/UX DESIGNER & WEB DESIGNER', width / 2, 255)

  // Footer Tagline
  ctx.fillStyle = '#8e8b82'
  ctx.font = '600 18px "JetBrains Mono", monospace'
  ctx.fillText('WORKSPACE & CREATIVE LAB', width / 2, 298)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

