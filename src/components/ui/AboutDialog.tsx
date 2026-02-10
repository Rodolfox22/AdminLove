import { useState } from 'react';
import { X, Heart, Star, ExternalLink } from 'lucide-react';
import { VERSION, APP_NAME, BUILD_DATE } from '@/version';

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutDialog({ isOpen, onClose }: AboutDialogProps) {
  if (!isOpen) return null;

  const versionInfo = {
    version: VERSION || '1.0.0',
    appName: APP_NAME || 'AdminLove',
    buildDate: BUILD_DATE || new Date().toISOString()
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in border border-border">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent transition-colors"
        >
          <X size={20} />
        </button>
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <span className="text-4xl">💰</span>
          </div>
          <h2 className="text-2xl font-bold">{versionInfo.appName}</h2>
          <p className="text-muted-foreground">Distribuye con propósito</p>
        </div>
        
        {/* Version info */}
        <div className="bg-muted/50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Versión</span>
            <span className="font-mono font-semibold">{versionInfo.version}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Build</span>
            <span className="text-xs font-mono">
              {new Date(versionInfo.buildDate).toLocaleDateString('es-AR')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">PWA</span>
            <span className="text-xs px-2 py-0.5 bg-success/10 text-success rounded-full">
              ✓ Instalable
            </span>
          </div>
        </div>
        
        {/* Features */}
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-sm text-muted-foreground">Características</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Modo Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Sincronización</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Historial</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>PWA Ready</span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-2">
            Desarrollado con ❤️
          </p>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <span>Ver en GitHub</span>
            <ExternalLink size={14} />
          </a>
        </div>
        
        {/* Decorative hearts */}
        <div className="absolute -bottom-6 -left-6 text-primary/20">
          <Heart size={48} fill="currentColor" />
        </div>
        <div className="absolute -top-4 -right-4 text-primary/20">
          <Star size={32} fill="currentColor" />
        </div>
      </div>
    </div>
  );
}
