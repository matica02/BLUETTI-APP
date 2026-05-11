import { useState, useMemo } from 'react'

const MODELOS = [
  { id: 'es125x',  nombre: 'ES125 X',   maxUnidades: 4, tieneBaterias: false },
  { id: 'ep2000',  nombre: 'EP2000',    maxUnidades: 3, tieneBaterias: true, maxBaterias: 7,  minBaterias: 2, batNombre: 'B700',   kwhBase: 0,     kwhBat: 7.168  },
  { id: 'ep760',   nombre: 'EP760',     maxUnidades: 1, tieneBaterias: true, maxBaterias: 4,  minBaterias: 2, batNombre: 'B500',   kwhBase: 0,     kwhBat: 4.96   },
  { id: 'apex300', nombre: 'APEX 300',  maxUnidades: 3, tieneBaterias: true, maxBaterias: 6,  batNombre: 'B300K',  kwhBase: 2.764, kwhBat: 3.072  },
  { id: 'ac200pl', nombre: 'AC200P L',  maxUnidades: 1, tieneBaterias: true, maxBaterias: 2,  batNombre: 'B300',   kwhBase: 2.304, kwhBat: 3.072  },
  { id: 'rv5',     nombre: 'RV5',       maxUnidades: 1, tieneBaterias: true, maxBaterias: 24, minBaterias: 2, batNombre: 'B4810',  kwhBase: 0,     kwhBat: 4.8    },
]

const MAX_SOLAR_W = {
  es125x: 12000,
  ep2000: 4800,
  ep760:  2400,
  apex300: 1200,
  ac200pl: 1200,
  rv5:    2000,
}

const PANEL_OPTIONS = [200, 400, 500]

function getKwh(modelo, unidades, baterias) {
  if (modelo.id === 'es125x') return unidades * 241
  if (modelo.id === 'rv5')    return baterias * 4.8
  if (modelo.id === 'ep2000') return unidades * baterias * 7.168
  return unidades * (modelo.kwhBase + baterias * modelo.kwhBat)
}

function getMaxSolar(modelId, unidades) {
  return MAX_SOLAR_W[modelId] * unidades
}

export default function SimuladorSolar() {
  const [modelId, setModelId]     = useState('apex300')
  const [unidades, setUnidades]   = useState(1)
  const [baterias, setBaterias]   = useState(0)
  const [panelW, setPanelW]       = useState(400)
  const [horasSol, setHorasSol]   = useState(5)

  const modelo = MODELOS.find(m => m.id === modelId)

  function handleModelChange(id) {
    const m = MODELOS.find(m => m.id === id)
    setModelId(id)
    setUnidades(1)
    setBaterias(m?.minBaterias ?? 0)
  }

  const resultado = useMemo(() => {
    const kwh       = getKwh(modelo, unidades, baterias)
    const maxSolar  = getMaxSolar(modelId, unidades)
    const efic      = 0.80
    const kwhPanel  = (panelW / 1000) * horasSol * efic
    const paneles   = Math.ceil(kwh / kwhPanel)
    const arrayKw   = (paneles * panelW) / 1000
    const maxPanels = Math.floor(maxSolar / panelW)
    const panelesFinal = Math.min(paneles, maxPanels)
    const arrayFinal   = (panelesFinal * panelW) / 1000
    const recargaHoras = kwh / (arrayFinal * efic)
    const limitado     = paneles > maxPanels

    return { kwh, paneles, arrayKw, panelesFinal, arrayFinal, recargaHoras, limitado, maxPanels, maxSolar }
  }, [modelo, modelId, unidades, baterias, panelW, horasSol])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuración */}
        <div className="space-y-6">
          {/* Modelo */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Modelo BLUETTI</p>
            <div className="flex flex-wrap gap-2">
              {MODELOS.map(m => (
                <button
                  key={m.id}
                  onClick={() => handleModelChange(m.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                    modelId === m.id
                      ? 'border-bluetti-cyan bg-bluetti-cyan/10 text-bluetti-cyan'
                      : 'border-bluetti-border text-gray-400 hover:border-bluetti-cyan hover:text-bluetti-cyan'
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
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Unidades en paralelo
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setUnidades(u => Math.max(1, u - 1))}
                  className="w-8 h-8 rounded-lg bg-bluetti-border hover:bg-red-900/40 text-gray-300 hover:text-red-400 font-bold flex items-center justify-center transition-all"
                >−</button>
                <span className="text-bluetti-cyan font-bold text-lg w-6 text-center">{unidades}</span>
                <button
                  onClick={() => setUnidades(u => Math.min(modelo.maxUnidades, u + 1))}
                  className="w-8 h-8 rounded-lg bg-bluetti-border hover:bg-bluetti-cyan hover:text-bluetti-bg text-gray-300 font-bold flex items-center justify-center transition-all"
                >+</button>
              </div>
            </div>
          )}

          {/* Baterías */}
          {modelo.tieneBaterias && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Baterías {modelo.batNombre} por unidad
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBaterias(b => Math.max(modelo.minBaterias ?? 0, b - 1))}
                  className="w-8 h-8 rounded-lg bg-bluetti-border hover:bg-red-900/40 text-gray-300 hover:text-red-400 font-bold flex items-center justify-center transition-all"
                >−</button>
                <span className="text-bluetti-cyan font-bold text-lg w-6 text-center">{baterias}</span>
                <button
                  onClick={() => setBaterias(b => Math.min(modelo.maxBaterias, b + 1))}
                  className="w-8 h-8 rounded-lg bg-bluetti-border hover:bg-bluetti-cyan hover:text-bluetti-bg text-gray-300 font-bold flex items-center justify-center transition-all"
                >+</button>
              </div>
            </div>
          )}

          {/* Panel wattage */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Potencia del panel</p>
            <div className="flex gap-2">
              {PANEL_OPTIONS.map(w => (
                <button
                  key={w}
                  onClick={() => setPanelW(w)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    panelW === w
                      ? 'border-bluetti-cyan bg-bluetti-cyan/10 text-bluetti-cyan'
                      : 'border-bluetti-border text-gray-400 hover:border-bluetti-cyan hover:text-bluetti-cyan'
                  }`}
                >
                  {w}W
                </button>
              ))}
            </div>
          </div>

          {/* Horas de sol */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
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
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Capacidad a recargar</p>
            <p className="text-3xl font-bold text-white">
              {resultado.kwh.toFixed(2)}
              <span className="text-sm font-normal text-gray-400 ml-1">kWh</span>
            </p>
          </div>

          <div className="border-t border-bluetti-border pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Paneles necesarios</span>
              <span className="text-bluetti-cyan text-2xl font-bold">{resultado.panelesFinal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Potencia del array</span>
              <span className="text-white font-semibold">{resultado.arrayFinal.toFixed(1)} kW</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Tiempo de recarga estimado</span>
              <span className="text-bluetti-lime font-bold text-lg">
                {resultado.recargaHoras.toFixed(1)}hs
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Entrada solar máxima del equipo</span>
              <span className="text-gray-300 text-sm">{resultado.maxSolar / 1000} kW</span>
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
