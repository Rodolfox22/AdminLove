import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useTransaccionStore, useConfiguracionStore } from '@/store';
import { formatearMonto, generarId } from '@/utils/helpers';
import type { Transaccion } from '@/types';
import { Plus, Minus, Trash2, ArrowRight, Wallet, AlertCircle } from 'lucide-react';

export default function DistribuirPage() {
  const navigate = useNavigate();
  const { configuracion } = useConfiguracionStore();
  const { 
    transacciones, 
    agregarTransaccion, 
    eliminarTransaccion,
    getTotalIngresos, 
    getTotalGastos,
    getDisponible,
    limpiarTransacciones
  } = useTransaccionStore();
  
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [tipoActual, setTipoActual] = useState<'ingreso' | 'gasto'>('ingreso');
  
  const disponible = getDisponible();
  
  const handleAgregar = () => {
    const monto = parseFloat(nuevoMonto.replace(/[^0-9.]/g, ''));
    
    if (!monto || monto <= 0) return;
    
    agregarTransaccion({
      tipo: tipoActual,
      monto,
      descripcion: nuevaDescripcion || (tipoActual === 'ingreso' ? 'Ingreso' : 'Gasto'),
      fecha: new Date().toISOString()
    });
    
    setNuevoMonto('');
    setNuevaDescripcion('');
  };
  
  const handleEliminarUltimo = () => {
    if (transacciones.length > 0) {
      const ultimo = transacciones[transacciones.length - 1];
      eliminarTransaccion(ultimo.id);
    }
  };
  
  const handleLimpiarTodo = () => {
    if (confirm('¿Estás seguro de eliminar todas las transacciones?')) {
      limpiarTransacciones();
    }
  };
  
  const handleVerResultados = () => {
    navigate('/resultados');
  };
  
  const formatearInput = (value: string) => {
    const numero = value.replace(/[^0-9.]/g, '');
    return numero;
  };
  
  return (
    <div className="space-y-4 sm:space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">Distribuir Ingresos</h1>
        <div className="flex gap-2">
          <button
            onClick={handleLimpiarTodo}
            className="btn-secondary px-3 py-1.5 text-sm"
            disabled={transacciones.length === 0}
          >
            Limpiar
          </button>
        </div>
      </div>
      
      {/* Toggle tipo */}
      <div className="flex gap-2 bg-card rounded-lg p-1 border border-border">
        <button
          onClick={() => setTipoActual('ingreso')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            tipoActual === 'ingreso'
              ? 'bg-ingreso text-white'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          💰 Ingreso
        </button>
        <button
          onClick={() => setTipoActual('gasto')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            tipoActual === 'gasto'
              ? 'bg-gasto text-white'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          💸 Gasto
        </button>
      </div>
      
      {/* Input nuevo */}
      <div className="bg-card rounded-xl p-3 sm:p-4 border border-border space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={nuevoMonto}
            onChange={(e) => setNuevoMonto(formatearInput(e.target.value))}
            placeholder="0.00"
            className="flex-1 text-2xl sm:text-3xl font-bold bg-transparent border-b-2 border-border focus:border-primary outline-none py-2"
            disabled={tipoActual === 'gasto' && disponible <= 0}
          />
          <button
            onClick={handleAgregar}
            disabled={!nuevoMonto || parseFloat(nuevoMonto) <= 0}
            className="btn-primary px-4 sm:px-6 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Agregar</span>
          </button>
        </div>
        
        <input
          type="text"
          value={nuevaDescripcion}
          onChange={(e) => setNuevaDescripcion(e.target.value)}
          placeholder="Descripción (opcional)"
          className="w-full text-sm bg-transparent border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
      
      {/* Lista de transacciones */}
      <div className="space-y-3">
        {transacciones.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Wallet size={48} className="mx-auto mb-4 opacity-50" />
            <p>No hay transacciones aún</p>
            <p className="text-sm">Agrega tus ingresos y gastos arriba</p>
          </div>
        ) : (
          <>
            {/* Ingresos */}
            {transacciones.filter(t => t.tipo === 'ingreso').map((transaccion) => (
              <div
                key={transaccion.id}
                className="transaccion-card-ingreso rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-semibold text-lg text-ingreso">
                    +{formatearMonto(transaccion.monto)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaccion.descripcion}
                  </p>
                </div>
                <button
                  onClick={() => eliminarTransaccion(transaccion.id)}
                  className="p-2 rounded-lg hover:bg-ingreso/10 text-ingreso transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            
            {/* Gastos */}
            {transacciones.filter(t => t.tipo === 'gasto').map((transaccion) => (
              <div
                key={transaccion.id}
                className="transaccion-card-gasto rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-semibold text-lg text-gasto">
                    -{formatearMonto(transaccion.monto)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {transaccion.descripcion}
                  </p>
                </div>
                <button
                  onClick={() => eliminarTransaccion(transaccion.id)}
                  className="p-2 rounded-lg hover:bg-gasto/10 text-gasto transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
      
      {/* Totales */}
      <div className="bg-card rounded-xl p-4 border border-border space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Ingresos</span>
          <span className="font-semibold text-ingreso">
            {formatearMonto(getTotalIngresos())}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Gastos</span>
          <span className="font-semibold text-gasto">
            {formatearMonto(getTotalGastos())}
          </span>
        </div>
        <div className="border-t border-border pt-3">
          <div className="flex justify-between">
            <span className="font-medium">Dinero Disponible</span>
            <span className={`font-bold text-xl ${disponible >= 0 ? 'text-primary' : 'text-destructive'}`}>
              {formatearMonto(disponible)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Botón distribuir */}
      <button
        onClick={handleVerResultados}
        disabled={transacciones.length === 0 || disponible < 0}
        className="w-full btn-primary py-3 sm:py-4 text-base sm:text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-lg">📊</span>
        <span>Ver Resultados</span>
        <ArrowRight className="w-5 h-5" />
      </button>
      
      {disponible < 0 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
          <AlertCircle size={20} />
          <span className="text-sm">Los gastos superan los ingresos</span>
        </div>
      )}
    </div>
  );
}
