import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, useConfiguracionStore } from '@/store';

// Pages
import AuthPage from '@/pages/AuthPage';
import MisDistribucionesPage from '@/pages/MisDistribucionesPage';
import HomePage from '@/pages/HomePage';
import DistribuirPage from '@/pages/DistribuirPage';
import ResultadosPage from '@/pages/ResultadosPage';
import ConfiguracionPage from '@/pages/ConfiguracionPage';
import HistorialPage from '@/pages/HistorialPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Layout
import Layout from '@/components/layout/Layout';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="mis-distribuciones" element={<MisDistribucionesPage />} />
        <Route path="distribuir" element={<DistribuirPage />} />
        <Route path="resultados" element={<ResultadosPage />} />
        <Route path="configuracion" element={<ConfiguracionPage />} />
        <Route path="historial" element={<HistorialPage />} />
      </Route>
      
      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
