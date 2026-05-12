import SimuladorSolar from '../components/SimuladorSolar'

export default function SimuladorSolarPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">Simulador de Paneles Solares</h1>
      <p className="text-bluetti-cyan text-sm mb-8">
        Calculá cuántos paneles solares necesitás para recargar tu equipo BLUETTI en un día.
      </p>
      <SimuladorSolar />
    </div>
  )
}
