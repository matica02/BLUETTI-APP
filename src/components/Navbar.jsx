import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCompare } from './CompareContext'

export default function Navbar() {
  const { selectedIds } = useCompare()
  const [hovered, setHovered] = useState(false)

  return (
    <div className="sticky top-0 z-40 py-2 pt-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-xl p-px transition-all duration-200 hover:scale-[1.03]"
          style={{ background: 'linear-gradient(to right, #00d4ff, #a3e635)' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <nav className="rounded-xl px-6 sm:px-8 h-16 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #0a2a45 0%, #0a0a0f 50%, #1a3a08 100%)' }}>
            <Link to="/" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-6">
              <img src="/images/logo-naval.png" alt="Naval Motor" className="h-4 sm:h-10 object-contain sm:mt-4" />
              <img src="/images/bluetti-logo.png.webp" alt="BLUETTI" className="h-4 sm:h-10 object-contain" />
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/"
                className="font-semibold text-[10px] sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:brightness-125 transition-all text-white"
                style={{ background: '#0a2a45' }}
              >
                Inicio
              </Link>
              <Link
                to="/calculadora"
                className="bg-bluetti-cyan text-bluetti-bg font-semibold text-[10px] sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:brightness-110 transition-all"
              >
                Calculadora
              </Link>
              <Link
                to="/simulador-solar"
                className="bg-bluetti-lime text-bluetti-bg font-semibold text-[10px] sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:brightness-110 transition-all"
              >
                Simulador Solar
              </Link>
              {selectedIds.length > 0 && (
                <Link
                  to="/comparar"
                  className="flex items-center gap-2 text-sm text-bluetti-cyan hover:text-white transition-colors"
                >
                  <span className="bg-bluetti-cyan text-bluetti-bg text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedIds.length}
                  </span>
                  <span className="hidden sm:block">Comparando</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
