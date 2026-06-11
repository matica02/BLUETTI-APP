export const CATEGORIA_LABELS = {
  'Industrial / Comercial': 'Industrial',
  'Movilidad / RV / Off-Grid': 'Movilidad',
  'Residencial / Comercial — Alta Potencia': 'Residencial',
  'Residencial — Monofásico': 'Residencial',
  'Portátil / Versátil / Escalable': 'Portátil',
  'Portátil / Compacto': 'Portátil',
  'Batería': 'Batería',
  'Accesorio': 'Accesorio',
}

export const CATEGORIA_COLORS = {
  Industrial: 'bg-[#8ea930]/15 text-[#c5dd66] border border-[#8ea930]/40',
  Movilidad: 'bg-blue-900/50 text-blue-300 border border-blue-700/50',
  Residencial: 'bg-white/10 text-white border border-white/30',
  Portátil: 'bg-orange-900/50 text-orange-300 border border-orange-700/50',
  Batería: 'bg-cyan-900/50 text-cyan-300 border border-cyan-700/50',
  Accesorio: 'bg-pink-900/50 text-pink-300 border border-pink-700/50',
}

export const CATEGORIA_BORDER_COLORS = {
  Industrial: '#8ea930',
  Movilidad: '#60a5fa',
  Residencial: '#ffffff',
  Portátil: '#f97316',
  Batería: '#22d3ee',
  Accesorio: '#f472b6',
}

// Override de color por producto (se setea con el campo `color` en products.json).
// Tiene prioridad sobre el color de la categoría.
export const COLOR_OVERRIDES = {
  naranja: { border: '#f97316', badge: 'bg-orange-900/50 text-orange-300 border border-orange-700/50' },
  azul: { border: '#60a5fa', badge: 'bg-blue-900/50 text-blue-300 border border-blue-700/50' },
  blanco: { border: '#ffffff', badge: 'bg-white/10 text-white border border-white/30' },
  verde: { border: '#8ea930', badge: 'bg-[#8ea930]/15 text-[#c5dd66] border border-[#8ea930]/40' },
}

export const TODAS_CATEGORIAS = ['Todos', 'Industrial', 'Residencial', 'Portátil', 'Movilidad', 'Batería', 'Accesorio']

export const TIPO_RED_COLORS = {
  'Off-Grid': 'bg-amber-900/50 text-amber-300 border border-amber-700/50',
  'Híbrido': 'bg-cyan-900/50 text-cyan-300 border border-cyan-700/50',
  'On-Grid': 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50',
}
