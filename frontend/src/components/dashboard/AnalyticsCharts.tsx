import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AnalyticsData } from '@/types'

type AnalyticsChartsProps = {
  analytics: AnalyticsData | null
  loading: boolean
}

export function AnalyticsCharts({ analytics }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <Card className="shadow-sm border-border bg-card text-card-foreground xl:col-span-2">
        <CardHeader>
          <CardTitle>Average Salary by Department</CardTitle>
          <CardDescription>Compensation distribution across teams.</CardDescription>
        </CardHeader>
        <CardContent className="h-[320px]">
          {!analytics ? <Skeleton className="h-full w-full" /> : (
            <div className="w-full h-full overflow-x-auto overflow-y-hidden custom-scrollbar">
              <div className="min-w-[500px] h-full pb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.byDepartment} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="department"
                      tick={{ fontSize: 11, fill: '#64748b' }} 
                      tickLine={false} 
                      axisLine={false} 
                      interval={0}
                      tickFormatter={(val) => val.length > 10 ? val.substring(0, 10) + '...' : val}
                    />
                    <YAxis 
                      tickFormatter={(val) => `$${val / 1000}k`} 
                      tick={{ fontSize: 12, fill: '#64748b' }} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <RechartsTooltip 
                      cursor={{ fill: 'transparent' }} 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        color: 'hsl(var(--card-foreground))',
                        borderRadius: '8px', 
                        border: '1px solid hsl(var(--border))', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                      }} 
                      itemStyle={{ color: 'hsl(var(--card-foreground))' }}
                      formatter={(value: any) => [`$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 'Average Salary']} 
                    />
                    <Bar dataKey="avgSalary" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border bg-card text-card-foreground xl:col-span-1">
        <CardHeader>
          <CardTitle>Headcount by Country</CardTitle>
          <CardDescription>Global distribution of our workforce.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          {!analytics ? <Skeleton className="h-full w-full" /> : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[...analytics.byCountry].sort((a, b) => b.count - a.count).slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="country"
                >
                  {analytics.byCountry.slice(0, 5).map((_, index) => {
                    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="transparent" />
                  })}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    color: 'hsl(var(--card-foreground))',
                    borderRadius: '8px', 
                    border: '1px solid hsl(var(--border))', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }} 
                  itemStyle={{ color: 'hsl(var(--card-foreground))' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
