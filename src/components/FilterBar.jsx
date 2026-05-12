import { TODAS_CATEGORIAS } from '../data/categorias'

export default function FilterBar({ activeFilter, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {TODAS_CATEGORIAS.map(cat => (
        <button
          key={cat}
          onClick={() => onFilterChange(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
            activeFilter === cat
              ? 'bg-bluetti-cyan text-bluetti-bg border-bluetti-cyan'
              : 'bg-transparent text-bluetti-cyan border-bluetti-border hover:border-bluetti-cyan/50 hover:text-white'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
