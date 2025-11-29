export const todayISO = (): string => new Date().toISOString().slice(0,10)
export const toISO = (d: Date): string => d.toISOString().slice(0,10)
export const parseISO = (s: string) => new Date(s + 'T00:00:00')

export const startOfWeek = (d = new Date()): Date => {
  const date = new Date(d)
  const day = (date.getDay() + 6) % 7 // Monday=0
  date.setDate(date.getDate() - day)
  date.setHours(0,0,0,0)
  return date
}
export const endOfWeek = (d = new Date()): Date => {
  const start = startOfWeek(d)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return end
}

export const formatNice = (iso: string): string => {
  const d = parseISO(iso)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
