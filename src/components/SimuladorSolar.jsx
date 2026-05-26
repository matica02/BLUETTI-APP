import { useState, useMemo } from 'react'

const MODELOS = [
  { id: 'es125x',  nombre: 'ES125 X',   maxUnidades: 4, tieneBaterias: false },
  { id: 'ep2000',  nombre: 'EP2000',    maxUnidades: 3, tieneBaterias: true, maxBaterias: 7,  minBaterias: u => u > 1 ? 2 : 4, batNombre: 'B700',   kwhBase: 0,     kwhBat: 7.37   },
  { id: 'ep760',   nombre: 'EP760',     maxUnidades: 1, tieneBaterias: true, maxBaterias: 4,  minBaterias: 2, batNombre: 'B500',   kwhBase: 0,     kwhBat: 4.96   },
  { id: 'apex300', nombre: 'APEX 300',  maxUnidades: 3, tieneBaterias: true, maxBaterias: 6,  minBaterias: 0, batNombre: 'B300K',  kwhBase: 2.76,  kwhBat: 2.76   },
  { id: 'ac200pl', nombre: 'AC200P L',  maxUnidades: 1, tieneBaterias: true, maxBaterias: 2,  minBaterias: 0, batNombre: 'B300K',  kwhBase: 2.304, kwhBat: 2.76   },
  { id: 'rv5',     nombre: 'RV5',       maxUnidades: 1, tieneBaterias: true, maxBaterias: 24, minBaterias: 2, batNombre: 'B4810',  kwhBase: 0,     kwhBat: 4.8    },
]

function resolveMinBat(modelo, unidades) {
  const m = modelo?.minBaterias
  if (m == null) return 0
  return typeof m === 'function' ? m(unidades) : m
}

const MAX_SOLAR_W = {
  es125x: 12000,
  ep2000: 4800,
  ep760:  2400,
  apex300: 1200,
  ac200pl: 1200,
  rv5:    2000,
}

const PANEL_OPTIONS = [200, 400, 500]

function getKwh(modelo, unidades, bateriasArr) {
  if (modelo.id === 'es125x') return unidades * 241
  const totalBat = bateriasArr.reduce((a, b) => a + b, 0)
  return unidades * (modelo.kwhBase || 0) + totalBat * (modelo.kwhBat || 0)
}

function getMaxSolar(modelId, unidades) {
  return MAX_SOLAR_W[modelId] * unidades
}

export default function SimuladorSolar() {
  const [modelId, setModelId]     = useState('apex300')
  const [unidades, setUnidades]   = useState(1)
  const [bateriasPorUnidad, setBateriasPorUnidad] = useState([0])
  const [panelW, setPanelW]       = useState(400)
  const [horasSol, setHorasSol]   = useState(5)

  const modelo = MODELOS.find(m => m.id === modelId)
  const currentBatMin = resolveMinBat(modelo, unidades)

  function handleModelChange(id) {
    const m = MODELOS.find(m => m.id === id)
    const newMin = resolveMinBat(m, 1)
    setModelId(id)
    setUnidades(1)
    setBateriasPorUnidad([newMin])
  }

  function changeUnidades(n) {
    const clamped = Math.max(1, Math.min(modelo.maxUnidades, n))
    const newMin = resolveMinBat(modelo, clamped)
    setUnidades(clamped)
    setBateriasPorUnidad(prev => {
      const grown = clamped > prev.length
        ? [...prev, ...Array(clamped - prev.length).fill(newMin)]
        : prev.slice(0, clamped)
      return grown.map(b => Math.max(newMin, Math.min(modelo.maxBaterias, b)))
    })
  }

  function adjustBat(idx, delta) {
    setBateriasPorUnidad(prev => prev.map((b, i) => {
      if (i !== idx) return b
      return Math.max(currentBatMin, Math.min(modelo.maxBaterias, b + delta))
    }))
  }

  const resultado = useMemo(() => {
    const kwh       = getKwh(modelo, unidades, bateriasPorUnidad)
    const maxSolar  = getMaxSolar(modelId, unidades)
    const efic      = 0.80
    const kwhPanel  = (panelW / 1000) * horasSol * efic
    const paneles   = kwh > 0 ? Math.ceil(kwh / kwhPanel) : 0
    const arrayKw   = (paneles * panelW) / 1000
    const maxPanels = Math.floor(maxSolar / panelW)
    const panelesFinal = Math.min(paneles, maxPanels)
    const arrayFinal   = (panelesFinal * panelW) / 1000
    const recargaHoras = arrayFinal > 0 ? kwh / (arrayFinal * efic) : 0
    const limitado     = paneles > maxPanels

    return { kwh, paneles, arrayKw, panelesFinal, arrayFinal, recargaHoras, limitado, maxPanels, maxSolar }
  }, [modelo, modelId, unidades, bateriasPorUnidad, panelW, horasSol])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuración */}
        <div className="space-y-6">
          {/* Modelo */}
          <div>
            <p className="text-xs font-semibold text-bluetti-cyan uppercase tracking-wider mb-3">Modelo BLUETTI</p>
            <div className="flex flex-wrap gap-2">
              {MODELOS.map(m => (
                <button
                  key={m.id}
                  onClick={() => handleModelChange(m.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                    modelId === m.id
                      ? 'border-bluetti-cyan bg-bluetti-cyan/10 text-bluetti-cyan'
                      : 'border-bluetti-border text-bluetti-cyan hover:border-bluetti-cyan hover:text-bluetti-cyan'
                  }`}
                >
                  {m.nombre}
                </button>
              ))}
            </div>
          </div>

          {/* Unidades */}
          {modelo.maxUnidades > 1 && (
            <div>
              <p className="text-xs font-semibold text-bluetti-cyan uppercase tracking-wider mb-3">
                Unidades en paralelo
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => changeUnidades(unidades - 1)}
                  disabled={unidades <= 1}
                  className="w-8 h-8 rounded-lg bg-bluetti-border hover:bg-red-900/40 text-bluetti-cyan/80 hover:text-red-400 font-bold flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >−</button>
                <span className="text-bluetti-cyan font-bold text-lg w-6 text-center">{unidades}</span>
                <button
                  onClick={() => changeUnidades(unidades + 1)}
                  disabled={unidades >= modelo.maxUnidades}
                  className="w-8 h-8 rounded-lg bg-bluetti-border hover:bg-bluetti-cyan hover:text-bluetti-bg text-bluetti-cyan/80 font-bold flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >+</button>
              </div>
            </div>
          )}

          {/* Baterías */}
          {modelo.tieneBaterias && (
            <div>
              <p className="text-xs font-semibold text-bluetti-cyan uppercase tracking-wider mb-3">
                Baterías {modelo.batNombre}{unidades > 1 ? ' por unidad' : ''}
                {currentBatMin > 0 ? (
                  <span className="text-bluetti-cyan/60 normal-case tracking-normal font-normal ml-1">
                    (mín. {currentBatMin}{unidades > 1 ? ' por unidad' : ''})
                  </span>
                ) : null}
              </p>
              <div className="space-y-2">
                {bateriasPorUnidad.map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {unidades > 1 && (
                      <span className="text-bluetti-cyan/70 text-sm w-20 shrink-0">Unidad {i + 1}</span>
                    )}
                    <button
                      onClick={() => adjustBat(i, -1)}
                      disabled={b <= currentBatMin}
                      className="w-8 h-8 rounded-lg bg-bluetti-border hover:bg-red-900/40 text-bluetti-cyan/80 hover:text-red-400 font-bold flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >−</button>
                    <span className="text-bluetti-cyan font-bold text-lg w-6 text-center">{b}</span>
                    <button
                      onClick={() => adjustBat(i, 1)}
                      disabled={b >= modelo.maxBaterias}
                      className="w-8 h-8 rounded-lg bg-bluetti-border hover:bg-bluetti-cyan hover:text-bluetti-bg text-bluetti-cyan/80 font-bold flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >+</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Panel wattage */}
          <div>
            <p className="text-xs font-semibold text-bluetti-cyan uppercase tracking-wider mb-3">Potencia del panel</p>
            <div className="flex gap-2">
              {PANEL_OPTIONS.map(w => (
                <button
                  key={w}
                  onClick={() => setPanelW(w)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    panelW === w
                      ? 'border-bluetti-cyan bg-bluetti-cyan/10 text-bluetti-cyan'
                      : 'border-bluetti-border text-bluetti-cyan hover:border-bluetti-cyan hover:text-bluetti-cyan'
                  }`}
                >
                  {w}W
                </button>
              ))}
            </div>
          </div>

          {/* Horas de sol */}
          <div>
            <p className="text-xs font-semibold text-bluetti-cyan uppercase tracking-wider mb-3">
              Horas de sol por día
            </p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={2}
                max={8}
                value={horasSol}
                onChange={e => setHorasSol(Number(e.target.value))}
                className="flex-1 accent-bluetti-cyan"
              />
              <span className="text-bluetti-cyan font-bold w-12 text-right">{horasSol}hs</span>
            </div>
            <div className="flex justify-between text-gray-600 text-xs mt-1">
              <span>Nublado (2hs)</span>
              <span>Muy soleado (8hs)</span>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="bg-black/20 rounded-xl p-5 flex flex-col gap-4">
          <div>
            <p className="text-xs text-bluetti-cyan/70 uppercase tracking-wider mb-1">Capacidad a recargar</p>
            <p className="text-3xl font-bold text-white">
              {resultado.kwh.toFixed(2)}
              <span className="text-sm font-normal text-bluetti-cyan ml-1">kWh</span>
            </p>
          </div>

          <div className="border-t border-bluetti-border pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-bluetti-cyan text-sm">Paneles necesarios</span>
              <span className="text-bluetti-cyan text-2xl font-bold">{resultado.panelesFinal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-bluetti-cyan text-sm">Potencia del array</span>
              <span className="text-white font-semibold">{resultado.arrayFinal.toFixed(1)} kW</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-bluetti-cyan text-sm">Tiempo de recarga estimado</span>
              <span className="text-bluetti-lime font-bold text-lg">
                {resultado.recargaHoras.toFixed(1)}hs
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-bluetti-cyan text-sm">Entrada solar máxima del equipo</span>
              <span className="text-bluetti-cyan/80 text-sm">{resultado.maxSolar / 1000} kW</span>
            </div>
          </div>

          {resultado.limitado && (
            <div className="bg-yellow-900/20 border border-yellow-600 rounded-xl p-3 text-sm text-yellow-300">
              La entrada solar del equipo está limitada a {resultado.maxPanels} paneles de {panelW}W ({resultado.maxSolar / 1000} kW). Los paneles adicionales no aportarán carga extra.
            </div>
          )}

          <p className="text-gray-600 text-xs mt-auto">
            Estimación con eficiencia del 80% por pérdidas de conversión e inclinación.
          </p>
        </div>
    </div>
  )
}
