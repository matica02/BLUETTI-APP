import { Link } from 'react-router-dom'
import { useCompare } from './CompareContext'

export default function Navbar() {
  const { selectedIds } = useCompare()

  return (
    <nav className="bg-bluetti-card border-b border-bluetti-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-3">
          <img src="/images/logo-naval.png" alt="Naval Motor" className="h-6 sm:h-8 object-contain" />
          <span className="text-gray-500 text-sm">×</span>
          <img src="/images/Bluetti.png.webp" alt="BLUETTI" className="h-7 sm:h-10 object-contain" />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/calculadora"
            className="bg-bluetti-cyan text-bluetti-bg font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg hover:brightness-110 transition-all"
          >
            Calculadora
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
      </div>
    </nav>
  )
}
