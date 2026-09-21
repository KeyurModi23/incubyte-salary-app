import { useEffect, useState } from 'react'
import axios from 'axios'
import { Employee, AnalyticsData } from '@/types'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { EmployeeDirectory } from '@/components/dashboard/EmployeeDirectory'
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts'
import { QuickStats } from '@/components/dashboard/QuickStats'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Topbar } from '@/components/dashboard/Topbar'
import { AddEmployeeDialog } from '@/components/dashboard/AddEmployeeDialog'
import { Toaster } from '@/components/ui/toaster'

const fetchEmployees = async (page: number, limit: number, search?: string) => {
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : ''
  const res = await axios.get(`http://localhost:3001/api/employees?page=${page}&limit=${limit}${searchParam}`)
  return res.data
}

const fetchAnalytics = async (search?: string) => {
  const searchParam = search ? `?search=${encodeURIComponent(search)}` : ''
  const res = await axios.get(`http://localhost:3001/api/analytics${searchParam}`)
  return res.data
}

function App() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const analyticsData = await fetchAnalytics(searchQuery)
        setAnalytics(analyticsData)
      } catch (error) {
        console.error("Failed to load analytics", error)
      }
    }
    const debounceTimer = setTimeout(loadAnalytics, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery, refreshTrigger])

  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true)
      try {
        const empData = await fetchEmployees(1, 10000, searchQuery)
        setEmployees(empData.data)
        setTotal(empData.meta.total)
      } catch (error) {
        console.error("Failed to load employees", error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(loadEmployees, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery, refreshTrigger])

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-center justify-between pb-6">
              <DashboardHeader total={total} />
              <AddEmployeeDialog onSuccess={triggerRefresh} />
            </div>

            <QuickStats total={total} loading={loading} />
            
            <div className="mt-8">
              <AnalyticsCharts analytics={analytics} loading={loading} />
            </div>

            <div className="mt-8">
              <EmployeeDirectory employees={employees} loading={loading} onRefresh={triggerRefresh} />
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}

export default App
