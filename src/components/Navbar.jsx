import { Link } from 'react-router-dom'
import { useCompare } from './CompareContext'

export default function Navbar() {
  const { selectedIds } = useCompare()

  return (
    <nav className="bg-bluetti-card border-b border-bluetti-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-bluetti-cyan font-bold text-lg tracking-wide">Naval Motor</span>
          <span className="text-gray-500 text-sm hidden sm:block">×</span>
          <span className="text-white font-semibold text-sm hidden sm:block">Productos BLUETTI</span>
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
  )
}
