import { Layers, LayoutDashboard, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import IconLogo from '../../assets/incubyte-icon.png'
import FullLogo from '../../assets/incubyte-logo.png'

type SidebarProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen bg-card border-r border-border flex flex-col shrink-0
          transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-[72px]'}
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
          <div className={`flex items-center relative h-full transition-all duration-300 overflow-hidden ${isOpen ? 'w-44' : 'w-7'}`}>
            <img 
              src={FullLogo} 
              alt="Incubyte" 
              className={`absolute left-0 w-32 h-auto object-contain transition-opacity duration-300 dark:hidden ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
            />
            <img 
              src="/FullLogoDark.png" 
              alt="Incubyte" 
              className={`absolute left-0 w-32 h-auto object-contain transition-opacity duration-300 hidden dark:block ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
            />
            <img 
              src={IconLogo} 
              alt="Incubyte" 
              className={`absolute left-0 w-7 h-7 object-contain transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} 
            />
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 flex flex-col gap-2 px-3">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-medium transition-all group relative overflow-hidden"
            title={!isOpen ? "Dashboard" : undefined}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            <span className={`transition-opacity duration-300 whitespace-nowrap ${isOpen ? 'opacity-100' : 'lg:opacity-0'}`}>
              Dashboard
            </span>
          </Link>
        </nav>
      </aside>
    </>
  )
}
