import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CompareProvider } from './components/CompareContext'
import Navbar from './components/Navbar'
import CompareBar from './components/CompareBar'
import Catalogo from './pages/Catalogo'
import ProductoDetalle from './pages/ProductoDetalle'
import Comparar from './pages/Comparar'
import Calculadora from './pages/Calculadora'
import SimuladorSolarPage from './pages/SimuladorSolarPage'

export default function App() {
  return (
    <BrowserRouter>
      <CompareProvider>
        <div className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #0a3d6b 0%, #0a0a0f 70%)' }}>
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
        </div>
      </CompareProvider>
    </BrowserRouter>
  )
}
