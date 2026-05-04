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
  { id: 'es125x', nombre: 'ES125 X', capacidad: 241 },
  { id: 'ep2000', nombre: 'EP2000', capacidad: 14.7 },
  { id: 'ep760', nombre: 'EP760', capacidad: 4.96 },
  { id: 'apex300', nombre: 'APEX 300', capacidad: 2.764 },
  { id: 'ac200pl', nombre: 'AC200P L', capacidad: 2.304 },
  { id: 'rv5', nombre: 'RV5', capacidad: null },
]

function colorHoras(horas) {
  if (horas === null) return 'border-gray-600 bg-gray-800/40'
  if (horas >= 8) return 'border-green-500 bg-green-900/20'
  if (horas >= 2) return 'border-yellow-500 bg-yellow-900/20'
  return 'border-red-500 bg-red-900/20'
}

function textoHoras(horas) {
  if (horas === null) return { label: 'Requiere batería externa', color: 'text-gray-400' }
  if (horas >= 8) return { label: `Cubre ${horas.toFixed(1)} horas`, color: 'text-green-400' }
  if (horas >= 2) return { label: `Cubre parcialmente (${horas.toFixed(1)} h)`, color: 'text-yellow-400' }
  return { label: `Insuficiente (${horas.toFixed(1)} h)`, color: 'text-red-400' }
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

  const idsAgregados = new Set(agregados.map(e => e.id))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">Calculadora de Autonomía</h1>
      <p className="text-gray-400 text-sm mb-8">
        Seleccioná los electrodomésticos que querés alimentar y calculá cuánto tiempo te dura cada modelo BLUETTI.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna izquierda: lista disponible */}
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

        {/* Columna derecha: seleccionados + resultado */}
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

          {/* Resultado */}
          <div className="bg-bluetti-card border border-bluetti-border rounded-xl p-5">
            <div className="flex items-baseline justify-between mb-5">
              <span className="text-gray-400 text-sm">Consumo total estimado</span>
              <span className="text-bluetti-cyan text-3xl font-bold">
                {totalKwh.toFixed(2)}
                <span className="text-sm font-normal text-gray-400 ml-1">kWh/día</span>
              </span>
            </div>

            {totalKwh === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                Agregá electrodomésticos para ver qué modelos BLUETTI te convienen.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Cobertura por modelo</p>
                {MODELOS.map(modelo => {
                  const horas = modelo.capacidad !== null
                    ? modelo.capacidad / totalKwh * 24
                    : null
                  const { label, color } = textoHoras(horas)
                  return (
                    <div
                      key={modelo.id}
                      className={`flex items-center justify-between rounded-lg border px-4 py-3 ${colorHoras(horas)}`}
                    >
                      <span className="text-white text-sm font-medium">{modelo.nombre}</span>
                      <span className={`text-sm font-semibold ${color}`}>{label}</span>
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
