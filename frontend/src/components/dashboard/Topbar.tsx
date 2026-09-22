import { Sun, Moon, Menu } from 'lucide-react'
import { useTheme } from '../ThemeProvider'

type TopbarProps = {
  toggleSidebar: () => void
}

export function Topbar({ toggleSidebar }: TopbarProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-md">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  )
}
