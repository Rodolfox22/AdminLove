import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDistribucionStore } from '@/store';
import { RUBROS_POR_DEFECTO } from '@/utils/constants';
import { generarId } from '@/utils/helpers';
import type { Rubro } from '@/types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Check,
  ChevronRight,
  Settings
} from 'lucide-react';

export default function MisDistribucionesPage() {
  const navigate = useNavigate();
  const { distribuciones, agregarDistribucion, actualizarDistribucion, eliminarDistribucion, duplicarDistribucion, activarDistribucion } = useDistribucionStore();
  
  const [showDeleted, setShowDeleted] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  
  const handleCrearDistribucion = () => {
    if (!nuevoNombre.trim()) return;
    
    const nueva = agregarDistribucion(nuevoNombre);
    
    // Agregar rubros por defecto
    const rubrosDefault: Rubro[] = RUBROS_POR_DEFECTO.map((r, index) => ({
      id: generarId(),
      distribucion_id: nueva.id,
      nombre: r.nombre,
      porcentaje: r.porcentaje,
      color: r.color,
      icono: r.icono,
      es_resto: false,
      orden: index + 1
    }));
    
    actualizarDistribucion(nueva.id, { rubros: rubrosDefault });
    setShowCreateModal(false);
    setNuevoNombre('');
    navigate('/configuracion');
  };
  
  const handleActivar = (id: string) => {
    activarDistribucion(id);
  };
  
  const handleDuplicar = (id: string) => {
    duplicarDistribucion(id);
  };
  
  const handleEliminar = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta distribución?')) {
      eliminarDistribucion(id);
    }
  };
  
  return (
    <div className="space-y-4 sm:space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">Mis Distribuciones</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary px-3 sm:px-4 py-2 flex items-center gap-2 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Nueva</span>
        </button>
      </div>
      
      {/* Toggle mostrar eliminados */}
      <button
        onClick={() => setShowDeleted(!showDeleted)}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {showDeleted ? '👁️ Ocultar eliminadas' : '🗑️ Ver eliminadas'}
      </button>
      
      {/* Lista de distribuciones */}
      <div className="space-y-3">
        {distribuciones.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Settings size={48} className="mx-auto mb-4 opacity-50" />
            <p>No tienes distribuciones aún</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary mt-4"
            >
              Crear tu primera distribución
            </button>
          </div>
        ) : (
          distribuciones.map((distribucion) => (
            <div
              key={distribucion.id}
              className={`bg-card rounded-xl p-3 sm:p-4 border border-border ${
                distribucion.es_activa ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {distribucion.es_activa ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    ) : (
                      <span className="text-sm sm:text-base">📋</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">{distribucion.nombre}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {distribucion.rubros.length} rubros
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate(`/configuracion?id=${distribucion.id}`)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <Edit size={18} />
                </button>
              </div>
              
              {/* Preview de rubros */}
              <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                {distribucion.rubros.slice(0, 5).map((rubro) => (
                  <div
                    key={rubro.id}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-xs whitespace-nowrap"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: rubro.color }}
                    />
                    <span>{rubro.porcentaje}%</span>
                  </div>
                ))}
                {distribucion.rubros.length > 5 && (
                  <span className="text-xs text-muted-foreground">
                    +{distribucion.rubros.length - 5} más
                  </span>
                )}
              </div>
              
              {/* Acciones */}
              <div className="flex flex-wrap gap-2">
                {!distribucion.es_activa && (
                  <button
                    onClick={() => handleActivar(distribucion.id)}
                    className="flex-1 sm:flex-none btn-primary py-2 px-3 text-xs sm:text-sm flex items-center justify-center gap-1"
                  >
                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Activar</span>
                  </button>
                )}
                
                <button
                  onClick={() => handleDuplicar(distribucion.id)}
                  className="btn-secondary py-2 px-2 sm:px-3 text-xs sm:text-sm flex items-center gap-1"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Duplicar</span>
                </button>
                
                <button
                  onClick={() => handleEliminar(distribucion.id)}
                  className="btn-secondary py-2 px-2 sm:px-3 text-xs sm:text-sm text-destructive hover:bg-destructive/10 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Modal crear distribución */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-card rounded-xl p-4 sm:p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg sm:text-xl font-bold mb-4">Nueva Distribución</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  placeholder="Ej: Sueldo Fijo"
                  className="input-field"
                  autoFocus
                />
              </div>
              
              <p className="text-sm text-muted-foreground">
                Se creará con rubros predefinidos que podrás personalizar.
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-secondary py-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCrearDistribucion}
                  disabled={!nuevoNombre.trim()}
                  className="flex-1 btn-primary py-2 disabled:opacity-50"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
