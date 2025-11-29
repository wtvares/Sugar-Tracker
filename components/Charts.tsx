'use client'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Line, Bar, Pie } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend)

export function LineChart({ labels, data, label }: { labels: string[], data: number[], label: string }) {
  return <div className="section"><Line data={{
    labels,
    datasets: [{ label, data, borderColor: '#8b7fc0', backgroundColor: 'rgba(139,127,192,0.2)', tension: 0.3 }]
  }} options={{ responsive: true, plugins: { legend: { display: false } } }} /></div>
}

export function BarChart({ labels, data, label }: { labels: string[], data: number[], label: string }) {
  return <div className="section"><Bar data={{
    labels,
    datasets: [{ label, data, backgroundColor: '#3dbb8d' }]
  }} options={{ responsive: true, plugins: { legend: { display: false } } }} /></div>
}

export function PieChart({ labels, data }: { labels: string[], data: number[] }) {
  const colors = ['#8b7fc0','#3dbb8d','#b2aa98','#a59ad0','#5fcea4','#cec8bc','#7669ab']
  return <div className="section"><Pie data={{
    labels,
    datasets: [{ data, backgroundColor: colors.slice(0, data.length) }]
  }} options={{ responsive: true }} /></div>
}
