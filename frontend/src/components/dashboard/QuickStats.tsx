import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type QuickStatsProps = {
  total: number
  loading: boolean
}

export function QuickStats({ total, loading }: QuickStatsProps) {
  return (
    <Card className="shadow-sm border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-24 w-full" /> : (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Employees</span>
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{total.toLocaleString()}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
