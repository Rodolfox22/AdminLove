import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { MONEDAS } from './constants';
import type { Rubro, Transaccion, HistorialRegistro, Distribucion } from '@/types';

// Utility para combinar clases
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatear moneda
export function formatearMonto(monto: number, moneda: string = 'ARS'): string {
  const config = MONEDAS.find(m => m.codigo === moneda) || MONEDAS[0];
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(monto);
}

// Formatear porcentaje
export function formatearPorcentaje(porcentaje: number): string {
  return `${porcentaje}%`;
}

// Formatear fecha
export function formatearFecha(fecha: string | Date, formato: 'corta' | 'larga' | 'relativa' = 'corta'): string {
  const fechaDate = typeof fecha === 'string' ? parseISO(fecha) : fecha;
  
  switch (formato) {
    case 'larga':
      return format(fechaDate, "d 'de' MMMM 'de' yyyy", { locale: es });
    case 'relativa':
      return formatDistanceToNow(fechaDate, { addSuffix: true, locale: es });
    default:
      return format(fechaDate, 'dd/MM/yyyy', { locale: es });
  }
}

// Generar ID único
export function generarId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Calcular distribución
export function calcularDistribucion(
  disponible: number,
  rubros: Rubro[]
): { rubro: Rubro; monto: number }[] {
  const resultado: { rubro: Rubro; monto: number }[] = [];
  let restoCalculado = 100;

  // Calcular resto disponible
  const rubrosNormales = rubros.filter(r => !r.es_resto);
  restoCalculado -= rubrosNormales.reduce((sum, r) => sum + r.porcentaje, 0);

  for (const rubro of rubros) {
    if (rubro.es_resto) {
      resultado.push({
        rubro,
        monto: (restoCalculado / 100) * disponible
      });
    } else {
      resultado.push({
        rubro,
        monto: (rubro.porcentaje / 100) * disponible
      });
    }
  }

  return resultado;
}

// Calcular totales de transacciones
export function calcularTotales(transacciones: Transaccion[]): {
  totalIngresos: number;
  totalGastos: number;
  disponible: number;
} {
  const totalIngresos = transacciones
    .filter(t => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + t.monto, 0);
  
  const totalGastos = transacciones
    .filter(t => t.tipo === 'gasto')
    .reduce((sum, t) => sum + t.monto, 0);

  return {
    totalIngresos,
    totalGastos,
    disponible: totalIngresos - totalGastos
  };
}

// Validar suma de porcentajes
export function validarPorcentajes(rubros: Rubro[]): {
  valido: boolean;
  suma: number;
  error?: string;
} {
  const rubrosNormales = rubros.filter(r => !r.es_resto);
  const suma = rubrosNormales.reduce((sum, r) => sum + r.porcentaje, 0);
  
  if (suma > 100) {
    return {
      valido: false,
      suma,
      error: `La suma de porcentajes no puede exceder 100% (actual: ${suma}%)`
    };
  }
  
  return { valido: true, suma };
}

// Obtener color de borde según el color del rubro
export function getColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    '#3B82F6': 'border-blue-500 bg-blue-50',
    '#10B981': 'border-green-500 bg-green-50',
    '#F59E0B': 'border-amber-500 bg-amber-50',
    '#EF4444': 'border-red-500 bg-red-50',
    '#8B5CF6': 'border-purple-500 bg-purple-50',
    '#EC4899': 'border-pink-500 bg-pink-50',
    '#06B6D4': 'border-cyan-500 bg-cyan-50',
    '#84CC16': 'border-lime-500 bg-lime-50',
    '#F97316': 'border-orange-500 bg-orange-50',
    '#6366F1': 'border-indigo-500 bg-indigo-50',
    '#14B8A6': 'border-teal-500 bg-teal-50',
    '#A855F7': 'border-violet-500 bg-violet-50'
  };
  
  return colorMap[color] || 'border-gray-500 bg-gray-50';
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Deep clone
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Capitalizar primera letra
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Truncar texto
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

// Formatear número grande
export function formatearNumeroGrande(numero: number): string {
  if (numero >= 1000000) {
    return `${(numero / 1000000).toFixed(1)}M`;
  }
  if (numero >= 1000) {
    return `${(numero / 1000).toFixed(1)}K`;
  }
  return numero.toString();
}
