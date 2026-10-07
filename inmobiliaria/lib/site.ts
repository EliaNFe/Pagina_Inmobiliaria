// URL pública del sitio. En Vercel toma el dominio de producción solo;
// si tenés dominio propio, definí NEXT_PUBLIC_SITE_URL (ej: https://tudominio.com.ar).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "")

export const SITE_NAME = "Inmobiliaria Liliana Cirigliano"
