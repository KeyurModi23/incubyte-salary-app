import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, TrendingUp } from "lucide-react"

type QuickStatsProps = {
  total: number
  loading: boolean
}

export function QuickStats({ total, loading }: QuickStatsProps) {
  return (
    <Card className="shadow-sm border-border bg-card text-card-foreground animate-in fade-in slide-in-from-bottom-3 duration-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && total === 0 ? <Skeleton className="h-16 w-full" /> : (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-foreground">
                {total.toLocaleString()}
              </span>
              <div className="p-2 bg-muted rounded-full text-primary">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
