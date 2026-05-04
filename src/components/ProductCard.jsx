import { Link } from 'react-router-dom'
import { useCompare } from './CompareContext'
import { CATEGORIA_LABELS, CATEGORIA_COLORS } from '../data/categorias'

export default function ProductCard({ product }) {
  const { addToCompare, removeFromCompare, isSelected, isFull } = useCompare()

  const label = CATEGORIA_LABELS[product.categoria] ?? product.categoria
  const colorClass = CATEGORIA_COLORS[label] ?? 'bg-gray-800 text-gray-300 border border-gray-700'
  const selected = isSelected(product.id)
  const disabled = isFull() && !selected

  function handleCompareClick() {
    if (selected) {
      removeFromCompare(product.id)
    } else {
      addToCompare(product.id)
    }
  }

  return (
    <div
      className={`bg-bluetti-card border rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:border-bluetti-cyan/50 ${
        selected ? 'border-bluetti-cyan' : 'border-bluetti-border'
      }`}
    >
      <div className="bg-black/30 flex items-center justify-center h-48 p-4">
        <img
          src={`/images/${product.imagen}`}
          alt={product.nombre}
          className="max-h-full max-w-full object-contain"
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-white font-bold text-lg leading-tight">{product.nombre}</h3>
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{product.tagline}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${colorClass}`}>
            {label}
          </span>
        </div>

        <div className="flex gap-2 mt-auto">
          <Link
            to={`/producto/${product.id}`}
            className="flex-1 text-center bg-bluetti-cyan text-bluetti-bg font-semibold text-sm py-2 rounded-lg hover:brightness-110 transition-all"
          >
            Ver detalle
          </Link>
          <button
            onClick={handleCompareClick}
            disabled={disabled}
            className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
              selected
                ? 'bg-bluetti-cyan/20 border-bluetti-cyan text-bluetti-cyan'
                : disabled
                ? 'border-gray-700 text-gray-600 cursor-not-allowed'
                : 'border-bluetti-border text-gray-400 hover:border-bluetti-cyan hover:text-bluetti-cyan'
            }`}
            aria-label={
              selected
                ? `Quitar ${product.nombre} de comparación`
                : `Agregar ${product.nombre} a comparación`
            }
          >
            {selected ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  )
}
