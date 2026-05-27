import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useParams, Link, useNavigate } from 'react-router-dom'
import products from '../data/products.json'
import { useCompare } from '../components/CompareContext'
import SpecsTable from '../components/SpecsTable'
import HighlightsList from '../components/HighlightsList'
import ExpansionConfigurator from '../components/ExpansionConfigurator'
import { CATEGORIA_LABELS, CATEGORIA_COLORS, TIPO_RED_COLORS } from '../data/categorias'
import { ScrollReveal } from '../components/ScrollReveal'

const modelsWithManual = ['rv5', 'ep2000', 'ep760', 'apex300', 'ac200pl', 'charger1', 'ac180p']
const modelsWithFlyer = ['rv5', 'ep2000', 'ep760', 'apex300', 'ac200pl', 'es125x', 'charger1', 'ac180p']
const modelsWithAppManual = ['ep760', 'ep2000']
const modelsWithInstallGuide = ['ep760', 'ep2000']

const installationVideos = {
  rv5: [
    { title: 'Video de Instalación', url: 'https://player.vimeo.com/video/1189375532' },
  ],
  ep760: [
    { title: 'Video de Instalación', url: 'https://www.youtube.com/embed/P8oKL9gz8mQ' },
  ],
  ep2000: [
    { title: 'Video de Instalación - Parte 1', url: 'https://www.youtube.com/embed/g_HmDfoobi8' },
    { title: 'Video de Instalación - Parte 2', url: 'https://www.youtube.com/embed/zSF0B4rQJGw' },
  ],
  apex300: [
    { title: 'Video de Instalación', url: 'https://www.youtube.com/embed/MNdrWA7kP8c?si=yGxsCSSYPqbyOe4-' },
  ],
}

export default function ProductoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = products.find(p => p.id === id)
  const { addToCompare, removeFromCompare, isSelected, isFull } = useCompare()
  const allImages = product ? [product.imagen, ...(product.imagenes || [])] : []
  const [selectedImage, setSelectedImage] = useState(0)
  // Reset selected image when product changes
  const [lastId, setLastId] = useState(id)
  if (id !== lastId) {
    setLastId(id)
    setSelectedImage(0)
  }

  const heroRef = useRef(null)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start end', 'end start'],
  })
  const heroY = useTransform(heroProgress, [0, 1], [-40, 40])

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-5xl mb-4">🔋</p>
        <h2 className="text-2xl font-bold text-white mb-2">Producto no encontrado</h2>
        <p className="text-bluetti-cyan mb-8">
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
  const colorClass = CATEGORIA_COLORS[label] ?? 'bg-gray-800 text-bluetti-cyan/80 border border-gray-700'
  const selected = isSelected(product.id)
  const disabled = isFull() && !selected
  const instVideos = installationVideos[product.id]

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
        className="text-bluetti-cyan hover:text-white text-sm mb-6 flex items-center gap-2 transition-colors"
      >
        ← Volver
      </button>

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        <div className="flex flex-col gap-3">
          <div ref={heroRef} className="relative flex items-center justify-center p-4 min-h-64 sm:min-h-96 overflow-hidden">
            <motion.img
              src={`/images/${allImages[selectedImage]}`}
              alt={product.nombre}
              style={{ y: heroY }}
              className="w-full max-h-72 sm:max-h-[480px] object-contain"
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2 justify-center">
              {allImages.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg border-2 overflow-hidden bg-black/30 transition-all ${
                    selectedImage === i ? 'border-bluetti-cyan' : 'border-bluetti-border hover:border-gray-500'
                  }`}
                >
                  <img
                    src={`/images/${img}`}
                    alt={`${product.nombre} vista ${i + 1}`}
                    className="w-full h-full object-contain p-1"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-start gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs px-3 py-1 rounded-full font-medium w-fit ${colorClass}`}>
              {label}
            </span>
            {product.tipoRed && (
              <span className={`text-xs px-3 py-1 rounded-full font-medium w-fit ${TIPO_RED_COLORS[product.tipoRed] || ''}`}>
                {product.tipoRed}
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold text-white">{product.nombre}</h1>
          {product.subtitulo && (
            <p className="text-bluetti-cyan text-sm font-medium">{product.subtitulo}</p>
          )}
          <div className="flex flex-col gap-2">
            {product.descripcion.split('\n').reduce((acc, line, i) => {
              if (line.startsWith('* ')) {
                const prev = acc[acc.length - 1]
                if (prev && prev.type === 'ul') {
                  prev.items.push(line.slice(2))
                } else {
                  acc.push({ type: 'ul', items: [line.slice(2)], key: i })
                }
              } else if (line.trim()) {
                acc.push({ type: 'p', text: line, key: i })
              }
              return acc
            }, []).map(block =>
              block.type === 'ul' ? (
                <ul key={block.key} className="list-disc list-inside text-bluetti-cyan leading-relaxed space-y-1 ml-1">
                  {block.items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              ) : (
                <p key={block.key} className="text-bluetti-cyan leading-relaxed">{block.text}</p>
              )
            )}
          </div>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <button
              onClick={handleCompare}
              disabled={disabled}
              className={`w-fit px-2 sm:px-6 py-1.5 sm:py-3 rounded-lg font-bold text-[10px] sm:text-sm border whitespace-nowrap transition-all ${
                selected
                  ? 'bg-bluetti-cyan border-bluetti-cyan text-bluetti-bg'
                  : disabled
                  ? 'border-gray-700 text-gray-600 cursor-not-allowed'
                  : 'bg-bluetti-cyan border-bluetti-cyan text-bluetti-bg hover:brightness-110'
              }`}
            >
              {selected ? '✓ En comparación' : '+ Agregar a comparación'}
            </button>
            {(modelsWithManual.includes(product.id) || modelsWithFlyer.includes(product.id)) && (
              <button
                onClick={() => {
                  const el = document.getElementById('descargas-detalle')
                  const top = el.getBoundingClientRect().top + window.scrollY - 90
                  window.scrollTo({ top, behavior: 'smooth' })
                }}
                className="flex items-center gap-1 bg-bluetti-lime text-bluetti-bg font-bold text-[10px] sm:text-sm pl-2 sm:pl-6 pr-1.5 sm:pr-3 py-1.5 sm:py-3 rounded-lg hover:brightness-110 transition-all"
              >
                Descargas
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            )}
            <button
              onClick={() => {
                const el = document.getElementById('videos-detalle')
                const top = el.getBoundingClientRect().top + window.scrollY - 90
                window.scrollTo({ top, behavior: 'smooth' })
              }}
              className="flex items-center gap-1 font-bold text-[10px] sm:text-sm pl-2 sm:pl-6 pr-1.5 sm:pr-3 py-1.5 sm:py-3 rounded-lg hover:brightness-110 transition-all text-bluetti-bg bg-bluetti-lime"
            >
              Videos
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <ExpansionConfigurator product={product} />

      <ScrollReveal as="section" className="mb-12">
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
              <p className="text-bluetti-cyan/80 text-sm mt-2 leading-relaxed">{caso.descripcion}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Puntos destacados</h2>
        <HighlightsList highlights={product.highlights} />
      </ScrollReveal>

      <ScrollReveal as="section" className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Especificaciones técnicas</h2>
        <SpecsTable specs={product.specs} />
      </ScrollReveal>

      {product.accesoriosCompatibles.length > 0 && (
        <ScrollReveal as="section" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Accesorios compatibles</h2>
          <ul className="space-y-2">
            {product.accesoriosCompatibles.map(acc => {
              const isObj = typeof acc === 'object' && acc !== null
              const nombre = isObj ? acc.nombre : acc
              const id = isObj ? acc.id : null
              return (
                <li key={nombre} className="flex items-center gap-3 text-bluetti-cyan/80 text-sm">
                  <span className="text-bluetti-cyan">→</span>
                  {id ? (
                    <Link
                      to={`/producto/${id}`}
                      className="text-bluetti-cyan hover:text-bluetti-lime hover:underline underline-offset-2 transition-colors"
                    >
                      {nombre}
                    </Link>
                  ) : (
                    <span>{nombre}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </ScrollReveal>
      )}

      <div id="descargas-detalle" />

      {modelsWithManual.includes(product.id) && (
        <ScrollReveal as="section" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Manual de Usuario</h2>
          <div className="bg-white/5 backdrop-blur-sm border border-bluetti-border rounded-2xl p-6 flex flex-col items-start gap-3">
            <a
              href={`/pdf/${product.id}.pdf`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border border-bluetti-cyan text-bluetti-cyan font-semibold px-6 py-3 rounded-xl hover:bg-bluetti-cyan hover:text-bluetti-bg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Descargar Manual de Usuario
            </a>
            <p className="text-bluetti-cyan/70 text-sm">Archivo PDF · Manual oficial del fabricante</p>
          </div>
        </ScrollReveal>
      )}

      {modelsWithFlyer.includes(product.id) && (
        <ScrollReveal as="section" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Flyer / Datasheet</h2>
          <div className="bg-white/5 backdrop-blur-sm border border-bluetti-border rounded-2xl p-6 flex flex-col items-start gap-3">
            <a
              href={`/flyer/${product.id}.pdf`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border border-bluetti-cyan text-bluetti-cyan font-semibold px-6 py-3 rounded-xl hover:bg-bluetti-cyan hover:text-bluetti-bg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Descargar Flyer / Datasheet
            </a>
            <p className="text-bluetti-cyan/70 text-sm">Archivo PDF · Ficha técnica del producto</p>
          </div>
        </ScrollReveal>
      )}

      {modelsWithAppManual.includes(product.id) && (
        <ScrollReveal as="section" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Manual para APP Bluetti</h2>
          <div className="bg-white/5 backdrop-blur-sm border border-bluetti-border rounded-2xl p-6 flex flex-col items-start gap-3">
            <a
              href={`/pdf/${product.id}-app.pdf`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border border-bluetti-cyan text-bluetti-cyan font-semibold px-6 py-3 rounded-xl hover:bg-bluetti-cyan hover:text-bluetti-bg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Descargar Manual para APP Bluetti
            </a>
            <p className="text-bluetti-cyan/70 text-sm">Archivo PDF · Manual de uso de la aplicación</p>
          </div>
        </ScrollReveal>
      )}

      {modelsWithInstallGuide.includes(product.id) && (
        <ScrollReveal as="section" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Guía de Instalación</h2>
          <div className="bg-white/5 backdrop-blur-sm border border-bluetti-border rounded-2xl p-6 flex flex-col items-start gap-3">
            <a
              href={`/pdf/${product.id}-guia.pdf`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border border-bluetti-cyan text-bluetti-cyan font-semibold px-6 py-3 rounded-xl hover:bg-bluetti-cyan hover:text-bluetti-bg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Descargar Guía de Instalación
            </a>
            <p className="text-bluetti-cyan/70 text-sm">Archivo PDF · Guía de instalación del producto</p>
          </div>
        </ScrollReveal>
      )}

      <div id="videos-detalle" />
      <ScrollReveal as="section" className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Video del producto</h2>
        <div className="rounded-2xl overflow-hidden border border-bluetti-border">
          <video
            key={product.id}
            controls
            className="w-full aspect-video object-contain bg-black"
            poster={`/images/${product.imagen}`}
          >
            <source src={`/videos/${product.id}.mp4`} type="video/mp4" />
          </video>
        </div>
      </ScrollReveal>

      {instVideos && (
        <ScrollReveal as="section" className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Video de Instalación</h2>
          <div className={`grid grid-cols-1 gap-6 ${instVideos.length > 1 ? 'md:grid-cols-2' : ''}`}>
            {instVideos.map(video => (
              <div key={video.url} className="bg-bluetti-card rounded-2xl overflow-hidden border border-bluetti-border">
                {instVideos.length > 1 && (
                  <p className="text-bluetti-cyan/80 text-sm font-medium px-4 pt-4">{video.title}</p>
                )}
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={video.url}
                    title={video.title}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}

    </div>
  )
}
