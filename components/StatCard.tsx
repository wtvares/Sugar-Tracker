export default function StatCard({ title, value, hint }: { title: string, value: string | number, hint?: string }) {
  return (
    <div className="section">
      <div className="text-sm text-warmgray-600">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {hint && <div className="text-xs text-warmgray-500 mt-1">{hint}</div>}
    </div>
  )
}
