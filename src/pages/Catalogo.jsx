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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-4">
      <section className="mb-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: 'Distribuidor oficial',
            icon: <svg className="w-7 h-7 sm:w-10 sm:h-10 text-bluetti-lime" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
          },
          {
            label: 'Garantía de fábrica',
            icon: <svg className="w-7 h-7 sm:w-10 sm:h-10 text-bluetti-lime" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          },
          {
            label: 'Envío a todo el país',
            icon: <svg className="w-7 h-7 sm:w-10 sm:h-10 text-bluetti-lime" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
          },
          {
            label: 'Soporte técnico',
            icon: <svg className="w-7 h-7 sm:w-10 sm:h-10 text-bluetti-lime" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          },
        ].map(item => (
          <div key={item.label} className="flex flex-col items-center gap-2 sm:gap-3 text-center px-3 py-4 sm:px-4 sm:py-6">
            {item.icon}
            <span className="text-bluetti-cyan/80 text-xs sm:text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </section>

      <div className="hidden sm:flex justify-center mb-6">
        <button
          onClick={() => {
            const el = document.getElementById('productos')
            const top = el.getBoundingClientRect().top + window.scrollY - 90
            window.scrollTo({ top, behavior: 'smooth' })
          }}
          className="flex items-center gap-2 bg-bluetti-cyan text-bluetti-bg font-semibold px-6 py-2 rounded-full hover:brightness-110 transition-all hover:scale-105"
        >
          Ver productos
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <section className="mb-14">
        <CatalogoCarousel />
      </section>

      <div id="productos" className="mb-8">
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

      <section className="mt-12 mb-8">
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
