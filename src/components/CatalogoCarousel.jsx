import { useState, useRef, useEffect } from 'react'

const SLIDES = [
  { type: 'video', src: '/videos/catalogo-video.mp4' },
  { type: 'video', src: '/videos/catalogo-video-2.mp4' },
  { type: 'image', src: '/images/catalogo-foto.png' },
  { type: 'image', src: '/images/catalogo-foto-2.jpg' },
  { type: 'image', src: '/images/catalogo-foto-3.png' },
  { type: 'image', src: '/images/catalogo-foto-4.png' },
  { type: 'image', src: '/images/catalogo-foto-5.png' },
  { type: 'image', src: '/images/catalogo-foto-6.png' },
  { type: 'image', src: '/images/catalogo-foto-7.png' },
  { type: 'image', src: '/images/catalogo-foto-8.png' },
]

export default function CatalogoCarousel() {
  const [current, setCurrent] = useState(0)
  const videoRefs = useRef([])

  useEffect(() => {
    videoRefs.current.forEach((ref, i) => {
      if (!ref) return
      if (i === current) {
        ref.play().catch(() => {})
      } else {
        ref.pause()
        ref.currentTime = 0
      }
    })
  }, [current])

  const prev = () => setCurrent(i => (i - 1 + SLIDES.length) % SLIDES.length)
  const next = () => setCurrent(i => (i + 1) % SLIDES.length)

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-black">
      <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-500 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {slide.type === 'video' ? (
              <video
                ref={el => videoRefs.current[i] = el}
                src={slide.src}
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={slide.src}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/75 text-white rounded-full p-2 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  )
}
