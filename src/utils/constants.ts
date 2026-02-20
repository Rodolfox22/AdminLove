// Constantes de la aplicación

export const APP_NAME = 'AdminLove';
export const APP_VERSION = '1.0.0';

export const STORAGE_KEYS = {
  USER: 'adminlove_user',
  DISTRIBUCIONES: 'adminlove_distribuciones',
  HISTORIAL: 'adminlove_historial',
  TRANSACCIONES: 'adminlove_transacciones',
  CONFIG: 'adminlove_config',
  OFFLINE_QUEUE: 'adminlove_offline_queue'
} as const;

export const RUBROS_POR_DEFECTO = [
  { nombre: 'Diezmo', porcentaje: 10, color: '#3B82F6', icono: 'church' },
  { nombre: 'Ofrenda', porcentaje: 10, color: '#EC4899', icono: 'heart' },
  { nombre: 'Comida', porcentaje: 20, color: '#10B981', icono: 'utensils' },
  { nombre: 'Transporte', porcentaje: 10, color: '#F59E0B', icono: 'car' },
  { nombre: 'Servicios', porcentaje: 10, color: '#8B5CF6', icono: 'zap' }
] as const;

export const COLORES_DISPONIBLES = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
  '#6366F1', // indigo
  '#14B8A6', // teal
  '#A855F7'  // violet
] as const;

export const ICONOS_DISPONIBLES = [
  'church',
  'heart',
  'utensils',
  'car',
  'zap',
  'home',
  'briefcase',
  'wallet',
  'piggy-bank',
  'gift',
  'star',
  'smile'
] as const;

// Mapeo de iconos a emoji para compatibilidad
export const ICONOS_EMOJI: Record<string, string> = {
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

export const MONEDAS = [
  { codigo: 'ARS', simbolo: '$', nombre: 'Peso Argentino' },
  { codigo: 'USD', simbolo: 'US$', nombre: 'Dólar Estadounidense' },
  { codigo: 'EUR', simbolo: '€', nombre: 'Euro' },
  { codigo: 'CLP', simbolo: '$', nombre: 'Peso Chileno' },
  { codigo: 'MXN', simbolo: '$', nombre: 'Peso Mexicano' },
  { codigo: 'COP', simbolo: '$', nombre: 'Peso Colombiano' }
] as const;

export const FILTROS_FECHA = [
  { valor: '7d', etiqueta: 'Últimos 7 días' },
  { valor: '30d', etiqueta: 'Últimos 30 días' },
  { valor: '90d', etiqueta: 'Últimos 90 días' },
  { valor: '1y', etiqueta: 'Último año' },
  { valor: 'all', etiqueta: 'Todo' }
] as const;
