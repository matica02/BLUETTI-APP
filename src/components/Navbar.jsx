import { Link } from 'react-router-dom'
import { useCompare } from './CompareContext'

export default function Navbar() {
  const { selectedIds } = useCompare()

  return (
    <div className="sticky top-0 z-40">
      <div className="w-full">
        <div>
          <nav className="relative px-4 sm:px-8 h-16 flex items-center justify-between bg-white/60 backdrop-blur-md">
            <Link
              to="/"
              className="bg-bluetti-cyan text-bluetti-bg font-semibold text-[9px] sm:text-sm px-1.5 sm:px-4 py-1 sm:py-2 rounded-lg border border-black hover:brightness-110 transition-all"
            >
              Inicio
            </Link>

            <Link to="/" className="absolute left-[38%] top-[58%] sm:left-1/2 sm:top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col sm:flex-row items-center gap-1 sm:gap-6">
              <img src="/images/logo-naval.png" alt="Naval Motor" className="h-5 sm:h-10 object-contain sm:mt-4" />
            </Link>

            <div className="flex items-center gap-1 sm:gap-3">
              <Link
                to="/calculadora"
                className="bg-bluetti-lime text-bluetti-bg font-semibold text-[9px] sm:text-sm px-1.5 sm:px-4 py-1 sm:py-2 rounded-lg border border-black hover:brightness-110 transition-all"
              >
                Calculadora
              </Link>
              <Link
                to="/simulador-solar"
                className="bg-bluetti-lime text-bluetti-bg font-semibold text-[9px] sm:text-sm px-1.5 sm:px-4 py-1 sm:py-2 rounded-lg border border-black hover:brightness-110 transition-all"
              >
                <span className="sm:hidden">Solar</span>
                <span className="hidden sm:inline">Simulador Solar</span>
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
          <div className="h-[3px] w-full" style={{ background: 'linear-gradient(to right, #00d4ff, #a3e635)' }} />
        </div>
      </div>
    </div>
  )
}
