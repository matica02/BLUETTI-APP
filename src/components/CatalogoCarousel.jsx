import { useState, useRef, useEffect } from 'react'

const SLIDES = [
  { type: 'image', src: '/images/catalogo-foto-7.png' },
  { type: 'video', src: '/videos/catalogo-video.mp4' },
  { type: 'image', src: '/images/catalogo-foto.png' },
  { type: 'image', src: '/images/catalogo-foto-2.jpg' },
  { type: 'image', src: '/images/catalogo-foto-3.png' },
  { type: 'image', src: '/images/catalogo-foto-4.png' },
  { type: 'image', src: '/images/catalogo-foto-5.png' },
  { type: 'image', src: '/images/catalogo-foto-6.png' },
  { type: 'image', src: '/images/catalogo-foto-8.png' },
  { type: 'image', src: '/images/catalogo-foto-9.png' },
  { type: 'image', src: '/images/catalogo-foto-10.png' },
  { type: 'image', src: '/images/catalogo-foto-11.png' },
]

const AUTOPLAY_INTERVAL = 4000

export default function CatalogoCarousel() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(null)
  const [direction, setDirection] = useState('next')
  const [paused, setPaused] = useState(false)
  const videoRefs = useRef([])

  useEffect(() => {
    videoRefs.current.forEach((ref, i) => {
      if (!ref) return
      if (i === current) ref.play().catch(() => {})
      else { ref.pause(); ref.currentTime = 0 }
    })
  }, [current])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => goNext(), AUTOPLAY_INTERVAL)
    return () => clearInterval(id)
  }, [paused, current])

  const goNext = () => {
    setDirection('next')
    setCurrent(i => {
      setPrev(i)
      return (i + 1) % SLIDES.length
    })
  }

  const goPrev = () => {
    setDirection('prev')
    setCurrent(i => {
      setPrev(i)
      return (i - 1 + SLIDES.length) % SLIDES.length
    })
  }

  const getStyle = (i) => {
    if (i === current) {
      return {
        transform: 'translateX(0%)',
        opacity: 1,
        zIndex: 10,
        transition: 'transform 600ms cubic-bezier(0.4,0,0.2,1), opacity 600ms ease',
      }
    }
    if (i === prev) {
      return {
        transform: direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)',
        opacity: 0,
        zIndex: 9,
        transition: 'transform 600ms cubic-bezier(0.4,0,0.2,1), opacity 600ms ease',
      }
    }
    return {
      transform: direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)',
      opacity: 0,
      zIndex: 0,
      transition: 'none',
    }
  }

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden bg-black transition-transform duration-300 hover:scale-[1.02]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
        {SLIDES.map((slide, i) => (
          <div key={i} className="absolute inset-0" style={getStyle(i)}>
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
        onClick={goPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 text-white/40 hover:text-white/80 hover:scale-[2] transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        onClick={goNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-white/40 hover:text-white/80 hover:scale-[2] transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  )
}
