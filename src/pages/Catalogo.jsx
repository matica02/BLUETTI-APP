import { useState } from 'react'
import products from '../data/products.json'
import { CATEGORIA_LABELS } from '../data/categorias'
import ProductCard from '../components/ProductCard'
import FilterBar from '../components/FilterBar'

export default function Catalogo() {
  const [activeFilter, setActiveFilter] = useState('Todos')

  const filteredProducts = activeFilter === 'Todos'
    ? products
    : products.filter(p => CATEGORIA_LABELS[p.categoria] === activeFilter)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Productos <span className="text-bluetti-cyan">BLUETTI</span>
        </h1>
        <p className="text-gray-400">
          Sistemas de almacenamiento de energía para cada necesidad
        </p>
      </div>

      <div className="mb-6">
        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          No hay productos en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
