import { createContext, useContext, useState } from 'react'

const CalculadoraContext = createContext(null)

export function CalculadoraProvider({ children }) {
  const [agregados, setAgregados] = useState([])
  const [openCats, setOpenCats] = useState({})

  return (
    <CalculadoraContext.Provider value={{ agregados, setAgregados, openCats, setOpenCats }}>
      {children}
    </CalculadoraContext.Provider>
  )
}

export function useCalculadora() {
  const ctx = useContext(CalculadoraContext)
  if (!ctx) throw new Error('useCalculadora debe usarse dentro de CalculadoraProvider')
  return ctx
}
