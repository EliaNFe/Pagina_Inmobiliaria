import type { MetadataRoute } from "next"
import { supabase } from "@/lib/supabase"
import { SITE_URL } from "@/lib/site"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await supabase.from("propiedades").select("id,created_at").eq("disponible", true)
  const fijas: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/propiedades`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/nosotros`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/contacto`, changeFrequency: "yearly", priority: 0.5 },
  ]
  const propiedades: MetadataRoute.Sitemap = (data ?? []).map(p => ({
    url: `${SITE_URL}/propiedades/${p.id}`,
    lastModified: p.created_at ? new Date(p.created_at) : undefined,
    changeFrequency: "weekly",
    priority: 0.7,
  }))
  return [...fijas, ...propiedades]
}
