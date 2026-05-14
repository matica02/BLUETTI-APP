import { formatKey } from '../utils'
import AnimatedNumber from './AnimatedNumber'

export default function SpecsTable({ specs }) {
  return (
    <div className="overflow-hidden rounded-xl border border-bluetti-border">
      <table className="w-full text-sm">
        <tbody>
          {Object.entries(specs).map(([key, value], i) => (
            <tr key={key} className={i % 2 === 0 ? 'bg-bluetti-card' : 'bg-bluetti-bg'}>
              <td className="px-4 py-3 text-bluetti-cyan font-medium w-1/2 align-top">
                {formatKey(key)}
              </td>
              <td className="px-4 py-3 text-white">
                {typeof value === 'boolean'
                  ? (value ? 'Sí' : 'No')
                  : <AnimatedNumber value={value} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
