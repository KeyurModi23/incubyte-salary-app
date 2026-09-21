import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EditSalaryDialog } from './EditSalaryDialog'
import { Employee } from '@/types'

type EmployeeDirectoryProps = {
  employees: Employee[]
  loading: boolean
  onRefresh: () => void
}

export function EmployeeDirectory({ employees, loading, onRefresh }: EmployeeDirectoryProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: employees.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // Height of each row
    overscan: 15,
  })

  return (
    <Card className="shadow-sm border-border bg-card text-card-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
      <CardHeader className="border-b border-border pb-4 mb-4">
        <CardTitle>Employee Directory</CardTitle>
        <CardDescription>A virtualized list rendering massive amounts of data with zero lag.</CardDescription>
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
            className="h-[650px] overflow-auto rounded-lg border border-border bg-background relative shadow-inner scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700"
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
              {/* Table Header */}
              <div className="sticky top-0 z-10 grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-4 py-3 bg-muted/80 backdrop-blur-md border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider shadow-sm">
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
                    className="absolute left-0 w-full grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-4 border-b border-border items-center hover:bg-muted/50 transition-colors"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                      top: 40 // Offset for sticky header
                    }}
                  >
                    <div className="font-medium text-foreground truncate pr-4">
                      {employee.firstName} {employee.lastName}
                    </div>
                    <div className="text-muted-foreground text-sm truncate pr-4">
                      {employee.email}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground truncate">
                        {employee.department}
                      </span>
                    </div>
                    <div className="font-medium text-emerald-600 dark:text-emerald-400">
                      ${employee.salary.toLocaleString()}
                    </div>
                    <div className="flex justify-end pr-2">
                      <EditSalaryDialog 
                        employeeId={employee.id}
                        currentSalary={employee.salary}
                        employeeName={`${employee.firstName} ${employee.lastName}`}
                        onSuccess={onRefresh}
                      />
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
