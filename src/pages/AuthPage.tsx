import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { generarId } from '@/utils/helpers';
import type { Usuario } from '@/types';
import { DollarSign, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { setUsuario } = useAuthStore();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const nombre = formData.get('nombre') as string;
    
    try {
      if (isLogin) {
        // Login con local storage (modo demo)
        const usuariosGuardados = JSON.parse(localStorage.getItem('adminlove_users') || '[]');
        const usuario = usuariosGuardados.find((u: Usuario) => u.email === email);
        
        if (usuario) {
          setUsuario(usuario);
          navigate('/');
        } else {
          setError('Usuario no encontrado. Regístrate primero.');
        }
      } else {
        // Registro
        if (!nombre) {
          setError('El nombre es requerido');
          setIsLoading(false);
          return;
        }
        
        const nuevoUsuario: Usuario = {
          id: generarId(),
          nombre,
          email,
          modo: 'local',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Guardar en local storage
        const usuariosGuardados = JSON.parse(localStorage.getItem('adminlove_users') || '[]');
        usuariosGuardados.push(nuevoUsuario);
        localStorage.setItem('adminlove_users', JSON.stringify(usuariosGuardados));
        
        setUsuario(nuevoUsuario);
        navigate('/');
      }
    } catch {
      setError('Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleModoLocal = () => {
    const usuarioLocal: Usuario = {
      id: generarId(),
      nombre: 'Usuario Local',
      modo: 'local',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setUsuario(usuarioLocal);
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-3 sm:mb-4">
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">AdminLove</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Gestiona tus ingresos con sabiduría y propósito
          </p>
        </div>
        
        {/* Card */}
        <div className="bg-card rounded-xl shadow-lg p-4 sm:p-6 border border-border">
          {/* Tabs */}
          <div className="flex gap-2 mb-4 sm:mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                isLogin
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              Ingresar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-lg font-medium text-sm sm:text-base transition-colors ${
                !isLogin
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              Registrar
            </button>
          </div>
          
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium mb-1">
                  Nombre
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Tu nombre"
                    className="input-field pl-9 sm:pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="tu@email.com"
                  required
                  className="input-field pl-9 sm:pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  className="input-field pl-9 sm:pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-2 sm:py-3 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50"
            >
              {isLoading ? (
                <span className="animate-pulse">Procesando...</span>
              ) : (
                <>
                  {isLogin ? 'Ingresar' : 'Crear Cuenta'}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </form>
          
          {/* Divider */}
          <div className="relative my-4 sm:my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">O</span>
            </div>
          </div>
          
          {/* Modo local */}
          <button
            onClick={handleModoLocal}
            className="w-full btn-secondary py-2 sm:py-3 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <span>📱</span>
            <span>Usar sin cuenta</span>
          </button>
        </div>
        
        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Al continuar, aceptas nuestros términos y política de privacidad.
        </p>
      </div>
    </div>
  );
}
