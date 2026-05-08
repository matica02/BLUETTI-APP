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

      <section className="mt-12 mb-4">
        <h2 className="text-xl font-bold text-white mb-4">Manual para APP Bluetti</h2>
        <div className="bg-bluetti-card border border-bluetti-border rounded-2xl p-6 flex flex-col items-start gap-3">
          <a
            href="/pdf/manual-app.pdf"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 border border-bluetti-cyan text-bluetti-cyan font-semibold px-6 py-3 rounded-xl hover:bg-bluetti-cyan hover:text-bluetti-bg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Descargar Manual para APP Bluetti
          </a>
          <p className="text-gray-500 text-sm">Archivo PDF · Manual de uso de la aplicación</p>
        </div>
      </section>
    </div>
  )
}
