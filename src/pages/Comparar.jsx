import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCompare } from '../components/CompareContext'
import { CATEGORIA_LABELS } from '../data/categorias'
import products from '../data/products.json'

const COMPARE_ROWS = [
  { label: 'Tipo de red', get: p => p.tipoRed },
  { label: 'Categoría', get: p => CATEGORIA_LABELS[p.categoria] ?? p.categoria },
  { label: 'Capacidad de batería', get: p => p.specs.capacidadBateria },
  { label: 'Capacidad máx. con expansión', get: p => p.specs.capacidadMaxConExpansion },
  {
    label: 'Potencia de salida AC',
    get: p => {
      const off = p.specs.potenciaSalidaAC_offGrid
      const on = p.specs.potenciaSalidaAC_onGrid
      if (off || on) {
        return [on && `${on} (on-grid)`, off && `${off} (off-grid)`].filter(Boolean).join(' · ')
      }
      return p.specs.potenciaSalidaAC
    },
  },
  { label: 'Potencia máxima / pico', get: p => p.specs.potenciaMaxSalida ?? p.specs.potenciaSobrecarga ?? p.specs.potenciaMaxParalelo ?? p.specs.potenciaMaxConSolar ?? p.specs.potenciaMaxima },
  { label: 'Entrada solar máxima', get: p => p.specs.entradaSolarMax ?? p.specs.entradaSolarBase },
  { label: 'Conexión solar', get: p => p.specs.conexionSolar },
  { label: 'Tipo de batería', get: p => p.specs.tipoBateria },
  { label: 'Ciclos de vida', get: p => p.specs.ciclosVida },
  { label: 'Baterías / packs compatibles', get: p => p.specs.bateriaCompatible ?? p.specs.notaExpansion },
  { label: 'Expandible', get: p => p.specs.expandible },
  { label: 'Fase eléctrica', get: p => p.specs.fase },
  { label: 'Switchover UPS', get: p => p.specs.switchoverUPS },
  { label: 'Conectividad', get: p => p.specs.conectividad },
  { label: 'Tipo de instalación', get: p => p.specs.instalacion },
  { label: 'Peso', get: p => p.specs.peso },
  { label: 'Dimensiones', get: p => p.specs.dimensiones },
  { label: 'Temperatura de operación', get: p => p.specs.temperaturaOperacion },
  { label: 'Garantía', get: p => p.specs.garantia },
]

function renderValue(val, isDiff) {
  if (val === undefined || val === null || val === '') {
    return <span className="text-gray-600 italic">—</span>
  }
  const text = typeof val === 'boolean' ? (val ? 'Sí' : 'No') : String(val)
  return <span className={isDiff ? 'text-bluetti-cyan font-semibold' : 'text-white'}>{text}</span>
}

export default function Comparar() {
  const { selectedIds, clearCompare, isFull } = useCompare()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isFull()) {
      navigate('/', { replace: true })
    }
  }, [isFull, navigate])

  if (!isFull()) return null

  const [p1, p2] = selectedIds.map(id => products.find(p => p.id === id))

  const rows = COMPARE_ROWS
    .map(r => ({ label: r.label, v1: r.get(p1), v2: r.get(p2) }))
    .filter(r => (r.v1 !== undefined && r.v1 !== null && r.v1 !== '') ||
                 (r.v2 !== undefined && r.v2 !== null && r.v2 !== ''))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-white">Comparación de productos</h1>
        <button
          onClick={() => { clearCompare(); navigate('/') }}
          className="text-sm text-bluetti-cyan hover:text-white border border-bluetti-border hover:border-gray-500 px-4 py-2 rounded-lg transition-all"
        >
          Limpiar comparación
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-2">
        <div />
        {[p1, p2].map(product => (
          <div
            key={product.id}
            className="bg-bluetti-card border border-bluetti-border rounded-xl p-4 text-center"
          >
            <div className="bg-black/30 rounded-lg flex items-center justify-center h-28 sm:h-56 mb-3 p-2">
              <img
                src={`/images/${product.imagen}`}
                alt={product.nombre}
                className="max-h-full max-w-full object-contain"
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
            <h2 className="text-white font-bold text-lg">{product.nombre}</h2>
            <p className="text-bluetti-cyan text-xs mt-1">{product.tagline}</p>
            <Link
              to={`/producto/${product.id}`}
              className="inline-block mt-3 text-bluetti-cyan text-xs hover:underline"
            >
              Ver detalle completo →
            </Link>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-bluetti-border overflow-hidden">
        {rows.map((row, i) => {
          const differ = String(row.v1 ?? '') !== String(row.v2 ?? '')
          return (
            <div
              key={row.label}
              className={`grid grid-cols-3 gap-4 px-4 py-3 text-sm ${
                i % 2 === 0 ? 'bg-bluetti-card' : 'bg-bluetti-bg'
              } ${differ ? 'border-l-2 border-bluetti-cyan' : ''}`}
            >
              <span className="text-bluetti-cyan font-medium">{row.label}</span>
              {renderValue(row.v1, differ)}
              {renderValue(row.v2, differ)}
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link to="/" className="text-sm text-bluetti-cyan hover:text-white transition-colors">
          ← Volver al catálogo
        </Link>
      </div>
    </div>
  )
}
