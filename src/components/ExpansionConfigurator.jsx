import { useState, useMemo } from 'react'

const CFG = {
  es125x: {
    paralelo: { min: 1, max: 4 },
    baterias: null,
  },
  es60: {
    paralelo: { min: 1, max: 6 },
    baterias: null,
  },
  rv5: {
    paralelo: null,
    baterias: {
      tipos: [
        { id: 'b4810', nombre: 'B4810', kWh: 5.12, max: 24 },
      ],
      min: 2,
    },
  },
  ep2000: {
    paralelo: { min: 1, max: 3 },
    baterias: {
      tipos: [{ id: 'b700', nombre: 'B700', kWh: 7.37, max: 7 }],
      min: u => u > 1 ? 4 : 2,
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
      tipos: [{ id: 'b300k', nombre: 'B300K', kWh: 2.76, max: 6 }],
      min: 0,
    },
  },
  ac200pl: {
    paralelo: null,
    baterias: {
      tipos: [
        { id: 'b300k', nombre: 'B300K', kWh: 2.76, max: 2 },
      ],
      min: 0,
    },
  },
}

// Potencia del EP2000 por unidad según cantidad de baterías: 2→10.5kW, 3→15.5kW, 4+→20kW
function ep2000Kw(n) {
  if (n <= 2) return 10.5
  if (n === 3) return 15.5
  return 20
}

function calcTotals(id, unidades, cantArr, tipoKwh) {
  const totalBat = cantArr.reduce((a, b) => a + b, 0)
  switch (id) {
    case 'es125x': return { kWh: unidades * 241, kW: unidades * 125 }
    case 'es60': return { kWh: unidades * 128, kW: unidades * 60 }
    case 'rv5': return { kWh: totalBat * tipoKwh, kW: 5 }
    case 'ep2000': return { kWh: totalBat * 7.37, kW: cantArr.reduce((a, n) => a + ep2000Kw(n), 0) }
    case 'ep760': return { kWh: totalBat * 4.96, kW: 7.6 }
    case 'apex300': return { kWh: unidades * 2.76 + totalBat * 2.76, kW: unidades * 3.84 }
    case 'ac200pl': return { kWh: 2.304 + totalBat * tipoKwh, kW: 2.4 }
    default: return { kWh: 0, kW: 0 }
  }
}

function isBase(id, unidades, cantArr) {
  const allEqual = v => cantArr.every(c => c === v)
  switch (id) {
    case 'es125x': return unidades === 1
    case 'es60': return unidades === 1
    case 'rv5': return allEqual(2)
    case 'ep2000': return unidades === 1 && allEqual(4)
    case 'ep760': return allEqual(2)
    case 'apex300': return unidades === 1 && allEqual(0)
    case 'ac200pl': return allEqual(0)
    default: return true
  }
}

function getConfigBadge(id, unidades, cantArr) {
  if (id === 'ep2000') {
    if (unidades > 1) {
      return { label: 'Expandido', cls: 'bg-bluetti-lime/10 text-bluetti-lime border border-bluetti-lime/30', tooltip: null }
    }
    const bats = cantArr[0] ?? 2
    if (bats === 2) {
      return {
        label: 'Potencia Limitada',
        cls: 'bg-yellow-400/10 text-yellow-300 border border-yellow-400/30',
        tooltip: 'Con 2 baterías B700 la potencia máxima es 10.5 kW.\nAgregá 1 batería para subir a 15.5 kW, o 2 para llegar a 20 kW (Configuración Base).',
      }
    }
    if (bats === 3) {
      return {
        label: 'Potencia Limitada',
        cls: 'bg-yellow-400/10 text-yellow-300 border border-yellow-400/30',
        tooltip: 'Con 3 baterías B700 la potencia máxima es 15.5 kW.\nAgregá 1 batería más para alcanzar los 20 kW (Configuración Base).',
      }
    }
    if (bats === 4) {
      return { label: 'Configuración Base', cls: 'bg-bluetti-cyan/10 text-bluetti-cyan border border-bluetti-cyan/30', tooltip: null }
    }
    return { label: 'Expandido', cls: 'bg-bluetti-lime/10 text-bluetti-lime border border-bluetti-lime/30', tooltip: null }
  }
  if (isBase(id, unidades, cantArr)) {
    return { label: 'Configuración Base', cls: 'bg-bluetti-cyan/10 text-bluetti-cyan border border-bluetti-cyan/30', tooltip: null }
  }
  return null
}

function resolveBatMin(cfg, unidades) {
  if (!cfg?.baterias) return 0
  const m = cfg.baterias.min
  return typeof m === 'function' ? m(unidades) : m
}

function fmtKwh(v) { return v >= 10 ? v.toFixed(1) : v.toFixed(2) }
function fmtKw(v) { return v >= 100 ? v.toFixed(0) : v.toFixed(1) }

export default function ExpansionConfigurator({ product }) {
  const cfg = CFG[product.id]

  const baseUnidades = cfg?.paralelo?.min ?? 1
  const baseMin = resolveBatMin(cfg, baseUnidades)
  const [unidades, setUnidades] = useState(baseUnidades)
  const [tipoBat, setTipoBat] = useState(cfg?.baterias?.tipos[0]?.id ?? null)
  const [cantBatPorUnidad, setCantBatPorUnidad] = useState(
    Array.from({ length: baseUnidades }, () => baseMin)
  )

  const currentBatMin = resolveBatMin(cfg, unidades)

  function changeUnidades(n) {
    const newMin = resolveBatMin(cfg, n)
    setUnidades(n)
    setCantBatPorUnidad(prev => {
      const grown = n > prev.length
        ? [...prev, ...Array(n - prev.length).fill(newMin)]
        : prev.slice(0, n)
      return grown.map(c => Math.max(newMin, c))
    })
  }

  function updateCantBat(idx, val) {
    setCantBatPorUnidad(prev => prev.map((c, i) => i === idx ? val : c))
  }

  const tipoSel = cfg?.baterias?.tipos.find(t => t.id === tipoBat)
  const { kWh, kW } = useMemo(
    () => cfg ? calcTotals(product.id, unidades, cantBatPorUnidad, tipoSel?.kWh ?? 0) : { kWh: 0, kW: 0 },
    [cfg, product.id, unidades, cantBatPorUnidad, tipoSel]
  )
  const [badgeHovered, setBadgeHovered] = useState(false)

  if (!cfg) return null

  const configBadge = getConfigBadge(product.id, unidades, cantBatPorUnidad)

  function handleTipoBat(nuevoId) {
    const nuevoTipo = cfg.baterias.tipos.find(t => t.id === nuevoId)
    setTipoBat(nuevoId)
    setCantBatPorUnidad(prev => prev.map(c => c > nuevoTipo.max ? nuevoTipo.max : c))
  }

  return (
    <div className="bg-bluetti-card border border-bluetti-border rounded-2xl p-6 mb-12">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          ⚡ Configurador de Sistema
        </h2>
        {configBadge && (
          <div
            className="relative"
            onPointerEnter={() => configBadge.tooltip && setBadgeHovered(true)}
            onPointerLeave={() => setBadgeHovered(false)}
          >
            <span className={`text-xs font-bold px-3 py-1 rounded-full cursor-default ${configBadge.cls}${configBadge.tooltip ? ' underline decoration-dotted underline-offset-2' : ''}`}>
              {configBadge.label}
            </span>
            {badgeHovered && configBadge.tooltip && (
              <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-bluetti-bg border border-yellow-400/40 rounded text-xs font-medium text-yellow-200 whitespace-pre-line pointer-events-none shadow-lg z-30 w-64 leading-relaxed">
                {configBadge.tooltip}
              </div>
            )}
          </div>
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
              onChange={e => changeUnidades(Number(e.target.value))}
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
          <div className="space-y-4">
            {unidades > 1 && (
              <p className="text-sm text-bluetti-cyan">
                Baterías {tipoSel.nombre} por unidad
                {currentBatMin > 0 ? <span className="text-bluetti-cyan/70"> (mín. {currentBatMin} por unidad)</span> : null}
              </p>
            )}
            {cantBatPorUnidad.map((cant, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-bluetti-cyan">
                    {unidades > 1
                      ? `Unidad ${i + 1}`
                      : <>Baterías {tipoSel.nombre}{currentBatMin > 0 ? ` (mín. ${currentBatMin})` : ''}</>}
                  </span>
                  <span className="text-bluetti-cyan font-bold">
                    {cant} unidad{cant !== 1 ? 'es' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min={currentBatMin}
                  max={tipoSel.max}
                  value={cant}
                  onChange={e => updateCantBat(i, Number(e.target.value))}
                  className="w-full accent-bluetti-cyan"
                />
              </div>
            ))}
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
