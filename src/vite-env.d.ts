/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_DEFAULT_CURRENCY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Type declarations for PWA
interface ServiceWorkerRegistration {
  update(): Promise<ServiceWorkerRegistration>;
  waiting?: ServiceWorker | null;
  active?: ServiceWorker | null;
}

interface Window {
  serviceWorker?: {
    register(scriptURL: string, options?: ServiceWorkerRegistrationOptions): Promise<ServiceWorkerRegistration>;
  };
}
