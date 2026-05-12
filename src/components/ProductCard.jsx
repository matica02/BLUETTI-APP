import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useCompare } from './CompareContext'
import { CATEGORIA_LABELS, CATEGORIA_COLORS } from '../data/categorias'

export default function ProductCard({ product }) {
  const { addToCompare, removeFromCompare, isSelected, isFull } = useCompare()

  const label = CATEGORIA_LABELS[product.categoria] ?? product.categoria
  const colorClass = CATEGORIA_COLORS[label] ?? 'bg-gray-800 text-bluetti-cyan/80 border border-gray-700'
  const selected = isSelected(product.id)
  const disabled = isFull() && !selected

  const allImages = [product.imagen, ...(product.imagenes ?? [])]
  const hasMultiple = allImages.length > 1
  // Strip with clone of first image at the end for seamless looping
  const stripImages = hasMultiple ? [...allImages, allImages[0]] : allImages

  const [currentIndex, setCurrentIndex] = useState(0)
  const [animated, setAnimated] = useState(true)
  const paused = useRef(false)

  useEffect(() => {
    if (!hasMultiple) return
    const interval = setInterval(() => {
      if (!paused.current) {
        setAnimated(true)
        setCurrentIndex(i => i + 1)
      }
    }, 2500)
    return () => clearInterval(interval)
  }, [hasMultiple])

  // When we land on the clone (last item), snap silently back to index 0
  useEffect(() => {
    if (currentIndex === stripImages.length - 1) {
      const timeout = setTimeout(() => {
        setAnimated(false)
        setCurrentIndex(0)
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, stripImages.length])

  // Re-enable animation after snap
  useEffect(() => {
    if (!animated) {
      const timeout = setTimeout(() => setAnimated(true), 50)
      return () => clearTimeout(timeout)
    }
  }, [animated])

  function handleCompareClick() {
    if (selected) {
      removeFromCompare(product.id)
    } else {
      addToCompare(product.id)
    }
  }

  const dotIndex = currentIndex % allImages.length

  return (
    <div
      className={`bg-bluetti-card border rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:border-bluetti-lime hover:scale-105 hover:z-10 ${
        selected ? 'border-bluetti-cyan' : 'border-bluetti-border'
      }`}
    >
      <div
        className="relative overflow-hidden h-48 sm:h-80"
        onMouseEnter={() => { paused.current = true }}
        onMouseLeave={() => { paused.current = false }}
      >
        <div
          className={animated ? 'flex h-full transition-transform duration-500 ease-in-out' : 'flex h-full'}
          style={{
            width: `${stripImages.length * 100}%`,
            transform: `translateX(-${currentIndex * (100 / stripImages.length)}%)`
          }}
        >
          {stripImages.map((img, i) => (
            <div
              key={i}
              className="h-full flex items-center justify-center p-4 bg-black/30 flex-shrink-0"
              style={{ width: `${100 / stripImages.length}%` }}
            >
              <img
                src={`/images/${img}`}
                alt={product.nombre}
                className="max-h-full max-w-full object-contain"
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-white font-bold text-lg leading-tight">{product.nombre}</h3>
            <p className="text-bluetti-cyan text-sm mt-1 line-clamp-2">{product.tagline}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${colorClass}`}>
            {label}
          </span>
        </div>

        <div className="flex gap-2 mt-auto">
          <Link
            to={`/producto/${product.id}`}
            className="flex-1 text-center bg-bluetti-lime text-bluetti-bg font-semibold text-sm py-2 rounded-lg hover:brightness-110 transition-all"
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
                : 'border-bluetti-border text-bluetti-cyan hover:border-bluetti-cyan hover:text-bluetti-cyan'
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
