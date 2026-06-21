# Inmobiliaria Liliana Cirigliano

Sitio web completo para una inmobiliaria real en Necochea, Buenos Aires. Incluye un catálogo público de propiedades y un panel de administración seguro para gestionar el contenido del sitio sin tocar código.

## Stack 

- **Next.js 15** — App Router, Server Components, API Routes
- **TypeScript**
- **Tailwind CSS v4**
- **Supabase** — PostgreSQL, Storage y Auth
- **Vercel** — deploy y hosting

## Caché


Las consultas a Supabase están cacheadas con `unstable_cache` de Next.js para reducir los tiempos de carga:

- Propiedades destacadas (home) → 5 minutos
- Catálogo de propiedades → 5 minutos  
- Detalle de propiedad → 10 minutos
- Imágenes de propiedad → 10 minutos
- Configuración del sitio → 10 minutos

En producción, las páginas se sirven desde caché y solo consultan Supabase cuando el caché expira.

## Funcionalidades

### Sitio público
- Home con hero dinámico, propiedades destacadas y contacto
- Catálogo de propiedades con paginado (12 por página)
- Detalle de propiedad con carrusel de múltiples imágenes
- Página de nosotros y contacto con datos editables desde el admin

### Panel de administración
- Login seguro — autenticación server-side, nunca client-side
- Dashboard con estadísticas y listado completo
- Alta de propiedades con múltiples fotos
- Edición y borrado de propiedades
- Configuración del sitio: teléfono, WhatsApp, email, horarios, dirección y textos del hero

### Seguridad
- Autenticación via API Route con cookies httpOnly
- Middleware que protege todas las rutas `/admin/*`
- Row Level Security en Supabase — público solo lee, admin escribe
- Rate limiting en el login (5 intentos por IP cada 5 minutos)
- Credenciales en variables de entorno, nunca en el código

## Estructura
app/

page.tsx                          → Home

propiedades/

page.tsx                        → Catálogo con paginado

[id]/page.tsx                   → Detalle con carrusel

nosotros/page.tsx

contacto/page.tsx

admin/

page.tsx                        → Dashboard

login/page.tsx

configuracion/page.tsx          → Editor de contenido

propiedades/

nueva/page.tsx

[id]/page.tsx                 → Edición y borrado

api/

auth/

login/route.ts                → Auth server-side con rate limiting

logout/route.ts

components/

Navbar.tsx

CarruselImagenes.tsx

lib/

supabase.ts                       → Cliente público

supabase-server.ts                → Cliente para Server Components

supabase-client.ts                → Cliente singleton para Client Components

middleware.ts                       → Protección de rutas

## Notas

Proyecto real en producción para un cliente. El panel de administración permite gestionar todo el contenido del sitio sin necesidad de tocar código.