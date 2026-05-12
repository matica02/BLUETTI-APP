import { useState } from 'react'
import products from '../data/products.json'
import { CATEGORIA_LABELS } from '../data/categorias'
import ProductCard from '../components/ProductCard'
import FilterBar from '../components/FilterBar'
import CatalogoCarousel from '../components/CatalogoCarousel'

export default function Catalogo() {
  const [activeFilter, setActiveFilter] = useState('Todos')

  const filteredProducts = activeFilter === 'Todos'
    ? products
    : products.filter(p => CATEGORIA_LABELS[p.categoria] === activeFilter)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Distribuidor oficial BLUETTI' },
          { label: 'Garantía de fábrica' },
          { label: 'Envío a todo el país' },
          { label: 'Soporte técnico' },
        ].map(item => (
          <div key={item.label} className="bg-white/5 backdrop-blur-sm border border-bluetti-border rounded-xl px-4 py-3 flex items-center gap-2">
            <span className="text-bluetti-lime font-bold text-sm shrink-0">✓</span>
            <span className="text-bluetti-cyan/80 text-xs font-medium">{item.label}</span>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <CatalogoCarousel />
      </section>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Productos <span className="text-bluetti-cyan">BLUETTI</span>
        </h1>
        <p className="text-bluetti-cyan">
          Sistemas de almacenamiento de energía para cada necesidad
        </p>
      </div>

      <div className="mb-6">
        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-bluetti-cyan/70 text-center py-16">
          No hay productos en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Descargá la APP Bluetti</h2>
        <div className="bg-white/5 backdrop-blur-sm border border-bluetti-border rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
          <img
            src="/images/logo-app-bluetti.png"
            alt="App Bluetti"
            className="w-24 h-24 rounded-2xl object-cover shrink-0"
          />
          <div className="flex flex-col gap-3 w-full">
            <p className="text-bluetti-cyan text-sm">Controlá y monitoreá tus equipos BLUETTI desde tu celular.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://apps.apple.com/ar/app/bluetti/id1550568336?l=en-GB"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-bluetti-cyan text-bluetti-cyan font-semibold px-5 py-3 rounded-xl hover:bg-bluetti-cyan hover:text-bluetti-bg transition-all justify-center sm:justify-start"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=net.poweroak.bluetticloud&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-bluetti-cyan text-bluetti-cyan font-semibold px-5 py-3 rounded-xl hover:bg-bluetti-cyan hover:text-bluetti-bg transition-all justify-center sm:justify-start"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.3.17.65.19.96.08l.07-.04 10.95-6.32-2.33-2.34-9.65 8.62zM.5 1.6C.19 1.97 0 2.5 0 3.14v17.72c0 .64.19 1.17.51 1.54l.08.08 9.92-9.92v-.23L.58 1.52.5 1.6zM20.65 10.16l-2.37-1.37-2.62 2.62 2.62 2.62 2.38-1.37c.68-.39.68-1.02-.01-1.5zM4.14.24l10.95 6.32-2.33 2.34L3.11.28l.03-.04z"/>
                </svg>
                Google Play
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-0 mb-4">
        <h2 className="text-xl font-bold text-white mb-4">Manual para APP Bluetti</h2>
        <div className="bg-white/5 backdrop-blur-sm border border-bluetti-border rounded-2xl p-6 flex flex-col items-start gap-3">
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
          <p className="text-bluetti-cyan/70 text-sm">Archivo PDF · Manual de uso de la aplicación</p>
        </div>
      </section>
    </div>
  )
}
