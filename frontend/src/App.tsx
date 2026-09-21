import { useEffect, useState } from 'react'
import axios from 'axios'
import { Employee, AnalyticsData } from '@/types'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { EmployeeDirectory } from '@/components/dashboard/EmployeeDirectory'
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts'
import { QuickStats } from '@/components/dashboard/QuickStats'

const fetchEmployees = async (page: number, limit: number) => {
  const res = await axios.get(`http://localhost:3001/api/employees?page=${page}&limit=${limit}`)
  return res.data
}

function App() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    Promise.all([
      fetchEmployees(1, 1000),
      axios.get('http://localhost:3001/api/analytics')
    ]).then(([empData, analyticsRes]) => {
      setEmployees(empData.data)
      setTotal(empData.meta.total)
      setAnalytics(analyticsRes.data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 flex flex-col gap-8 text-slate-900 dark:text-slate-50 font-sans">
      <DashboardHeader total={total} />
      
      <main className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="flex flex-col gap-8 xl:col-span-3">
          <EmployeeDirectory employees={employees} loading={loading} />
          <AnalyticsCharts analytics={analytics} loading={loading} />
        </div>

        <div className="flex flex-col gap-6 xl:col-span-1">
          <QuickStats total={total} loading={loading} />
        </div>
      </main>
    </div>
  )
}

export default App
