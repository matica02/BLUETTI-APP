import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export default function AnimatedNumber({ value }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, margin: '-50px' })
  const str = String(value)

  const match = str.match(/^([^\d-]*)(-?\d+(?:[.,]\d+)?)([^\d]*)$/)
  const canAnimate = !!match

  const [display, setDisplay] = useState(canAnimate ? match[1] + '0' + match[3] : str)

  useEffect(() => {
    if (!canAnimate) return
    const [, prefix, numStr, suffix] = match
    const target = parseFloat(numStr.replace(',', '.'))
    const decimals = (numStr.split(/[.,]/)[1] || '').length

    if (!isInView) {
      setDisplay(prefix + (0).toFixed(decimals) + suffix)
      return
    }

    let raf
    const duration = 1200
    const start = performance.now()
    const tick = now => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = target * eased
      setDisplay(prefix + current.toFixed(decimals) + suffix)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isInView, canAnimate, match])

  return <span ref={ref}>{display}</span>
}
