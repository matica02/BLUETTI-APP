import { ComposedChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

const SLOT_HOURS = 0.5

function formatHour(t) {
  const h = Math.floor(t)
  const m = Math.round((t - h) * 60)
  return `${h}:${m.toString().padStart(2, '0')}`
}

export default function DayChart({ consumoPerSlot, solarPerSlot, solarOn }) {
  const data = consumoPerSlot.map((c, s) => ({
    hour: s * SLOT_HOURS,
    consumoKw: c / SLOT_HOURS,
    solarKw: solarOn ? (solarPerSlot[s] ?? 0) / SLOT_HOURS : 0,
  }))

  return (
    <div className="bg-bluetti-card border border-bluetti-border rounded-xl p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-bluetti-cyan uppercase tracking-wider mb-3">
        Tu día — consumo {solarOn && 'y generación solar'}
      </h3>
      <div className="h-64 sm:h-80 -ml-3 sm:-ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="consumoGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fde047" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#fde047" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a52" />
            <XAxis
              dataKey="hour"
              type="number"
              domain={[0, 24]}
              ticks={[0, 3, 6, 9, 12, 15, 18, 21, 24]}
              tickFormatter={h => `${h}h`}
              stroke="#67e8f9"
              tick={{ fill: '#67e8f9', fontSize: 11 }}
            />
            <YAxis
              stroke="#67e8f9"
              tick={{ fill: '#67e8f9', fontSize: 11 }}
              tickFormatter={v => `${v.toFixed(1)}`}
              label={{ value: 'kW', angle: -90, position: 'insideLeft', fill: '#67e8f9', fontSize: 11, dx: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a1929',
                border: '1px solid #1e3a52',
                borderRadius: '0.5rem',
                color: '#67e8f9',
                fontSize: '12px',
              }}
              labelFormatter={h => formatHour(h)}
              formatter={(value, name) => [`${Number(value).toFixed(2)} kW`, name]}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', color: '#67e8f9', paddingTop: 6 }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="consumoKw"
              name="Consumo"
              stroke="#22d3ee"
              strokeWidth={2}
              fill="url(#consumoGradient)"
              isAnimationActive={false}
            />
            {solarOn && (
              <Area
                type="monotone"
                dataKey="solarKw"
                name="Solar"
                stroke="#fde047"
                strokeWidth={2}
                fill="url(#solarGradient)"
                isAnimationActive={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
