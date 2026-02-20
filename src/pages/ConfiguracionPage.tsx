import { useState, useRef, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDistribucionStore } from '@/store';
import { COLORES_DISPONIBLES, RUBROS_POR_DEFECTO, ICONOS_DISPONIBLES, ICONOS_EMOJI } from '@/utils/constants';
import { generarId } from '@/utils/helpers';
import type { Rubro } from '@/types';
import { 
  Plus, 
  Trash2, 
  Save, 
  Settings,
  Palette,
  Download,
  Upload,
  ChevronUp,
  ChevronDown,
  Palette as ColorIcon
} from 'lucide-react';

// Componente selector de color colapsable
function ColorSelector({ color, onChange }: { color: string; onChange: (color: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 ring-2 ring-offset-2 ring-primary/50"
        style={{ backgroundColor: color }}
        title="Cambiar color"
      >
        <Palette className="w-4 h-4 text-white drop-shadow-md" />
      </button>
      
      {isOpen && (
        <div className="absolute z-20 left-0 top-10 bg-card border border-border rounded-lg shadow-lg p-2 grid grid-cols-4 gap-1 w-36">
          {COLORES_DISPONIBLES.map((c) => (
            <button
              key={c}
              onClick={() => {
                onChange(c);
                setIsOpen(false);
              }}
              className={`w-7 h-7 rounded-full transition-transform ${
                color === c ? 'scale-110 ring-2 ring-primary' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Componente selector de icono
function IconSelector({ icono, onChange }: { icono: string | undefined; onChange: (icono: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentIcon = icono || 'star';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted hover:bg-accent transition-colors text-lg"
        title="Cambiar icono"
      >
        {ICONOS_EMOJI[currentIcon] || '📦'}
      </button>
      
      {isOpen && (
        <div className="absolute z-20 left-0 top-10 bg-card border border-border rounded-lg shadow-lg p-2 grid grid-cols-4 gap-1 w-36">
          {ICONOS_DISPONIBLES.map((icon) => (
            <button
              key={icon}
              onClick={() => {
                onChange(icon);
                setIsOpen(false);
              }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-transform ${
                currentIcon === icon ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-accent hover:scale-105'
              }`}
              title={icon}
            >
              {ICONOS_EMOJI[icon]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ConfiguracionPage() {
  const navigate = useNavigate();
  const { distribucionActivaId, getDistribucionActiva, actualizarDistribucion } = useDistribucionStore();
  
  // Contexto para pasar funciones al Navbar
  const { setSaveAction, setNewAction } = useOutletContext<{
    setSaveAction?: (action: () => void) => void;
    setNewAction?: (action: () => void) => void;
  }>();
  
  const distribucion = getDistribucionActiva();
  const rubros = distribucion?.rubros || [];
  
  const [nombre, setNombre] = useState(distribucion?.nombre || '');
  const [rubrosEditados, setRubrosEditados] = useState<Rubro[]>(rubros);
  const [isSaving, setIsSaving] = useState(false);
  
  const sumaPorcentajes = rubrosEditados
    .filter(r => !r.es_resto)
    .reduce((sum, r) => sum + r.porcentaje, 0);
  
  const restoPorcentaje = Math.max(0, 100 - sumaPorcentajes);
  
  const handleAgregarRubro = () => {
    const nuevo: Rubro = {
      id: generarId(),
      distribucion_id: distribucion?.id || '',
      nombre: 'Nuevo Rubro',
      porcentaje: 0,
      color: COLORES_DISPONIBLES[rubrosEditados.length % COLORES_DISPONIBLES.length],
      es_resto: false,
      orden: rubrosEditados.length + 1
    };
    
    setRubrosEditados([...rubrosEditados, nuevo]);
  };
  
  const handleEliminarRubro = (id: string) => {
    setRubrosEditados(rubrosEditados.filter(r => r.id !== id));
  };
  
  const handleActualizarRubro = (id: string, datos: Partial<Rubro>) => {
    setRubrosEditados(rubrosEditados.map(r => 
      r.id === id ? { ...r, ...datos } : r
    ));
  };
  
  const handleMoverRubro = (index: number, direccion: 'arriba' | 'abajo') => {
    const nuevosRubros = [...rubrosEditados];
    const nuevoIndex = direccion === 'arriba' ? index - 1 : index + 1;
    
    if (nuevoIndex < 0 || nuevoIndex >= nuevosRubros.length) return;
    
    [nuevosRubros[index], nuevosRubros[nuevoIndex]] = [nuevosRubros[nuevoIndex], nuevosRubros[index]];
    
    nuevosRubros.forEach((r, i) => {
      r.orden = i + 1;
    });
    
    setRubrosEditados(nuevosRubros);
  };
  
  // Función para seleccionar el texto de un input al hacer clic
  const handleSelectText = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };
  
  const handleGuardar = () => {
    if (!distribucion) {
      // Crear nueva distribución
      const nueva = useDistribucionStore.getState().agregarDistribucion(nombre || 'Nueva Distribución');
      actualizarDistribucion(nueva.id, {
        nombre: nombre || 'Nueva Distribución',
        rubros: rubrosEditados
      });
      useDistribucionStore.getState().activarDistribucion(nueva.id);
    } else {
      actualizarDistribucion(distribucion.id, {
        nombre,
        rubros: rubrosEditados
      });
    }
    
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };
  
  // Registrar las funciones de guardado y nuevo en el contexto del outlet
  useEffect(() => {
    if (setSaveAction) {
      setSaveAction(handleGuardar);
    }
    if (setNewAction) {
      setNewAction(handleAgregarRubro);
    }
    
    return () => {
      if (setSaveAction) setSaveAction(() => {});
      if (setNewAction) setNewAction(() => {});
    };
  }, [setSaveAction, setNewAction, handleGuardar, handleAgregarRubro]);
  
  return (
    <div className="space-y-4 sm:space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">Configuración</h1>
        <button
          onClick={handleGuardar}
          disabled={isSaving || sumaPorcentajes > 100}
          className="btn-primary px-3 sm:px-4 py-2 flex items-center gap-2 text-sm sm:text-base disabled:opacity-50"
        >
          <Save className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
        </button>
      </div>
      
      {/* Nombre de distribución */}
      <div className="bg-card rounded-xl p-4 border border-border space-y-3">
        <label className="block font-medium">Nombre de la Distribución</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Sueldo Fijo"
          className="input-field"
        />
      </div>
      
      {/* Rubros */}
      <div className="bg-card rounded-xl p-3 sm:p-4 border border-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="font-semibold flex items-center gap-2 text-sm sm:text-base">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            Rubros
          </h2>
          <button
            onClick={handleAgregarRubro}
            className="btn-secondary px-3 py-1.5 text-sm flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>Agregar</span>
          </button>
        </div>
        
        {/* Lista de rubros */}
        <div className="space-y-3">
          {rubrosEditados.map((rubro, index) => (
            <div
              key={rubro.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border border-border bg-muted/30"
            >
              {/* Controles de orden */}
              <div className="flex flex-row sm:flex-col gap-1">
                <button
                  onClick={() => handleMoverRubro(index, 'arriba')}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-accent disabled:opacity-30"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleMoverRubro(index, 'abajo')}
                  disabled={index === rubrosEditados.length - 1}
                  className="p-1 rounded hover:bg-accent disabled:opacity-30"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              
              {/* Color e Icono, Nombre, Porcentaje y Eliminar - todos en la misma línea */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {/* Color e Icono */}
                <div className="flex items-center gap-1">
                  <ColorSelector
                    color={rubro.color}
                    onChange={(color) => handleActualizarRubro(rubro.id, { color })}
                  />
                  <IconSelector
                    icono={rubro.icono}
                    onChange={(icono) => handleActualizarRubro(rubro.id, { icono })}
                  />
                </div>
                
                {/* Nombre */}
                <input
                  type="text"
                  value={rubro.nombre}
                  onChange={(e) => handleActualizarRubro(rubro.id, { nombre: e.target.value })}
                  onClick={handleSelectText}
                  className="flex-1 bg-transparent font-medium focus:outline-none text-sm min-w-0"
                  placeholder="Nombre"
                />
                
                {/* Porcentaje */}
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={rubro.porcentaje}
                    onChange={(e) => handleActualizarRubro(rubro.id, { porcentaje: parseInt(e.target.value) || 0 })}
                    onClick={handleSelectText}
                    className="w-12 sm:w-16 text-center bg-transparent font-medium focus:outline-none border-b border-border text-sm"
                    min="0"
                    max="100"
                  />
                  <span className="text-muted-foreground text-sm">%</span>
                </div>
                
                {/* Eliminar */}
                <button
                  onClick={() => handleEliminarRubro(rubro.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Resumen */}
        <div className="pt-4 border-t border-border space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total asignado:</span>
            <span className={sumaPorcentajes > 100 ? 'text-destructive font-bold' : sumaPorcentajes === 100 ? 'text-success font-bold' : ''}>
              {sumaPorcentajes}%
            </span>
          </div>
          {sumaPorcentajes < 100 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Resto automático:</span>
              <span className="font-medium text-primary">{restoPorcentaje}%</span>
            </div>
          )}
          {sumaPorcentajes > 100 && (
            <p className="text-sm text-destructive">
              ⚠️ La suma no puede exceder 100%
            </p>
          )}
        </div>
      </div>
      
      {/* Acciones adicionales */}
      <div className="grid grid-cols-2 gap-3">
        <button className="btn-secondary py-2 sm:py-3 flex items-center justify-center gap-2 text-sm">
          <Download className="w-4 h-4" />
          <span>Exportar</span>
        </button>
        <button className="btn-secondary py-2 sm:py-3 flex items-center justify-center gap-2 text-sm">
          <Upload className="w-4 h-4" />
          <span>Importar</span>
        </button>
      </div>
    </div>
  );
}
