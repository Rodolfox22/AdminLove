import { useNavigate } from 'react-router-dom';
import { useTransaccionStore, useDistribucionStore, useHistorialStore, useAuthStore } from '@/store';
import { formatearMonto, calcularDistribucion } from '@/utils/helpers';
import type { DistribucionDetalle } from '@/types';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  PieChart,
  CheckCircle2
} from 'lucide-react';

export default function ResultadosPage() {
  const navigate = useNavigate();
  const { usuario } = useAuthStore();
  const { getTotalIngresos, getTotalGastos, getDisponible, transacciones, limpiarTransacciones } = useTransaccionStore();
  const { getDistribucionActiva } = useDistribucionStore();
  const { agregarRegistro } = useHistorialStore();
  
  const disponible = getDisponible();
  const distribucion = getDistribucionActiva();
  const rubros = distribucion?.rubros || [];
  
  // Calcular distribución con rubro resto si aplica
  const rubrosConResto = [...rubros];
  const sumaPorcentajes = rubros.reduce((sum, r) => sum + r.porcentaje, 0);
  
  if (sumaPorcentajes < 100) {
    rubrosConResto.push({
      id: 'resto',
      distribucion_id: distribucion?.id || '',
      nombre: 'Resto',
      porcentaje: 100 - sumaPorcentajes,
      color: '#6B7280',
      es_resto: true,
      orden: rubros.length + 1
    });
  }
  
  const resultados = calcularDistribucion(disponible, rubrosConResto);
  
  const handleGuardar = () => {
    if (!distribucion) return;
    
    const detalle: DistribucionDetalle[] = resultados.map(({ rubro, monto }) => ({
      rubro_nombre: rubro.nombre,
      porcentaje: rubro.porcentaje,
      monto,
      color: rubro.color
    }));
    
    agregarRegistro({
      usuario_id: usuario?.id || '',
      distribucion_id: distribucion.id,
      distribucion_nombre: distribucion.nombre,
      fecha: new Date().toISOString(),
      total_ingresos: getTotalIngresos(),
      total_gastos: getTotalGastos(),
      dinero_disponible: disponible,
      distribucion_detalle: detalle
    });
    
    // Limpiar transacciones después de guardar
    // Nota: En una implementación real, esto dependería del flujo
  };
  
  const handleNuevaDistribucion = () => {
    navigate('/distribuir');
  };
  
  return (
    <div className="space-y-4 sm:space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => navigate('/distribuir')}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold">Resultados</h1>
      </div>
      
      {/* Disponible */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl p-4 sm:p-6 text-center">
        <p className="text-sm text-muted-foreground mb-1">Dinero Disponible</p>
        <p className="text-3xl sm:text-4xl font-bold text-primary">{formatearMonto(disponible)}</p>
      </div>
      
      {/* Distribución */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <PieChart size={20} />
          <span>Distribución</span>
        </div>
        
        {resultados.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No hay rubros configurados</p>
            <button
              onClick={() => navigate('/configuracion')}
              className="btn-primary mt-4"
            >
              Configurar Distribución
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {resultados.map(({ rubro, monto }) => (
              <div
                key={rubro.id}
                className="bg-card rounded-xl p-4 border-l-4 border border-border"
                style={{ borderLeftColor: rubro.color }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${rubro.color}20` }}
                    >
                      {rubro.icono ? (
                        <span>{getIconEmoji(rubro.icono)}</span>
                      ) : (
                        <span>📦</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{rubro.nombre}</p>
                      <p className="text-sm text-muted-foreground">{rubro.porcentaje}%</p>
                    </div>
                  </div>
                  <p className="text-xl font-bold" style={{ color: rubro.color }}>
                    {formatearMonto(monto)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Resumen */}
      <div className="bg-muted/50 rounded-xl p-3 sm:p-4 space-y-2">
        <h3 className="font-semibold text-sm sm:text-base">Resumen</h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Ingresos totales</p>
            <p className="font-medium text-ingreso">{formatearMonto(getTotalIngresos())}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Gastos totales</p>
            <p className="font-medium text-gasto">{formatearMonto(getTotalGastos())}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Transacciones</p>
            <p className="font-medium">{transacciones.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Rubros</p>
            <p className="font-medium">{resultados.length}</p>
          </div>
        </div>
      </div>
      
      {/* Acciones */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleNuevaDistribucion}
          className="btn-secondary py-2 sm:py-3 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Nueva</span>
        </button>
        
        <button
          onClick={handleGuardar}
          className="btn-primary py-2 sm:py-3 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Save className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Guardar</span>
        </button>
      </div>
      
      {/* Éxito */}
      {false && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-success/10 text-success">
          <CheckCircle2 size={20} />
          <span>Distribución guardada exitosamente</span>
        </div>
      )}
    </div>
  );
}

function getIconEmoji(icono: string): string {
  const iconos: Record<string, string> = {
    church: '🏛️',
    heart: '💖',
    utensils: '🍴',
    car: '🚗',
    zap: '⚡',
    home: '🏠',
    briefcase: '💼',
    wallet: '👛',
    'piggy-bank': '🐷',
    gift: '🎁',
    star: '⭐',
    smile: '😊'
  };
  
  return iconos[icono] || '📦';
}
