import { createClient } from '@supabase/supabase-js';
import { STORAGE_KEYS } from '@/utils/constants';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Database types for TypeScript
export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string;
          nombre: string;
          email: string | null;
          modo: 'local' | 'supabase';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['usuarios']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['usuarios']['Insert']>;
      };
      distribuciones: {
        Row: {
          id: string;
          usuario_id: string;
          nombre: string;
          es_activa: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['distribuciones']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['distribuciones']['Insert']>;
      };
      rubros: {
        Row: {
          id: string;
          distribucion_id: string;
          nombre: string;
          porcentaje: number;
          icono: string | null;
          color: string;
          es_resto: boolean;
          orden: number;
        };
        Insert: Omit<Database['public']['Tables']['rubros']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['rubros']['Insert']>;
      };
      historial_distribuciones: {
        Row: {
          id: string;
          usuario_id: string;
          distribucion_id: string | null;
          distribucion_nombre: string;
          fecha: string;
          total_ingresos: number;
          total_gastos: number;
          dinero_disponible: number;
          distribucion_detalle: unknown;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['historial_distribuciones']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['historial_distribuciones']['Insert']>;
      };
    };
  };
};

// Sync functions
export const syncFromSupabase = async (userId: string) => {
  if (!isSupabaseConfigured()) return null;
  
  try {
    // Get user's distribuciones
    const { data: distribuciones, error: distError } = await supabase
      .from('distribuciones')
      .select('*')
      .eq('usuario_id', userId);
    
    if (distError) throw distError;
    
    // Get rubros for each distribucion
    const distribucionIds = distribuciones?.map(d => d.id) || [];
    
    const { data: rubros, error: rubroError } = await supabase
      .from('rubros')
      .select('*')
      .in('distribucion_id', distribucionIds);
    
    if (rubroError) throw rubroError;
    
    // Get historial
    const { data: historial, error: histError } = await supabase
      .from('historial_distribuciones')
      .select('*')
      .eq('usuario_id', userId)
      .order('fecha', { ascending: false });
    
    if (histError) throw histError;
    
    return { distribuciones, rubros, historial };
  } catch (error) {
    console.error('Error syncing from Supabase:', error);
    return null;
  }
};

export const syncToSupabase = async (
  userId: string,
  data: {
    distribuciones?: unknown[];
    rubros?: unknown[];
    historial?: unknown[];
  }
) => {
  if (!isSupabaseConfigured()) return false;
  
  try {
    if (data.distribuciones) {
      const { error } = await supabase
        .from('distribuciones')
        .upsert(data.distribuciones);
      if (error) throw error;
    }
    
    if (data.rubros) {
      const { error } = await supabase
        .from('rubros')
        .upsert(data.rubros);
      if (error) throw error;
    }
    
    if (data.historial) {
      const { error } = await supabase
        .from('historial_distribuciones')
        .insert(data.historial);
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error syncing to Supabase:', error);
    return false;
  }
};

// Subscribe to real-time changes
export const subscribeToChanges = (
  userId: string,
  callback: (payload: unknown) => void
) => {
  if (!isSupabaseConfigured()) return null;
  
  const channel = supabase
    .channel(`user-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'historial_distribuciones',
        filter: `usuario_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
  
  return () => supabase.removeChannel(channel);
};
