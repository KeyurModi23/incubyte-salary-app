import { LayoutDashboard, Users, PieChart, Settings } from 'lucide-react'

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col hidden lg:flex h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          Incubyte
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Overview</div>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md bg-secondary text-secondary-foreground font-medium transition-colors">
          <LayoutDashboard className="w-4 h-4 text-primary" />
          Dashboard
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
          <Users className="w-4 h-4" />
          Directory
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
          <PieChart className="w-4 h-4" />
          Analytics
        </a>
      </nav>

      <div className="p-4 border-t border-border">
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </a>
      </div>
    </aside>
  )
}
