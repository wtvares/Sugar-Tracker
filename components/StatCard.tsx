export default function StatCard({ title, value, hint }: { title: string, value: string | number, hint?: string }) {
  return (
    <div className="section hover:shadow-md transition-shadow duration-200">
      <div className="text-xs font-medium text-warmgray-500 uppercase tracking-wide mb-2">{title}</div>
      <div className="text-3xl font-bold text-lavender-700 mb-1">{value}</div>
      {hint && <div className="text-xs text-warmgray-500 mt-2 leading-relaxed">{hint}</div>}
    </div>
  )
}
