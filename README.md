# 💰 AdminLove

**AdminLove** es una aplicación web PWA para distribución inteligente de ingresos. Permite configurar rubros porcentuales y distribuir tus ingresos disponibles (ingresos - gastos) automáticamente.

![AdminLove](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=AdminLove)

## ✨ Características

- 📱 **PWA**: Instala en tu dispositivo y úsalo offline
- 🔐 **Modo Local**: Sin cuenta, tus datos se guardan localmente
- 🌙 **Modo Oscuro**: Interfaz adaptativa
- 📊 **Historial**: Guarda y consulta todas tus distribuciones
- 🔄 **Sincronización**: Configura Supabase para acceder desde múltiples dispositivos
- 🎨 **Personalizable**: Crea tus propios rubros con colores e íconos
- 📤 **Exportar/Importar**: Guarda tus configuraciones en archivos .adlv

## 🚀 Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: TailwindCSS v3
- **Estado**: Zustand
- **Rutas**: React Router v6
- **Base de datos**: Supabase (opcional)
- **PWA**: Vite PWA + Service Worker

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/adminlove.git
cd adminlove
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## 🛠️ Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Vista previa de la build |
| `npm run lint` | Ejecuta ESLint |
| `npm run format` | Formatea con Prettier |
| `npm run test` | Ejecuta tests unitarios |
| `npm run deploy` | Despliega a GitHub Pages |

## 📁 Estructura del Proyecto

```
adminlove/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── service-worker.js
│   └── offline.html
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── Layout.tsx
│   │   └── ui/
│   ├── pages/
│   │   ├── AuthPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── DistribuirPage.tsx
│   │   ├── ResultadosPage.tsx
│   │   ├── ConfiguracionPage.tsx
│   │   ├── HistorialPage.tsx
│   │   └── MisDistribucionesPage.tsx
│   ├── store/
│   │   └── index.ts
│   ├── services/
│   │   └── supabase/
│   │       └── client.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   └── migrations/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🔧 Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta las migraciones en `supabase/migrations/`
3. Configura las políticas RLS (Row Level Security)
4. Agrega las credenciales en `.env`

## 📱 Instalación como PWA

1. Abre la aplicación en un navegador compatible (Chrome, Edge, Safari)
2. Busca la opción "Instalar aplicación" en el menú
3. ¡Listo! Ahora AdminLove estará en tu pantalla de inicio

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🙏 Agradecimientos

- [shadcn/ui](https://ui.shadcn.com/) por los componentes base
- [Lucide](https://lucide.dev/) por los íconos
- [TailwindCSS](https://tailwindcss.com/) por el sistema de estilos
- [Supabase](https://supabase.com/) por la infraestructura de backend

---

**Desarrollado con ❤️ por AdminLove**
