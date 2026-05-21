import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
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
