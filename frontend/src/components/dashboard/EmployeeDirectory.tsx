import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Employee } from '@/types'

type EmployeeDirectoryProps = {
  employees: Employee[]
  loading: boolean
}

export function EmployeeDirectory({ employees, loading }: EmployeeDirectoryProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: employees.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // Height of each row
    overscan: 15,
  })

  return (
    <Card className="shadow-sm border-slate-200 dark:border-slate-800">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-4 mb-4">
        <CardTitle>Employee Directory</CardTitle>
        <CardDescription>A virtualized list rendering massive amounts of data with zero lag.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
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
            className="h-[650px] overflow-auto rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative shadow-inner"
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {/* Table Header */}
              <div className="sticky top-0 z-10 flex items-center px-4 py-3 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider shadow-sm">
                <div className="flex-[1.5]">Employee</div>
                <div className="flex-1 hidden md:block">Email</div>
                <div className="w-32">Department</div>
                <div className="w-24 text-right">Salary</div>
              </div>

              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const employee = employees[virtualRow.index]
                return (
                  <div
                    key={virtualRow.index}
                    className="absolute left-0 w-full flex items-center px-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                      top: 40 // Offset for sticky header
                    }}
                  >
                    <div className="flex-[1.5] font-medium text-slate-900 dark:text-slate-100 truncate pr-4">
                      {employee.firstName} {employee.lastName}
                    </div>
                    <div className="flex-1 text-slate-500 text-sm hidden md:block truncate pr-4">
                      {employee.email}
                    </div>
                    <div className="w-32 text-slate-500 text-sm">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 truncate">
                        {employee.department}
                      </span>
                    </div>
                    <div className="w-24 text-right font-medium text-emerald-600 dark:text-emerald-400">
                      ${employee.salary.toLocaleString()}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
