export default function HighlightsList({ highlights }) {
  return (
    <ul className="space-y-3">
      {highlights.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="text-bluetti-lime text-lg flex-shrink-0 mt-0.5">⚡</span>
          <span className="text-bluetti-cyan/80 text-sm leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}
