// Tipos base para la aplicación AdminLove

// Usuario
export interface Usuario {
  id: string;
  nombre: string;
  email?: string;
  modo: 'local' | 'supabase';
  created_at: string;
  updated_at: string;
}

// Distribución
export interface Distribucion {
  id: string;
  usuario_id: string;
  nombre: string;
  es_activa: boolean;
  rubros: Rubro[];
  created_at: string;
  updated_at: string;
}

export interface Rubro {
  id: string;
  distribucion_id: string;
  nombre: string;
  porcentaje: number;
  icono?: string;
  color: string;
  es_resto: boolean;
  orden: number;
}

// Transacciones
export interface Transaccion {
  id: string;
  distribucion_id?: string;
  tipo: 'ingreso' | 'gasto';
  monto: number;
  descripcion: string;
  fecha: string;
  created_at: string;
}

// Historial
export interface HistorialRegistro {
  id: string;
  usuario_id: string;
  distribucion_id?: string;
  distribucion_nombre: string;
  fecha: string;
  total_ingresos: number;
  total_gastos: number;
  dinero_disponible: number;
  distribucion_detalle: DistribucionDetalle[];
  created_at: string;
}

export interface DistribucionDetalle {
  rubro_nombre: string;
  porcentaje: number;
  monto: number;
  icono?: string;
  color: string;
}

// Configuración
export interface Configuracion {
  tema: 'claro' | 'oscuro' | 'sistema';
  moneda: string;
  notificaciones: boolean;
}

// Auth
export interface AuthState {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Formularios
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface TransaccionForm {
  tipo: 'ingreso' | 'gasto';
  monto: string;
  descripcion: string;
}

export interface RubroForm {
  nombre: string;
  porcentaje: string;
  icono?: string;
  color: string;
}

export interface DistribucionForm {
  nombre: string;
}

// Filtros
export interface FiltrosHistorial {
  distribucion_id?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  monto_min?: number;
  monto_max?: number;
}

// Export/Import
export interface ExportData {
  version: string;
  exportDate: string;
  userData: {
    userName: string;
  };
  distribucion: {
    nombre: string;
    rubros: RubroExport[];
  };
  configuracion: {
    modoOscuro: boolean;
    moneda: string;
  };
}

export interface RubroExport {
  nombre: string;
  porcentaje: number;
  icono?: string;
  color: string;
  orden: number;
}
