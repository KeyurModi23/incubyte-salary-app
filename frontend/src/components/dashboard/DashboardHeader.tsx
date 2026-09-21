type DashboardHeaderProps = {
  total: number
}

export function DashboardHeader({ total }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-1 pb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
        Dashboard Overview
      </h1>
      <p className="text-sm text-muted-foreground">
        Managing {total ? total.toLocaleString() : '...'} active workforce members across all departments.
      </p>
    </header>
  )
}
