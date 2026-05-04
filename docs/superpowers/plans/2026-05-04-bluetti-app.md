# bluetti-app Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir una SPA React con catálogo de productos BLUETTI, detalle de producto y comparador de 2 productos con estilo oscuro estilo BLUETTI, completamente en español.

**Architecture:** SPA con react-router-dom v6, tres rutas (`/`, `/producto/:id`, `/comparar`). Estado global mínimo con React Context (`CompareContext`) para la selección de hasta 2 productos a comparar. Datos estáticos desde `src/data/products.json`. Imágenes en `public/images/`.

**Tech Stack:** React 18, Vite, Tailwind CSS v3, react-router-dom v6, vitest, @testing-library/react

---

## Mapa de archivos

| Archivo | Responsabilidad |
|---------|----------------|
| `src/utils.js` | `formatKey(key)` — convierte camelCase a texto legible |
| `src/data/categorias.js` | `CATEGORIA_LABELS`, `CATEGORIA_COLORS`, `TODAS_CATEGORIAS` |
| `src/data/products.json` | Datos de los 6 productos BLUETTI |
| `public/images/*.png` | Imágenes de productos (referenciadas como `/images/nombre.png`) |
| `src/components/CompareContext.jsx` | Context + Provider + `useCompare` hook |
| `src/components/Navbar.jsx` | Barra de navegación con badge de comparación |
| `src/components/CompareBar.jsx` | Barra flotante inferior con productos seleccionados |
| `src/components/ProductCard.jsx` | Card de producto en el catálogo |
| `src/components/FilterBar.jsx` | Chips de filtro por categoría |
| `src/components/SpecsTable.jsx` | Tabla key-value de especificaciones técnicas |
| `src/components/HighlightsList.jsx` | Lista de puntos destacados |
| `src/pages/Catalogo.jsx` | Grid de productos con filtros |
| `src/pages/ProductoDetalle.jsx` | Detalle completo de un producto |
| `src/pages/Comparar.jsx` | Comparación lado a lado de 2 productos |
| `src/App.jsx` | Router + providers |
| `src/main.jsx` | Entry point |
| `src/index.css` | Tailwind directives + Google Fonts |
| `tailwind.config.js` | Paleta BLUETTI + paths de contenido |
| `vite.config.js` | Config Vite + vitest |
| `src/test-setup.js` | Setup de testing-library |

---

## Task 1: Inicializar proyecto Vite + React + git

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`

- [ ] **Scaffoldear proyecto Vite React en el directorio actual**

```bash
npm create vite@latest . -- --template react
```
Cuando pregunte si continuar con archivos existentes, escribir `y` y Enter.

- [ ] **Instalar dependencias base**

```bash
npm install
```

- [ ] **Inicializar repositorio git**

```bash
git init
git add package.json package-lock.json vite.config.js index.html .gitignore
git commit -m "chore: init Vite React project"
```

---

## Task 2: Instalar Tailwind CSS y react-router-dom

**Files:**
- Modify: `package.json`
- Create: `tailwind.config.js`, `postcss.config.js`

- [ ] **Instalar dependencias**

```bash
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
```

- [ ] **Inicializar Tailwind**

```bash
npx tailwindcss init -p
```
Expected: crea `tailwind.config.js` y `postcss.config.js`

- [ ] **Commit**

```bash
git add package.json package-lock.json tailwind.config.js postcss.config.js
git commit -m "chore: add Tailwind CSS and react-router-dom"
```

---

## Task 3: Configurar Tailwind con paleta BLUETTI

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/index.css`

- [ ] **Reemplazar `tailwind.config.js` completamente:**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bluetti: {
          bg: '#0a0a0f',
          card: '#111827',
          cyan: '#00d4ff',
          lime: '#a3e635',
          border: '#1f2937',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
```

- [ ] **Reemplazar `src/index.css` completamente:**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #0a0a0f;
  color: #ffffff;
}
```

- [ ] **Verificar que el build no tiene errores**

```bash
npm run build
```
Expected: `dist/` generado sin errores.

- [ ] **Commit**

```bash
git add tailwind.config.js src/index.css
git commit -m "chore: configure Tailwind with BLUETTI color palette"
```

---

## Task 4: Organizar estructura y mover archivos existentes

**Files:**
- Create: `src/data/products.json`
- Create: `public/images/*.png`
- Delete: `src/App.css`, `src/assets/react.svg`, `public/vite.svg`

- [ ] **Crear carpetas necesarias**

```bash
mkdir -p src/components src/pages src/data public/images
```

- [ ] **Copiar products.json al lugar correcto**

```bash
cp products.json src/data/products.json
```

- [ ] **Copiar imágenes a `public/images/` (para que Vite las sirva como assets estáticos)**

```bash
cp ac200pl.png apex300.png ep2000.png ep760.png es125x.png rv5.png public/images/
```

- [ ] **Eliminar boilerplate de Vite**

```bash
rm -f src/App.css src/assets/react.svg public/vite.svg
```

- [ ] **Verificar estructura**

```bash
ls src/data && ls public/images
```
Expected: `products.json` en `src/data/`, los 6 `.png` en `public/images/`

- [ ] **Commit**

```bash
git add src/data/products.json public/images/
git commit -m "chore: move products data and images to correct directories"
```

---

## Task 5: Crear helpers de datos

**Files:**
- Create: `src/utils.js`
- Create: `src/data/categorias.js`

- [ ] **Crear `src/utils.js`:**

```js
export function formatKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .trim()
}
```

- [ ] **Crear `src/data/categorias.js`:**

```js
export const CATEGORIA_LABELS = {
  'Industrial / Comercial': 'Industrial',
  'Movilidad / RV / Off-Grid': 'Movilidad',
  'Residencial / Comercial — Alta Potencia': 'Residencial',
  'Residencial — Monofásico': 'Residencial',
  'Portátil / Versátil / Escalable': 'Portátil',
  'Portátil / Compacto': 'Portátil',
}

export const CATEGORIA_COLORS = {
  Industrial: 'bg-orange-900/50 text-orange-300 border border-orange-700/50',
  Movilidad: 'bg-blue-900/50 text-blue-300 border border-blue-700/50',
  Residencial: 'bg-green-900/50 text-green-300 border border-green-700/50',
  Portátil: 'bg-purple-900/50 text-purple-300 border border-purple-700/50',
}

export const TODAS_CATEGORIAS = ['Todos', 'Industrial', 'Residencial', 'Portátil', 'Movilidad']
```

- [ ] **Commit**

```bash
git add src/utils.js src/data/categorias.js
git commit -m "feat: add formatKey utility and category helpers"
```

---

## Task 6: Implementar CompareContext con tests

**Files:**
- Create: `src/components/CompareContext.jsx`
- Create: `src/components/CompareContext.test.jsx`
- Create: `src/test-setup.js`
- Modify: `vite.config.js`

- [ ] **Instalar dependencias de testing**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Reemplazar `vite.config.js`:**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
  },
})
```

- [ ] **Crear `src/test-setup.js`:**

```js
import '@testing-library/jest-dom'
```

- [ ] **Crear `src/components/CompareContext.jsx`:**

```jsx
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
```

- [ ] **Escribir el test que falla primero — crear `src/components/CompareContext.test.jsx`:**

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { CompareProvider, useCompare } from './CompareContext'

function TestConsumer() {
  const { selectedIds, addToCompare, removeFromCompare, clearCompare, isSelected, isFull } = useCompare()
  return (
    <div>
      <span data-testid="ids">{selectedIds.join(',')}</span>
      <span data-testid="is-full">{String(isFull())}</span>
      <span data-testid="selected-ep2000">{String(isSelected('ep2000'))}</span>
      <button onClick={() => addToCompare('ep2000')}>add ep2000</button>
      <button onClick={() => addToCompare('rv5')}>add rv5</button>
      <button onClick={() => addToCompare('apex300')}>add apex300</button>
      <button onClick={() => removeFromCompare('ep2000')}>remove ep2000</button>
      <button onClick={clearCompare}>clear</button>
    </div>
  )
}

function setup() {
  render(<CompareProvider><TestConsumer /></CompareProvider>)
}

test('empieza vacío', () => {
  setup()
  expect(screen.getByTestId('ids').textContent).toBe('')
  expect(screen.getByTestId('is-full').textContent).toBe('false')
})

test('agrega hasta 2 productos', () => {
  setup()
  fireEvent.click(screen.getByText('add ep2000'))
  fireEvent.click(screen.getByText('add rv5'))
  expect(screen.getByTestId('ids').textContent).toBe('ep2000,rv5')
  expect(screen.getByTestId('is-full').textContent).toBe('true')
})

test('no agrega un tercer producto', () => {
  setup()
  fireEvent.click(screen.getByText('add ep2000'))
  fireEvent.click(screen.getByText('add rv5'))
  fireEvent.click(screen.getByText('add apex300'))
  expect(screen.getByTestId('ids').textContent).toBe('ep2000,rv5')
})

test('no agrega duplicados', () => {
  setup()
  fireEvent.click(screen.getByText('add ep2000'))
  fireEvent.click(screen.getByText('add ep2000'))
  expect(screen.getByTestId('ids').textContent).toBe('ep2000')
})

test('quita un producto por id', () => {
  setup()
  fireEvent.click(screen.getByText('add ep2000'))
  fireEvent.click(screen.getByText('remove ep2000'))
  expect(screen.getByTestId('ids').textContent).toBe('')
})

test('clearCompare resetea a vacío', () => {
  setup()
  fireEvent.click(screen.getByText('add ep2000'))
  fireEvent.click(screen.getByText('add rv5'))
  fireEvent.click(screen.getByText('clear'))
  expect(screen.getByTestId('ids').textContent).toBe('')
})

test('isSelected devuelve true solo para productos seleccionados', () => {
  setup()
  expect(screen.getByTestId('selected-ep2000').textContent).toBe('false')
  fireEvent.click(screen.getByText('add ep2000'))
  expect(screen.getByTestId('selected-ep2000').textContent).toBe('true')
})
```

- [ ] **Correr tests y verificar que pasan**

```bash
npx vitest run src/components/CompareContext.test.jsx
```
Expected: `7 tests passed`

- [ ] **Commit**

```bash
git add src/components/CompareContext.jsx src/components/CompareContext.test.jsx src/test-setup.js vite.config.js
git commit -m "feat: add CompareContext with 7 passing tests"
```

---

## Task 7: Implementar Navbar

**Files:**
- Create: `src/components/Navbar.jsx`

- [ ] **Crear `src/components/Navbar.jsx`:**

```jsx
import { Link } from 'react-router-dom'
import { useCompare } from './CompareContext'

export default function Navbar() {
  const { selectedIds } = useCompare()

  return (
    <nav className="bg-bluetti-card border-b border-bluetti-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-bluetti-cyan font-bold text-lg tracking-wide">Naval Motor</span>
          <span className="text-gray-500 text-sm hidden sm:block">×</span>
          <span className="text-white font-semibold text-sm hidden sm:block">Productos BLUETTI</span>
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
  )
}
```

- [ ] **Commit**

```bash
git add src/components/Navbar.jsx
git commit -m "feat: add Navbar with compare badge"
```

---

## Task 8: Implementar CompareBar

**Files:**
- Create: `src/components/CompareBar.jsx`

- [ ] **Crear `src/components/CompareBar.jsx`:**

```jsx
import { useNavigate } from 'react-router-dom'
import { useCompare } from './CompareContext'
import products from '../data/products.json'

export default function CompareBar() {
  const { selectedIds, removeFromCompare, isFull } = useCompare()
  const navigate = useNavigate()

  if (selectedIds.length === 0) return null

  const selectedProducts = selectedIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-bluetti-card border-t border-bluetti-border shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {selectedProducts.map(product => (
            <div key={product.id} className="flex items-center gap-2 bg-bluetti-bg rounded-lg px-3 py-2">
              <img
                src={`/images/${product.imagen}`}
                alt={product.nombre}
                className="w-10 h-10 object-contain"
                onError={e => { e.target.style.display = 'none' }}
              />
              <span className="text-sm text-white font-medium truncate max-w-[120px]">
                {product.nombre}
              </span>
              <button
                onClick={() => removeFromCompare(product.id)}
                className="text-gray-400 hover:text-white ml-1 flex-shrink-0 leading-none"
                aria-label={`Quitar ${product.nombre} de la comparación`}
              >
                ✕
              </button>
            </div>
          ))}

          {selectedIds.length === 1 && (
            <span className="text-gray-500 text-sm hidden sm:block">
              Seleccioná un producto más para comparar
            </span>
          )}
        </div>

        <button
          onClick={() => navigate('/comparar')}
          disabled={!isFull()}
          className="flex-shrink-0 bg-bluetti-cyan text-bluetti-bg font-bold px-5 py-2 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
        >
          Comparar ahora →
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/CompareBar.jsx
git commit -m "feat: add CompareBar floating bottom bar"
```

---

## Task 9: Implementar ProductCard

**Files:**
- Create: `src/components/ProductCard.jsx`

- [ ] **Crear `src/components/ProductCard.jsx`:**

```jsx
import { Link } from 'react-router-dom'
import { useCompare } from './CompareContext'
import { CATEGORIA_LABELS, CATEGORIA_COLORS } from '../data/categorias'

export default function ProductCard({ product }) {
  const { addToCompare, removeFromCompare, isSelected, isFull } = useCompare()

  const label = CATEGORIA_LABELS[product.categoria] ?? product.categoria
  const colorClass = CATEGORIA_COLORS[label] ?? 'bg-gray-800 text-gray-300 border border-gray-700'
  const selected = isSelected(product.id)
  const disabled = isFull() && !selected

  function handleCompareClick() {
    if (selected) {
      removeFromCompare(product.id)
    } else {
      addToCompare(product.id)
    }
  }

  return (
    <div
      className={`bg-bluetti-card border rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:border-bluetti-cyan/50 ${
        selected ? 'border-bluetti-cyan' : 'border-bluetti-border'
      }`}
    >
      <div className="bg-black/30 flex items-center justify-center h-48 p-4">
        <img
          src={`/images/${product.imagen}`}
          alt={product.nombre}
          className="max-h-full max-w-full object-contain"
          onError={e => { e.target.style.display = 'none' }}
        />
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-white font-bold text-lg leading-tight">{product.nombre}</h3>
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{product.tagline}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${colorClass}`}>
            {label}
          </span>
        </div>

        <div className="flex gap-2 mt-auto">
          <Link
            to={`/producto/${product.id}`}
            className="flex-1 text-center bg-bluetti-cyan text-bluetti-bg font-semibold text-sm py-2 rounded-lg hover:brightness-110 transition-all"
          >
            Ver detalle
          </Link>
          <button
            onClick={handleCompareClick}
            disabled={disabled}
            className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
              selected
                ? 'bg-bluetti-cyan/20 border-bluetti-cyan text-bluetti-cyan'
                : disabled
                ? 'border-gray-700 text-gray-600 cursor-not-allowed'
                : 'border-bluetti-border text-gray-400 hover:border-bluetti-cyan hover:text-bluetti-cyan'
            }`}
            aria-label={
              selected
                ? `Quitar ${product.nombre} de comparación`
                : `Agregar ${product.nombre} a comparación`
            }
          >
            {selected ? '✓' : '+'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/ProductCard.jsx
git commit -m "feat: add ProductCard with compare toggle"
```

---

## Task 10: Implementar FilterBar

**Files:**
- Create: `src/components/FilterBar.jsx`

- [ ] **Crear `src/components/FilterBar.jsx`:**

```jsx
import { TODAS_CATEGORIAS } from '../data/categorias'

export default function FilterBar({ activeFilter, onFilterChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
      {TODAS_CATEGORIAS.map(cat => (
        <button
          key={cat}
          onClick={() => onFilterChange(cat)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
            activeFilter === cat
              ? 'bg-bluetti-cyan text-bluetti-bg border-bluetti-cyan'
              : 'bg-transparent text-gray-400 border-bluetti-border hover:border-bluetti-cyan/50 hover:text-white'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/FilterBar.jsx
git commit -m "feat: add FilterBar with category chips"
```

---

## Task 11: Implementar SpecsTable y HighlightsList

**Files:**
- Create: `src/components/SpecsTable.jsx`
- Create: `src/components/HighlightsList.jsx`

- [ ] **Crear `src/components/SpecsTable.jsx`:**

```jsx
import { formatKey } from '../utils'

export default function SpecsTable({ specs }) {
  return (
    <div className="overflow-hidden rounded-xl border border-bluetti-border">
      <table className="w-full text-sm">
        <tbody>
          {Object.entries(specs).map(([key, value], i) => (
            <tr key={key} className={i % 2 === 0 ? 'bg-bluetti-card' : 'bg-bluetti-bg'}>
              <td className="px-4 py-3 text-gray-400 font-medium w-1/2 align-top">
                {formatKey(key)}
              </td>
              <td className="px-4 py-3 text-white">
                {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Crear `src/components/HighlightsList.jsx`:**

```jsx
export default function HighlightsList({ highlights }) {
  return (
    <ul className="space-y-3">
      {highlights.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="text-bluetti-lime text-lg flex-shrink-0 mt-0.5">⚡</span>
          <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/SpecsTable.jsx src/components/HighlightsList.jsx
git commit -m "feat: add SpecsTable and HighlightsList components"
```

---

## Task 12: Implementar página Catálogo

**Files:**
- Create: `src/pages/Catalogo.jsx`

- [ ] **Crear `src/pages/Catalogo.jsx`:**

```jsx
import { useState } from 'react'
import products from '../data/products.json'
import { CATEGORIA_LABELS } from '../data/categorias'
import ProductCard from '../components/ProductCard'
import FilterBar from '../components/FilterBar'

export default function Catalogo() {
  const [activeFilter, setActiveFilter] = useState('Todos')

  const filteredProducts = activeFilter === 'Todos'
    ? products
    : products.filter(p => CATEGORIA_LABELS[p.categoria] === activeFilter)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Productos <span className="text-bluetti-cyan">BLUETTI</span>
        </h1>
        <p className="text-gray-400">
          Sistemas de almacenamiento de energía para cada necesidad
        </p>
      </div>

      <div className="mb-6">
        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 text-center py-16">
          No hay productos en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add src/pages/Catalogo.jsx
git commit -m "feat: add Catalogo page with product grid and filters"
```

---

## Task 13: Implementar página ProductoDetalle

**Files:**
- Create: `src/pages/ProductoDetalle.jsx`

- [ ] **Crear `src/pages/ProductoDetalle.jsx`:**

```jsx
import { useParams, Link, useNavigate } from 'react-router-dom'
import products from '../data/products.json'
import { useCompare } from '../components/CompareContext'
import SpecsTable from '../components/SpecsTable'
import HighlightsList from '../components/HighlightsList'
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

      {/* Hero */}
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

      {/* Casos de uso */}
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

      {/* Highlights */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Puntos destacados</h2>
        <HighlightsList highlights={product.highlights} />
      </section>

      {/* Specs */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Especificaciones técnicas</h2>
        <SpecsTable specs={product.specs} />
      </section>

      {/* Accesorios */}
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
```

- [ ] **Commit**

```bash
git add src/pages/ProductoDetalle.jsx
git commit -m "feat: add ProductoDetalle page with specs, highlights, and casos de uso"
```

---

## Task 14: Implementar página Comparar

**Files:**
- Create: `src/pages/Comparar.jsx`

- [ ] **Crear `src/pages/Comparar.jsx`:**

```jsx
import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCompare } from '../components/CompareContext'
import { formatKey } from '../utils'
import products from '../data/products.json'

export default function Comparar() {
  const { selectedIds, clearCompare, isFull } = useCompare()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isFull()) {
      navigate('/', { replace: true })
    }
  }, [isFull, navigate])

  if (!isFull()) return null

  const [p1, p2] = selectedIds.map(id => products.find(p => p.id === id))

  const allSpecKeys = Array.from(
    new Set([...Object.keys(p1.specs), ...Object.keys(p2.specs)])
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-white">Comparación de productos</h1>
        <button
          onClick={() => { clearCompare(); navigate('/') }}
          className="text-sm text-gray-400 hover:text-white border border-bluetti-border hover:border-gray-500 px-4 py-2 rounded-lg transition-all"
        >
          Limpiar comparación
        </button>
      </div>

      {/* Encabezados */}
      <div className="grid grid-cols-3 gap-4 mb-2">
        <div />
        {[p1, p2].map(product => (
          <div
            key={product.id}
            className="bg-bluetti-card border border-bluetti-border rounded-xl p-4 text-center"
          >
            <div className="bg-black/30 rounded-lg flex items-center justify-center h-36 mb-3 p-2">
              <img
                src={`/images/${product.imagen}`}
                alt={product.nombre}
                className="max-h-full max-w-full object-contain"
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
            <h2 className="text-white font-bold text-lg">{product.nombre}</h2>
            <p className="text-gray-400 text-xs mt-1">{product.tagline}</p>
            <Link
              to={`/producto/${product.id}`}
              className="inline-block mt-3 text-bluetti-cyan text-xs hover:underline"
            >
              Ver detalle completo →
            </Link>
          </div>
        ))}
      </div>

      {/* Tabla de specs */}
      <div className="rounded-xl border border-bluetti-border overflow-hidden">
        {allSpecKeys.map((key, i) => {
          const v1 = p1.specs[key]
          const v2 = p2.specs[key]
          const differ = String(v1 ?? '') !== String(v2 ?? '')

          return (
            <div
              key={key}
              className={`grid grid-cols-3 gap-4 px-4 py-3 text-sm ${
                i % 2 === 0 ? 'bg-bluetti-card' : 'bg-bluetti-bg'
              } ${differ ? 'border-l-2 border-bluetti-cyan' : ''}`}
            >
              <span className="text-gray-400 font-medium">{formatKey(key)}</span>
              {[v1, v2].map((val, j) => (
                <span
                  key={j}
                  className={
                    val === undefined
                      ? 'text-gray-600 italic'
                      : differ
                      ? 'text-bluetti-cyan font-semibold'
                      : 'text-white'
                  }
                >
                  {val === undefined
                    ? '—'
                    : typeof val === 'boolean'
                    ? (val ? 'Sí' : 'No')
                    : String(val)}
                </span>
              ))}
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
          ← Volver al catálogo
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add src/pages/Comparar.jsx
git commit -m "feat: add Comparar page with side-by-side spec diff"
```

---

## Task 15: Cablear App.jsx y main.jsx

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/main.jsx`

- [ ] **Reemplazar `src/main.jsx`:**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Reemplazar `src/App.jsx`:**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CompareProvider } from './components/CompareContext'
import Navbar from './components/Navbar'
import CompareBar from './components/CompareBar'
import Catalogo from './pages/Catalogo'
import ProductoDetalle from './pages/ProductoDetalle'
import Comparar from './pages/Comparar'

export default function App() {
  return (
    <BrowserRouter>
      <CompareProvider>
        <div className="min-h-screen bg-bluetti-bg text-white">
          <Navbar />
          <main className="pb-24">
            <Routes>
              <Route path="/" element={<Catalogo />} />
              <Route path="/producto/:id" element={<ProductoDetalle />} />
              <Route path="/comparar" element={<Comparar />} />
            </Routes>
          </main>
          <CompareBar />
        </div>
      </CompareProvider>
    </BrowserRouter>
  )
}
```

- [ ] **Commit**

```bash
git add src/App.jsx src/main.jsx
git commit -m "feat: wire up App router with all pages and providers"
```

---

## Task 16: Verificación final

**Files:** ninguno nuevo

- [ ] **Correr todos los tests**

```bash
npx vitest run
```
Expected: `7 tests passed`

- [ ] **Verificar build de producción**

```bash
npm run build
```
Expected: sin errores. `dist/` generado.

- [ ] **Arrancar servidor de desarrollo y verificar manualmente**

```bash
npm run dev
```
Abrir `http://localhost:5173` y verificar:
- [ ] Catálogo muestra los 6 productos con sus imágenes
- [ ] Chips de filtro funcionan (Industrial, Residencial, Portátil, Movilidad)
- [ ] Clic en "Ver detalle" abre la página de detalle correcta
- [ ] Página de detalle muestra imagen, specs, highlights, casos de uso
- [ ] Productos con accesorios muestran la sección "Accesorios compatibles"
- [ ] Botón "+ Comparar" en la card agrega el producto a la CompareBar inferior
- [ ] CompareBar aparece al seleccionar 1 producto y muestra "Seleccioná un producto más"
- [ ] Con 2 productos seleccionados, "Comparar ahora →" se activa
- [ ] Página `/comparar` muestra las dos columnas con specs alineadas
- [ ] Filas con valores distintos aparecen resaltadas en cyan con borde izquierdo
- [ ] "Limpiar comparación" vuelve al catálogo con el contexto reseteado
- [ ] Navegar a `/producto/inexistente` muestra la página de error con botón volver
- [ ] El Navbar muestra el badge numérico cuando hay productos en comparación
- [ ] Layout es correcto en mobile (320px), tablet (768px) y desktop (1280px)

- [ ] **Detener servidor y hacer commit final**

Ctrl+C para detener `npm run dev`.

```bash
git add .
git commit -m "feat: bluetti-app complete — catalog, product detail, comparator"
```
