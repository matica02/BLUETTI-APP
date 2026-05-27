const COLORS = [
  '#22d3ee', '#fde047', '#a3e635', '#fb923c', '#f472b6',
  '#c084fc', '#38bdf8', '#fb7185', '#34d399', '#a5b4fc',
]

const MAX_RINGS = 10

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
  if (!agregados || agregados.length === 0) return null

  const groups = groupByName(agregados)
  const visibleGroups = groups.slice(0, MAX_RINGS)
  const hiddenCount = groups.length - visibleGroups.length

  const size = 360
  const cx = size / 2
  const cy = size / 2
  const outerR = 145
  const innerR = 50
  const gap = 2
  const ringWidth = (outerR - innerR - gap * (visibleGroups.length - 1)) / visibleGroups.length

  return (
    <div className="bg-bluetti-card border border-bluetti-border rounded-xl p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-bluetti-cyan uppercase tracking-wider mb-3">
        Reloj de uso 24h
      </h3>

      <div className="flex justify-center">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[360px]" role="img" aria-label="Reloj de uso 24h">
          <circle cx={cx} cy={cy} r={outerR + 2} fill="none" stroke="#1e3a52" strokeWidth={1} />
          <circle cx={cx} cy={cy} r={innerR - 2} fill="none" stroke="#1e3a52" strokeWidth={1} />

          {[0, 3, 6, 9, 12, 15, 18, 21].map(h => {
            const angle = hourToAngle(h)
            const tickStart = polar(cx, cy, outerR + 2, angle)
            const tickEnd = polar(cx, cy, outerR + 10, angle)
            const labelPos = polar(cx, cy, outerR + 22, angle)
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
            const end = polar(cx, cy, outerR + 2, angle)
            const start = polar(cx, cy, innerR - 2, angle)
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
                  const startA = hourToAngle(f.inicio)
                  const endA = f.fin <= f.inicio
                    ? hourToAngle(f.fin + 24)
                    : hourToAngle(f.fin)
                  const opacity = 0.35 + 0.6 * (f.porcentaje / 100)
                  return (
                    <path
                      key={`${i}-${instIdx}-${fIdx}`}
                      d={arcPath(cx, cy, rIn, rOut, startA, endA)}
                      fill={color}
                      fillOpacity={opacity}
                      stroke={color}
                      strokeWidth={0.5}
                    >
                      <title>{g.nombre} · {f.porcentaje}% · {f.inicio}h–{f.fin}h</title>
                    </path>
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
        {hiddenCount > 0 && (
          <span className="text-xs text-bluetti-cyan/50">+{hiddenCount} más</span>
        )}
      </div>
    </div>
  )
}
