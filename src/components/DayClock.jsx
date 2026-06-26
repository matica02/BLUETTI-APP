import { useState, useRef, useCallback } from 'react'

const COLORS = [
  '#22d3ee', '#fde047', '#a3e635', '#fb923c', '#f472b6',
  '#c084fc', '#38bdf8', '#fb7185', '#34d399', '#a5b4fc',
]

function polar(cx, cy, r, angle) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
}

function hourToAngle(h) {
  return -Math.PI / 2 + (h / 24) * 2 * Math.PI
}

function arcPath(cx, cy, rInner, rOuter, startA, endA) {
  let delta = endA - startA
  if (delta >= Math.PI * 2 - 0.001) {
    delta = Math.PI * 2 - 0.001
    endA = startA + delta
  }
  const largeArc = delta > Math.PI ? 1 : 0
  const so = polar(cx, cy, rOuter, startA)
  const eo = polar(cx, cy, rOuter, endA)
  const si = polar(cx, cy, rInner, endA)
  const ei = polar(cx, cy, rInner, startA)
  return [
    `M ${so.x} ${so.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${eo.x} ${eo.y}`,
    `L ${si.x} ${si.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${ei.x} ${ei.y}`,
    'Z',
  ].join(' ')
}

function groupByName(agregados) {
  const order = []
  const map = {}
  agregados.forEach(e => {
    if (!map[e.nombre]) {
      map[e.nombre] = { nombre: e.nombre, watts: e.watts, instances: [] }
      order.push(e.nombre)
    }
    map[e.nombre].instances.push(e)
  })
  return order.map(n => map[n])
}

export default function DayClock({ agregados }) {
  const [hovered, setHovered] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)
  const leaveTimer = useRef(null)

  if (!agregados || agregados.length === 0) return null

  const groups = groupByName(agregados)
  const visibleGroups = groups

  const size = 360
  const cx = size / 2
  const cy = size / 2
  const outerR = 148
  const innerR = 44
  const gap = 1
  const ringWidth = (outerR - innerR - gap * (visibleGroups.length - 1)) / visibleGroups.length

  function handlePointerMove(e) {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleEnter = useCallback((data) => {
    clearTimeout(leaveTimer.current)
    setHovered(data)
  }, [])

  const handleLeave = useCallback(() => {
    leaveTimer.current = setTimeout(() => setHovered(null), 120)
  }, [])

  // Tooltip content
  const tt = hovered
  const ttCantidad = tt ? tt.group.instances.length : 0
  const ttWattsTotal = tt ? tt.group.watts * ttCantidad * (tt.franja.porcentaje / 100) : 0

  // Clamp tooltip so it doesn't overflow the container
  const TT_W = 200
  const TT_H = 96
  let ttLeft = mousePos.x + 14
  let ttTop = mousePos.y - 14
  if (containerRef.current) {
    const cw = containerRef.current.offsetWidth
    const ch = containerRef.current.offsetHeight
    if (ttLeft + TT_W > cw - 4) ttLeft = mousePos.x - TT_W - 10
    if (ttTop + TT_H > ch - 4) ttTop = mousePos.y - TT_H - 4
    if (ttTop < 4) ttTop = 4
    if (ttLeft < 4) ttLeft = 4
  }

  return (
    <div
      ref={containerRef}
      className="bg-bluetti-card border border-bluetti-border rounded-xl p-4 sm:p-5 relative"
      onPointerMove={handlePointerMove}
    >
      <h3 className="text-sm font-semibold text-bluetti-cyan uppercase tracking-wider mb-3">
        Reloj de uso 24h
      </h3>

      <div className="flex justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full" role="img" aria-label="Reloj de uso 24h">
          <circle cx={cx} cy={cy} r={outerR + 3} fill="none" stroke="#1e3a52" strokeWidth={1} />
          <circle cx={cx} cy={cy} r={innerR - 3} fill="none" stroke="#1e3a52" strokeWidth={1} />

          {[0, 3, 6, 9, 12, 15, 18, 21].map(h => {
            const angle = hourToAngle(h)
            const tickStart = polar(cx, cy, outerR + 3, angle)
            const tickEnd = polar(cx, cy, outerR + 11, angle)
            const labelPos = polar(cx, cy, outerR + 23, angle)
            return (
              <g key={h}>
                <line
                  x1={tickStart.x} y1={tickStart.y}
                  x2={tickEnd.x} y2={tickEnd.y}
                  stroke="#67e8f9" strokeOpacity={0.6} strokeWidth={1}
                />
                <text
                  x={labelPos.x} y={labelPos.y}
                  fill="#67e8f9" fontSize="11"
                  textAnchor="middle" dominantBaseline="middle"
                >{h}h</text>
              </g>
            )
          })}

          {[0, 6, 12, 18].map(h => {
            const angle = hourToAngle(h)
            const end = polar(cx, cy, outerR + 3, angle)
            const start = polar(cx, cy, innerR - 3, angle)
            return (
              <line
                key={`grid-${h}`}
                x1={start.x} y1={start.y}
                x2={end.x} y2={end.y}
                stroke="#1e3a52" strokeOpacity={0.5} strokeWidth={1}
                strokeDasharray="2 3"
              />
            )
          })}

          {visibleGroups.map((g, i) => {
            const color = COLORS[i % COLORS.length]
            const rOut = outerR - i * (ringWidth + gap)
            const rIn = rOut - ringWidth

            return g.instances.flatMap((e, instIdx) =>
              e.franjas
                .filter(f => f.porcentaje > 0)
                .map((f, fIdx) => {
                  const key = `${i}-${instIdx}-${fIdx}`
                  const isHov = hovered?.key === key
                  const startA = hourToAngle(f.inicio)
                  const endA = f.fin <= f.inicio
                    ? hourToAngle(f.fin + 24)
                    : hourToAngle(f.fin)
                  const opacity = 0.35 + 0.6 * (f.porcentaje / 100)
                  return (
                    <path
                      key={key}
                      d={arcPath(cx, cy, rIn, rOut, startA, endA)}
                      fill={color}
                      fillOpacity={isHov ? Math.min(1, opacity + 0.25) : opacity}
                      stroke={color}
                      strokeWidth={isHov ? 2 : 0.5}
                      strokeOpacity={isHov ? 0.9 : 1}
                      style={{
                        transformOrigin: `${cx}px ${cy}px`,
                        transform: isHov ? 'scale(1.06)' : 'scale(1)',
                        transition: 'transform 0.12s ease, fill-opacity 0.1s ease',
                        cursor: 'pointer',
                      }}
                      onPointerEnter={() => handleEnter({ key, group: g, instance: e, franja: f, color })}
                      onPointerLeave={handleLeave}
                    />
                  )
                })
            )
          })}

          <text x={cx} y={cy - 6} fill="#67e8f9" fontSize="11" textAnchor="middle" opacity={0.7}>24 h</text>
          <text x={cx} y={cy + 10} fill="#67e8f9" fontSize="10" textAnchor="middle" opacity={0.5}>uso diario</text>
        </svg>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3">
        {visibleGroups.map((g, i) => (
          <div key={g.nombre} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="text-xs text-bluetti-cyan/80 truncate max-w-[140px]" title={g.nombre}>
              {g.nombre}
            </span>
          </div>
        ))}
      </div>

      {hovered && (
        <div
          className="absolute pointer-events-none z-30 bg-bluetti-bg border rounded-xl px-3 py-2.5 shadow-xl text-xs leading-relaxed"
          style={{
            left: ttLeft,
            top: ttTop,
            width: TT_W,
            borderColor: hovered.color + '60',
          }}
        >
          <p className="font-bold mb-1 truncate" style={{ color: hovered.color }}>
            {hovered.group.nombre}
            {ttCantidad > 1 && <span className="font-normal text-white/60 ml-1">×{ttCantidad}</span>}
          </p>
          <p className="text-white/70">
            <span className="text-white/90 font-semibold">{hovered.franja.inicio}h – {hovered.franja.fin}h</span>
            <span className="mx-1.5 text-white/30">·</span>
            {hovered.franja.porcentaje}% activo
          </p>
          <p className="text-white/70 mt-0.5">
            {hovered.group.watts} W × {ttCantidad} = <span className="text-white/90 font-semibold">{hovered.group.watts * ttCantidad} W</span>
            <span className="text-white/50 ml-1">(~{ttWattsTotal.toFixed(0)} W promedio)</span>
          </p>
        </div>
      )}
    </div>
  )
}
