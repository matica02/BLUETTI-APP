# Diseño: bluetti-app

**Fecha:** 2026-05-04  
**Proyecto:** Naval Motor — Catálogo de productos BLUETTI  
**Stack:** React + Vite + Tailwind CSS + react-router-dom  
**Idioma:** Español

---

## Propósito

App web para Naval Motor que funciona como catálogo de productos BLUETTI y herramienta de ventas. La usan tanto clientes finales (para explorar productos) como vendedores de Naval Motor (en reuniones con clientes). Funciona en desktop, tablet y mobile.

---

## Características

- Listado de productos con filtro por categoría
- Vista de detalle completo de cada producto
- Comparador lado a lado de 2 productos
- Sin contacto/cotización (fuera de scope)
- Sin backend — datos estáticos desde `products.json`

---

## Arquitectura

### Enfoque

SPA (Single Page Application) con routing client-side. Estado global mínimo via React Context para la selección de comparación. Sin librerías de estado adicionales (YAGNI).

### Rutas

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | `Catalogo` | Listado con filtros |
| `/producto/:id` | `ProductoDetalle` | Detalle completo |
| `/comparar` | `Comparar` | Comparador de 2 productos |

### Estructura de archivos

```
src/
  components/
    Navbar.jsx           — navegación + indicador de comparación activa
    ProductCard.jsx      — card de producto en el catálogo
    FilterBar.jsx        — chips de filtro por categoría
    SpecsTable.jsx       — tabla key-value de especificaciones técnicas
    HighlightsList.jsx   — lista de puntos destacados con íconos
    CompareBar.jsx       — barra flotante inferior con productos seleccionados
    CompareContext.jsx   — estado global: IDs de los 2 productos a comparar
  pages/
    Catalogo.jsx         — página principal con grid y filtros
    ProductoDetalle.jsx  — página de detalle de producto
    Comparar.jsx         — página de comparación lado a lado
  data/
    products.json        — datos de los 6 productos BLUETTI
  assets/
    images/              — imágenes de productos (ac200pl.png, apex300.png, etc.)
  App.jsx
  main.jsx
public/
```

---

## Componentes

### Navbar
- Logo Naval Motor + texto "Productos BLUETTI"
- Badge con número de productos en comparación (0, 1 o 2)
- Link al catálogo

### ProductCard
- Imagen del producto
- Badge de categoría (coloreado)
- Nombre + tagline
- Botón "Ver detalle" → `/producto/:id`
- Botón "+ Comparar" que:
  - Agrega el producto al contexto de comparación
  - Se deshabilita si ya hay 2 seleccionados y este no es uno de ellos
  - Muestra estado activo si ya está seleccionado

### FilterBar
- Chips horizontales con labels cortos: `Todos`, `Industrial`, `Residencial`, `Portátil`, `Movilidad`
- El mapeo de `producto.categoria` a label de filtro se hace en `Catalogo.jsx` con un objeto de normalización
- Filtro con `useState` local en `Catalogo.jsx`
- Scroll horizontal en mobile

### SpecsTable
- Tabla con filas `clave: valor` generada dinámicamente desde `producto.specs`
- Claves formateadas legiblemente (camelCase → texto normal)

### HighlightsList
- Lista de `producto.highlights` con ícono de check o rayo

### CompareBar
- Barra fija en la parte inferior, visible cuando hay ≥1 producto seleccionado
- Muestra nombre + miniatura de cada producto seleccionado
- Botón "Comparar ahora →" (activo solo con 2 productos)
- Botón "✕" para quitar cada producto de la selección

---

## Páginas

### Catálogo (`/`)
1. Header: título de la página
2. `FilterBar` para filtrar por categoría
3. Grid responsivo de `ProductCard` (1 col mobile, 2 cols tablet, 3 cols desktop)
4. `CompareBar` superpuesta si hay productos seleccionados

### Detalle del producto (`/producto/:id`)
1. Imagen grande del producto
2. Nombre, tagline, descripción
3. Sección "Especificaciones técnicas" → `SpecsTable`
4. Sección "Puntos destacados" → `HighlightsList`
5. Sección "Casos de uso" → cards con etiqueta + descripción
6. Sección "Accesorios compatibles" (solo si `accesoriosCompatibles.length > 0`)
7. Botón "+ Agregar a comparación" (fijo o al final)

### Comparador (`/comparar`)
- Requiere exactamente 2 productos en el contexto; si no, redirige a `/` con aviso
- Dos columnas: imagen + nombre + specs alineadas por fila
- Filas con valores distintos resaltadas con color de acento
- Botón "Limpiar comparación" → resetea contexto y vuelve al catálogo

---

## Estado global (CompareContext)

```js
// Expone:
selectedIds: string[]          // máx. 2 IDs
addToCompare(id): void         // agrega si hay menos de 2
removeFromCompare(id): void    // quita por ID
clearCompare(): void           // resetea a []
isSelected(id): boolean
isFull(): boolean              // true si selectedIds.length === 2
```

---

## Estilo visual

| Token | Valor |
|-------|-------|
| Fondo general | `#0a0a0f` |
| Fondo cards | `#111827` |
| Acento principal (cyan) | `#00d4ff` |
| Acento secundario (verde lima) | `#a3e635` |
| Texto principal | `#ffffff` |
| Texto secundario | `#d1d5db` (gray-300) |
| Bordes sutiles | `#1f2937` (gray-800) |

Tipografía: Inter (Google Fonts) o la sans-serif del sistema.  
Tailwind CSS se usa para todos los estilos — sin CSS custom salvo variables de color en `tailwind.config.js`.

---

## Manejo de errores

| Caso | Comportamiento |
|------|----------------|
| ID de producto inexistente en `/producto/:id` | Página "Producto no encontrado" + botón "Volver al catálogo" |
| `/comparar` con < 2 productos seleccionados | Redirección a `/` con mensaje toast |
| Imagen de producto no disponible | Placeholder oscuro con nombre del producto |

---

## Datos

- Fuente: `src/data/products.json` (6 productos BLUETTI)
- Imágenes: `src/assets/images/*.png`
- Los datos son estáticos — no hay fetch, no hay API
- Si se agregan productos en el futuro, basta con editar el JSON y agregar la imagen

---

## Fuera de scope

- Formulario de contacto o cotización
- Autenticación / login
- Backend o base de datos
- Animaciones complejas
- Internacionalización (la app es solo en español)
