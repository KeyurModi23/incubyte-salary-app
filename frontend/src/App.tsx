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
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1)

  // Centralized debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 800) // Increased to 800ms for slower typing speeds
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const analyticsData = await fetchAnalytics(debouncedQuery)
        setAnalytics(analyticsData)
      } catch (error) {
        console.error("Failed to load analytics", error)
      }
    }
    loadAnalytics()
  }, [debouncedQuery, refreshTrigger])

  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true)
      try {
        const empData = await fetchEmployees(1, 10000, debouncedQuery)
        setEmployees(empData.data)
        setTotal(empData.meta.total)
      } catch (error) {
        console.error("Failed to load employees", error)
      } finally {
        setLoading(false)
      }
    }
    loadEmployees()
  }, [debouncedQuery, refreshTrigger])

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex overflow-hidden">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center items-start justify-between pb-6 gap-4">
              <DashboardHeader total={total} />
              <AddEmployeeDialog onSuccess={triggerRefresh} />
            </div>

            <QuickStats total={total} loading={loading} />
            
            <div className="mt-8">
              <AnalyticsCharts analytics={analytics} loading={loading} />
            </div>

            <div className="mt-8">
              <EmployeeDirectory 
                employees={employees} 
                loading={loading} 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onRefresh={triggerRefresh} 
              />
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}

export default App
