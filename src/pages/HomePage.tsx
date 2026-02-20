import { useNavigate } from 'react-router-dom';
import { useAuthStore, useTransaccionStore, useHistorialStore } from '@/store';
import { formatearMonto, formatearFecha } from '@/utils/helpers';
import { 
  Plus, 
  DollarSign, 
  TrendingUp, 
  Clock,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { usuario } = useAuthStore();
  const { getTotalIngresos, getTotalGastos, getDisponible } = useTransaccionStore();
  const { historial } = useHistorialStore();
  
  const disponible = getDisponible();
  const ultimoHistorial = historial[0];
  
  const handleNuevaDistribucion = () => {
    navigate('/distribuir');
  };
  
  return (
    <div className="space-y-6 animate-in">
      {/* Saludo */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold">
          ¡Bienvenido{usuario?.nombre ? `, ${usuario.nombre}` : ''}!
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Administra tus ingresos con sabiduría y propósito
        </p>
      </div>
      
      {/* Botón principal */}
      <button
        onClick={handleNuevaDistribucion}
        className="w-full btn-primary py-3 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
      >
        <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
        <span>Iniciar Nueva Distribución</span>
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-card rounded-xl p-3 sm:p-4 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs">Ingresos</span>
          </div>
          <p className="text-base sm:text-lg font-semibold text-ingreso">
            {formatearMonto(getTotalIngresos())}
          </p>
        </div>
        
        <div className="bg-card rounded-xl p-3 sm:p-4 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs">Gastos</span>
          </div>
          <p className="text-base sm:text-lg font-semibold text-gasto">
            {formatearMonto(getTotalGastos())}
          </p>
        </div>
        
        <div className="bg-card rounded-xl p-3 sm:p-4 border border-border col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <span className="text-xs">Disponible</span>
          </div>
          <p className={`text-base sm:text-lg font-semibold ${disponible >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {formatearMonto(disponible)}
          </p>
        </div>
      </div>
      
      {/* Última distribución */}
      {ultimoHistorial && (
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Clock size={16} />
            <span className="text-sm">Última distribución</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{ultimoHistorial.distribucion_nombre}</span>
              <span className="text-sm text-muted-foreground">
                {formatearFecha(ultimoHistorial.fecha)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Total acumulado:</span>
              <span className="font-semibold text-ingreso">
                {formatearMonto(ultimoHistorial.dinero_disponible)}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Acceso rápido */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <h2 className="font-semibold mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/mis-distribuciones')}
            className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors text-left"
          >
            <span className="text-xl sm:text-2xl">📋</span>
            <div>
              <p className="font-medium text-sm">Mis Distribuciones</p>
              <p className="text-xs text-muted-foreground hidden sm:block">Gestionar plantillas</p>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/historial')}
            className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors text-left"
          >
            <span className="text-xl sm:text-2xl">📊</span>
            <div>
              <p className="font-medium text-sm">Ver Historial</p>
              <p className="text-xs text-muted-foreground hidden sm:block">Todas las transacciones</p>
            </div>
          </button>
        </div>
      </div>
      
      {/* Info */}
      <div className="bg-muted/50 rounded-xl p-4 border border-border">
        <p className="text-sm text-muted-foreground text-center">
          💡 Tip: Tus datos se guardan automáticamente en este dispositivo.
        </p>
      </div>
    </div>
  );
}
