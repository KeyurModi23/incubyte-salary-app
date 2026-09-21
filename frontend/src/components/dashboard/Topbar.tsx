import { Search, Bell, Sun, Moon, Menu } from 'lucide-react'
import { useTheme } from '../ThemeProvider'

export function Topbar() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-md">
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search employees..." 
            className="h-9 w-64 rounded-full border border-input bg-muted pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full ring-2 ring-background"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 ml-2 shadow-sm border border-background"></div>
      </div>
    </header>
  )
}
