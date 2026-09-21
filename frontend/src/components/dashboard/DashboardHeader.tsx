type DashboardHeaderProps = {
  total: number
}

export function DashboardHeader({ total }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-2 border-b border-slate-200 dark:border-slate-800 pb-6">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
        Incubyte HR Dashboard
      </h1>
      <p className="text-slate-500 dark:text-slate-400">
        Managing {total ? total.toLocaleString() : '...'} employees seamlessly.
      </p>
    </header>
  )
}
