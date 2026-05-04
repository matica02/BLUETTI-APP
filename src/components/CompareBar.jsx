import { useNavigate } from 'react-router-dom'
import { useCompare } from './CompareContext'
import products from '../data/products.json'

export default function CompareBar() {
  const { selectedIds, removeFromCompare, isFull } = useCompare()
  const navigate = useNavigate()

  if (selectedIds.length === 0) return null

  const selectedProducts = selectedIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-bluetti-card border-t border-bluetti-border shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {selectedProducts.map(product => (
            <div key={product.id} className="flex items-center gap-2 bg-bluetti-bg rounded-lg px-3 py-2">
              <img
                src={`/images/${product.imagen}`}
                alt={product.nombre}
                className="w-10 h-10 object-contain"
                onError={e => { e.target.style.display = 'none' }}
              />
              <span className="text-sm text-white font-medium truncate max-w-[120px]">
                {product.nombre}
              </span>
              <button
                onClick={() => removeFromCompare(product.id)}
                className="text-gray-400 hover:text-white ml-1 flex-shrink-0 leading-none"
                aria-label={`Quitar ${product.nombre} de la comparación`}
              >
                ✕
              </button>
            </div>
          ))}

          {selectedIds.length === 1 && (
            <span className="text-gray-500 text-sm hidden sm:block">
              Seleccioná un producto más para comparar
            </span>
          )}
        </div>

        <button
          onClick={() => navigate('/comparar')}
          disabled={!isFull()}
          className="flex-shrink-0 bg-bluetti-cyan text-bluetti-bg font-bold px-5 py-2 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
        >
          Comparar ahora →
        </button>
      </div>
    </div>
  )
}
