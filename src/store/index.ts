import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Usuario, Distribucion, Transaccion, HistorialRegistro, Configuracion } from '@/types';
import { generarId } from '@/utils/helpers';

// Tipos de estado
interface AuthState {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  setUsuario: (usuario: Usuario | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

interface DistribucionState {
  distribuciones: Distribucion[];
  distribucionActivaId: string | null;
  
  // Acciones
  setDistribuciones: (distribuciones: Distribucion[]) => void;
  agregarDistribucion: (nombre: string) => Distribucion;
  actualizarDistribucion: (id: string, datos: Partial<Distribucion>) => void;
  eliminarDistribucion: (id: string) => void;
  activarDistribucion: (id: string) => void;
  duplicarDistribucion: (id: string) => void;
  getDistribucionActiva: () => Distribucion | null;
}

interface TransaccionState {
  transacciones: Transaccion[];
  
  // Acciones
  setTransacciones: (transacciones: Transaccion[]) => void;
  agregarTransaccion: (transaccion: Omit<Transaccion, 'id' | 'created_at'>) => Transaccion;
  actualizarTransaccion: (id: string, datos: Partial<Transaccion>) => void;
  eliminarTransaccion: (id: string) => void;
  limpiarTransacciones: () => void;
  getTotalIngresos: () => number;
  getTotalGastos: () => number;
  getDisponible: () => number;
}

interface HistorialState {
  historial: HistorialRegistro[];
  
  // Acciones
  setHistorial: (historial: HistorialRegistro[]) => void;
  agregarRegistro: (registro: Omit<HistorialRegistro, 'id' | 'created_at'>) => HistorialRegistro;
  eliminarRegistro: (id: string) => void;
  getHistorialPorDistribucion: (distribucionId: string) => HistorialRegistro[];
  getHistorialPorFecha: (fechaInicio: string, fechaFin: string) => HistorialRegistro[];
}

interface ConfiguracionState {
  configuracion: Configuracion;
  
  // Acciones
  setConfiguracion: (config: Partial<Configuracion>) => void;
  toggleTema: () => void;
}

// Stores

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      setUsuario: (usuario) => set({ 
        usuario, 
        isAuthenticated: !! usuario 
      }),
      logout: () => set({ 
        usuario: null, 
        isAuthenticated: false 
      }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

// Distribucion Store
export const useDistribucionStore = create<DistribucionState>()(
  persist(
    (set, get) => ({
      distribuciones: [],
      distribucionActivaId: null,
      
      setDistribuciones: (distribuciones) => set({ distribuciones }),
      
      agregarDistribucion: (nombre) => {
        const nueva: Distribucion = {
          id: generarId(),
          usuario_id: '',
          nombre,
          es_activa: false,
          rubros: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        set((state) => ({
          distribuciones: [...state.distribuciones, nueva]
        }));
        
        return nueva;
      },
      
      actualizarDistribucion: (id, datos) => {
        set((state) => ({
          distribuciones: state.distribuciones.map((d) =>
            d.id === id ? { ...d, ...datos, updated_at: new Date().toISOString() } : d
          )
        }));
      },
      
      eliminarDistribucion: (id) => {
        set((state) => ({
          distribuciones: state.distribuciones.filter((d) => d.id !== id),
          distribucionActivaId: state.distribucionActivaId === id ? null : state.distribucionActivaId
        }));
      },
      
      activarDistribucion: (id) => {
        set((state) => ({
          distribuciones: state.distribuciones.map((d) => ({
            ...d,
            es_activa: d.id === id
          })),
          distribucionActivaId: id
        }));
      },
      
      duplicarDistribucion: (id) => {
        const original = get().distribuciones.find((d) => d.id === id);
        if (!original) return;
        
        const copia: Distribucion = {
          ...original,
          id: generarId(),
          nombre: `${original.nombre} (Copia)`,
          es_activa: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        set((state) => ({
          distribuciones: [...state.distribuciones, copia]
        }));
      },
      
      getDistribucionActiva: () => {
        const { distribuciones, distribucionActivaId } = get();
        if (distribucionActivaId) {
          return distribuciones.find((d) => d.id === distribucionActivaId) || null;
        }
        return distribuciones.find((d) => d.es_activa) || null;
      }
    }),
    {
      name: 'distribucion-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

// Transaccion Store
export const useTransaccionStore = create<TransaccionState>()(
  persist(
    (set, get) => ({
      transacciones: [],
      
      setTransacciones: (transacciones) => set({ transacciones }),
      
      agregarTransaccion: (data) => {
        const nueva: Transaccion = {
          ...data,
          id: generarId(),
          created_at: new Date().toISOString()
        };
        
        set((state) => ({
          transacciones: [...state.transacciones, nueva]
        }));
        
        return nueva;
      },
      
      actualizarTransaccion: (id, datos) => {
        set((state) => ({
          transacciones: state.transacciones.map((t) =>
            t.id === id ? { ...t, ...datos } : t
          )
        }));
      },
      
      eliminarTransaccion: (id) => {
        set((state) => ({
          transacciones: state.transacciones.filter((t) => t.id !== id)
        }));
      },
      
      limpiarTransacciones: () => set({ transacciones: [] }),
      
      getTotalIngresos: () => {
        return get().transacciones
          .filter((t) => t.tipo === 'ingreso')
          .reduce((sum, t) => sum + t.monto, 0);
      },
      
      getTotalGastos: () => {
        return get().transacciones
          .filter((t) => t.tipo === 'gasto')
          .reduce((sum, t) => sum + t.monto, 0);
      },
      
      getDisponible: () => {
        return get().getTotalIngresos() - get().getTotalGastos();
      }
    }),
    {
      name: 'transaccion-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

// Historial Store
export const useHistorialStore = create<HistorialState>()(
  persist(
    (set, get) => ({
      historial: [],
      
      setHistorial: (historial) => set({ historial }),
      
      agregarRegistro: (data) => {
        const registro: HistorialRegistro = {
          ...data,
          id: generarId(),
          created_at: new Date().toISOString()
        };
        
        set((state) => ({
          historial: [registro, ...state.historial]
        }));
        
        return registro;
      },
      
      eliminarRegistro: (id) => {
        set((state) => ({
          historial: state.historial.filter((h) => h.id !== id)
        }));
      },
      
      getHistorialPorDistribucion: (distribucionId) => {
        return get().historial.filter((h) => h.distribucion_id === distribucionId);
      },
      
      getHistorialPorFecha: (fechaInicio, fechaFin) => {
        return get().historial.filter((h) => h.fecha >= fechaInicio && h.fecha <= fechaFin);
      }
    }),
    {
      name: 'historial-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

// Configuracion Store
export const useConfiguracionStore = create<ConfiguracionState>()(
  persist(
    (set, get) => ({
      configuracion: {
        tema: 'sistema',
        moneda: 'ARS',
        notificaciones: true
      },
      
      setConfiguracion: (config) => {
        set((state) => ({
          configuracion: { ...state.configuracion, ...config }
        }));
      },
      
      toggleTema: () => {
        const { tema } = get().configuracion;
        const nuevosTemas: Record<string, Configuracion['tema']> = {
          claro: 'oscuro',
          oscuro: 'sistema',
          sistema: 'claro'
        };
        
        set((state) => ({
          configuracion: {
            ...state.configuracion,
            tema: nuevosTemas[tema]
          }
        }));
      }
    }),
    {
      name: 'config-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
