import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCompare } from '../components/CompareContext'
import { formatKey } from '../utils'
import products from '../data/products.json'

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

  const allSpecKeys = Array.from(
    new Set([...Object.keys(p1.specs), ...Object.keys(p2.specs)])
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-white">Comparación de productos</h1>
        <button
          onClick={() => { clearCompare(); navigate('/') }}
          className="text-sm text-gray-400 hover:text-white border border-bluetti-border hover:border-gray-500 px-4 py-2 rounded-lg transition-all"
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
            <div className="bg-black/30 rounded-lg flex items-center justify-center h-36 mb-3 p-2">
              <img
                src={`/images/${product.imagen}`}
                alt={product.nombre}
                className="max-h-full max-w-full object-contain"
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
            <h2 className="text-white font-bold text-lg">{product.nombre}</h2>
            <p className="text-gray-400 text-xs mt-1">{product.tagline}</p>
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
        {allSpecKeys.map((key, i) => {
          const v1 = p1.specs[key]
          const v2 = p2.specs[key]
          const differ = String(v1 ?? '') !== String(v2 ?? '')

          return (
            <div
              key={key}
              className={`grid grid-cols-3 gap-4 px-4 py-3 text-sm ${
                i % 2 === 0 ? 'bg-bluetti-card' : 'bg-bluetti-bg'
              } ${differ ? 'border-l-2 border-bluetti-cyan' : ''}`}
            >
              <span className="text-gray-400 font-medium">{formatKey(key)}</span>
              {[v1, v2].map((val, j) => (
                <span
                  key={j}
                  className={
                    val === undefined
                      ? 'text-gray-600 italic'
                      : differ
                      ? 'text-bluetti-cyan font-semibold'
                      : 'text-white'
                  }
                >
                  {val === undefined
                    ? '—'
                    : typeof val === 'boolean'
                    ? (val ? 'Sí' : 'No')
                    : String(val)}
                </span>
              ))}
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
          ← Volver al catálogo
        </Link>
      </div>
    </div>
  )
}
