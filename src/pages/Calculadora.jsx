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

const PERFILES = [
  {
    id: 'casa',
    nombre: 'Casa',
    items: [
      { id: 'heladera', cantidad: 1, horas: 24 },
      { id: 'freezer', cantidad: 1, horas: 24 },
      { id: 'tv', cantidad: 1, horas: 6 },
      { id: 'led', cantidad: 1, horas: 8 },
      { id: 'wifi', cantidad: 1, horas: 24 },
      { id: 'celular', cantidad: 2, horas: 2 },
      { id: 'pava', cantidad: 1, horas: 1 },
      { id: 'notebook', cantidad: 1, horas: 4 },
    ],
  },
  {
    id: 'camping',
    nombre: 'Camping',
    items: [
      { id: 'heladera', cantidad: 1, horas: 24 },
      { id: 'led', cantidad: 1, horas: 6 },
      { id: 'celular', cantidad: 3, horas: 2 },
      { id: 'ventilador', cantidad: 1, horas: 8 },
      { id: 'pava', cantidad: 1, horas: 1 },
    ],
  },
  {
    id: 'comercio',
    nombre: 'Comercio',
    items: [
      { id: 'heladera_comercial', cantidad: 1, horas: 24 },
      { id: 'led', cantidad: 2, horas: 10 },
      { id: 'wifi', cantidad: 1, horas: 24 },
      { id: 'pc', cantidad: 1, horas: 8 },
      { id: 'alarma', cantidad: 1, horas: 24 },
      { id: 'camara', cantidad: 2, horas: 24 },
    ],
  },
  {
    id: 'obra',
    nombre: 'Obra',
    items: [
      { id: 'herramientas', cantidad: 2, horas: 4 },
      { id: 'led', cantidad: 1, horas: 6 },
      { id: 'celular', cantidad: 3, horas: 1 },
      { id: 'bomba', cantidad: 1, horas: 2 },
    ],
  },
  {
    id: 'industrial',
    nombre: 'Industrial',
    items: [
      { id: 'compresor_20hp', cantidad: 1, horas: 8 },
      { id: 'compresor_10hp', cantidad: 1, horas: 8 },
      { id: 'soldadora_mig', cantidad: 3, horas: 4 },
      { id: 'torno_industrial', cantidad: 2, horas: 6 },
      { id: 'fresadora_cnc', cantidad: 2, horas: 6 },
      { id: 'motor_trifasico', cantidad: 2, horas: 8 },
      { id: 'iluminacion_galpon', cantidad: 5, horas: 10 },
      { id: 'extractor_industrial', cantidad: 1, horas: 8 },
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

export default function Calculadora() {
  const { agregados, setAgregados, openCats, setOpenCats } = useCalculadora()
  const [customNombre, setCustomNombre] = useState('')
  const [customWatts, setCustomWatts] = useState('')
  const [movilidad, setMovilidad] = useState(false)

  function toggleCat(id) {
    setOpenCats(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function agregar(electro) {
    setAgregados(prev => {
      const existe = prev.find(e => e.id === electro.id)
      if (existe) return prev.map(e => e.id === electro.id ? { ...e, cantidad: e.cantidad + 1 } : e)
      return [...prev, { ...electro, horas: 4, cantidad: 1 }]
    })
  }

  function quitar(id) {
    setAgregados(prev => prev.filter(e => e.id !== id))
  }

  function setCantidad(id, nueva) {
    if (nueva <= 0) return quitar(id)
    setAgregados(prev => prev.map(e => e.id === id ? { ...e, cantidad: nueva } : e))
  }

  function setHoras(id, horas) {
    setAgregados(prev => prev.map(e => e.id === id ? { ...e, horas } : e))
  }

  const totalKwh = useMemo(() =>
    agregados.reduce((sum, e) => sum + (e.watts * e.cantidad * e.horas) / 1000, 0),
    [agregados]
  )

  const totalWatts = useMemo(() =>
    agregados.reduce((sum, e) => sum + e.watts * e.cantidad, 0),
    [agregados]
  )

  function aplicarPerfil(perfil) {
    const nuevos = perfil.items.map(item => {
      const electro = ELECTRODOMESTICOS.find(e => e.id === item.id)
      return { ...electro, cantidad: item.cantidad, horas: item.horas }
    })
    setAgregados(nuevos)
  }

  const cantidadPorId = Object.fromEntries(agregados.map(e => [e.id, e.cantidad]))

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
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-bluetti-cyan text-xs">Cantidad:</span>
                      <button
                        onClick={() => setCantidad(e.id, e.cantidad - 1)}
                        className="w-6 h-6 rounded bg-bluetti-border hover:bg-red-900/40 text-bluetti-cyan/80 hover:text-red-400 text-sm font-bold flex items-center justify-center transition-all"
                      >
                        −
                      </button>
                      <span className="text-bluetti-cyan font-bold text-sm w-4 text-center">{e.cantidad}</span>
                      <button
                        onClick={() => setCantidad(e.id, e.cantidad + 1)}
                        className="w-6 h-6 rounded bg-bluetti-border hover:bg-bluetti-cyan hover:text-bluetti-bg text-bluetti-cyan/80 text-sm font-bold flex items-center justify-center transition-all"
                      >
                        +
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
                    <div className="text-bluetti-cyan/70 text-xs mt-1">
                      {e.watts}W × {e.cantidad} × {e.horas}h = {((e.watts * e.cantidad * e.horas) / 1000).toFixed(2)} kWh/día
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
            {totalWatts > 0 && (
              <div className="flex items-baseline justify-between mb-5">
                <span className="text-bluetti-cyan text-sm">Potencia simultánea</span>
                <span className="text-bluetti-cyan text-3xl font-bold">
                  {(totalWatts / 1000).toFixed(2)}
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
                    const kw = totalWatts / 1000
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
                      totalKw={totalWatts / 1000}
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
