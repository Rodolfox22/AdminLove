import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { cn } from '@/utils/helpers';
import { VERSION } from '@/version';
import AboutDialog from '@/components/ui/AboutDialog';
import {
  Home,
  DollarSign,
  Settings,
  History,
  Menu,
  X,
  LogOut,
  User,
  ChevronRight,
  Info,
  List
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // Obtener el título de la página actual
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Inicio';
      case '/distribuir': return 'Dividir';
      case '/mis-distribuciones': return 'Mis Distribuciones';
      case '/historial': return 'Historial';
      case '/configuracion': return 'Ajustes';
      case '/resultados': return 'Resultados';
      default: return 'AdminLove';
    }
  };

  const navItems = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/distribuir', label: 'Dividir', icon: DollarSign },
    { path: '/mis-distribuciones', label: 'Mis Distribuciones', icon: List },
    { path: '/historial', label: 'Historial', icon: History },
    { path: '/configuracion', label: 'Ajustes', icon: Settings }
  ];

  // Elementos para el bottom navigation - PC (escritorio)
  const bottomNavItemsPC = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/distribuir', label: 'Dividir', icon: DollarSign },
    { path: '/mis-distribuciones', label: 'Mis Distribuciones', icon: List },
    { path: '/historial', label: 'Historial', icon: History },
    { path: '/configuracion', label: 'Ajustes', icon: Settings }
  ];

  return (
    <>
      {/* Header superior móvil con título */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border lg:hidden">
        <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg sm:text-xl">
              <span className="text-primary">💰</span>
            </Link>
            <span className="font-semibold text-lg">{getPageTitle()}</span>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setShowAbout(true)}
              className="p-2 rounded-lg hover:bg-accent"
              aria-label="Acerca de"
            >
              <Info className="w-5 h-5 sm:size-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-accent"
              aria-label="Menú"
            >
              {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
        
        {/* Menú desplegable superior */}
        {isOpen && (
          <div className="absolute top-14 sm:top-16 left-0 right-0 bg-background border-b border-border p-4 space-y-2 animate-in max-h-80 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  )}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight size={16} className="ml-auto" />}
                </Link>
              );
            })}
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10"
            >
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}
      </header>

      {/* Bottom Navigation para móviles - solo spacer, sin menú */}
      <div className="lg:hidden h-16" />

      {/* Sidebar escritorio */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border hidden lg:flex flex-col z-40">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary text-2xl">💰</span>
            <span>AdminLove</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border space-y-2">
          <button
            onClick={() => setShowAbout(true)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-accent transition-colors text-left"
          >
            <Info size={20} />
            <span>Acerca de</span>
            <span className="ml-auto text-xs text-muted-foreground">v{VERSION}</span>
          </button>
          
          <div className="flex items-center gap-3 px-4 py-3 mt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User size={16} />
              <span className="truncate">{usuario?.nombre || 'Usuario'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-destructive transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Bottom Navigation para PC (escritorio) */}
      <nav className="hidden lg:flex fixed bottom-0 left-64 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border">
        <div className="flex items-center justify-around w-full h-14 px-4 max-w-7xl mx-auto">
          {bottomNavItemsPC.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <Icon size={18} />
                <span className="text-xs sm:text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer para el contenido (bottom nav en PC) */}
      <div className="hidden lg:block h-14" />
      
      {/* About Dialog */}
      <AboutDialog isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
}
