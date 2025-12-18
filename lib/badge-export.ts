// Canvas-based badge export - no external dependencies needed

export interface Badge {
  id: number
  name: string
  description: string
  icon: string
  color: string
}

export async function exportBadge(badge: Badge, username: string, showUsername: boolean) {
  // Create canvas with compact aspect ratio
  const canvas = document.createElement('canvas')
  const width = 600
  const height = 650
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  if (!ctx) return

  // Background with gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#f3e8ff')
  gradient.addColorStop(1, '#fce7f3')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Border container
  const borderPadding = 30
  ctx.strokeStyle = '#d1d5db'
  ctx.lineWidth = 2
  ctx.strokeRect(
    borderPadding,
    borderPadding,
    width - borderPadding * 2,
    height - borderPadding * 2
  )

  // Determine the badge image path and category based on badge name
  let imagePath = ''
  let category = ''
  const badgeName = badge.name.toLowerCase().replace(/\s+/g, '-')
  
  // Check which category the badge belongs to
  if (badge.id <= 10 && ['soft-genius', 'curious-nerd', 'quirky-optimist', 'controlled-chaos', 'quiet-intense', 'playful-thinker', 'overthinking-romantic', 'calm-strategist', 'creative-daydreamer', 'low-key-visionary'].includes(badgeName)) {
    imagePath = `/personality/${badgeName}.png`
    category = 'CORE PERSONALITY'
  } else if (['late-night-thinker', 'night-thinker', 'main-character-energy', 'sonic-explorer', 'comfort-listener', 'chaos-shuffle', 'softcore-melancholic', 'adrenaline-listener', 'intentional-curator', 'nostalgia-trapped', 'emotion-translator'].includes(badgeName)) {
    category = 'MUSIC PERSONALITY'
    // Handle special cases with extra spaces in filenames
    if (badge.name === 'Late-Night Thinker') {
      imagePath = '/music/night-thinker.png'
    } else if (badge.name === 'Nostalgia Trapped') {
      imagePath = '/music/nostalgia-trapped .png'
    } else if (badge.name === 'Adrenaline Listener') {
      imagePath = '/music/adrenaline-listener .png'
    } else {
      imagePath = `/music/${badgeName}.png`
    }
  } else {
    imagePath = `/dating/${badgeName}.png`
    category = 'DATING ENERGY'
  }

  // Category label at the top
  ctx.fillStyle = '#9333ea'
  ctx.font = 'bold 18px "Pixelify Sans", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(category, width / 2, 85)

  // Load and draw badge image
  const img = new window.Image()
  img.crossOrigin = 'anonymous'

  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
    img.src = imagePath
  })

  // Draw circular badge image
  const badgeSize = 280
  const badgeCenterX = width / 2
  const badgeCenterY = 260

  ctx.save()
  ctx.beginPath()
  ctx.arc(badgeCenterX, badgeCenterY, badgeSize / 2, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(
    img,
    badgeCenterX - badgeSize / 2,
    badgeCenterY - badgeSize / 2,
    badgeSize,
    badgeSize
  )
  ctx.restore()

  // Draw border around the circle
  ctx.strokeStyle = '#fbbf24'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(badgeCenterX, badgeCenterY, badgeSize / 2 + 4, 0, Math.PI * 2)
  ctx.stroke()

  // Badge name
  ctx.fillStyle = '#000000'
  ctx.font = 'bold 32px "Pixelify Sans", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(badge.name, badgeCenterX, 440)

  // Description with word wrapping
  ctx.fillStyle = '#4b5563'
  ctx.font = '20px "Pixelify Sans", system-ui, sans-serif'
  const maxWidth = width - 80
  const words = badge.description.split(' ')
  let line = ''
  let y = 490

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' '
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), badgeCenterX, y)
      line = words[i] + ' '
      y += 28
    } else {
      line = testLine
    }
  }
  ctx.fillText(line.trim(), badgeCenterX, y)

  // Username
  if (username) {
    ctx.fillStyle = '#6b7280'
    ctx.font = '16px "Pixelify Sans", system-ui, sans-serif'
    ctx.fillText(`@${username}`, badgeCenterX, height - 90)
  }

  // Footer text - made by
  ctx.fillStyle = '#9ca3af'
  ctx.font = '14px "Pixelify Sans", system-ui, sans-serif'
  ctx.fillText('made by @mistartworks', badgeCenterX, height - 70)

  // Download
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${badge.name.replace(/\s+/g, '-')}-badge.png`
      a.click()
      URL.revokeObjectURL(url)
    }
  })
}

export interface BadgeWithType {
  badge: Badge
  type: 'core' | 'music' | 'dating'
}

export async function exportAllBadges(
  badges: Badge[], 
  username: string, 
  showUsername: boolean,
  badgesWithTypes?: BadgeWithType[],
  summary?: { summary: string[]; traits: string[]; warning: string }
) {
  // Load template image from /public/template.png
  const template = await loadTemplateImage('/template.png')

  const canvas = document.createElement('canvas')
  canvas.width = template.width
  canvas.height = template.height
  const ctx = canvas.getContext('2d')

  if (!ctx) return

  // Draw template as background
  ctx.drawImage(template, 0, 0, canvas.width, canvas.height)

  const centerX = canvas.width / 2
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // If we have badge types and summary, use new layout
  if (badgesWithTypes && summary) {
    // Load badge images
    const badgeImages: { [key: string]: HTMLImageElement } = {}
    
    for (const badgeWithType of badgesWithTypes) {
      const badgeName = badgeWithType.badge.name.toLowerCase().replace(/\s+/g, '-')
      let imagePath = ''
      
      if (badgeWithType.type === 'core') {
        imagePath = `/personality/${badgeName}.png`
      } else if (badgeWithType.type === 'music') {
        if (badgeWithType.badge.name === 'Late-Night Thinker') {
          imagePath = '/music/night-thinker.png'
        } else if (badgeWithType.badge.name === 'Nostalgia Trapped') {
          imagePath = '/music/nostalgia-trapped .png'
        } else if (badgeWithType.badge.name === 'Adrenaline Listener') {
          imagePath = '/music/adrenaline-listener .png'
        } else {
          imagePath = `/music/${badgeName}.png`
        }
      } else {
        imagePath = `/dating/${badgeName}.png`
      }
      
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = imagePath
      })
      badgeImages[badgeWithType.type] = img
    }

    // Triangle formation for badges
    const badgeSize = 180
    const triangleTop = canvas.height * 0.25
    const triangleSpacing = 250
    
    // Top badge (Core Personality)
    const topX = centerX
    const topY = triangleTop
    
    // Bottom left badge (Music Personality)
    const leftX = centerX - triangleSpacing
    const leftY = triangleTop + triangleSpacing * 0.866 // sqrt(3)/2 for equilateral triangle
    
    // Bottom right badge (Dating Energy)
    const rightX = centerX + triangleSpacing
    const rightY = triangleTop + triangleSpacing * 0.866
    
    // Draw badges in triangle formation
    const positions = [
      { x: topX, y: topY, type: 'core' as const },
      { x: leftX, y: leftY, type: 'music' as const },
      { x: rightX, y: rightY, type: 'dating' as const }
    ]
    
    positions.forEach(pos => {
      const img = badgeImages[pos.type]
      if (img) {
        // Draw circular badge
        ctx.save()
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, badgeSize / 2, 0, Math.PI * 2)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(img, pos.x - badgeSize / 2, pos.y - badgeSize / 2, badgeSize, badgeSize)
        ctx.restore()
        
        // Draw border
        ctx.strokeStyle = '#fbbf24'
        ctx.lineWidth = 6
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, badgeSize / 2 + 4, 0, Math.PI * 2)
        ctx.stroke()
      }
    })
    
    // Draw username in the center of triangle
    if (username) {
      const triangleCenterY = triangleTop + (triangleSpacing * 0.866) / 2
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 36px "Pixelify Sans", system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 4
      ctx.strokeText(`@${username}`, centerX, triangleCenterY)
      ctx.fillText(`@${username}`, centerX, triangleCenterY)
    }
    
    // Draw summary box
    const summaryBoxY = leftY + badgeSize / 2 + 60
    const summaryBoxWidth = canvas.width * 0.9
    const summaryBoxX = (canvas.width - summaryBoxWidth) / 2
    const summaryBoxPadding = 40
    
    // Use only summary text, not traits
    const allSummaryText = summary.summary
    
    // Calculate box height
    ctx.font = '20px "Pixelify Sans", system-ui, sans-serif'
    const lineHeight = 32
    const summaryBoxHeight = (allSummaryText.length * lineHeight * 2) + (summaryBoxPadding * 2)
    
    // Draw semi-transparent background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
    ctx.fillRect(summaryBoxX, summaryBoxY, summaryBoxWidth, summaryBoxHeight)
    
    // Draw border around summary box
    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 2
    ctx.strokeRect(summaryBoxX, summaryBoxY, summaryBoxWidth, summaryBoxHeight)
    
    // Draw summary text
    ctx.fillStyle = '#1f2937'
    ctx.textAlign = 'left'
    let textY = summaryBoxY + summaryBoxPadding + 10
    
    allSummaryText.forEach((line, index) => {
      const words = line.split(' ')
      let currentLine = ''
      const maxWidth = summaryBoxWidth - (summaryBoxPadding * 2)
      
      words.forEach(word => {
        const testLine = currentLine + word + ' '
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && currentLine !== '') {
          ctx.fillText(currentLine.trim(), summaryBoxX + summaryBoxPadding, textY)
          currentLine = word + ' '
          textY += lineHeight
        } else {
          currentLine = testLine
        }
      })
      
      if (currentLine.trim() !== '') {
        ctx.fillText(currentLine.trim(), summaryBoxX + summaryBoxPadding, textY)
        textY += lineHeight
      }
    })
  } else {
    // Old layout (fallback)
    // Draw each badge in the middle area
    badges.forEach((badge, index) => {
      const slotWidth = canvas.width / (badges.length + 1)
      const badgeCenterX = slotWidth * (index + 1)
      const badgeCenterY = canvas.height * 0.5
      const radius = Math.min(canvas.width, canvas.height) * 0.08

      // Badge circle
      ctx.beginPath()
      ctx.arc(badgeCenterX, badgeCenterY, radius, 0, Math.PI * 2)
      ctx.fillStyle = badge.color
      ctx.fill()

      // Icon
      ctx.font = `${radius * 0.9}px Arial`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(badge.icon, badgeCenterX, badgeCenterY - radius * 0.15)

      // Badge name
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 24px "Pixelify Sans", system-ui, sans-serif'
      ctx.fillText(badge.name, badgeCenterX, badgeCenterY + radius * 0.9)

      // Description (truncated for space)
      ctx.fillStyle = '#4b5563'
      ctx.font = '14px "Pixelify Sans", system-ui, sans-serif'
      const shortDesc = badge.description.length > 50 
        ? badge.description.substring(0, 47) + '...'
        : badge.description
      ctx.fillText(shortDesc, badgeCenterX, badgeCenterY + radius * 1.3)
    })

    // Optional username toggle
    if (showUsername && username) {
      const footerY = canvas.height - Math.max(40, canvas.height * 0.06)
      ctx.font = '16px "Pixelify Sans", system-ui, sans-serif'
      ctx.fillStyle = '#000000'
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 3
      ctx.strokeText(`@${username}`, centerX, footerY)
      ctx.fillText(`@${username}`, centerX, footerY)
    }
  }

  // Download
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'my-personality-stack.png'
      a.click()
      URL.revokeObjectURL(url)
    }
  })
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = words[0]

  for (let i = 1; i < words.length; i++) {
    const word = words[i]
    const width = ctx.measureText(currentLine + ' ' + word).width
    if (width < maxWidth) {
      currentLine += ' ' + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  lines.push(currentLine)
  return lines
}

async function loadTemplateImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (err) => reject(err)
    img.src = src
  })
}


