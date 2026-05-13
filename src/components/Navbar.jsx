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
          className="rounded-xl p-[3px] transition-all duration-200 hover:scale-[1.03]"
          style={{ background: 'linear-gradient(to right, #00d4ff, #a3e635)' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <nav className="rounded-xl px-6 sm:px-8 h-16 flex items-center justify-between" style={{ background: '#F5F2EC' }}>
            <Link to="/" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-6">
              <img src="/images/logo-naval.png" alt="Naval Motor" className="h-4 sm:h-10 object-contain sm:mt-4" />
              <img src="/images/bluetti-logo.png.webp" alt="BLUETTI" className="h-4 sm:h-10 object-contain" />
            </Link>

            <div className="flex items-center gap-1 sm:gap-3">
              <Link
                to="/"
                className="bg-bluetti-cyan text-bluetti-bg font-semibold text-[9px] sm:text-sm px-1.5 sm:px-4 py-1 sm:py-2 rounded-lg hover:brightness-110 transition-all"
              >
                Inicio
              </Link>
              <Link
                to="/calculadora"
                className="bg-bluetti-lime text-bluetti-bg font-semibold text-[9px] sm:text-sm px-1.5 sm:px-4 py-1 sm:py-2 rounded-lg hover:brightness-110 transition-all"
              >
                Calculadora
              </Link>
              <Link
                to="/simulador-solar"
                className="bg-bluetti-lime text-bluetti-bg font-semibold text-[9px] sm:text-sm px-1.5 sm:px-4 py-1 sm:py-2 rounded-lg hover:brightness-110 transition-all"
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
