import { useState } from 'react';
import { useHistorialStore } from '@/store';
import { formatearMonto, formatearFecha } from '@/utils/helpers';
import { History, Calendar, Filter, Download, ChevronRight } from 'lucide-react';
import type { HistorialRegistro } from '@/types';

export default function HistorialPage() {
  const { historial } = useHistorialStore();
  const [filtroMes, setFiltroMes] = useState<string>('all');
  const [registroSeleccionado, setRegistroSeleccionado] = useState<HistorialRegistro | null>(null);
  
  // Filtrar por mes
  const historialFiltrado = historial.filter((registro) => {
    if (filtroMes === 'all') return true;
    
    const fecha = new Date(registro.fecha);
    const ahora = new Date();
    
    switch (filtroMes) {
      case '7d':
        return fecha >= new Date(ahora.setDate(ahora.getDate() - 7));
      case '30d':
        return fecha >= new Date(ahora.setDate(ahora.getDate() - 30));
      case '90d':
        return fecha >= new Date(ahora.setDate(ahora.getDate() - 90));
      case '1y':
        return fecha >= new Date(ahora.setFullYear(ahora.getFullYear() - 1));
      default:
        return true;
    }
  });
  
  // Calcular totales del período
  const totalIngresos = historialFiltrado.reduce((sum, r) => sum + r.total_ingresos, 0);
  const totalGastos = historialFiltrado.reduce((sum, r) => sum + r.total_gastos, 0);
  const totalDisponible = historialFiltrado.reduce((sum, r) => sum + r.dinero_disponible, 0);
  
  return (
    <div className="space-y-4 sm:space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <History className="w-5 h-5 sm:w-6 sm:h-6" />
          Historial
        </h1>
        <button className="btn-secondary px-3 py-1.5 text-sm flex items-center gap-1">
          <Download className="w-4 h-4" />
          <span>Exportar</span>
        </button>
      </div>
      
      {/* Filtros */}
      <div className="bg-card rounded-xl p-3 sm:p-4 border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4" />
          <span className="font-medium text-sm sm:text-base">Filtros</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { valor: '7d', etiqueta: '7 días' },
            { valor: '30d', etiqueta: '30 días' },
            { valor: '90d', etiqueta: '90 días' },
            { valor: '1y', etiqueta: '1 año' },
            { valor: 'all', etiqueta: 'Todo' }
          ].map((opcion) => (
            <button
              key={opcion.valor}
              onClick={() => setFiltroMes(opcion.valor)}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                filtroMes === opcion.valor
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-accent'
              }`}
            >
              {opcion.etiqueta}
            </button>
          ))}
        </div>
      </div>
      
      {/* Resumen del período */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-card rounded-xl p-3 sm:p-4 border border-border">
          <p className="text-xs text-muted-foreground">Ingresos</p>
          <p className="text-base sm:text-lg font-semibold text-ingreso">{formatearMonto(totalIngresos)}</p>
        </div>
        <div className="bg-card rounded-xl p-3 sm:p-4 border border-border">
          <p className="text-xs text-muted-foreground">Gastos</p>
          <p className="text-base sm:text-lg font-semibold text-gasto">{formatearMonto(totalGastos)}</p>
        </div>
        <div className="bg-card rounded-xl p-3 sm:p-4 border border-border col-span-2 sm:col-span-1">
          <p className="text-xs text-muted-foreground">Disponible</p>
          <p className={`text-base sm:text-lg font-semibold ${totalDisponible >= 0 ? 'text-primary' : 'text-destructive'}`}>
            {formatearMonto(totalDisponible)}
          </p>
        </div>
      </div>
      
      {/* Lista de historial */}
      <div className="space-y-3">
        {historialFiltrado.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p>No hay registros en el historial</p>
            <p className="text-sm">Guarda tus distribuciones para verlas aquí</p>
          </div>
        ) : (
          historialFiltrado.map((registro) => (
            <button
              key={registro.id}
              onClick={() => setRegistroSeleccionado(registro)}
              className="w-full bg-card rounded-xl p-4 border border-border text-left hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{registro.distribucion_nombre}</span>
                <span className="text-sm text-muted-foreground">
                  {formatearFecha(registro.fecha)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-sm">
                  <span className="text-muted-foreground">
                    {registro.total_ingresos > 0 ? `+${formatearMonto(registro.total_ingresos)}` : ''}
                  </span>
                  <span className="text-muted-foreground">
                    {registro.total_gastos > 0 ? `-${formatearMonto(registro.total_gastos)}` : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${registro.dinero_disponible >= 0 ? 'text-primary' : 'text-destructive'}`}>
                    {formatearMonto(registro.dinero_disponible)}
                  </span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              </div>
            </button>
          ))
        )}
      </div>
      
      {/* Modal de detalle */}
      {registroSeleccionado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setRegistroSeleccionado(null)}>
          <div className="bg-card rounded-xl p-4 sm:p-6 max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold">Detalle</h2>
              <button
                onClick={() => setRegistroSeleccionado(null)}
                className="p-2 rounded-lg hover:bg-accent"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="pb-3 sm:pb-4 border-b border-border">
                <p className="text-sm text-muted-foreground">Distribución</p>
                <p className="font-medium">{registroSeleccionado.distribucion_nombre}</p>
                <p className="text-sm text-muted-foreground">{formatearFecha(registroSeleccionado.fecha, 'larga')}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pb-3 sm:pb-4 border-b border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Ingresos</p>
                  <p className="font-semibold text-ingreso">{formatearMonto(registroSeleccionado.total_ingresos)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gastos</p>
                  <p className="font-semibold text-gasto">{formatearMonto(registroSeleccionado.total_gastos)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Disponible</p>
                  <p className="font-semibold">{formatearMonto(registroSeleccionado.dinero_disponible)}</p>
                </div>
              </div>
              
              <div>
                <p className="font-medium mb-3">Distribución</p>
                <div className="space-y-2">
                  {registroSeleccionado.distribucion_detalle.map((detalle, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: detalle.color }}
                        />
                        <span>{detalle.rubro_nombre}</span>
                        <span className="text-sm text-muted-foreground">({detalle.porcentaje}%)</span>
                      </div>
                      <span className="font-semibold">{formatearMonto(detalle.monto)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
