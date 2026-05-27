import { useState, useMemo, useEffect } from 'react'
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

const SLOT_HOURS = 0.5
const EFICIENCIA_INVERSOR = 0.92
const DOD_BATERIA = 0.9

function formatHour(t) {
  const h = Math.floor(t)
  const m = Math.round((t - h) * 60)
  return `${h}:${m.toString().padStart(2, '0')}`
}

export default function DayChart({ consumoPerSlot, solarPerSlot, solarOn, modelOptions = [] }) {
  const [selectedModelId, setSelectedModelId] = useState(modelOptions[0]?.id ?? null)

  useEffect(() => {
    if (modelOptions.length === 0) {
      if (selectedModelId !== null) setSelectedModelId(null)
      return
    }
    if (!modelOptions.find(m => m.id === selectedModelId)) {
      setSelectedModelId(modelOptions[0].id)
    }
  }, [modelOptions, selectedModelId])

  const selectedModel = modelOptions.find(m => m.id === selectedModelId) ?? null

  const data = useMemo(() => {
    const usable = (selectedModel?.capacityKwh ?? 0) * DOD_BATERIA
    const capPerSlot = selectedModel
      ? (selectedModel.maxSolarW * SLOT_HOURS) / 1000
      : Infinity
    let soc = usable
    return consumoPerSlot.map((c, s) => {
      const rawSolar = solarOn ? (solarPerSlot[s] ?? 0) : 0
      const solarEff = Math.min(rawSolar, capPerSlot)
      const consumoDC = c / EFICIENCIA_INVERSOR
      soc = Math.max(0, Math.min(usable, soc + solarEff - consumoDC))
      const socPct = usable > 0 ? (soc / usable) * 100 : 0
      return {
        hour: s * SLOT_HOURS,
        consumoKw: c / SLOT_HOURS,
        solarKw: rawSolar / SLOT_HOURS,
        socPct,
      }
    })
  }, [consumoPerSlot, solarPerSlot, solarOn, selectedModel])

  return (
    <div className="bg-bluetti-card border border-bluetti-border rounded-xl p-4 sm:p-5 h-full flex flex-col">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <h3 className="text-sm font-semibold text-bluetti-cyan uppercase tracking-wider">
          Tu día — consumo {solarOn && 'y generación solar'}
        </h3>
        {modelOptions.length > 0 && (
          <label className="flex items-center gap-1.5 text-[10px] sm:text-xs text-bluetti-cyan/70">
            <span>SOC para:</span>
            <select
              value={selectedModelId ?? ''}
              onChange={e => setSelectedModelId(e.target.value)}
              className="bg-black/30 border border-bluetti-border rounded px-1.5 py-0.5 text-bluetti-cyan focus:outline-none focus:border-bluetti-cyan"
            >
              {modelOptions.map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </label>
        )}
      </div>
      <div className="flex-1 min-h-[256px] -ml-3 sm:-ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: selectedModel ? 25 : 10, left: 0, bottom: 0 }}>
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
              yAxisId="left"
              stroke="#67e8f9"
              tick={{ fill: '#67e8f9', fontSize: 11 }}
              tickFormatter={v => `${v.toFixed(1)}`}
              label={{ value: 'kW', angle: -90, position: 'insideLeft', fill: '#67e8f9', fontSize: 11, dx: 10 }}
            />
            {selectedModel && (
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                stroke="#f87171"
                tick={{ fill: '#f87171', fontSize: 11 }}
                tickFormatter={v => `${v}%`}
              />
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: '#0a1929',
                border: '1px solid #1e3a52',
                borderRadius: '0.5rem',
                color: '#67e8f9',
                fontSize: '12px',
              }}
              labelFormatter={h => formatHour(h)}
              formatter={(value, name) => {
                if (name === 'SOC') return [`${Number(value).toFixed(0)}%`, name]
                return [`${Number(value).toFixed(2)} kW`, name]
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', color: '#67e8f9', paddingTop: 6 }}
              iconType="circle"
            />
            <Area
              yAxisId="left"
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
                yAxisId="left"
                type="monotone"
                dataKey="solarKw"
                name="Solar"
                stroke="#fde047"
                strokeWidth={2}
                fill="url(#solarGradient)"
                isAnimationActive={false}
              />
            )}
            {selectedModel && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="socPct"
                name="SOC"
                stroke="#f87171"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {selectedModel && (
        <p className="text-[10px] text-bluetti-cyan/50 mt-1.5 leading-snug">
          SOC con la configuración actual de {selectedModel.nombre}. Cambiá unidades o baterías en la card para ver el efecto.
        </p>
      )}
    </div>
  )
}
