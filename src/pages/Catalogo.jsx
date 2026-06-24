import products from '../data/products.json'
import ProductCard from '../components/ProductCard'
import CatalogoCarousel from '../components/CatalogoCarousel'
import { ScrollReveal, StaggerGroup, StaggerItem } from '../components/ScrollReveal'

// Orden de los modelos en el catálogo (el RV5 va después de los blancos EP2000/EP760)
const MODELO_ORDER = ['es125x', 'es60', 'ep2000', 'ep760', 'rv5', 'apex300', 'ac200pl', 'ac180p']

// Orden de las baterías en el catálogo
const BATERIA_ORDER = ['b700', 'b500', 'b4810', 'b300k']

const ordenarPor = (lista, orden) =>
  [...lista].sort((a, b) => {
    const ia = orden.indexOf(a.id)
    const ib = orden.indexOf(b.id)
    // los ids desconocidos van al final, conservando su orden relativo
    return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib)
  })

export default function Catalogo() {
  const modelos = ordenarPor(products.filter(p => p.categoria !== 'Accesorio' && p.categoria !== 'Batería'), MODELO_ORDER)
  const baterias = ordenarPor(products.filter(p => p.categoria === 'Batería'), BATERIA_ORDER)
  const accesorios = products.filter(p => p.categoria === 'Accesorio')

  return (
    <div className="w-full px-4 sm:px-8 pt-8 pb-4">
      <div className="hidden sm:flex justify-center gap-3 mb-6">
        <button
          onClick={() => {
            const el = document.getElementById('descargas')
            const top = el.getBoundingClientRect().top + window.scrollY - 90
            window.scrollTo({ top, behavior: 'smooth' })
          }}
          className="flex items-center gap-2 bg-bluetti-lime text-bluetti-bg font-semibold px-6 py-2 rounded-full hover:brightness-110 transition-all hover:scale-105"
        >
          Descargas
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <div className="flex sm:hidden justify-center mb-4">
        <button
          onClick={() => {
            const el = document.getElementById('descargas')
            const top = el.getBoundingClientRect().top + window.scrollY - 90
            window.scrollTo({ top, behavior: 'smooth' })
          }}
          className="flex items-center gap-1.5 bg-bluetti-lime text-bluetti-bg font-semibold text-xs px-4 py-1.5 rounded-full hover:brightness-110 transition-all hover:scale-105"
        >
          Descargas
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <div id="productos" className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Productos <span className="text-bluetti-cyan">BLUETTI</span>
        </h1>
        <p className="text-bluetti-cyan">
          Sistemas de almacenamiento de energía para cada necesidad
        </p>
      </div>

      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {modelos.map(product => (
          <StaggerItem key={product.id}>
            <ProductCard product={product} />
          </StaggerItem>
        ))}
      </StaggerGroup>

      {baterias.length > 0 && (
        <>
          <div id="baterias" className="mt-14 mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">
              Baterías <span className="text-bluetti-cyan">BLUETTI</span>
            </h2>
            <p className="text-bluetti-cyan">
              Módulos de expansión para ampliar la capacidad de tus equipos
            </p>
          </div>

          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {baterias.map(product => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </>
      )}

      {accesorios.length > 0 && (
        <>
          <div id="accesorios" className="mt-14 mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">
              Accesorios <span className="text-bluetti-cyan">BLUETTI</span>
            </h2>
            <p className="text-bluetti-cyan">
              Complementos para potenciar y controlar tus equipos
            </p>
          </div>

          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {accesorios.map(product => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </>
      )}

      <section className="mt-14 mb-14 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen px-4 sm:px-8">
        <CatalogoCarousel />
      </section>

      <ScrollReveal as="section" className="mt-12 mb-8">
        <div id="descargas" />
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
      </ScrollReveal>

      <ScrollReveal as="section" className="mt-0 mb-4">
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
      </ScrollReveal>
    </div>
  )
}
