import { useState, useMemo } from 'react'

const ELECTRODOMESTICOS = [
  { id: 'heladera', nombre: 'Heladera', watts: 150 },
  { id: 'aire', nombre: 'Aire acondicionado (split 3000 frigs.)', watts: 900 },
  { id: 'lavarropas', nombre: 'Lavarropas', watts: 500 },
  { id: 'microondas', nombre: 'Microondas', watts: 1000 },
  { id: 'tv', nombre: 'TV 55"', watts: 120 },
  { id: 'pc', nombre: 'Computadora + monitor', watts: 200 },
  { id: 'led', nombre: 'Iluminación LED (10 luces)', watts: 100 },
  { id: 'bomba', nombre: 'Bomba de agua', watts: 750 },
  { id: 'wifi', nombre: 'Router WiFi', watts: 15 },
  { id: 'celular', nombre: 'Cargador de celular', watts: 10 },
  { id: 'heladera_comercial', nombre: 'Heladera comercial', watts: 400 },
  { id: 'herramientas', nombre: 'Herramientas eléctricas', watts: 800 },
]

const MODELOS = [
  { id: 'es125x', nombre: 'ES125 X' },
  { id: 'ep2000', nombre: 'EP2000' },
  { id: 'ep760', nombre: 'EP760' },
  { id: 'apex300', nombre: 'APEX 300' },
  { id: 'ac200pl', nombre: 'AC200P L' },
  { id: 'rv5', nombre: 'RV5' },
]

const BASE = {
  es125x: { kWh: 241, kW: 125 },
  rv5: { kWh: 0, kW: 5 },
  ep2000: { kWh: 2 * 7.168, kW: 10.5 },
  ep760: { kWh: 4.96, kW: 7.6 },
  apex300: { kWh: 2.764, kW: 3.84 },
  ac200pl: { kWh: 2.304, kW: 2.4 },
}

// Returns { kWh, kW, unidades, baterias, tipo } or null if insufficient
function findMinConfig(modelId, needKwh, needKw) {
  const sat = (kWh, kW) => kWh >= needKwh && kW >= needKw

  switch (modelId) {
    case 'es125x': {
      for (let u = 1; u <= 4; u++) {
        const kWh = u * 241, kW = u * 125
        if (sat(kWh, kW)) return { kWh, kW, unidades: u, baterias: null, tipo: null }
      }
      return null
    }
    case 'rv5': {
      // Use B4810 (4.8 kWh, max 6) — highest capacity per slot
      if (5 < needKw) return null
      for (let b = 0; b <= 24; b++) {
        const kWh = b * 4.8
        if (kWh >= needKwh) return { kWh, kW: 5, unidades: 1, baterias: b, tipo: 'B4810' }
      }
      return null
    }
    case 'ep2000': {
      for (let u = 1; u <= 3; u++) {
        for (let b = 2; b <= 7; b++) {
          const kWh = u * b * 7.168, kW = u * 10.5
          if (sat(kWh, kW)) return { kWh, kW, unidades: u, baterias: b, tipo: 'B700' }
        }
      }
      return null
    }
    case 'ep760': {
      if (7.6 < needKw) return null
      for (let b = 1; b <= 4; b++) {
        const kWh = b * 4.96
        if (kWh >= needKwh) return { kWh, kW: 7.6, unidades: 1, baterias: b, tipo: 'B500' }
      }
      return null
    }
    case 'apex300': {
      if (3.84 < needKw) return null
      for (let b = 0; b <= 6; b++) {
        const kWh = 2.764 + b * 3.072
        if (kWh >= needKwh) return { kWh, kW: 3.84, unidades: 1, baterias: b, tipo: 'B300K' }
      }
      return null
    }
    case 'ac200pl': {
      if (2.4 < needKw) return null
      // Use B300 (3.072 kWh) — highest capacity per slot
      for (let b = 0; b <= 2; b++) {
        const kWh = 2.304 + b * 3.072
        if (kWh >= needKwh) return { kWh, kW: 2.4, unidades: 1, baterias: b, tipo: 'B300' }
      }
      return null
    }
    default: return null
  }
}

function isBaseResult(modelId, r) {
  if (!r) return false
  switch (modelId) {
    case 'es125x': return r.unidades === 1
    case 'rv5': return r.baterias === 0
    case 'ep2000': return r.unidades === 1 && r.baterias === 2
    case 'ep760': return r.baterias === 1
    case 'apex300': return r.baterias === 0
    case 'ac200pl': return r.baterias === 0
    default: return false
  }
}

function configLabel(modelId, r) {
  if (!r) return ''
  switch (modelId) {
    case 'es125x':
      return r.unidades === 1 ? '1 unidad' : `${r.unidades} unidades en paralelo`
    case 'rv5':
      return r.baterias === 0 ? 'Sin baterías externas' : `${r.baterias} bater${r.baterias === 1 ? 'ía' : 'ías'} ${r.tipo}`
    case 'ep2000':
      return `${r.unidades} unidad${r.unidades > 1 ? 'es' : ''} + ${r.baterias} baterías ${r.tipo} por unidad`
    case 'ep760':
      return `${r.baterias} bater${r.baterias === 1 ? 'ía' : 'ías'} ${r.tipo}`
    case 'apex300':
      return r.baterias === 0 ? 'Solo unidad base' : `${r.baterias} baterías ${r.tipo}`
    case 'ac200pl':
      return r.baterias === 0 ? 'Solo unidad base' : `${r.baterias} bater${r.baterias === 1 ? 'ía' : 'ías'} ${r.tipo}`
    default: return ''
  }
}

export default function Calculadora() {
  const [agregados, setAgregados] = useState([])

  function agregar(electro) {
    if (agregados.find(e => e.id === electro.id)) return
    setAgregados(prev => [...prev, { ...electro, horas: 4 }])
  }

  function quitar(id) {
    setAgregados(prev => prev.filter(e => e.id !== id))
  }

  function setHoras(id, horas) {
    setAgregados(prev => prev.map(e => e.id === id ? { ...e, horas } : e))
  }

  const totalKwh = useMemo(() =>
    agregados.reduce((sum, e) => sum + (e.watts * e.horas) / 1000, 0),
    [agregados]
  )

  const totalWatts = useMemo(() =>
    agregados.reduce((sum, e) => sum + e.watts, 0),
    [agregados]
  )

  const idsAgregados = new Set(agregados.map(e => e.id))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">Calculadora de Autonomía</h1>
      <p className="text-gray-400 text-sm mb-8">
        Seleccioná los electrodomésticos que querés alimentar y calculá cuánto tiempo te dura cada modelo BLUETTI.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna izquierda */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Electrodomésticos disponibles
          </h2>
          <div className="space-y-2">
            {ELECTRODOMESTICOS.map(e => {
              const yaAgregado = idsAgregados.has(e.id)
              return (
                <div
                  key={e.id}
                  className="flex items-center justify-between bg-bluetti-card border border-bluetti-border rounded-xl px-4 py-3"
                >
                  <div>
                    <span className="text-white text-sm">{e.nombre}</span>
                    <span className="text-gray-500 text-xs ml-2">{e.watts}W</span>
                  </div>
                  <button
                    onClick={() => agregar(e)}
                    disabled={yaAgregado}
                    className={`w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center transition-all ${
                      yaAgregado
                        ? 'bg-bluetti-cyan/20 text-bluetti-cyan cursor-default'
                        : 'bg-bluetti-border hover:bg-bluetti-cyan hover:text-bluetti-bg text-gray-300'
                    }`}
                  >
                    {yaAgregado ? '✓' : '+'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Mi instalación
            </h2>

            {agregados.length === 0 ? (
              <div className="bg-bluetti-card border border-dashed border-bluetti-border rounded-xl p-8 text-center">
                <p className="text-gray-500 text-sm">
                  Agregá electrodomésticos de la lista para calcular la autonomía.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {agregados.map(e => (
                  <div
                    key={e.id}
                    className="bg-bluetti-card border border-bluetti-border rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-medium">{e.nombre}</span>
                      <button
                        onClick={() => quitar(e.id)}
                        className="text-gray-600 hover:text-red-400 text-lg leading-none transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={1}
                        max={24}
                        value={e.horas}
                        onChange={ev => setHoras(e.id, Number(ev.target.value))}
                        className="flex-1 accent-bluetti-cyan"
                      />
                      <span className="text-bluetti-cyan text-sm font-bold w-16 text-right">
                        {e.horas}h/día
                      </span>
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {e.watts}W × {e.horas}h = {((e.watts * e.horas) / 1000).toFixed(2)} kWh/día
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Panel de resultados */}
          <div className="bg-bluetti-card border border-bluetti-border rounded-xl p-5">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-gray-400 text-sm">Consumo total estimado</span>
              <span className="text-bluetti-cyan text-3xl font-bold">
                {totalKwh.toFixed(2)}
                <span className="text-sm font-normal text-gray-400 ml-1">kWh/día</span>
              </span>
            </div>
            {totalWatts > 0 && (
              <div className="flex items-baseline justify-between mb-5">
                <span className="text-gray-400 text-sm">Potencia simultánea</span>
                <span className="text-gray-300 text-lg font-semibold">
                  {(totalWatts / 1000).toFixed(2)}
                  <span className="text-sm font-normal text-gray-500 ml-1">kW</span>
                </span>
              </div>
            )}

            {totalKwh === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                Agregá electrodomésticos para ver qué modelos BLUETTI te convienen.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                  Configuración recomendada por modelo
                </p>
                {MODELOS.map(modelo => {
                  const result = findMinConfig(modelo.id, totalKwh, totalWatts / 1000)
                  const base = isBaseResult(modelo.id, result)
                  const horas = result ? ((result.kWh / totalKwh) * 24).toFixed(1) : null

                  if (!result) {
                    return (
                      <div key={modelo.id} className="rounded-lg border border-red-500 bg-red-900/20 px-4 py-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white text-sm font-medium">{modelo.nombre}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-900 text-red-300">
                            Insuficiente
                          </span>
                        </div>
                        <p className="text-xs text-red-400/80">
                          Insuficiente incluso en configuración máxima
                        </p>
                      </div>
                    )
                  }

                  if (base) {
                    return (
                      <div key={modelo.id} className="rounded-lg border border-green-500 bg-green-900/20 px-4 py-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white text-sm font-medium">{modelo.nombre}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-900 text-green-300">
                            Base suficiente
                          </span>
                        </div>
                        <p className="text-xs text-bluetti-cyan">{configLabel(modelo.id, result)}</p>
                        <p className="text-xs text-bluetti-lime mt-1">
                          Autonomía estimada: {horas} horas
                        </p>
                      </div>
                    )
                  }

                  return (
                    <div key={modelo.id} className="rounded-lg border border-yellow-500 bg-yellow-900/20 px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-sm font-medium">{modelo.nombre}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-yellow-900 text-yellow-300">
                          Requiere expansión
                        </span>
                      </div>
                      <p className="text-xs text-bluetti-cyan">
                        Config. recomendada: {configLabel(modelo.id, result)}
                      </p>
                      <p className="text-xs text-bluetti-lime mt-1">
                        Autonomía estimada: {horas} horas
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
