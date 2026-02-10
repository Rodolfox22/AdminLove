import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="text-8xl">😕</div>
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl text-muted-foreground">
          Página no encontrada
        </p>
        <p className="text-muted-foreground">
          La página que buscas no existe o ha sido movida.
        </p>
        
        <div className="flex gap-4 justify-center pt-4">
          <button
            onClick={() => window.history.back()}
            className="btn-secondary px-6 py-3 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>
          
          <Link
            to="/"
            className="btn-primary px-6 py-3 flex items-center gap-2"
          >
            <Home size={20} />
            <span>Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
