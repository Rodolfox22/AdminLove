import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';

interface NavbarActions {
  setSaveAction?: (action: () => void) => void;
  setNewAction?: (action: () => void) => void;
}

export default function Layout() {
  const location = useLocation();
  
  // Estado para almacenar las acciones del Navbar
  const [saveAction, setSaveAction] = useState<() => void>(() => {});
  const [newAction, setNewAction] = useState<() => void>(() => {});
  
  // Determinar si mostrar botones según la ruta
  const showSaveButton = location.pathname === '/configuracion';
  const showNewButton = location.pathname === '/distribuir' || location.pathname === '/configuracion';
  
  // Función wrapper para manejar el guardado
  const handleSave = useCallback(() => {
    saveAction();
  }, [saveAction]);
  
  // Función wrapper para manejar nuevo
  const handleNew = useCallback(() => {
    newAction();
  }, [newAction]);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        showSaveButton={showSaveButton}
        showNewButton={showNewButton}
        onSave={showSaveButton ? handleSave : undefined}
        onNew={showNewButton ? handleNew : undefined}
      />
      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="container mx-auto px-3 py-4 md:px-4 md:py-6 lg:px-6">
          <Outlet context={{ setSaveAction, setNewAction }} />
        </div>
      </main>
    </div>
  );
}
