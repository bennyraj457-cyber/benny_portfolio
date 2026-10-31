import * as THREE from 'three'

/**
 * Creates high-res canvas texture for an architectural studio wall plaque:
 * "STUDIO 01 // BENNY RAJ"
 * "CREATIVE DEVELOPER & UI/UX"
 */
export function createStudioWallPlaqueTexture(): THREE.CanvasTexture {
  const width = 1024
  const height = 512
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Frosted smoke acrylic / dark bronze plate base
  ctx.fillStyle = '#1c1d1a'
  ctx.fillRect(0, 0, width, height)

  // Brushed hairline texture
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
  for (let x = 0; x < width; x += 3) {
    ctx.fillRect(x, 0, 1, height)
  }

  // Refined double border (matte brass & subtle yellow)
  ctx.strokeStyle = '#d4af37'
  ctx.lineWidth = 4
  ctx.strokeRect(18, 18, width - 36, height - 36)

  ctx.strokeStyle = 'rgba(245, 208, 0, 0.25)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(28, 28, width - 56, height - 56)

  // Corner architectural standoffs / rivets
  const standoffs = [
    [40, 40],
    [width - 40, 40],
    [40, height - 40],
    [width - 40, height - 40],
  ]
  standoffs.forEach(([sx, sy]) => {
    ctx.fillStyle = '#111210'
    ctx.beginPath()
    ctx.arc(sx, sy, 11, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#d4af37'
    ctx.beginPath()
    ctx.arc(sx, sy, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#f5d000'
    ctx.beginPath()
    ctx.arc(sx - 1.5, sy - 1.5, 2.5, 0, Math.PI * 2)
    ctx.fill()
  })

  // Studio Tag
  ctx.font = 'bold 24px "SF Mono", "Fira Code", monospace'
  ctx.fillStyle = '#f5d000'
  ctx.textAlign = 'center'
  ctx.fillText('• STUDIO 01 • PRIVATE LAB •', width / 2, 90)

  // Decorative divider
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(120, 120)
  ctx.lineTo(width - 120, 120)
  ctx.stroke()

  // Main Name: BENNY RAJ
  ctx.font = '900 64px "Inter", -apple-system, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.letterSpacing = '8px'
  ctx.fillText('BENNY RAJ', width / 2, 210)

  // Subtitle: CREATIVE DEVELOPER & DESIGNER
  ctx.font = '600 26px "Inter", -apple-system, sans-serif'
  ctx.fillStyle = '#c5c3bc'
  ctx.letterSpacing = '4px'
  ctx.fillText('CREATIVE DEVELOPER & DESIGNER', width / 2, 275)

  // Bottom spec bar
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
  ctx.beginPath()
  ctx.moveTo(160, 320)
  ctx.lineTo(width - 160, 320)
  ctx.stroke()

  ctx.font = '500 20px "SF Mono", monospace'
  ctx.fillStyle = '#8f8e87'
  ctx.fillText('3D EXPERIENCES • WEB APPS • UI/UX SYSTEMS', width / 2, 375)

  ctx.font = '600 18px "SF Mono", monospace'
  ctx.fillStyle = '#f5d000'
  ctx.fillText('STATUS: AVAILABLE FOR SELECT COMMISSIONS', width / 2, 430)

  const texture = new THREE.CanvasTexture(canvas)
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

