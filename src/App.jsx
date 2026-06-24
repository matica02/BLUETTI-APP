import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

const BANNER_IMAGES = [
  '/images/banner-1.jpg',
  '/images/banner-2.jpg',
  '/images/banner-3.jpg',
  '/images/banner-4.jpg',
  '/images/banner-5.jpg',
  '/images/banner-7.jpg',
  '/images/banner-8.jpg',
]

function Banner() {
  const { pathname } = useLocation()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % BANNER_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  if (pathname !== '/') return null

  const prev = () => setCurrent(i => (i - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length)
  const next = () => setCurrent(i => (i + 1) % BANNER_IMAGES.length)

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {BANNER_IMAGES.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Banner BLUETTI ${i + 1}`}
            className="w-full h-auto flex-shrink-0"
            style={{ minWidth: '100%' }}
          />
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-white/40 hover:text-white/80 hover:scale-[2] transition-all"
        aria-label="Anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-white/40 hover:text-white/80 hover:scale-[2] transition-all"
        aria-label="Siguiente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  )
}
import { CompareProvider } from './components/CompareContext'
import { CalculadoraProvider } from './components/CalculadoraContext'
import Navbar from './components/Navbar'
import CompareBar from './components/CompareBar'
import ScrollProgress from './components/ScrollProgress'
import Catalogo from './pages/Catalogo'
import ProductoDetalle from './pages/ProductoDetalle'
import Comparar from './pages/Comparar'
import Calculadora from './pages/Calculadora'
import SimuladorSolarPage from './pages/SimuladorSolarPage'

export default function App() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <BrowserRouter>
      <CompareProvider>
        <CalculadoraProvider>
        <div className="min-h-screen text-white">
          <ScrollToTop />
          <ScrollProgress />
          <Navbar />
          <Banner />
          <main className="pb-24">
            <Routes>
              <Route path="/" element={<Catalogo />} />
              <Route path="/producto/:id" element={<ProductoDetalle />} />
              <Route path="/comparar" element={<Comparar />} />
              <Route path="/calculadora" element={<Calculadora />} />
              <Route path="/simulador-solar" element={<SimuladorSolarPage />} />
            </Routes>
          </main>
          <CompareBar />
          {showTop && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:brightness-125 transition-all hover:scale-110"
              style={{ background: '#0a2a45' }}
              aria-label="Volver al inicio"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
          )}
        </div>
        </CalculadoraProvider>
      </CompareProvider>
    </BrowserRouter>
  )
}
