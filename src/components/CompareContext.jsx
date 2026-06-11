import { createContext, useContext, useState } from 'react'
import products from '../data/products.json'

const CompareContext = createContext(null)

// Grupo de comparación: solo se comparan elementos del mismo grupo
// (productos con productos, baterías con baterías).
function groupOf(id) {
  const p = products.find(x => x.id === id)
  if (!p) return null
  return p.categoria === 'Batería' ? 'bateria' : 'producto'
}

export function CompareProvider({ children }) {
  const [selectedIds, setSelectedIds] = useState([])

  function addToCompare(id) {
    setSelectedIds(prev => {
      if (prev.includes(id) || prev.length >= 2) return prev
      if (prev.length > 0 && groupOf(prev[0]) !== groupOf(id)) return prev
      return [...prev, id]
    })
  }

  // ¿Se puede agregar este id a la comparación actual?
  // (mismo grupo que lo ya seleccionado)
  function canCompare(id) {
    if (selectedIds.length === 0 || selectedIds.includes(id)) return true
    return groupOf(selectedIds[0]) === groupOf(id)
  }

  function removeFromCompare(id) {
    setSelectedIds(prev => prev.filter(x => x !== id))
  }

  function clearCompare() {
    setSelectedIds([])
  }

  function isSelected(id) {
    return selectedIds.includes(id)
  }

  function isFull() {
    return selectedIds.length === 2
  }

  return (
    <CompareContext.Provider value={{ selectedIds, addToCompare, removeFromCompare, clearCompare, isSelected, isFull, canCompare }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare debe usarse dentro de CompareProvider')
  return ctx
}
