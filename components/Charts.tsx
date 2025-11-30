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

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: { 
        size: 14
        // Removed weight property - Chart.js will use default bold
      },
      bodyFont: { size: 13 },
      cornerRadius: 8,
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
      ticks: {
        font: { size: 11 },
        color: '#6b7280'
      }
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: { size: 11 },
        color: '#6b7280'
      }
    }
  }
}

export function LineChart({ labels, data, label }: { labels: string[], data: number[], label: string }) {
  return (
    <div className="section">
      <div className="text-sm font-semibold text-warmgray-700 mb-4">{label}</div>
      <div style={{ height: '200px' }}>
        <Line 
          data={{
            labels,
            datasets: [{ 
              label, 
              data, 
              borderColor: '#8b7fc0', 
              backgroundColor: 'rgba(139,127,192,0.1)', 
              tension: 0.4,
              pointRadius: 4,
              pointHoverRadius: 6,
              pointBackgroundColor: '#8b7fc0',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
            }]
          }} 
          options={chartOptions} 
        />
      </div>
    </div>
  )
}

export function BarChart({ labels, data, label }: { labels: string[], data: number[], label: string }) {
  return (
    <div className="section">
      <div className="text-sm font-semibold text-warmgray-700 mb-4">{label}</div>
      <div style={{ height: '200px' }}>
        <Bar 
          data={{
            labels,
            datasets: [{ 
              label, 
              data, 
              backgroundColor: '#3dbb8d',
              borderRadius: 6,
            }]
          }} 
          options={chartOptions} 
        />
      </div>
    </div>
  )
}

export function PieChart({ labels, data }: { labels: string[], data: number[] }) {
  const colors = ['#8b7fc0','#3dbb8d','#b2aa98','#a59ad0','#5fcea4','#cec8bc','#7669ab']
  return (
    <div className="section">
      <div className="text-sm font-semibold text-warmgray-700 mb-4">Distribution</div>
      <div style={{ height: '250px' }}>
        <Pie 
          data={{
            labels,
            datasets: [{ 
              data, 
              backgroundColor: colors.slice(0, data.length),
              borderWidth: 2,
              borderColor: '#fff',
            }]
          }} 
          options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              legend: {
                display: true,
                position: 'bottom' as const,
                labels: {
                  padding: 15,
                  font: { size: 12 },
                  usePointStyle: true,
                }
              }
            }
          }} 
        />
      </div>
    </div>
  )
}
