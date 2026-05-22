import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCalculadora } from '../components/CalculadoraContext'

const CATEGORIAS_ELECTRO = [
  { id: 'climatizacion', nombre: 'Climatización', items: [
    { id: 'aire', nombre: 'Aire acondicionado (split 3000 frigs.)', watts: 900 },
    { id: 'aire_grande', nombre: 'Aire acondicionado (split 5000 frigs.)', watts: 1500 },
    { id: 'ventilador', nombre: 'Ventilador de pie', watts: 60 },
    { id: 'calefactor', nombre: 'Calefactor eléctrico', watts: 1500 },
  ]},
  { id: 'cocina', nombre: 'Cocina', items: [
    { id: 'heladera', nombre: 'Heladera', watts: 150 },
    { id: 'freezer', nombre: 'Freezer', watts: 150 },
    { id: 'heladera_comercial', nombre: 'Heladera comercial', watts: 400 },
    { id: 'microondas', nombre: 'Microondas', watts: 1000 },
    { id: 'horno', nombre: 'Horno eléctrico', watts: 1200 },
    { id: 'pava', nombre: 'Pava eléctrica', watts: 1500 },
    { id: 'cafetera', nombre: 'Cafetera', watts: 900 },
    { id: 'tostadora', nombre: 'Tostadora', watts: 850 },
    { id: 'licuadora', nombre: 'Licuadora', watts: 400 },
  ]},
  { id: 'entretenimiento', nombre: 'Entretenimiento', items: [
    { id: 'tv', nombre: 'TV 55"', watts: 120 },
    { id: 'tv_32', nombre: 'TV 32"', watts: 60 },
    { id: 'consola', nombre: 'Consola de videojuegos', watts: 150 },
    { id: 'proyector', nombre: 'Proyector', watts: 250 },
  ]},
  { id: 'trabajo', nombre: 'Trabajo y conectividad', items: [
    { id: 'pc', nombre: 'Computadora de escritorio + monitor', watts: 200 },
    { id: 'notebook', nombre: 'Notebook / Laptop', watts: 65 },
    { id: 'wifi', nombre: 'Router WiFi', watts: 15 },
    { id: 'celular', nombre: 'Cargador de celular', watts: 10 },
  ]},
  { id: 'iluminacion', nombre: 'Iluminación', items: [
    { id: 'led', nombre: 'Iluminación LED (10 luces)', watts: 100 },
  ]},
  { id: 'hogar', nombre: 'Hogar', items: [
    { id: 'lavarropas', nombre: 'Lavarropas', watts: 500 },
    { id: 'plancha', nombre: 'Plancha de ropa', watts: 1200 },
    { id: 'aspiradora', nombre: 'Aspiradora', watts: 1200 },
  ]},
  { id: 'seguridad', nombre: 'Seguridad y servicios', items: [
    { id: 'camara', nombre: 'Cámara de seguridad', watts: 15 },
    { id: 'alarma', nombre: 'Alarma del hogar', watts: 20 },
    { id: 'bomba', nombre: 'Bomba de agua', watts: 750 },
  ]},
  { id: 'herramientas', nombre: 'Herramientas', items: [
    { id: 'herramientas', nombre: 'Herramientas eléctricas', watts: 800 },
  ]},
  { id: 'industrial', nombre: 'Industrial', items: [
    { id: 'compresor_10hp', nombre: 'Compresor industrial (10 HP)', watts: 7500 },
    { id: 'compresor_20hp', nombre: 'Compresor industrial (20 HP)', watts: 15000 },
    { id: 'motor_trifasico', nombre: 'Motor trifásico (10 HP)', watts: 7500 },
    { id: 'soldadora_mig', nombre: 'Soldadora MIG/TIG', watts: 5000 },
    { id: 'torno_industrial', nombre: 'Torno industrial', watts: 5500 },
    { id: 'fresadora_cnc', nombre: 'Fresadora CNC', watts: 7500 },
    { id: 'camara_frigorifica', nombre: 'Cámara frigorífica industrial', watts: 5000 },
    { id: 'horno_industrial', nombre: 'Horno industrial (panadería)', watts: 12000 },
    { id: 'amasadora_industrial', nombre: 'Amasadora industrial', watts: 3000 },
    { id: 'caldera_electrica', nombre: 'Caldera eléctrica industrial', watts: 9000 },
    { id: 'bomba_industrial', nombre: 'Bomba centrífuga industrial', watts: 4000 },
    { id: 'cinta_transportadora', nombre: 'Cinta transportadora', watts: 2200 },
    { id: 'iluminacion_galpon', nombre: 'Iluminación LED galpón', watts: 2000 },
    { id: 'extractor_industrial', nombre: 'Extractor industrial', watts: 1500 },
  ]},
]

const ELECTRODOMESTICOS = CATEGORIAS_ELECTRO.flatMap(c => c.items)

const DEFAULT_FRANJA = { inicio: 0, fin: 24, porcentaje: 100 }

const PERFILES = [
  {
    id: 'casa',
    nombre: 'Casa',
    items: [
      { id: 'heladera', cantidad: 1 },
      { id: 'freezer', cantidad: 1 },
      { id: 'tv', cantidad: 1 },
      { id: 'led', cantidad: 1 },
      { id: 'wifi', cantidad: 1 },
      { id: 'celular', cantidad: 2 },
      { id: 'pava', cantidad: 1 },
      { id: 'notebook', cantidad: 1 },
    ],
  },
  {
    id: 'camping',
    nombre: 'Camping',
    items: [
      { id: 'heladera', cantidad: 1 },
      { id: 'led', cantidad: 1 },
      { id: 'celular', cantidad: 3 },
      { id: 'ventilador', cantidad: 1 },
      { id: 'pava', cantidad: 1 },
    ],
  },
  {
    id: 'comercio',
    nombre: 'Comercio',
    items: [
      { id: 'heladera_comercial', cantidad: 1 },
      { id: 'led', cantidad: 2 },
      { id: 'wifi', cantidad: 1 },
      { id: 'pc', cantidad: 1 },
      { id: 'alarma', cantidad: 1 },
      { id: 'camara', cantidad: 2 },
    ],
  },
  {
    id: 'obra',
    nombre: 'Obra',
    items: [
      { id: 'herramientas', cantidad: 2 },
      { id: 'led', cantidad: 1 },
      { id: 'celular', cantidad: 3 },
      { id: 'bomba', cantidad: 1 },
    ],
  },
  {
    id: 'industrial',
    nombre: 'Industrial',
    items: [
      { id: 'compresor_20hp', cantidad: 1 },
      { id: 'compresor_10hp', cantidad: 1 },
      { id: 'soldadora_mig', cantidad: 3 },
      { id: 'torno_industrial', cantidad: 2 },
      { id: 'fresadora_cnc', cantidad: 2 },
      { id: 'motor_trifasico', cantidad: 2 },
      { id: 'iluminacion_galpon', cantidad: 5 },
      { id: 'extractor_industrial', cantidad: 1 },
    ],
  },
]

const MODELOS = [
  { id: 'es125x', nombre: 'ES125 X' },
  { id: 'ep2000', nombre: 'EP2000' },
  { id: 'ep760', nombre: 'EP760' },
  { id: 'apex300', nombre: 'APEX 300' },
  { id: 'ac200pl', nombre: 'AC200P L' },
  { id: 'rv5', nombre: 'RV5' },
]

const MODEL_CFG = {
  es125x:  { paralelo: { min: 1, max: 4 },  bat: null },
  ep2000:  { paralelo: { min: 1, max: 3 },  bat: { tipo: 'B700',  min: 4, max: 7  } },
  ep760:   { paralelo: null,                bat: { tipo: 'B500',  min: 2, max: 4  } },
  apex300: { paralelo: { min: 1, max: 3 },  bat: { tipo: 'B300K', min: 0, max: 6  } },
  ac200pl: { paralelo: null,                bat: { tipo: 'B300K', min: 0, max: 2  } },
  rv5:     { paralelo: null,                bat: { tipo: 'B4810', min: 2, max: 24 } },
}

function calcCapacity(modelId, unidades, baterias) {
  switch (modelId) {
    case 'es125x':  return { kWh: unidades * 241, kW: unidades * 125 }
    case 'rv5':     return { kWh: baterias * 4.8, kW: 5 }
    case 'ep2000':  return { kWh: unidades * baterias * 7.37, kW: unidades * 20 }
    case 'ep760':   return { kWh: baterias * 4.96, kW: 7.6 }
    case 'apex300': return { kWh: unidades * (2.76 + baterias * 2.76), kW: unidades * 3.84 }
    case 'ac200pl': return { kWh: 2.304 + baterias * 2.76, kW: 2.4 }
    default:        return { kWh: 0, kW: 0 }
  }
}

function maxKwForModel(id) {
  const cfg = MODEL_CFG[id]
  const maxUnidades = cfg.paralelo?.max ?? 1
  const maxBaterias = cfg.bat?.max ?? 0
  return calcCapacity(id, maxUnidades, maxBaterias).kW
}

const SLOTS_PER_DAY = 48
const SLOT_HOURS = 0.5

function formatTime(t) {
  const h = Math.floor(t)
  const m = Math.round((t - h) * 60)
  return `${h}:${m.toString().padStart(2, '0')}`
}

function timeInRange(t, inicio, fin) {
  if (inicio < fin) return t >= inicio && t < fin
  return t >= inicio || t < fin
}

function activePctAtSlot(electro, s) {
  const t = s * SLOT_HOURS
  return electro.franjas.reduce(
    (sum, f) => sum + (timeInRange(t, f.inicio, f.fin) ? f.porcentaje : 0),
    0
  )
}

function loadAtSlotW(agregados, s) {
  return agregados.reduce(
    (sum, e) => sum + e.watts * activePctAtSlot(e, s) / 100,
    0
  )
}

function electroDailyKwh(electro) {
  let total = 0
  for (let s = 0; s < SLOTS_PER_DAY; s++) {
    total += electro.watts * activePctAtSlot(electro, s) / 100
  }
  return total * SLOT_HOURS / 1000
}

function makeInstanceKey(id) {
  return `${id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function franjaCoversSlot(f, s) {
  return timeInRange(s * SLOT_HOURS, f.inicio, f.fin)
}

function franjasHaveOverlap(franjas) {
  const counts = new Array(SLOTS_PER_DAY).fill(0)
  for (const f of franjas) {
    for (let s = 0; s < SLOTS_PER_DAY; s++) {
      if (franjaCoversSlot(f, s)) counts[s]++
    }
  }
  return counts.some(c => c > 1)
}

function findFirstGap(franjas) {
  const covered = new Set()
  for (const f of franjas) {
    for (let s = 0; s < SLOTS_PER_DAY; s++) {
      if (franjaCoversSlot(f, s)) covered.add(s)
    }
  }
  let startSlot = -1
  for (let s = 0; s < SLOTS_PER_DAY; s++) {
    if (!covered.has(s)) { startSlot = s; break }
  }
  if (startSlot === -1) return null
  let endSlot = startSlot
  while (endSlot < SLOTS_PER_DAY && !covered.has(endSlot)) endSlot++
  return { inicio: startSlot * SLOT_HOURS, fin: endSlot * SLOT_HOURS }
}

function dailyKwh(agregados) {
  let total = 0
  for (let s = 0; s < SLOTS_PER_DAY; s++) total += loadAtSlotW(agregados, s)
  return total * SLOT_HOURS / 1000
}

function peakInfo(agregados) {
  let maxW = 0
  let peakSlot = 0
  for (let s = 0; s < SLOTS_PER_DAY; s++) {
    const l = loadAtSlotW(agregados, s)
    if (l > maxW) { maxW = l; peakSlot = s }
  }
  return { watts: maxW, time: peakSlot * SLOT_HOURS }
}

const STATUS_STYLES = {
  insufficient: { border: 'border-red-500',    bg: 'bg-red-900/20',    badge: 'bg-red-900 text-red-300',       label: 'Insuficiente' },
  expansion:    { border: 'border-yellow-500', bg: 'bg-yellow-900/20', badge: 'bg-yellow-900 text-yellow-300', label: 'Requiere expansión' },
  base:         { border: 'border-green-500',  bg: 'bg-green-900/20',  badge: 'bg-green-900 text-green-300',   label: 'Base suficiente' },
}

function Stepper({ value, min, max, onChange, label, sublabel }) {
  return (
    <div className="flex items-center justify-between gap-3 bg-black/30 rounded-xl px-4 py-3 border border-bluetti-border">
      <div className="flex flex-col min-w-0">
        <span className="text-bluetti-cyan/70 text-xs uppercase tracking-wider leading-tight truncate">{label}</span>
        {sublabel && <span className="text-bluetti-cyan/50 text-xs mt-0.5 truncate">{sublabel}</span>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-9 h-9 rounded-lg bg-bluetti-border hover:bg-red-900/40 text-bluetti-cyan/80 hover:text-red-400 text-lg font-bold flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-bluetti-border disabled:hover:text-bluetti-cyan/80"
        >−</button>
        <span className="text-bluetti-cyan font-bold text-lg w-7 text-center">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-9 h-9 rounded-lg bg-bluetti-border hover:bg-bluetti-cyan hover:text-bluetti-bg text-bluetti-cyan/80 text-lg font-bold flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-bluetti-border disabled:hover:text-bluetti-cyan/80"
        >+</button>
      </div>
    </div>
  )
}

function ModelCard({ modelo, totalKwh, totalKw }) {
  const cfg = MODEL_CFG[modelo.id]
  const baseUnidades = cfg.paralelo?.min ?? 1
  const baseBaterias = cfg.bat?.min ?? 0
  const [unidades, setUnidades] = useState(baseUnidades)
  const [baterias, setBaterias] = useState(baseBaterias)

  const { kWh, kW } = useMemo(
    () => calcCapacity(modelo.id, unidades, baterias),
    [modelo.id, unidades, baterias]
  )

  const status = useMemo(() => {
    if (kW < totalKw) return 'insufficient'
    if (unidades === baseUnidades && baterias === baseBaterias) return 'base'
    return 'expansion'
  }, [kW, totalKw, unidades, baterias, baseUnidades, baseBaterias])

  const horas = totalKwh > 0 ? ((kWh / totalKwh) * 24).toFixed(1) : null
  const styles = STATUS_STYLES[status]

  return (
    <div className={`rounded-xl border ${styles.border} ${styles.bg} px-5 py-4`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-white text-base font-semibold">{modelo.nombre}</span>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${styles.badge}`}>
          {styles.label}
        </span>
      </div>

      <div className={`grid gap-3 mb-4 ${cfg.paralelo && cfg.bat ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {cfg.paralelo && (
          <Stepper
            value={unidades}
            min={cfg.paralelo.min}
            max={cfg.paralelo.max}
            onChange={setUnidades}
            label="Unidades"
          />
        )}
        {cfg.bat && (
          <Stepper
            value={baterias}
            min={cfg.bat.min}
            max={cfg.bat.max}
            onChange={setBaterias}
            label="Baterías"
            sublabel={cfg.bat.tipo}
          />
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-bluetti-cyan/80 mb-3">
        <span>{kWh.toFixed(2)} kWh · {kW.toFixed(1)} kW</span>
      </div>

      {status === 'insufficient' ? (
        <p className="text-sm text-red-400/80">
          No soporta el pico de potencia requerido
        </p>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-bluetti-lime text-3xl font-bold leading-none">{horas}</span>
            <span className="text-bluetti-lime text-base font-semibold">hs de autonomía</span>
          </div>
          <Link
            to={`/producto/${modelo.id}`}
            className="text-sm text-bluetti-cyan hover:text-bluetti-cyan underline underline-offset-2 transition-colors"
          >
            Ver producto
          </Link>
        </div>
      )}
    </div>
  )
}

function FranjaRow({ franja, siblingFranjas, onChange, onDelete, canDelete }) {
  function isInicioValid(v) {
    const candidate = { inicio: v, fin: franja.fin, porcentaje: 0 }
    return !franjasHaveOverlap([...siblingFranjas, candidate])
  }
  function isFinValid(v) {
    const candidate = { inicio: franja.inicio, fin: v, porcentaje: 0 }
    return !franjasHaveOverlap([...siblingFranjas, candidate])
  }
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-bluetti-cyan/70 text-xs">De</span>
      <select
        value={franja.inicio}
        onChange={ev => onChange({ ...franja, inicio: Number(ev.target.value) })}
        className="bg-black/30 border border-bluetti-border rounded px-2 py-1 text-bluetti-cyan text-xs focus:outline-none focus:border-bluetti-cyan"
      >
        {Array.from({ length: SLOTS_PER_DAY }, (_, i) => {
          const v = i * SLOT_HOURS
          return <option key={v} value={v} disabled={!isInicioValid(v)}>{formatTime(v)}</option>
        })}
      </select>
      <span className="text-bluetti-cyan/70 text-xs">a</span>
      <select
        value={franja.fin}
        onChange={ev => onChange({ ...franja, fin: Number(ev.target.value) })}
        className="bg-black/30 border border-bluetti-border rounded px-2 py-1 text-bluetti-cyan text-xs focus:outline-none focus:border-bluetti-cyan"
      >
        {Array.from({ length: SLOTS_PER_DAY }, (_, i) => {
          const v = (i + 1) * SLOT_HOURS
          return <option key={v} value={v} disabled={!isFinValid(v)}>{formatTime(v)}</option>
        })}
      </select>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={franja.porcentaje}
        onChange={ev => onChange({ ...franja, porcentaje: Number(ev.target.value) })}
        className="flex-1 min-w-[80px] accent-bluetti-cyan"
      />
      <span className="text-bluetti-cyan text-xs font-bold w-10 text-right">{franja.porcentaje}%</span>
      {canDelete ? (
        <button
          onClick={onDelete}
          className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-red-400 text-base leading-none transition-colors"
          title="Eliminar franja"
        >×</button>
      ) : (
        <span className="w-5" />
      )}
    </div>
  )
}

export default function Calculadora() {
  const { agregados, setAgregados, openCats, setOpenCats } = useCalculadora()
  const [customNombre, setCustomNombre] = useState('')
  const [customWatts, setCustomWatts] = useState('')
  const [movilidad, setMovilidad] = useState(false)

  function toggleCat(id) {
    setOpenCats(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function agregar(electro) {
    setAgregados(prev => [
      ...prev,
      { ...electro, instanceKey: makeInstanceKey(electro.id), franjas: [{ ...DEFAULT_FRANJA }] }
    ])
  }

  function quitar(instanceKey) {
    setAgregados(prev => prev.filter(e => e.instanceKey !== instanceKey))
  }

  function addFranja(instanceKey) {
    setAgregados(prev => prev.map(e => {
      if (e.instanceKey !== instanceKey) return e
      const gap = findFirstGap(e.franjas)
      if (!gap) return e
      return { ...e, franjas: [...e.franjas, { ...gap, porcentaje: 100 }] }
    }))
  }

  function deleteFranja(instanceKey, idx) {
    setAgregados(prev => prev.map(e => {
      if (e.instanceKey !== instanceKey) return e
      if (e.franjas.length <= 1) return e
      return { ...e, franjas: e.franjas.filter((_, i) => i !== idx) }
    }))
  }

  function updateFranja(instanceKey, idx, updated) {
    setAgregados(prev => prev.map(e => {
      if (e.instanceKey !== instanceKey) return e
      const newFranjas = e.franjas.map((f, i) => i === idx ? updated : f)
      if (franjasHaveOverlap(newFranjas)) return e
      return { ...e, franjas: newFranjas }
    }))
  }

  const totalKwh = useMemo(() => dailyKwh(agregados), [agregados])
  const peak = useMemo(() => peakInfo(agregados), [agregados])

  function aplicarPerfil(perfil) {
    const nuevos = []
    perfil.items.forEach(item => {
      const electro = ELECTRODOMESTICOS.find(e => e.id === item.id)
      if (!electro) return
      for (let i = 0; i < item.cantidad; i++) {
        nuevos.push({
          ...electro,
          instanceKey: makeInstanceKey(electro.id),
          franjas: [{ ...DEFAULT_FRANJA }],
        })
      }
    })
    setAgregados(nuevos)
  }

  const cantidadPorId = agregados.reduce((acc, e) => {
    acc[e.id] = (acc[e.id] || 0) + 1
    return acc
  }, {})

  const nameCounters = {}
  const agregadosConNombre = agregados.map(e => {
    nameCounters[e.nombre] = (nameCounters[e.nombre] || 0) + 1
    return { ...e, displayName: `${e.nombre} ${nameCounters[e.nombre]}` }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">Calculadora de Autonomía</h1>
      <p className="text-bluetti-cyan text-sm mb-8">
        Seleccioná los electrodomésticos que querés alimentar y calculá cuánto tiempo te dura cada modelo BLUETTI.
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-bluetti-cyan/70 text-sm self-center mr-1">Perfil de uso:</span>
        {PERFILES.map(perfil => (
          <button
            key={perfil.id}
            onClick={() => aplicarPerfil(perfil)}
            className="px-4 py-2 rounded-xl border border-bluetti-border text-sm font-medium text-bluetti-cyan/80 hover:border-bluetti-cyan hover:text-bluetti-cyan transition-all"
          >
            {perfil.nombre}
          </button>
        ))}
        {agregados.length > 0 && (
          <button
            onClick={() => setAgregados([])}
            className="px-4 py-2 rounded-xl border border-red-800 text-sm font-medium text-red-400 hover:bg-red-900/20 transition-all ml-auto"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna izquierda */}
        <div>
          <h2 className="text-sm font-semibold text-bluetti-cyan uppercase tracking-wider mb-4">
            Electrodomésticos disponibles
          </h2>
          <div className="mb-4 bg-bluetti-card border border-dashed border-bluetti-border rounded-xl p-4">
            <p className="text-xs font-semibold text-bluetti-cyan uppercase tracking-wider mb-3">
              Agregar electrodoméstico personalizado
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nombre"
                value={customNombre}
                onChange={e => setCustomNombre(e.target.value)}
                className="flex-1 bg-black/30 border border-bluetti-border rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-bluetti-cyan"
              />
              <input
                type="number"
                placeholder="Watts"
                min={1}
                value={customWatts}
                onChange={e => setCustomWatts(e.target.value)}
                className="w-24 bg-black/30 border border-bluetti-border rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-bluetti-cyan"
              />
              <button
                onClick={() => {
                  const w = parseInt(customWatts)
                  if (!customNombre.trim() || !w || w <= 0) return
                  agregar({ id: `custom-${Date.now()}`, nombre: customNombre.trim(), watts: w })
                  setCustomNombre('')
                  setCustomWatts('')
                }}
                className="w-10 h-10 rounded-lg font-bold text-lg flex items-center justify-center bg-bluetti-border hover:bg-bluetti-cyan hover:text-bluetti-bg text-bluetti-cyan/80 transition-all shrink-0"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {CATEGORIAS_ELECTRO.map(cat => {
              const isOpen = !!openCats[cat.id]
              return (
                <div key={cat.id} className="border border-bluetti-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleCat(cat.id)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-bluetti-card hover:bg-white/5 transition-colors"
                  >
                    <span className="text-sm font-semibold text-white">{cat.nombre}</span>
                    <span className={`text-bluetti-cyan text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-bluetti-border divide-y divide-bluetti-border">
                      {cat.items.map(e => {
                        const cantidad = cantidadPorId[e.id] ?? 0
                        return (
                          <div
                            key={e.id}
                            className="flex items-center justify-between bg-bluetti-card px-4 py-3"
                          >
                            <div>
                              <span className="text-white text-sm">{e.nombre}</span>
                              <span className="text-bluetti-cyan/70 text-xs ml-2">{e.watts}W</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {cantidad > 0 && (
                                <span className="text-bluetti-cyan text-xs font-bold min-w-[20px] text-center">
                                  ×{cantidad}
                                </span>
                              )}
                              <button
                                onClick={() => agregar(e)}
                                className="w-8 h-8 rounded-lg font-bold text-lg flex items-center justify-center transition-all bg-bluetti-border hover:bg-bluetti-cyan hover:text-bluetti-bg text-bluetti-cyan/80"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

        </div>

        {/* Columna derecha */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4 gap-3">
              <h2 className="text-sm font-semibold text-bluetti-cyan uppercase tracking-wider">
                Mi instalación
              </h2>
              <button
                onClick={() => setMovilidad(v => !v)}
                role="switch"
                aria-checked={movilidad}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  movilidad
                    ? 'border-bluetti-cyan bg-bluetti-cyan/10 text-bluetti-cyan'
                    : 'border-bluetti-border text-bluetti-cyan/70 hover:border-bluetti-cyan hover:text-bluetti-cyan'
                }`}
              >
                <span
                  className={`relative inline-block w-8 h-4 rounded-full transition-colors ${
                    movilidad ? 'bg-bluetti-cyan' : 'bg-bluetti-border'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-bluetti-bg transition-transform ${
                      movilidad ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </span>
                Movilidad
              </button>
            </div>

            {agregados.length === 0 ? (
              <div className="bg-bluetti-card border border-dashed border-bluetti-border rounded-xl p-8 text-center">
                <p className="text-bluetti-cyan/70 text-sm">
                  Agregá electrodomésticos de la lista para calcular la autonomía.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {agregadosConNombre.map(e => (
                  <div
                    key={e.instanceKey}
                    className="bg-bluetti-card border border-bluetti-border rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white text-sm font-medium">{e.displayName}</span>
                      <button
                        onClick={() => quitar(e.instanceKey)}
                        className="text-gray-600 hover:text-red-400 text-lg leading-none transition-colors"
                      >
                        ×
                      </button>
                    </div>
                    <div className="space-y-2 mb-2">
                      {e.franjas.map((f, idx) => (
                        <FranjaRow
                          key={idx}
                          franja={f}
                          siblingFranjas={e.franjas.filter((_, i) => i !== idx)}
                          onChange={updated => updateFranja(e.instanceKey, idx, updated)}
                          onDelete={() => deleteFranja(e.instanceKey, idx)}
                          canDelete={e.franjas.length > 1}
                        />
                      ))}
                      {(() => {
                        const hayHueco = !!findFirstGap(e.franjas)
                        return (
                          <button
                            onClick={() => addFranja(e.instanceKey)}
                            disabled={!hayHueco}
                            title={hayHueco ? '' : 'Achicá una franja existente para liberar espacio'}
                            className="text-xs text-bluetti-cyan/80 hover:text-bluetti-cyan border border-dashed border-bluetti-border rounded-lg px-2 py-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-bluetti-cyan/80"
                          >
                            + Agregar franja
                          </button>
                        )
                      })()}
                    </div>
                    <div className="text-bluetti-cyan/70 text-xs">
                      {e.watts}W = {electroDailyKwh(e).toFixed(2)} kWh/día
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Panel de resultados */}
          <div className="bg-bluetti-card border border-bluetti-border rounded-xl p-5">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-bluetti-cyan text-sm">Consumo total estimado</span>
              <span className="text-bluetti-cyan text-3xl font-bold">
                {totalKwh.toFixed(2)}
                <span className="text-sm font-normal text-bluetti-cyan ml-1 inline-block w-16 text-left">kWh/día</span>
              </span>
            </div>
            {peak.watts > 0 && (
              <div className="flex items-baseline justify-between mb-5">
                <span className="text-bluetti-cyan text-sm">
                  Pico de consumo <span className="text-bluetti-cyan/60 text-xs">(a las {formatTime(peak.time)})</span>
                </span>
                <span className="text-bluetti-cyan text-3xl font-bold">
                  {(peak.watts / 1000).toFixed(2)}
                  <span className="text-sm font-normal text-bluetti-cyan ml-1 inline-block w-16 text-left">kW</span>
                </span>
              </div>
            )}

            {totalKwh === 0 ? (
              <p className="text-bluetti-cyan/70 text-sm text-center py-4">
                Agregá electrodomésticos para ver qué modelos BLUETTI te convienen.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-bluetti-cyan/70 uppercase tracking-wider mb-3">
                  Configurá cada modelo para ver su autonomía
                </p>
                {MODELOS
                  .filter(m => {
                    const kw = peak.watts / 1000
                    if (movilidad) return m.id === 'rv5'
                    if (m.id === 'rv5') return false
                    if (m.id === 'es125x' && kw < 60) return false
                    return kw <= maxKwForModel(m.id)
                  })
                  .map(modelo => (
                    <ModelCard
                      key={modelo.id}
                      modelo={modelo}
                      totalKwh={totalKwh}
                      totalKw={peak.watts / 1000}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
