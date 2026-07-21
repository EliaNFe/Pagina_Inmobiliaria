# Inmobiliaria Liliana Cirigliano

Sitio web completo para una inmobiliaria real en Necochea, Buenos Aires. Incluye un catálogo público de propiedades y un panel de administración seguro para gestionar el contenido del sitio sin tocar código.

## Stack

- **Next.js 16** — App Router, Server Components, Server Actions
- **TypeScript**
- **Tailwind CSS v4**
- **Supabase** — PostgreSQL, Storage y Auth
- **Vercel** — deploy y hosting

## Diseño

Sistema de diseño editorial propio: fondo oscuro sólido (`#1C0A00`) con acentos naranjas (`#C2540A`), tipografías **Sora** (títulos) + **Inter** (texto) vía `next/font/google`, botones rectangulares con micro-interacciones (barrido de color, flechas animadas), cinta de texto en movimiento (marquee) y animaciones de aparición al scrollear con `IntersectionObserver`.

## Caché

Las consultas a Supabase están cacheadas con `unstable_cache` de Next.js:

- Propiedades destacadas (home) → 5 minutos
- Catálogo de propiedades → 5 minutos
- Detalle de propiedad → 10 minutos
- Imágenes de propiedad → 10 minutos
- Configuración del sitio → 10 minutos

Cada mutación desde el admin (crear, editar, borrar propiedad o imagen, guardar configuración) invalida el caché correspondiente con `revalidatePath` al terminar, así los cambios se ven al instante en el sitio público sin esperar a que expire el caché.

## Funcionalidades

### Sitio público
- Home con hero editorial, secciones por tipo de propiedad, propiedades destacadas y sección institucional
- Catálogo de propiedades con paginado y filtro por tipo
- Detalle de propiedad con carrusel de múltiples imágenes (crossfade, zoom lento, filmstrip, navegación por teclado)
- Formulario de consulta rápida por WhatsApp en el home, con mensaje prellenado
- Página de nosotros y contacto con datos editables desde el admin, incluyendo mapa embebido de Google Maps
- Animaciones de aparición al hacer scroll

### Panel de administración
- Login seguro con rate limiting (5 intentos por IP cada 5 minutos)
- Dashboard con estadísticas y selección múltiple de propiedades para borrado en lote
- Alta y edición de propiedades con múltiples fotos, comprimidas automáticamente en el navegador antes de subir (reduce peso y evita límites de tamaño)
- Sincronización automática de la foto principal cada vez que se agrega o borra una imagen
- Configuración del sitio: teléfono, WhatsApp, email, horarios, dirección y textos del hero

### Seguridad
- Autenticación server-side, nunca en el cliente
- `proxy.ts` (antes `middleware.ts`, renombrado por el cambio de convención en Next 16) protege todas las rutas `/admin/*`
- Todas las mutaciones pasan por Server Actions (`lib/property-actions.ts`), que vuelven a verificar la sesión server-side como segunda capa de seguridad, independiente del proxy
- Row Level Security en Supabase — público solo lee, admin escribe
- Rate limiting en el login
- Credenciales en variables de entorno, nunca en el código

## Estructura

```
app/
  page.tsx                          → Home
  propiedades/
    page.tsx                        → Catálogo con paginado y filtros
    [id]/page.tsx                   → Detalle con carrusel
  nosotros/page.tsx
  contacto/page.tsx                 → Incluye mapa embebido
  admin/
    page.tsx                        → Dashboard con borrado múltiple
    login/page.tsx
    configuracion/page.tsx
    propiedades/
      nueva/page.tsx
      [id]/page.tsx                 → Edición y borrado
  api/
    auth/
      login/route.ts                → Auth server-side con rate limiting
      logout/route.ts
components/
  Navbar.tsx
  SliderPropiedades.tsx             → Slider autoplay del home
  CarruselImagenes.tsx              → Carrusel del detalle
  ConsultaWhatsappForm.tsx
  PropiedadesTable.tsx              → Tabla admin con selección múltiple
  Reveal.tsx                        → Animación de aparición al scroll
lib/
  supabase.ts                       → Cliente público + queries cacheadas
  supabase-server.ts                → Cliente para Server Components
  supabase-client.ts                → Cliente singleton para Client Components
  property-actions.ts               → Server Actions (crear/editar/borrar)
  comprimir-imagen.ts               → Compresión de imágenes en el navegador
proxy.ts                            → Protección de rutas (ex middleware.ts)
next.config.ts                      → Límite de Server Actions ampliado a 10mb
```

## Notas

Proyecto real en producción para un cliente. El panel de administración permite gestionar todo el contenido del sitio sin necesidad de tocar código.
