import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 500
const PARTICLE_COUNT_MOBILE = 150
const MOBILE_BREAKPOINT = 768
const MAX_DIST = 130
const MOUSE_RADIUS = 160
const SPEED = 0.4

// small lightning-bolt shape (like the classic "zap" icon), centered on origin
const BOLT_POINTS = [
  [1, -10], [-9, 2], [0, 2], [-1, 10], [9, -2], [0, -2],
]

function drawBolt(ctx, x, y, scale, color) {
  ctx.beginPath()
  BOLT_POINTS.forEach(([px, py], i) => {
    const dx = x + px * scale
    const dy = y + py * scale
    if (i === 0) ctx.moveTo(dx, dy)
    else ctx.lineTo(dx, dy)
  })
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}

export default function ParticleBackground() {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouse = e => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouse)

    const count = window.innerWidth < MOBILE_BREAKPOINT ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * SPEED,
      vy: (Math.random() - 0.5) * SPEED,
      r: Math.random() * 1.5 + 1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        drawBolt(ctx, p.x, p.y, p.r * 0.25, 'rgba(0, 180, 216, 0.55)')
      }

      // lines between nearby particles — brighter when close to the mouse
      const mx = mouse.current.x
      const my = mouse.current.y
      const nearMouse = particles.map(p => {
        const dx = p.x - mx
        const dy = p.y - my
        return Math.sqrt(dx * dx + dy * dy) < MOUSE_RADIUS
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            const t = 1 - dist / MAX_DIST
            const near = nearMouse[i] || nearMouse[j]
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = near ? `rgba(0, 220, 255, ${0.6 * t})` : `rgba(0, 180, 216, ${0.18 * t})`
            ctx.lineWidth = near ? 1.1 : 0.7
            ctx.stroke()
          }
        }

        if (!nearMouse[i]) continue

        // line to mouse
        const dx = particles[i].x - mx
        const dy = particles[i].y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MAX_DIST * 1.4) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(mx, my)
          ctx.strokeStyle = `rgba(0, 220, 255, ${0.35 * (1 - dist / (MAX_DIST * 1.4))})`
          ctx.lineWidth = 0.9
          ctx.stroke()
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animRef.current)
      } else {
        animRef.current = requestAnimationFrame(draw)
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    if (!document.hidden) {
      animRef.current = requestAnimationFrame(draw)
    }

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
