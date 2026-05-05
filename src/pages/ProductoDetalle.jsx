import { useParams, Link, useNavigate } from 'react-router-dom'
import products from '../data/products.json'
import { useCompare } from '../components/CompareContext'
import SpecsTable from '../components/SpecsTable'
import HighlightsList from '../components/HighlightsList'
import ExpansionConfigurator from '../components/ExpansionConfigurator'
import { CATEGORIA_LABELS, CATEGORIA_COLORS } from '../data/categorias'

export default function ProductoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = products.find(p => p.id === id)
  const { addToCompare, removeFromCompare, isSelected, isFull } = useCompare()

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-5xl mb-4">🔋</p>
        <h2 className="text-2xl font-bold text-white mb-2">Producto no encontrado</h2>
        <p className="text-gray-400 mb-8">
          El producto que buscás no existe o fue eliminado.
        </p>
        <Link
          to="/"
          className="bg-bluetti-cyan text-bluetti-bg font-bold px-6 py-3 rounded-lg hover:brightness-110 transition-all"
        >
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const label = CATEGORIA_LABELS[product.categoria] ?? product.categoria
  const colorClass = CATEGORIA_COLORS[label] ?? 'bg-gray-800 text-gray-300 border border-gray-700'
  const selected = isSelected(product.id)
  const disabled = isFull() && !selected

  function handleCompare() {
    if (selected) {
      removeFromCompare(product.id)
    } else {
      addToCompare(product.id)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-2 transition-colors"
      >
        ← Volver
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        <div className="bg-black/30 rounded-2xl flex items-center justify-center p-8 min-h-64">
          <img
            src={`/images/${product.imagen}`}
            alt={product.nombre}
            className="max-h-72 max-w-full object-contain"
            onError={e => { e.target.style.display = 'none' }}
          />
        </div>

        <div className="flex flex-col justify-center gap-4">
          <span className={`text-xs px-3 py-1 rounded-full font-medium w-fit ${colorClass}`}>
            {label}
          </span>
          <h1 className="text-4xl font-bold text-white">{product.nombre}</h1>
          <p className="text-bluetti-cyan text-lg font-medium">{product.tagline}</p>
          <p className="text-gray-400 leading-relaxed">{product.descripcion}</p>
          <p className="text-gray-500 text-sm">{product.perfilUsuario}</p>

          <button
            onClick={handleCompare}
            disabled={disabled}
            className={`mt-2 w-fit px-6 py-3 rounded-lg font-bold text-sm border transition-all ${
              selected
                ? 'bg-bluetti-cyan/20 border-bluetti-cyan text-bluetti-cyan'
                : disabled
                ? 'border-gray-700 text-gray-600 cursor-not-allowed'
                : 'border-bluetti-border text-gray-300 hover:border-bluetti-cyan hover:text-bluetti-cyan'
            }`}
          >
            {selected ? '✓ En comparación' : '+ Agregar a comparación'}
          </button>
        </div>
      </div>

      <ExpansionConfigurator product={product} />

      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Casos de uso</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {product.casosDeUso.map(caso => (
            <div
              key={caso.etiqueta}
              className="bg-bluetti-card border border-bluetti-border rounded-xl p-4"
            >
              <span className="text-bluetti-lime text-xs font-bold uppercase tracking-wider">
                {caso.etiqueta}
              </span>
              <p className="text-gray-300 text-sm mt-2 leading-relaxed">{caso.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Puntos destacados</h2>
        <HighlightsList highlights={product.highlights} />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Especificaciones técnicas</h2>
        <SpecsTable specs={product.specs} />
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Video del producto</h2>
        <div className="rounded-2xl overflow-hidden border border-bluetti-border">
          <video
            key={product.id}
            controls
            className="w-full"
            poster={`/images/${product.imagen}`}
          >
            <source src={`/videos/${product.id}.mp4`} type="video/mp4" />
          </video>
        </div>
      </section>

      {product.accesoriosCompatibles.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Accesorios compatibles</h2>
          <ul className="space-y-2">
            {product.accesoriosCompatibles.map(acc => (
              <li key={acc} className="flex items-center gap-3 text-gray-300 text-sm">
                <span className="text-bluetti-cyan">→</span> {acc}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
