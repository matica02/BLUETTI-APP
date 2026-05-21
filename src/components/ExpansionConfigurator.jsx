import { useState, useMemo } from 'react'

const CFG = {
  es125x: {
    paralelo: { min: 1, max: 4 },
    baterias: null,
  },
  rv5: {
    paralelo: null,
    baterias: {
      tipos: [
        { id: 'b4810', nombre: 'B4810', kWh: 4.8, max: 24 },
        { id: 'b300', nombre: 'B300', kWh: 3.072, max: 24 },
      ],
      min: 2,
    },
  },
  ep2000: {
    paralelo: { min: 1, max: 3 },
    baterias: {
      tipos: [{ id: 'b700', nombre: 'B700', kWh: 7.168, max: 7 }],
      min: 4,
    },
  },
  ep760: {
    paralelo: null,
    baterias: {
      tipos: [{ id: 'b500', nombre: 'B500', kWh: 4.96, max: 4 }],
      min: 2,
    },
  },
  apex300: {
    paralelo: { min: 1, max: 3 },
    baterias: {
      tipos: [{ id: 'b300k', nombre: 'B300K', kWh: 3.072, max: 6 }],
      min: 2,
    },
  },
  ac200pl: {
    paralelo: null,
    baterias: {
      tipos: [
        { id: 'b300', nombre: 'B300', kWh: 3.072, max: 2 },
        { id: 'b210p', nombre: 'B210P', kWh: 2.048, max: 2 },
        { id: 'b230', nombre: 'B230', kWh: 2.048, max: 2 },
      ],
      min: 0,
    },
  },
}

function calcTotals(id, unidades, cant, tipoKwh) {
  switch (id) {
    case 'es125x': return { kWh: unidades * 241, kW: unidades * 125 }
    case 'rv5': return { kWh: cant * tipoKwh, kW: 5 }
    case 'ep2000': return { kWh: unidades * cant * 7.168, kW: unidades * 20 }
    case 'ep760': return { kWh: cant * 4.96, kW: 7.6 }
    case 'apex300': return { kWh: unidades * (2.764 + cant * 3.072), kW: unidades * 3.84 }
    case 'ac200pl': return { kWh: 2.304 + cant * tipoKwh, kW: 2.4 }
    default: return { kWh: 0, kW: 0 }
  }
}

function isBase(id, unidades, cant) {
  switch (id) {
    case 'es125x': return unidades === 1
    case 'rv5': return cant === 2
    case 'ep2000': return unidades === 1 && cant === 4
    case 'ep760': return cant === 2
    case 'apex300': return unidades === 1 && cant === 2
    case 'ac200pl': return cant === 0
    default: return true
  }
}

function fmtKwh(v) { return v >= 10 ? v.toFixed(1) : v.toFixed(2) }
function fmtKw(v) { return v >= 100 ? v.toFixed(0) : v.toFixed(1) }

export default function ExpansionConfigurator({ product }) {
  const cfg = CFG[product.id]

  const [unidades, setUnidades] = useState(cfg?.paralelo?.min ?? 1)
  const [tipoBat, setTipoBat] = useState(cfg?.baterias?.tipos[0]?.id ?? null)
  const [cantBat, setCantBat] = useState(cfg?.baterias?.min ?? 0)

  const tipoSel = cfg?.baterias?.tipos.find(t => t.id === tipoBat)
  const { kWh, kW } = useMemo(
    () => cfg ? calcTotals(product.id, unidades, cantBat, tipoSel?.kWh ?? 0) : { kWh: 0, kW: 0 },
    [cfg, product.id, unidades, cantBat, tipoSel]
  )

  if (!cfg) return null

  const enBase = isBase(product.id, unidades, cantBat)

  function handleTipoBat(nuevoId) {
    const nuevoTipo = cfg.baterias.tipos.find(t => t.id === nuevoId)
    setTipoBat(nuevoId)
    if (cantBat > nuevoTipo.max) setCantBat(nuevoTipo.max)
  }

  return (
    <div className="bg-bluetti-card border border-bluetti-border rounded-2xl p-6 mb-12">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          ⚡ Configurador de Sistema
        </h2>
        {enBase && (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-bluetti-cyan/10 text-bluetti-cyan border border-bluetti-cyan/30">
            Configuración Base
          </span>
        )}
      </div>

      <div className="space-y-6 mb-8">
        {cfg.paralelo && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-bluetti-cyan">Unidades en paralelo</span>
              <span className="text-bluetti-cyan font-bold">
                {unidades} unidad{unidades > 1 ? 'es' : ''}
              </span>
            </div>
            <input
              type="range"
              min={cfg.paralelo.min}
              max={cfg.paralelo.max}
              value={unidades}
              onChange={e => setUnidades(Number(e.target.value))}
              className="w-full accent-bluetti-cyan"
            />
            {cfg.paralelo.nota && (
              <p className="text-xs text-bluetti-cyan/70 mt-1">{cfg.paralelo.nota}</p>
            )}
          </div>
        )}

        {cfg.baterias && cfg.baterias.tipos.length > 1 && (
          <div>
            <p className="text-sm text-bluetti-cyan mb-3">Tipo de batería</p>
            <div className="flex flex-wrap gap-2">
              {cfg.baterias.tipos.map(tipo => (
                <button
                  key={tipo.id}
                  onClick={() => handleTipoBat(tipo.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    tipoBat === tipo.id
                      ? 'bg-bluetti-cyan/20 border-bluetti-cyan text-bluetti-cyan'
                      : 'border-bluetti-border text-bluetti-cyan hover:border-gray-500'
                  }`}
                >
                  {tipo.nombre} · {tipo.kWh} kWh
                </button>
              ))}
            </div>
          </div>
        )}

        {cfg.baterias && tipoSel && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-bluetti-cyan">
                Baterías {tipoSel.nombre}
                {cfg.baterias.min > 0 ? ` (mín. ${cfg.baterias.min})` : ''}
              </span>
              <span className="text-bluetti-cyan font-bold">
                {cantBat} unidad{cantBat !== 1 ? 'es' : ''}
              </span>
            </div>
            <input
              type="range"
              min={cfg.baterias.min}
              max={tipoSel.max}
              value={cantBat}
              onChange={e => setCantBat(Number(e.target.value))}
              className="w-full accent-bluetti-cyan"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/30 rounded-xl p-4 border border-bluetti-border">
          <p className="text-xs text-bluetti-cyan/70 uppercase tracking-wider mb-1">Capacidad Total</p>
          <p className="text-bluetti-lime text-2xl font-bold">
            {fmtKwh(kWh)}
            <span className="text-sm font-normal text-bluetti-cyan ml-1">kWh</span>
          </p>
        </div>
        <div className="bg-black/30 rounded-xl p-4 border border-bluetti-border">
          <p className="text-xs text-bluetti-cyan/70 uppercase tracking-wider mb-1">Potencia Máxima</p>
          <p className="text-bluetti-cyan text-2xl font-bold">
            {fmtKw(kW)}
            <span className="text-sm font-normal text-bluetti-cyan ml-1">kW</span>
          </p>
        </div>
      </div>
    </div>
  )
}
