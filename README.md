# ArriendosCol — Viviendas y Refugios Disponibles

ArriendosCol es una plataforma web Full Stack unificada en Next.js (App Router), TypeScript y Tailwind CSS enfocada en encontrar y publicar viviendas disponibles para arriendo y refugios habilitados para emergencias en Colombia.

---

## Características de la Aplicación

1. **Diseño Moderno & Responsivo:** Inspirado en plataformas inmobiliarias profesionales con dark mode, badges, skeletons y layout adaptable (Desktop, Tablet, Móviles).
2. **Publicación Rápida Directa:** Sin bloqueos ni barreras de registro obligatorio para publicar viviendas o refugios en emergencias.
3. **Zonas Prioritarias:** Estructura jerárquica por **Departamento → Municipio → Barrio/Sector** con soporte completo para Cali, Pereira, Manizales y Chocó (Quibdó).
4. **Imágenes en Base64 Optimizadas:** Redimensión y compresión automática en el navegador (vía Canvas HTML5) antes de almacenar en la base de datos PostgreSQL.
5. **Mapa Interactivo Leaflet / OpenStreetMap:** Marcadores diferenciados para viviendas (verde) y refugios (rojo), popups informativos y selector con PIN arrastrable para capturar coordenadas exactas (`latitude`, `longitude`).
6. **Despliegue 100% en Vercel:** Next.js Route Handlers integrados en `/api/*` que consultan a PostgreSQL en Railway mediante Prisma ORM.

---

## Estructura del Proyecto

```
arriendoscol/
├── app/
│   ├── layout.tsx
│   ├── globals.css                       # Estilos globales y mapas
│   ├── page.tsx                          # Home page con Hero, buscador y mapas
│   ├── viviendas/
│   │   ├── page.tsx                      # Catálogo de viviendas con filtros
│   │   └── [id]/page.tsx                 # Detalle de vivienda + Galería + Mapa
│   ├── refugios/
│   │   ├── page.tsx                      # Lista de refugios de emergencia
│   │   └── [id]/page.tsx                 # Detalle del refugio + Capacidad
│   ├── mapa/
│   │   └── page.tsx                      # Mapa nacional interactivo pantalla completa
│   ├── publicar-vivienda/page.tsx        # Formulario de publicación viviendas
│   ├── publicar-refugio/page.tsx         # Formulario de publicación refugios
│   ├── admin/
│   │   └── page.tsx                      # Dashboard de administración y reportes
│   └── api/
│       ├── properties/                   # API Routes para viviendas
│       ├── shelters/                     # API Routes para refugios
│       ├── reports/                      # API Route de reportes
│       └── locations/                    # Dataset de ubicaciones colombianas
├── components/
│   ├── Navbar.tsx                        # Header principal
│   ├── Footer.tsx                        # Pie de página
│   ├── PropertyCard.tsx                  # Card de vivienda
│   ├── ShelterCard.tsx                   # Card de refugio
│   ├── LeafletMap.tsx                    # Dynamic Leaflet wrapper
│   ├── LeafletMapClient.tsx              # Renderizador Leaflet Client-side
│   └── ImageUploader.tsx                 # Compresor Base64 en Canvas
├── lib/
│   ├── prisma.ts                         # Singleton de Prisma Client
│   └── locationData.ts                   # Geografía estructurada de Colombia
├── prisma/
│   └── schema.prisma                     # Esquema Prisma PostgreSQL
└── package.json
```

---

## Configuración y Despliegue en Vercel

1. Subir este repositorio a GitHub.
2. En **Vercel**, importar el proyecto (`Import Project`).
3. En **Settings → Environment Variables**, agregar:
   - `DATABASE_URL`: La URL de conexión de PostgreSQL alojada en Railway (ejemplo: `postgresql://postgres:password@host:port/railway`).
   - `NEXT_PUBLIC_MAP_PROVIDER`: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
4. Al desplegar, Vercel ejecutará automáticamente `prisma generate && next build`.

---

## Instalación Local

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```
