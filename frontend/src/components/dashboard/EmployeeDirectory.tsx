import { useRef, useState, useEffect } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EditSalaryDialog } from './EditSalaryDialog'
import { Employee } from '@/types'

type EmployeeDirectoryProps = {
  employees: Employee[]
  loading: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  onRefresh: () => void
  fetchNextPage?: () => void
  isFetchingNextPage?: boolean
}

export function EmployeeDirectory({ employees, loading, searchQuery, setSearchQuery, onRefresh, fetchNextPage, isFetchingNextPage }: EmployeeDirectoryProps) {
  const [isMobile, setIsMobile] = useState(false)
  
  // Need to use layout effect or early mount effect for initial window size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: employees.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => isMobile ? 160 : 64, // Taller rows on mobile for vertical card layout
    overscan: 15,
    initialRect: { width: 1000, height: 1000 } // Fixes JSDOM testing and improves first-paint
  })

  const virtualItems = rowVirtualizer.getVirtualItems()

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1]
    if (!lastItem || !fetchNextPage) return
    
    // If we've scrolled within 10 items of the bottom, fetch the next page
    if (lastItem.index >= employees.length - 10 && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [virtualItems, employees.length, isFetchingNextPage, fetchNextPage])

  return (
    <Card className="shadow-sm border-border bg-card text-card-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
      <CardHeader className="border-b border-border pb-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle>Employee Directory</CardTitle>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search employees..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full sm:w-64 rounded-full border border-input bg-muted pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading && employees.length === 0 ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div
            ref={parentRef}
            className="h-[650px] overflow-auto rounded-lg border border-border bg-background relative shadow-inner custom-scrollbar"
          >
            {employees.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <p className="text-lg font-medium">No employees found.</p>
                <p className="text-sm">Try adjusting your search query.</p>
              </div>
            ) : (
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
              {/* Table Header - Desktop Only */}
              <div className="sticky top-0 z-10 hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-4 py-3 bg-muted/80 backdrop-blur-md border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider shadow-sm">
                <div>Employee</div>
                <div>Email</div>
                <div>Department</div>
                <div>Salary</div>
                <div className="text-right pr-2">Actions</div>
              </div>

              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const employee = employees[virtualRow.index]
                if (!employee) return null
                return (
                  <div
                    key={virtualRow.index}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    className="absolute left-0 w-full px-4 border-b border-border hover:bg-muted/50 transition-colors"
                    style={{
                      transform: `translateY(${virtualRow.start}px)`,
                      top: isMobile ? 0 : 40 // Offset for sticky header only on desktop
                    }}
                  >
                    <div className="flex flex-col md:grid md:grid-cols-[2fr_2fr_1fr_1fr_auto] gap-3 md:gap-4 h-full py-4 md:py-0 md:min-h-[64px] md:items-center">
                      
                      {/* Name & Mobile Email & Mobile Action */}
                      <div className="flex justify-between items-start md:block min-w-0 w-full">
                        <div className="flex flex-col min-w-0 mr-2">
                          <span className="font-medium text-foreground truncate text-[15px] md:text-sm">
                            {employee.firstName} {employee.lastName}
                          </span>
                          <span className="text-muted-foreground text-sm truncate md:hidden">
                            {employee.email}
                          </span>
                        </div>
                        <div className="md:hidden shrink-0">
                          <EditSalaryDialog 
                            employeeId={employee.id}
                            currentSalary={employee.salary}
                            employeeName={`${employee.firstName} ${employee.lastName}`}
                            onSuccess={onRefresh}
                          />
                        </div>
                      </div>
                      
                      {/* Desktop Email */}
                      <div className="hidden md:block text-muted-foreground text-sm truncate pr-4">
                        {employee.email}
                      </div>

                      {/* Mobile: Department & Salary in one row */}
                      <div className="flex justify-between items-center md:hidden pt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground truncate">
                          {employee.department}
                        </span>
                        <div className="font-medium text-emerald-600 dark:text-emerald-400">
                          ${employee.salary.toLocaleString()}
                        </div>
                      </div>

                      {/* Desktop: Department */}
                      <div className="hidden md:block text-muted-foreground text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground truncate">
                          {employee.department}
                        </span>
                      </div>

                      {/* Desktop: Salary */}
                      <div className="hidden md:block font-medium text-emerald-600 dark:text-emerald-400">
                        ${employee.salary.toLocaleString()}
                      </div>

                      {/* Desktop Action */}
                      <div className="hidden md:flex justify-end pr-2">
                        <EditSalaryDialog 
                          employeeId={employee.id}
                          currentSalary={employee.salary}
                          employeeName={`${employee.firstName} ${employee.lastName}`}
                          onSuccess={onRefresh}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
