import { getPropiedadesPorOperacionPaginado, getConteoPorTipo } from "@/lib/supabase"
import { formatearPrecio } from "@/lib/formatear-precio"
import Reveal from "@/components/Reveal"
import Link from "next/link"
import styles from "./propiedades.module.css"

const TIPOS = ["Casa", "Departamento", "Terreno", "Lote", "Local comercial"]
const SECCIONES: { clave: "Venta" | "Alquiler" | "Alquiler temporada"; paramPagina: "pv" | "pa" | "pt"; titulo: string; subtitulo: string }[] = [
  { clave: "Venta", paramPagina: "pv", titulo: "En venta", subtitulo: "Propiedades disponibles para comprar" },
  { clave: "Alquiler", paramPagina: "pa", titulo: "En alquiler", subtitulo: "Alquiler tradicional" },
  { clave: "Alquiler temporada", paramPagina: "pt", titulo: "Alquiler por temporada", subtitulo: "Para tus vacaciones en Necochea" },
]

function esNueva(fecha?: string) { return !!fecha && (Date.now() - new Date(fecha).getTime()) / 86400000 <= 14 }
function paginaValida(valor?: string) { const n = Number(valor); return Number.isInteger(n) && n > 0 ? n : 1 }

export default async function Propiedades({ searchParams }: { searchParams: Promise<{ tipo?: string; pv?: string; pa?: string; pt?: string }> }) {
  const { tipo, pv, pa, pt } = await searchParams
  const paginas = { pv: paginaValida(pv), pa: paginaValida(pa), pt: paginaValida(pt) }
  const [resultados, conteoPorTipo] = await Promise.all([
    Promise.all(SECCIONES.map(s => getPropiedadesPorOperacionPaginado(s.clave, paginas[s.paramPagina], tipo))),
    getConteoPorTipo(),
  ])
  const totalGeneral = Object.values(conteoPorTipo).reduce((a, b) => a + b, 0)
  const tiposDisponibles = TIPOS.filter(t => conteoPorTipo[t] > 0)
  const secciones = SECCIONES.map((s, i) => ({ ...s, items: resultados[i].data, count: resultados[i].count, totalPaginas: Math.ceil(resultados[i].count / 6), paginaActual: paginas[s.paramPagina] }))
  const totalFiltrado = secciones.reduce((n, s) => n + s.count, 0)

  function hrefPagina(param: "pv" | "pa" | "pt", nueva: number) {
    const query = new URLSearchParams()
    if (tipo) query.set("tipo", tipo)
    ;(["pv", "pa", "pt"] as const).forEach(p => { const n = p === param ? nueva : paginas[p]; if (n > 1) query.set(p, String(n)) })
    return `/propiedades${query.size ? `?${query}` : ""}`
  }

  const filtros = <nav className={styles.filterOptions} aria-label="Filtrar por tipo">
    <Link href="/propiedades" className={`${styles.filterLink} ${!tipo ? styles.filterActive : ""}`}>Todas <span>{totalGeneral}</span></Link>
    {tiposDisponibles.map(t => <Link key={t} href={`/propiedades?tipo=${encodeURIComponent(t)}`} className={`${styles.filterLink} ${tipo === t ? styles.filterActive : ""}`}>{t} <span>{conteoPorTipo[t]}</span></Link>)}
  </nav>

  return <main className="antialiased">
    <section className="relative overflow-hidden text-white pt-40 pb-20 px-6" style={{ background: "radial-gradient(circle at 82% 18%, rgba(194,84,10,0.24) 0%, transparent 34%), radial-gradient(circle at 12% 100%, rgba(234,88,12,0.10) 0%, transparent 30%), linear-gradient(135deg, #120704 0%, #1C0A00 58%, #2A1007 100%)" }}>
      <div style={{ position: "absolute", right: -100, top: -100, width: 420, height: 420, borderRadius: "50%", background: "rgba(194,84,10,0.10)", pointerEvents: "none", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", left: "10%", bottom: -80, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,247,237,0.035)", pointerEvents: "none", filter: "blur(20px)" }} />
      <div className="relative max-w-6xl mx-auto"><p className="text-xs font-bold tracking-[0.15em] text-[#ECA56F] uppercase mb-3">Catálogo</p><h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Propiedades disponibles</h1><p className="text-white/55 mt-3">{totalFiltrado} {totalFiltrado === 1 ? "propiedad" : "propiedades"} en Necochea y alrededores</p></div>
    </section>

    <section className={styles.catalogue}><div className={styles.container}>
      <div className={styles.toolbar}>
        <div><p className={styles.eyebrow}>Nuestra selección</p><p className={styles.resultLabel}>Explorar propiedades</p><span className={styles.resultCount}>{tipo ? `${totalFiltrado} en ${tipo}` : `${totalGeneral} disponibles`}</span></div>
        <div className={styles.desktopFilters}><span className={styles.filterLabel}>Tipo de propiedad</span>{filtros}</div>
        <details className={styles.mobileFilters}><summary>Filtros {tipo && <span className={styles.filterCount}>1</span>}<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 7h16M7 12h10M10 17h4" /></svg></summary><div className={styles.mobilePanel}>{filtros}</div></details>
      </div>
      {tipo && <div className={styles.activeFilters}><span>Filtro activo</span><Link href="/propiedades" aria-label={`Quitar filtro ${tipo}`}>{tipo} <b aria-hidden="true">×</b></Link></div>}
      {secciones.filter(s => s.count > 0).length > 1 && <nav className={styles.sectionNav} aria-label="Secciones de propiedades">{secciones.map(s => s.count > 0 && <a key={s.clave} href={`#${s.clave.replace(/\s+/g, "-").toLowerCase()}`}>{s.titulo}<span>{s.count}</span></a>)}</nav>}

      {!secciones.some(s => s.count > 0) ? <div className={styles.emptyState}><span aria-hidden="true">⌂</span><h2>No encontramos propiedades con esos filtros.</h2><p>Probá explorando todos los tipos disponibles.</p>{tipo && <Link href="/propiedades">Limpiar filtros</Link>}</div> :
      <div className={styles.sections}>{secciones.map((s, sectionIndex) => s.count > 0 && <section key={s.clave} id={s.clave.replace(/\s+/g, "-").toLowerCase()} className={styles.propertySection}>
        <header className={styles.sectionHeader}><div><p>{String(sectionIndex + 1).padStart(2, "0")}</p><div><h2>{s.titulo}</h2><span>{s.subtitulo}</span></div></div><span>{s.count} {s.count === 1 ? "propiedad" : "propiedades"}</span></header>
        <div className={styles.grid}>{s.items.map((p, index) => <Reveal key={p.id} delay={(index % 3) * 90}><Link href={`/propiedades/${p.id}`} className={styles.card}>
          <div className={styles.imageWrap}>{p.imagen_url ? <img src={p.imagen_url} alt={p.titulo} loading="lazy" decoding="async" /> : <div className={styles.noImage}>Sin imagen disponible</div>}<div className={styles.imageShade}/><div className={styles.badges}><span>{p.tipo}</span>{esNueva(p.created_at) && <span className={styles.newBadge}>Nueva</span>}</div><span className={styles.operation}>{s.clave}</span></div>
          <div className={styles.cardBody}><div className={styles.cardTopline}><p className={styles.price}>{formatearPrecio(p.precio, p.moneda)}</p><span className={styles.arrow}>↗</span></div><h3>{p.titulo}</h3><p className={styles.location}><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><span>{p.ubicacion}</span></p><div className={styles.cardFooter}><span><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/></svg>{p.superficie} m²</span><span className={styles.cta}>Ver propiedad <b>→</b></span></div></div>
        </Link></Reveal>)}</div>
        {s.totalPaginas > 1 && <nav className={styles.pagination} aria-label={`Paginación de ${s.titulo}`}><Link aria-disabled={s.paginaActual <= 1} tabIndex={s.paginaActual <= 1 ? -1 : undefined} href={hrefPagina(s.paramPagina, Math.max(1, s.paginaActual - 1))} className={s.paginaActual <= 1 ? styles.disabled : ""}>← <span>Anterior</span></Link><div>{Array.from({ length: s.totalPaginas }, (_, i) => i + 1).map(n => <Link key={n} href={hrefPagina(s.paramPagina, n)} aria-current={n === s.paginaActual ? "page" : undefined}>{n}</Link>)}</div><Link aria-disabled={s.paginaActual >= s.totalPaginas} tabIndex={s.paginaActual >= s.totalPaginas ? -1 : undefined} href={hrefPagina(s.paramPagina, Math.min(s.totalPaginas, s.paginaActual + 1))} className={s.paginaActual >= s.totalPaginas ? styles.disabled : ""}><span>Siguiente</span> →</Link></nav>}
      </section>)}</div>}
    </div></section>

    <footer className="py-12 border-t border-white/10" style={{ background: "#0A0300" }}><div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6"><p className="text-white/40 text-sm font-medium">© {new Date().getFullYear()} Inmobiliaria Liliana Cirigliano — Necochea, Buenos Aires</p><nav className="flex gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-2 py-1.5">{[{ href: "/propiedades", label: "Propiedades" }, { href: "/nosotros", label: "Nosotros" }, { href: "/contacto", label: "Contacto" }].map(link => <Link key={link.href} href={link.href} className="text-white/50 text-sm font-medium hover:text-white hover:bg-white/10 transition-colors px-3 py-1.5 rounded-xl">{link.label}</Link>)}</nav></div></footer>
  </main>
}
