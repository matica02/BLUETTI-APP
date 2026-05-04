import { createContext, useContext, useState } from 'react'

const CompareContext = createContext(null)

export function CompareProvider({ children }) {
  const [selectedIds, setSelectedIds] = useState([])

  function addToCompare(id) {
    setSelectedIds(prev => {
      if (prev.includes(id) || prev.length >= 2) return prev
      return [...prev, id]
    })
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
    <CompareContext.Provider value={{ selectedIds, addToCompare, removeFromCompare, clearCompare, isSelected, isFull }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare debe usarse dentro de CompareProvider')
  return ctx
}
