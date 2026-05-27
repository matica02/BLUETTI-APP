import { useState, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCalculadora } from '../components/CalculadoraContext'
import DayChart from '../components/DayChart'
import DayClock from '../components/DayClock'

const CATEGORIAS_ELECTRO = [
  { id: 'climatizacion', nombre: 'Climatización', items: [
    { id: 'aire', nombre: 'Aire acondicionado (split 3000 frigs.)', watts: 900, arranqueW: 2700 },
    { id: 'aire_grande', nombre: 'Aire acondicionado (split 5000 frigs.)', watts: 1500, arranqueW: 4500 },
    { id: 'ventilador', nombre: 'Ventilador de pie', watts: 60 },
    { id: 'calefactor', nombre: 'Calefactor eléctrico', watts: 1500 },
  ]},
  { id: 'cocina', nombre: 'Cocina', items: [
    { id: 'heladera', nombre: 'Heladera', watts: 150, arranqueW: 450 },
    { id: 'freezer', nombre: 'Freezer', watts: 150, arranqueW: 450 },
    { id: 'heladera_comercial', nombre: 'Heladera comercial', watts: 400, arranqueW: 1200 },
    { id: 'microondas', nombre: 'Microondas', watts: 1000, arranqueW: 2000 },
    { id: 'horno', nombre: 'Horno eléctrico', watts: 1200 },
    { id: 'pava', nombre: 'Pava eléctrica', watts: 1500 },
    { id: 'cafetera', nombre: 'Cafetera', watts: 900 },
    { id: 'tostadora', nombre: 'Tostadora', watts: 850 },
    { id: 'licuadora', nombre: 'Licuadora', watts: 400, arranqueW: 800 },
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
    { id: 'lavarropas', nombre: 'Lavarropas', watts: 500, arranqueW: 1500 },
    { id: 'plancha', nombre: 'Plancha de ropa', watts: 1200 },
    { id: 'aspiradora', nombre: 'Aspiradora', watts: 1200, arranqueW: 2400 },
  ]},
  { id: 'seguridad', nombre: 'Seguridad y servicios', items: [
    { id: 'camara', nombre: 'Cámara de seguridad', watts: 15 },
    { id: 'alarma', nombre: 'Alarma del hogar', watts: 20 },
    { id: 'bomba', nombre: 'Bomba de agua', watts: 750, arranqueW: 3000 },
  ]},
  { id: 'herramientas', nombre: 'Herramientas', items: [
    { id: 'herramientas', nombre: 'Herramientas eléctricas', watts: 800, arranqueW: 1600 },
  ]},
  { id: 'industrial', nombre: 'Industrial', items: [
    { id: 'compresor_10hp', nombre: 'Compresor industrial (10 HP)', watts: 7500, arranqueW: 22500 },
    { id: 'compresor_20hp', nombre: 'Compresor industrial (20 HP)', watts: 15000, arranqueW: 45000 },
    { id: 'motor_trifasico', nombre: 'Motor trifásico (10 HP)', watts: 7500, arranqueW: 22500 },
    { id: 'soldadora_mig', nombre: 'Soldadora MIG/TIG', watts: 5000, arranqueW: 10000 },
    { id: 'torno_industrial', nombre: 'Torno industrial', watts: 5500, arranqueW: 16500 },
    { id: 'fresadora_cnc', nombre: 'Fresadora CNC', watts: 7500, arranqueW: 18750 },
    { id: 'camara_frigorifica', nombre: 'Cámara frigorífica industrial', watts: 5000, arranqueW: 15000 },
    { id: 'horno_industrial', nombre: 'Horno industrial (panadería)', watts: 12000 },
    { id: 'amasadora_industrial', nombre: 'Amasadora industrial', watts: 3000, arranqueW: 9000 },
    { id: 'caldera_electrica', nombre: 'Caldera eléctrica industrial', watts: 9000 },
    { id: 'bomba_industrial', nombre: 'Bomba centrífuga industrial', watts: 4000, arranqueW: 12000 },
    { id: 'cinta_transportadora', nombre: 'Cinta transportadora', watts: 2200, arranqueW: 6600 },
    { id: 'iluminacion_galpon', nombre: 'Iluminación LED galpón', watts: 2000 },
    { id: 'extractor_industrial', nombre: 'Extractor industrial', watts: 1500, arranqueW: 3000 },
  ]},
]

const ELECTRODOMESTICOS = CATEGORIAS_ELECTRO.flatMap(c => c.items)

const DEFAULT_FRANJA = { inicio: 0, fin: 24, porcentaje: 100 }

const FRANJA_NOCHE_CARGA = [
  { inicio: 0, fin: 7, porcentaje: 100 },
  { inicio: 22, fin: 24, porcentaje: 100 },
]

const PERFILES = [
  {
    id: 'casa',
    nombre: 'Casa',
    items: [
      { id: 'heladera', cantidad: 1 },
      { id: 'freezer', cantidad: 1 },
      { id: 'tv', cantidad: 1, franjas: [{ inicio: 18, fin: 23, porcentaje: 100 }] },
      { id: 'led', cantidad: 1, franjas: [{ inicio: 19, fin: 23, porcentaje: 100 }] },
      { id: 'wifi', cantidad: 1 },
      { id: 'celular', cantidad: 2, franjas: FRANJA_NOCHE_CARGA },
      { id: 'pava', cantidad: 1, franjas: [{ inicio: 7, fin: 8, porcentaje: 30 }] },
      { id: 'notebook', cantidad: 1, franjas: [{ inicio: 9, fin: 18, porcentaje: 80 }] },
    ],
  },
  {
    id: 'camping',
    nombre: 'Camping',
    items: [
      { id: 'heladera', cantidad: 1 },
      { id: 'led', cantidad: 1, franjas: [{ inicio: 19, fin: 23, porcentaje: 100 }] },
      { id: 'celular', cantidad: 3, franjas: FRANJA_NOCHE_CARGA },
      { id: 'ventilador', cantidad: 1, franjas: [{ inicio: 14, fin: 19, porcentaje: 100 }] },
      { id: 'pava', cantidad: 1, franjas: [
        { inicio: 7, fin: 8, porcentaje: 50 },
        { inicio: 18, fin: 19, porcentaje: 50 },
      ] },
    ],
  },
  {
    id: 'motorhome',
    nombre: 'Motorhome',
    items: [
      { id: 'heladera', cantidad: 1 },
      { id: 'led', cantidad: 1, franjas: [{ inicio: 19, fin: 23, porcentaje: 100 }] },
      { id: 'celular', cantidad: 3, franjas: FRANJA_NOCHE_CARGA },
      { id: 'ventilador', cantidad: 1, franjas: [{ inicio: 14, fin: 19, porcentaje: 100 }] },
      { id: 'cafetera', cantidad: 1, franjas: [{ inicio: 7, fin: 8, porcentaje: 60 }] },
      { id: 'notebook', cantidad: 1, franjas: [{ inicio: 9, fin: 17, porcentaje: 70 }] },
      { id: 'tv_32', cantidad: 1, franjas: [{ inicio: 19, fin: 23, porcentaje: 100 }] },
      { id: 'wifi', cantidad: 1 },
    ],
  },
  {
    id: 'comercio',
    nombre: 'Comercio',
    items: [
      { id: 'heladera_comercial', cantidad: 1 },
      { id: 'led', cantidad: 2, franjas: [{ inicio: 8, fin: 20, porcentaje: 100 }] },
      { id: 'wifi', cantidad: 1 },
      { id: 'pc', cantidad: 1, franjas: [{ inicio: 9, fin: 18, porcentaje: 100 }] },
      { id: 'alarma', cantidad: 1 },
      { id: 'camara', cantidad: 2 },
    ],
  },
  {
    id: 'obra',
    nombre: 'Obra',
    items: [
      { id: 'herramientas', cantidad: 2, franjas: [{ inicio: 8, fin: 17, porcentaje: 60 }] },
      { id: 'led', cantidad: 1, franjas: [{ inicio: 8, fin: 18, porcentaje: 100 }] },
      { id: 'celular', cantidad: 3, franjas: [{ inicio: 8, fin: 18, porcentaje: 80 }] },
      { id: 'bomba', cantidad: 1, franjas: [
        { inicio: 7, fin: 9, porcentaje: 50 },
        { inicio: 17, fin: 19, porcentaje: 50 },
      ] },
    ],
  },
  {
    id: 'granja',
    nombre: 'Granja',
    items: [
      { id: 'bomba', cantidad: 1, franjas: [
        { inicio: 7, fin: 9, porcentaje: 50 },
        { inicio: 18, fin: 20, porcentaje: 50 },
      ] },
      { id: 'heladera', cantidad: 1 },
      { id: 'freezer', cantidad: 1 },
      { id: 'led', cantidad: 2, franjas: [{ inicio: 18, fin: 23, porcentaje: 100 }] },
      { id: 'iluminacion_galpon', cantidad: 1, franjas: [{ inicio: 18, fin: 22, porcentaje: 100 }] },
      { id: 'herramientas', cantidad: 1, franjas: [{ inicio: 9, fin: 17, porcentaje: 30 }] },
      { id: 'wifi', cantidad: 1 },
      { id: 'tv', cantidad: 1, franjas: [{ inicio: 19, fin: 23, porcentaje: 100 }] },
    ],
  },
  {
    id: 'industrial',
    nombre: 'Industrial',
    items: [
      { id: 'compresor_20hp', cantidad: 1, franjas: [{ inicio: 7, fin: 19, porcentaje: 100 }] },
      { id: 'compresor_10hp', cantidad: 1, franjas: [{ inicio: 7, fin: 19, porcentaje: 100 }] },
      { id: 'soldadora_mig', cantidad: 3, franjas: [{ inicio: 8, fin: 17, porcentaje: 50 }] },
      { id: 'torno_industrial', cantidad: 2, franjas: [{ inicio: 8, fin: 17, porcentaje: 60 }] },
      { id: 'fresadora_cnc', cantidad: 2, franjas: [{ inicio: 8, fin: 17, porcentaje: 60 }] },
      { id: 'motor_trifasico', cantidad: 2, franjas: [{ inicio: 7, fin: 19, porcentaje: 100 }] },
      { id: 'iluminacion_galpon', cantidad: 5, franjas: [{ inicio: 7, fin: 22, porcentaje: 100 }] },
      { id: 'extractor_industrial', cantidad: 1, franjas: [{ inicio: 7, fin: 19, porcentaje: 100 }] },
    ],
  },
]

const MODELOS = [
  { id: 'es125x', nombre: 'ES125 X' },
  { id: 'ep2000', nombre: 'EP2000' },
  { id: 'ep760', nombre: 'EP760' },
  { id: 'apex300', nombre: 'APEX 300' },
  { id: 'ac200pl', nombre: 'AC200P L' },
  { id: 'ac180p', nombre: 'AC180P' },
  { id: 'rv5', nombre: 'RV5' },
]

const MAX_SOLAR_W = {
  es125x: 12000,
  ep2000: 4800,
  ep760:  2400,
  apex300: 1200,
  ac200pl: 1200,
  ac180p:  500,
  rv5:    2000,
}

const MODEL_CFG = {
  es125x:  { paralelo: { min: 1, max: 4 },  bat: null },
  ep2000:  { paralelo: { min: 1, max: 3 },  bat: { tipo: 'B700',  min: u => u > 1 ? 2 : 4, max: 7 } },
  ep760:   { paralelo: null,                bat: { tipo: 'B500',  min: 2, max: 4  } },
  apex300: { paralelo: { min: 1, max: 3 },  bat: { tipo: 'B300K', min: 0, max: 6  } },
  ac200pl: { paralelo: null,                bat: { tipo: 'B300K', min: 0, max: 2  } },
  ac180p:  { paralelo: null,                bat: null },
  rv5:     { paralelo: null,                bat: { tipo: 'B4810', min: 2, max: 24 } },
}

function calcCapacity(modelId, unidades, baterias) {
  const arr = Array.isArray(baterias) ? baterias : Array(unidades).fill(baterias)
  const totalBat = arr.reduce((a, b) => a + b, 0)
  switch (modelId) {
    case 'es125x':  return { kWh: unidades * 241, kW: unidades * 125 }
    case 'rv5':     return { kWh: totalBat * 5.12, kW: 5 }
    case 'ep2000':  return { kWh: totalBat * 7.37, kW: unidades * 20 }
    case 'ep760':   return { kWh: totalBat * 4.96, kW: 7.6 }
    case 'apex300': return { kWh: unidades * 2.76 + totalBat * 2.76, kW: unidades * 3.84 }
    case 'ac200pl': return { kWh: 2.304 + totalBat * 2.76, kW: 2.4 }
    case 'ac180p':  return { kWh: 1.44, kW: 1.8 }
    default:        return { kWh: 0, kW: 0 }
  }
}

function batMin(cfg, unidades) {
  if (!cfg.bat) return 0
  return typeof cfg.bat.min === 'function' ? cfg.bat.min(unidades) : cfg.bat.min
}

function maxKwForModel(id) {
  const cfg = MODEL_CFG[id]
  const maxUnidades = cfg.paralelo?.max ?? 1
  const maxBaterias = cfg.bat?.max ?? 0
  return calcCapacity(id, maxUnidades, maxBaterias).kW
}

const SLOTS_PER_DAY = 48
const SLOT_HOURS = 0.5
const ZERO_SLOTS = new Array(SLOTS_PER_DAY).fill(0)
const MAX_SIM_DAYS = 30
const EFICIENCIA_INVERSOR = 0.92
const DOD_BATERIA = 0.90

function formatDuracion(hours) {
  const maxHours = MAX_SIM_DAYS * 24
  if (hours >= maxHours) return { val: `${MAX_SIM_DAYS}+`, unit: 'días' }
  if (hours >= 24) return { val: (hours / 24).toFixed(1), unit: 'días' }
  return { val: hours.toFixed(1), unit: 'hs' }
}

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

const SUN_START = 6
const SUN_END = 18

function dailySolarKwh(paneles, panelW, horasSol, efic = 0.8) {
  return (paneles * panelW / 1000) * horasSol * efic
}

function computeSolarPerSlot(totalDailyKwh) {
  const arr = new Array(SLOTS_PER_DAY).fill(0)
  if (totalDailyKwh <= 0) return arr
  let sum = 0
  for (let s = 0; s < SLOTS_PER_DAY; s++) {
    const t = s * SLOT_HOURS
    if (t < SUN_START || t >= SUN_END) continue
    const x = (t - SUN_START) / (SUN_END - SUN_START)
    arr[s] = Math.sin(Math.PI * x)
    sum += arr[s]
  }
  if (sum === 0) return arr
  for (let s = 0; s < SLOTS_PER_DAY; s++) arr[s] = arr[s] * totalDailyKwh / sum
  return arr
}

function computeConsumoPerSlot(agregados) {
  return Array.from({ length: SLOTS_PER_DAY }, (_, s) =>
    loadAtSlotW(agregados, s) * SLOT_HOURS / 1000
  )
}

function simulateAutonomy(capacityKwh, consumoPerSlot, solarPerSlot, maxDays = MAX_SIM_DAYS) {
  if (capacityKwh <= 0) return { autosuficiente: false, horas: 0 }
  const usableCapacity = capacityKwh * DOD_BATERIA
  const dailySolar = solarPerSlot.reduce((a, b) => a + b, 0)
  const dailyConsumoAC = consumoPerSlot.reduce((a, b) => a + b, 0)
  const dailyConsumoDC = dailyConsumoAC / EFICIENCIA_INVERSOR
  if (dailyConsumoAC <= 0) return { autosuficiente: true, horas: maxDays * 24 }

  let soc = usableCapacity
  let hours = 0
  for (let day = 0; day < maxDays; day++) {
    for (let s = 0; s < SLOTS_PER_DAY; s++) {
      const consumoDC = consumoPerSlot[s] / EFICIENCIA_INVERSOR
      soc = Math.min(usableCapacity, soc + solarPerSlot[s] - consumoDC)
      hours += SLOT_HOURS
      if (soc <= 0) return { autosuficiente: false, horas: hours }
    }
  }
  return { autosuficiente: dailySolar >= dailyConsumoDC, horas: hours }
}

function peakInfo(agregados) {
  let maxCont = 0
  let contSlot = 0
  let maxSurge = 0
  let surgeSlot = 0
  for (let s = 0; s < SLOTS_PER_DAY; s++) {
    const cont = loadAtSlotW(agregados, s)
    if (cont > maxCont) { maxCont = cont; contSlot = s }
    let surgeDelta = 0
    for (const e of agregados) {
      if (!e.arranqueW || e.arranqueW <= e.watts) continue
      const pct = activePctAtSlot(e, s) / 100
      if (pct === 0) continue
      const d = e.arranqueW - e.watts * pct
      if (d > surgeDelta) surgeDelta = d
    }
    const totalSurge = cont + surgeDelta
    if (totalSurge > maxSurge) { maxSurge = totalSurge; surgeSlot = s }
  }
  return {
    watts: maxCont,
    time: contSlot * SLOT_HOURS,
    surgeWatts: maxSurge,
    surgeTime: surgeSlot * SLOT_HOURS,
    hasSurge: maxSurge > maxCont,
  }
}

const STATUS_STYLES = {
  insufficient: { border: 'border-red-500',    bg: 'bg-red-900/20',    badge: 'bg-red-900 text-red-300',       label: 'Insuficiente' },
  expansion:    { border: 'border-yellow-500', bg: 'bg-yellow-900/20', badge: 'bg-yellow-900 text-yellow-300', label: 'Requiere expansión' },
  base:         { border: 'border-green-500',  bg: 'bg-green-900/20',  badge: 'bg-green-900 text-green-300',   label: 'Base suficiente' },
}

function Stepper({ value, min, max, onChange, label, sublabel }) {
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3 bg-black/30 rounded-xl px-3 sm:px-4 py-2 sm:py-3 border border-bluetti-border">
      <div className="flex flex-col min-w-0">
        <span className="text-bluetti-cyan/70 text-xs uppercase tracking-wider leading-tight truncate">{label}</span>
        {sublabel && <span className="text-bluetti-cyan/50 text-xs mt-0.5 truncate">{sublabel}</span>}
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-bluetti-border hover:bg-red-900/40 text-bluetti-cyan/80 hover:text-red-400 text-base sm:text-lg font-bold flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-bluetti-border disabled:hover:text-bluetti-cyan/80"
        >−</button>
        <span className="text-bluetti-cyan font-bold text-base sm:text-lg w-6 sm:w-7 text-center">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-bluetti-border hover:bg-bluetti-cyan hover:text-bluetti-bg text-bluetti-cyan/80 text-base sm:text-lg font-bold flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-bluetti-border disabled:hover:text-bluetti-cyan/80"
        >+</button>
      </div>
    </div>
  )
}

function ModelCard({ modelo, totalKwh, totalKw, solarOn, consumoPerSlot, solarPerSlot, config, onChangeConfig }) {
  const cfg = MODEL_CFG[modelo.id]
  const baseUnidades = cfg.paralelo?.min ?? 1
  const baseBateriasPorUnidad = batMin(cfg, baseUnidades)
  const { unidades, bateriasPorUnidad } = config

  const currentBatMin = batMin(cfg, unidades)

  function changeUnidades(n) {
    const newMin = batMin(cfg, n)
    const grown = n > bateriasPorUnidad.length
      ? [...bateriasPorUnidad, ...Array(n - bateriasPorUnidad.length).fill(newMin)]
      : bateriasPorUnidad.slice(0, n)
    const clamped = grown.map(b => Math.max(newMin, b))
    onChangeConfig({ unidades: n, bateriasPorUnidad: clamped })
  }

  function updateBaterias(idx, val) {
    const newArr = bateriasPorUnidad.map((b, i) => i === idx ? val : b)
    onChangeConfig({ unidades, bateriasPorUnidad: newArr })
  }

  const { kWh, kW } = useMemo(
    () => calcCapacity(modelo.id, unidades, bateriasPorUnidad),
    [modelo.id, unidades, bateriasPorUnidad]
  )

  const status = useMemo(() => {
    if (kW < totalKw) return 'insufficient'
    const allAtMin = bateriasPorUnidad.every(b => b === baseBateriasPorUnidad)
    if (unidades === baseUnidades && allAtMin) return 'base'
    return 'expansion'
  }, [kW, totalKw, unidades, bateriasPorUnidad, baseUnidades, baseBateriasPorUnidad])

  const styles = STATUS_STYLES[status]

  const capW = (MAX_SOLAR_W[modelo.id] ?? 0) * unidades
  const capPerSlot = capW * SLOT_HOURS / 1000

  const effectiveSolarPerSlot = useMemo(() => {
    if (!solarPerSlot) return null
    if (capPerSlot <= 0) return solarPerSlot
    return solarPerSlot.map(s => Math.min(s, capPerSlot))
  }, [solarPerSlot, capPerSlot])

  const solarRecortado = useMemo(() => {
    if (!solarOn || !solarPerSlot || !effectiveSolarPerSlot) return false
    const total = solarPerSlot.reduce((a, b) => a + b, 0)
    const eff = effectiveSolarPerSlot.reduce((a, b) => a + b, 0)
    return total > eff + 0.001
  }, [solarOn, solarPerSlot, effectiveSolarPerSlot])

  const sinSolar = useMemo(() => {
    if (!consumoPerSlot) return null
    return simulateAutonomy(kWh, consumoPerSlot, ZERO_SLOTS)
  }, [kWh, consumoPerSlot])

  const conSolar = useMemo(() => {
    if (!solarOn || !consumoPerSlot || !effectiveSolarPerSlot) return null
    return simulateAutonomy(kWh, consumoPerSlot, effectiveSolarPerSlot)
  }, [solarOn, consumoPerSlot, effectiveSolarPerSlot, kWh])

  const sinSolarFmt = sinSolar ? formatDuracion(sinSolar.horas) : null
  const conSolarFmt = conSolar ? formatDuracion(conSolar.horas) : null

  return (
    <div className={`rounded-xl border ${styles.border} ${styles.bg} px-3 sm:px-5 py-3 sm:py-4`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
        <span className="text-white text-sm sm:text-base font-semibold truncate">{modelo.nombre}</span>
        <span className={`text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0 ${styles.badge}`}>
          {styles.label}
        </span>
      </div>

      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
        {cfg.paralelo && (
          <Stepper
            value={unidades}
            min={cfg.paralelo.min}
            max={cfg.paralelo.max}
            onChange={changeUnidades}
            label="Unidades"
          />
        )}
        {cfg.bat && (
          <div className={`grid gap-2 sm:gap-3 ${unidades > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            {bateriasPorUnidad.map((b, i) => (
              <Stepper
                key={i}
                value={b}
                min={currentBatMin}
                max={cfg.bat.max}
                onChange={v => updateBaterias(i, v)}
                label={unidades > 1 ? `Baterías Unidad ${i + 1}` : 'Baterías'}
                sublabel={cfg.bat.tipo}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs sm:text-sm text-bluetti-cyan/80 mb-2 sm:mb-3">
        <span>{kWh.toFixed(2)} kWh · {kW.toFixed(1)} kW</span>
      </div>

      {status === 'insufficient' ? (
        <p className="text-xs sm:text-sm text-red-400/80">
          No soporta el pico de potencia requerido
        </p>
      ) : (
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-baseline gap-1.5">
              <span className="text-bluetti-lime text-2xl sm:text-3xl font-bold leading-none">
                {sinSolarFmt?.val}
              </span>
              <span className="text-bluetti-lime text-sm sm:text-base font-semibold">
                {sinSolarFmt?.unit} de autonomía
              </span>
            </div>
            <Link
              to={`/producto/${modelo.id}`}
              className="text-xs sm:text-sm text-bluetti-cyan hover:text-bluetti-cyan underline underline-offset-2 transition-colors shrink-0"
            >
              Ver producto
            </Link>
          </div>
          {conSolar && (
            <>
              {conSolar.autosuficiente ? (
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-yellow-300 text-base sm:text-lg font-bold">
                    ☀ Autosuficiente con solar
                  </span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
                  <span className="text-yellow-200/90 text-sm sm:text-base font-semibold">☀ Con solar:</span>
                  <span className="text-yellow-300 text-sm sm:text-base font-bold">
                    {conSolarFmt?.val} {conSolarFmt?.unit}
                  </span>
                </div>
              )}
              {solarRecortado && (
                <p className="text-yellow-200/70 text-[11px] sm:text-xs mt-0.5">
                  Entrada solar limitada a {capW.toLocaleString('es-AR')} W (máximo del equipo)
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function WattsInput({ value, onCommit }) {
  const [text, setText] = useState(String(value))

  useEffect(() => {
    setText(String(value))
  }, [value])

  function commit() {
    const num = parseInt(text, 10)
    if (Number.isFinite(num) && num > 0) {
      if (num !== value) onCommit(num)
    } else {
      setText(String(value))
    }
  }

  return (
    <input
      type="number"
      min={1}
      step={50}
      value={text}
      onChange={ev => setText(ev.target.value)}
      onBlur={commit}
      onKeyDown={ev => {
        if (ev.key === 'Enter') ev.currentTarget.blur()
      }}
      className="w-16 bg-black/30 border border-bluetti-border rounded px-1.5 py-0.5 text-bluetti-cyan text-xs focus:outline-none focus:border-bluetti-cyan"
    />
  )
}

function TimelineBar({ franja, siblingFranjas, onChange }) {
  const trackRef = useRef(null)
  const [dragMode, setDragMode] = useState(null)
  const [hovered, setHovered] = useState(false)
  const dragOffsetRef = useRef(0)

  function pxToHour(clientX) {
    if (!trackRef.current) return 0
    const rect = trackRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return Math.round(ratio * SLOTS_PER_DAY) / 2
  }

  function startDrag(mode, e) {
    e.preventDefault()
    e.stopPropagation()
    if (mode === 'move' && trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect()
      const startX = rect.left + (franja.inicio / 24) * rect.width
      dragOffsetRef.current = e.clientX - startX
    }
    setDragMode(mode)
  }

  useEffect(() => {
    if (!dragMode) return
    function onMove(e) {
      const adjustedX = dragMode === 'move' ? e.clientX - dragOffsetRef.current : e.clientX
      const hour = pxToHour(adjustedX)
      const duration = franja.fin - franja.inicio

      let candidate = null
      if (dragMode === 'start') {
        const newInicio = Math.max(0, Math.min(franja.fin - SLOT_HOURS, hour))
        if (newInicio !== franja.inicio) candidate = { ...franja, inicio: newInicio }
      } else if (dragMode === 'end') {
        const newFin = Math.max(franja.inicio + SLOT_HOURS, Math.min(24, hour))
        if (newFin !== franja.fin) candidate = { ...franja, fin: newFin }
      } else if (dragMode === 'move') {
        const newStart = Math.max(0, Math.min(24 - duration, hour))
        if (newStart !== franja.inicio) candidate = { ...franja, inicio: newStart, fin: newStart + duration }
      }
      if (candidate && !franjasHaveOverlap([...siblingFranjas, candidate])) {
        onChange(candidate)
      }
    }
    function onUp() { setDragMode(null) }

    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
    document.addEventListener('pointercancel', onUp)
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointercancel', onUp)
    }
  }, [dragMode, franja, siblingFranjas, onChange])

  const startPct = (franja.inicio / 24) * 100
  const widthPct = ((franja.fin - franja.inicio) / 24) * 100

  return (
    <div
      ref={trackRef}
      className="relative flex-1 min-w-[180px] h-9 bg-black/30 border border-bluetti-border rounded select-none touch-none"
    >
      {[6, 12, 18].map(h => (
        <div
          key={`tick-${h}`}
          className="absolute top-1 bottom-1 w-px bg-bluetti-border/40 pointer-events-none"
          style={{ left: `${(h / 24) * 100}%` }}
        />
      ))}
      <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] text-bluetti-cyan/40 pointer-events-none">0h</span>
      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-bluetti-cyan/40 pointer-events-none">24h</span>

      <div
        className="absolute top-0 bottom-0 bg-bluetti-cyan/30 border-y-2 border-bluetti-cyan cursor-move flex items-center justify-center overflow-hidden"
        style={{ left: `${startPct}%`, width: `${widthPct}%` }}
        onPointerDown={e => startDrag('move', e)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <span className="text-[10px] text-bluetti-cyan font-semibold pointer-events-none whitespace-nowrap">
          {formatTime(franja.inicio)}–{formatTime(franja.fin)}
        </span>
        <div
          className="absolute left-0 top-0 bottom-0 w-2 bg-bluetti-cyan/90 cursor-ew-resize hover:bg-bluetti-cyan"
          onPointerDown={e => startDrag('start', e)}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-2 bg-bluetti-cyan/90 cursor-ew-resize hover:bg-bluetti-cyan"
          onPointerDown={e => startDrag('end', e)}
        />
      </div>

      {(hovered || dragMode) && (
        <div
          className="absolute bottom-full mb-1.5 px-2 py-1 bg-bluetti-bg border border-bluetti-cyan rounded text-xs font-semibold text-bluetti-cyan whitespace-nowrap pointer-events-none shadow-lg z-10"
          style={{ left: `${startPct + widthPct / 2}%`, transform: 'translateX(-50%)' }}
        >
          {formatTime(franja.inicio)} – {formatTime(franja.fin)}
        </div>
      )}
    </div>
  )
}

function FranjaRow({ franja, siblingFranjas, onChange, onDelete, canDelete }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <TimelineBar franja={franja} siblingFranjas={siblingFranjas} onChange={onChange} />
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={franja.porcentaje}
        onChange={ev => onChange({ ...franja, porcentaje: Number(ev.target.value) })}
        className="w-20 sm:w-28 accent-bluetti-cyan"
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
  const [solarOn, setSolarOn] = useState(false)
  const [solarPaneles, setSolarPaneles] = useState(4)
  const [solarPanelW, setSolarPanelW] = useState(400)
  const [solarHorasSol, setSolarHorasSol] = useState(5)

  const [modelConfigs, setModelConfigs] = useState(() => {
    const initial = {}
    MODELOS.forEach(m => {
      const cfg = MODEL_CFG[m.id]
      const baseUnidades = cfg.paralelo?.min ?? 1
      const baseBat = batMin(cfg, baseUnidades)
      initial[m.id] = {
        unidades: baseUnidades,
        bateriasPorUnidad: Array(baseUnidades).fill(baseBat),
      }
    })
    return initial
  })

  function updateModelConfig(modelId, newConfig) {
    setModelConfigs(prev => ({ ...prev, [modelId]: newConfig }))
  }

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

  function updateWatts(instanceKey, newWatts) {
    setAgregados(prev => prev.map(e =>
      e.instanceKey === instanceKey ? { ...e, watts: newWatts } : e
    ))
  }

  function updateArranque(instanceKey, value) {
    const num = value === '' ? undefined : Number(value)
    const sane = Number.isFinite(num) && num > 0 ? num : undefined
    setAgregados(prev => prev.map(e =>
      e.instanceKey === instanceKey ? { ...e, arranqueW: sane } : e
    ))
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

  const dailySolar = useMemo(
    () => solarOn ? dailySolarKwh(solarPaneles, solarPanelW, solarHorasSol) : 0,
    [solarOn, solarPaneles, solarPanelW, solarHorasSol]
  )
  const solarPerSlot = useMemo(() => computeSolarPerSlot(dailySolar), [dailySolar])
  const consumoPerSlot = useMemo(() => computeConsumoPerSlot(agregados), [agregados])
  const solarActivo = solarOn && dailySolar > 0

  const dayChartModelOptions = useMemo(() => {
    const contKw = peak.watts / 1000
    const effectiveKw = peak.hasSurge ? peak.surgeWatts / 1000 : contKw
    return MODELOS
      .filter(m => {
        if (movilidad) return m.id === 'rv5'
        if (m.id === 'rv5') return false
        if (m.id === 'es125x' && contKw < 25) return false
        return effectiveKw <= maxKwForModel(m.id)
      })
      .map(m => {
        const { unidades, bateriasPorUnidad } = modelConfigs[m.id]
        const { kWh: capacityKwh } = calcCapacity(m.id, unidades, bateriasPorUnidad)
        const maxSolarW = (MAX_SOLAR_W[m.id] ?? 0) * unidades
        return { id: m.id, nombre: m.nombre, capacityKwh, maxSolarW }
      })
  }, [peak, movilidad, modelConfigs])

  function aplicarPerfil(perfil) {
    const nuevos = []
    perfil.items.forEach(item => {
      const electro = ELECTRODOMESTICOS.find(e => e.id === item.id)
      if (!electro) return
      const itemFranjas = item.franjas ?? [DEFAULT_FRANJA]
      for (let i = 0; i < item.cantidad; i++) {
        nuevos.push({
          ...electro,
          instanceKey: makeInstanceKey(electro.id),
          franjas: itemFranjas.map(f => ({ ...f })),
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
        Seleccioná los equipos que querés alimentar y calculá cuánto tiempo te dura cada modelo BLUETTI.
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
      </div>

      {totalKwh > 0 && (
        <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DayChart
              consumoPerSlot={consumoPerSlot}
              solarPerSlot={solarPerSlot}
              solarOn={solarActivo}
              modelOptions={dayChartModelOptions}
            />
          </div>
          <DayClock agregados={agregados} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna izquierda */}
        <div>
          <h2 className="text-sm font-semibold text-bluetti-cyan uppercase tracking-wider mb-4">
            Equipos disponibles
          </h2>
          <div className="mb-4 bg-bluetti-card border border-dashed border-bluetti-border rounded-xl p-4">
            <p className="text-xs font-semibold text-bluetti-cyan uppercase tracking-wider mb-3">
              Agregar equipo personalizado
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nombre"
                value={customNombre}
                onChange={e => setCustomNombre(e.target.value)}
                className="flex-1 min-w-0 bg-black/30 border border-bluetti-border rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-bluetti-cyan"
              />
              <input
                type="number"
                placeholder="Watts"
                min={1}
                value={customWatts}
                onChange={e => setCustomWatts(e.target.value)}
                className="w-20 sm:w-24 shrink-0 bg-black/30 border border-bluetti-border rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-bluetti-cyan"
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
                            className="flex items-center justify-between bg-bluetti-card px-4 py-3 gap-2"
                          >
                            <div className="min-w-0 flex-1 flex items-baseline gap-2">
                              <span className="text-white text-sm truncate">{e.nombre}</span>
                              <span className="text-bluetti-cyan/70 text-xs shrink-0">{e.watts}W</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
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
            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
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
                  Casa Rodante / Barco
                </button>
              </div>
              {agregados.length > 0 && (
                <button
                  onClick={() => setAgregados([])}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border border-red-800 text-red-400 hover:bg-red-900/20 transition-all"
                >
                  Limpiar
                </button>
              )}
            </div>

            {agregados.length === 0 ? (
              <div className="bg-bluetti-card border border-dashed border-bluetti-border rounded-xl p-8 text-center">
                <p className="text-bluetti-cyan/70 text-sm">
                  Agregá equipos de la lista para calcular la autonomía.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {agregadosConNombre.map(e => (
                  <div
                    key={e.instanceKey}
                    className="bg-bluetti-card border border-bluetti-border rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <span className="text-white text-sm font-medium truncate min-w-0">{e.displayName}</span>
                      <button
                        onClick={() => quitar(e.instanceKey)}
                        className="text-gray-600 hover:text-red-400 text-lg leading-none transition-colors shrink-0"
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
                    <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                      <label className="flex items-center gap-1.5 text-bluetti-cyan/70" title="Editá los W si tu equipo consume distinto al valor estándar">
                        <WattsInput
                          value={e.watts}
                          onCommit={w => updateWatts(e.instanceKey, w)}
                        />
                        <span>W = {electroDailyKwh(e).toFixed(2)} kWh/día</span>
                      </label>
                      <label
                        className="flex items-center gap-1.5 text-bluetti-cyan/70"
                        title="Algunos equipos (heladera, microondas, bomba, aire) necesitan un pico de W más alto al arrancar. Opcional."
                      >
                        <span>Pico arranque</span>
                        <input
                          type="number"
                          min={e.watts}
                          step={50}
                          placeholder="—"
                          value={e.arranqueW ?? ''}
                          onChange={ev => updateArranque(e.instanceKey, ev.target.value)}
                          className="w-20 bg-black/30 border border-bluetti-border rounded px-1.5 py-0.5 text-bluetti-cyan text-xs focus:outline-none focus:border-bluetti-cyan"
                        />
                        <span>W</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Solar opcional */}
          <div className="bg-bluetti-card border border-bluetti-border rounded-xl p-4">
            <button
              onClick={() => setSolarOn(v => !v)}
              className="w-full flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white text-sm font-semibold">☀ Paneles Solares</span>
                {solarActivo && (
                  <span className="text-yellow-300 text-xs font-semibold">
                    +{dailySolar.toFixed(2)} kWh/día
                  </span>
                )}
              </div>
              <span
                className={`relative inline-block w-10 h-5 rounded-full transition-colors shrink-0 ${
                  solarOn ? 'bg-bluetti-cyan' : 'bg-bluetti-border'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-bluetti-bg transition-transform ${
                    solarOn ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </span>
            </button>

            {solarOn && (
              <div className="mt-4 space-y-3 pt-4 border-t border-bluetti-border">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-bluetti-cyan/80 text-xs uppercase tracking-wider">Paneles</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSolarPaneles(p => Math.max(1, p - 1))}
                      disabled={solarPaneles <= 1}
                      className="w-8 h-8 rounded-lg bg-bluetti-border hover:bg-red-900/40 text-bluetti-cyan/80 hover:text-red-400 font-bold flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >−</button>
                    <span className="text-bluetti-cyan font-bold text-base w-6 text-center">{solarPaneles}</span>
                    <button
                      onClick={() => setSolarPaneles(p => Math.min(40, p + 1))}
                      disabled={solarPaneles >= 40}
                      className="w-8 h-8 rounded-lg bg-bluetti-border hover:bg-bluetti-cyan hover:text-bluetti-bg text-bluetti-cyan/80 font-bold flex items-center justify-center transition-all disabled:opacity-30"
                    >+</button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-bluetti-cyan/80 text-xs uppercase tracking-wider">Wp por panel</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSolarPanelW(w => Math.max(200, w - 50))}
                      disabled={solarPanelW <= 200}
                      className="w-8 h-8 rounded-lg bg-bluetti-border hover:bg-red-900/40 text-bluetti-cyan/80 hover:text-red-400 font-bold flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >−</button>
                    <span className="text-bluetti-cyan font-bold text-base w-14 text-center">{solarPanelW} W</span>
                    <button
                      onClick={() => setSolarPanelW(w => Math.min(1000, w + 50))}
                      disabled={solarPanelW >= 1000}
                      className="w-8 h-8 rounded-lg bg-bluetti-border hover:bg-bluetti-cyan hover:text-bluetti-bg text-bluetti-cyan/80 font-bold flex items-center justify-center transition-all disabled:opacity-30"
                    >+</button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-bluetti-cyan/80 text-xs uppercase tracking-wider">Horas pico de sol</span>
                    <span className="text-bluetti-cyan font-bold text-sm">{solarHorasSol} hs</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={8}
                    value={solarHorasSol}
                    onChange={e => setSolarHorasSol(Number(e.target.value))}
                    className="w-full accent-bluetti-cyan"
                  />
                  <div className="flex justify-between text-gray-600 text-[10px] mt-0.5">
                    <span>Nublado (2)</span>
                    <span>Pleno verano (8)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Panel de resultados */}
          <div className="bg-bluetti-card border border-bluetti-border rounded-xl p-4 sm:p-5">
            <div className="flex items-baseline justify-between gap-2 mb-2">
              <span className="text-bluetti-cyan text-xs sm:text-sm">Consumo total estimado</span>
              <span className="text-bluetti-cyan text-xl sm:text-3xl font-bold">
                {totalKwh.toFixed(2)}
                <span className="text-xs sm:text-sm font-normal text-bluetti-cyan ml-1 inline-block w-12 sm:w-16 text-left">kWh/día</span>
              </span>
            </div>
            {peak.watts > 0 && (
              <div className="flex items-baseline justify-between gap-2 mb-2">
                <span className="text-bluetti-cyan text-xs sm:text-sm">
                  Pico de consumo <span className="text-bluetti-cyan/60 text-[10px] sm:text-xs">(a las {formatTime(peak.time)})</span>
                </span>
                <span className="text-bluetti-cyan text-xl sm:text-3xl font-bold">
                  {(peak.watts / 1000).toFixed(2)}
                  <span className="text-xs sm:text-sm font-normal text-bluetti-cyan ml-1 inline-block w-12 sm:w-16 text-left">kW</span>
                </span>
              </div>
            )}
            {peak.hasSurge && (
              <div className="flex items-baseline justify-between gap-2 mb-4 sm:mb-5">
                <span className="text-bluetti-cyan text-xs sm:text-sm">
                  Pico de arranque <span className="text-bluetti-cyan/60 text-[10px] sm:text-xs">(a las {formatTime(peak.surgeTime)})</span>
                </span>
                <span className="text-bluetti-lime text-xl sm:text-3xl font-bold">
                  {(peak.surgeWatts / 1000).toFixed(2)}
                  <span className="text-xs sm:text-sm font-normal text-bluetti-lime ml-1 inline-block w-12 sm:w-16 text-left">kW</span>
                </span>
              </div>
            )}
            {peak.watts > 0 && !peak.hasSurge && <div className="mb-4 sm:mb-5" />}

            {totalKwh === 0 ? (
              <p className="text-bluetti-cyan/70 text-sm text-center py-4">
                Agregá equipos para ver qué modelos BLUETTI te convienen.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-bluetti-cyan/70 uppercase tracking-wider mb-3">
                  Configurá cada modelo para ver su autonomía
                </p>
                {(() => {
                  const contKw = peak.watts / 1000
                  const effectiveKw = peak.hasSurge ? peak.surgeWatts / 1000 : contKw
                  return MODELOS
                    .filter(m => {
                      if (movilidad) return m.id === 'rv5'
                      if (m.id === 'rv5') return false
                      if (m.id === 'es125x' && contKw < 25) return false
                      return effectiveKw <= maxKwForModel(m.id)
                    })
                    .map(modelo => (
                      <ModelCard
                        key={modelo.id}
                        modelo={modelo}
                        totalKwh={totalKwh}
                        totalKw={effectiveKw}
                        solarOn={solarActivo}
                        consumoPerSlot={consumoPerSlot}
                        solarPerSlot={solarPerSlot}
                        config={modelConfigs[modelo.id]}
                        onChangeConfig={newCfg => updateModelConfig(modelo.id, newCfg)}
                      />
                    ))
                })()}
                <p
                  className="text-[10px] sm:text-xs text-bluetti-cyan/60 mt-2 leading-relaxed"
                  title="Las baterías LiFePO4 no se descargan al 100% en uso normal (10% reserva). El inversor pierde ~8% al convertir DC en AC."
                >
                  Cálculo conservador: incluye {Math.round(EFICIENCIA_INVERSOR * 100)}% de eficiencia del inversor (DC→AC) y {Math.round((1 - DOD_BATERIA) * 100)}% de reserva de batería (DOD usable).
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
