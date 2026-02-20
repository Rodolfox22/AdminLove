import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-4 sm:space-y-6">
        <div className="text-6xl sm:text-8xl">😕</div>
        <h1 className="text-3xl sm:text-4xl font-bold">404</h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          Página no encontrada
        </p>
        <p className="text-muted-foreground text-sm sm:text-base">
          La página que buscas no existe o ha sido movida.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
          <button
            onClick={() => window.history.back()}
            className="btn-secondary px-5 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Volver</span>
          </button>
          
          <Link
            to="/AdminLove/"
            className="btn-primary px-5 sm:px-6 py-2 sm:py-3 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
