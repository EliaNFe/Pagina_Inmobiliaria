"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { borrarPropiedadesMultiples, cambiarDisponibilidadPropiedad } from "@/lib/property-actions"
import { formatearPrecio } from "@/lib/formatear-precio"
import { type FiltrosAdmin, PROPIEDADES_POR_PAGINA, urlAdmin } from "@/lib/admin-propiedades"
import styles from "./PropiedadesTable.module.css"

type Propiedad = {
  id: string
  titulo: string
  ubicacion: string
  tipo: string
  moneda?: string
  precio: number
  destacada: boolean
  disponible: boolean
  operacion?: string
}

export default function PropiedadesTable({
  propiedades,
  filtros,
  tipos,
  totalFiltrado,
  idsVisiblesEnHome,
  limiteHome,
}: {
  propiedades: Propiedad[]
  filtros: FiltrosAdmin
  tipos: string[]
  totalFiltrado: number
  idsVisiblesEnHome: string[]
  limiteHome: number
}) {
  const router = useRouter()
  const [seleccionadas, setSeleccionadas] = useState<Set<string>>(new Set())
  const [borrando, setBorrando] = useState(false)
  const paginas = Math.max(1, Math.ceil(totalFiltrado / PROPIEDADES_POR_PAGINA))
  const [guardando, startTransition] = useTransition()
  const [error, setError] = useState("")
  const filtradas = propiedades

  function cambiarDisponibilidad(propiedad: Propiedad) {
    setError("")
    setSeleccionadas(new Set())
    startTransition(async () => {
      try {
        const resultado = await cambiarDisponibilidadPropiedad(propiedad.id, !propiedad.disponible)
        if (resultado.error) setError(resultado.error)
        else router.refresh()
      } catch {
        setError("No se pudo cambiar la disponibilidad. Intentá nuevamente.")
      }
    })
  }

  const visibles = new Set(idsVisiblesEnHome)
  const todasSeleccionadas = filtradas.length > 0 && filtradas.every(p => seleccionadas.has(p.id))

  function toggleUna(id: string) {
    setSeleccionadas(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleTodas() {
    if (todasSeleccionadas) {
      setSeleccionadas(new Set())
    } else {
      setSeleccionadas(new Set(filtradas.map(p => p.id)))
    }
  }

  async function handleBorrarSeleccionadas() {
    const cantidad = seleccionadas.size
    if (cantidad === 0) return
    const confirmado = confirm(
      cantidad === 1
        ? "¿Borrar esta propiedad? Esta acción no se puede deshacer."
        : `¿Borrar estas ${cantidad} propiedades? Esta acción no se puede deshacer.`
    )
    if (!confirmado) return

    setBorrando(true)
    await borrarPropiedadesMultiples(Array.from(seleccionadas))
    setSeleccionadas(new Set())
    setBorrando(false)
    router.refresh()
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #F0E4D8", borderRadius: "8px", overflow: "hidden" }}>
      <form action="/admin" method="get" className={styles.filters}>
        <label className={styles.location}>Buscar por ubicación
          <input name="ubicacion" type="search" defaultValue={filtros.ubicacion} placeholder="Ej: calle 82" maxLength={200} />
        </label>
        <label>Tipo de propiedad
          <select name="tipo" defaultValue={filtros.tipo}>
            <option value="">Todos los tipos</option>
            {tipos.map(tipo => <option key={tipo}>{tipo}</option>)}
          </select>
        </label>
        <label>Operación
          <select name="operacion" defaultValue={filtros.operacion}>
            <option value="">Todas las operaciones</option>
            <option>Venta</option><option>Alquiler</option><option>Alquiler temporada</option>
          </select>
        </label>
        <label>Disponibilidad
          <select name="disponibilidad" defaultValue={filtros.disponibilidad}>
            <option value="">Todas</option>
            <option value="disponibles">Disponibles</option>
            <option value="no-disponibles">No disponibles</option>
          </select>
        </label>
        <div className={styles.filterActions}>
          <button type="submit" disabled={borrando || guardando} className={styles.search}>Buscar propiedades</button>
          <Link href="/admin" className={styles.clear}>Limpiar filtros</Link>
        </div>
        <p className={styles.hint}>Buscá por calle, número o zona. Podés combinar la ubicación con todos los filtros.</p>
      </form>
      {error && <p role="alert" style={{ padding: "12px 24px", color: "#B91C1C" }}>{error}</p>}

      <div style={{
        padding: "16px 24px",
        borderBottom: "1px solid #F0E4D8",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: seleccionadas.size > 0 ? "#1C0A00" : "#fff",
        transition: "background 0.2s",
      }}>
        {seleccionadas.size > 0 ? (
          <>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>
              {seleccionadas.size} {seleccionadas.size === 1 ? "propiedad seleccionada" : "propiedades seleccionadas"}
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setSeleccionadas(new Set())}
                style={{ background: "transparent", color: "rgba(255,255,255,0.6)", border: "none", fontSize: "13px", cursor: "pointer", padding: "8px 12px" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleBorrarSeleccionadas}
                disabled={borrando}
                style={{
                  background: "#DC2626", color: "#fff", border: "none", borderRadius: "4px",
                  padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer",
                  opacity: borrando ? 0.6 : 1,
                }}
              >
                {borrando ? "Borrando..." : "Borrar seleccionadas"}
              </button>
            </div>
          </>
        ) : (
          <h2 className="font-display" style={{ fontSize: "14px", fontWeight: 700, color: "#1C0A00" }}>
            {totalFiltrado} {totalFiltrado === 1 ? "propiedad encontrada" : "propiedades encontradas"}
          </h2>
        )}
      </div>

      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <table style={{ width: "100%", minWidth: "620px", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#FDFBF9" }}>
            <th style={{ padding: "10px 16px", width: "40px" }}>
              <input
                type="checkbox"
                checked={todasSeleccionadas}
                aria-label="Seleccionar todas las propiedades de esta página"
                disabled={borrando || guardando}
                onChange={toggleTodas}
                style={{ width: "16px", height: "16px", accentColor: "#C2540A", cursor: "pointer" }}
              />
            </th>
            {["Propiedad", "Tipo", "Precio", "Disponibilidad", "Home", "Acciones"].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "10px 24px 10px 0", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtradas.map((propiedad) => (
            <tr
              key={propiedad.id}
              style={{
                borderTop: "1px solid #F0E4D8",
                background: seleccionadas.has(propiedad.id) ? "#FFF7ED" : "transparent",
              }}
            >
              <td style={{ padding: "14px 16px" }}>
                <input
                  type="checkbox"
                  checked={seleccionadas.has(propiedad.id)}
                  aria-label={`Seleccionar ${propiedad.titulo}`}
                  disabled={borrando || guardando}
                  onChange={() => toggleUna(propiedad.id)}
                  style={{ width: "16px", height: "16px", accentColor: "#C2540A", cursor: "pointer" }}
                />
              </td>
              <td style={{ padding: "14px 24px 14px 0" }}>
                <p className="font-display" style={{ fontWeight: 700, color: "#1C0A00", fontSize: "14px" }}>{propiedad.titulo}</p>
                <p style={{ color: "#A8A29E", fontSize: "12px", marginTop: "2px" }}>{propiedad.ubicacion}</p>
                <p style={{ color: "#78716C", fontSize: "12px", marginTop: "2px" }}>{propiedad.operacion || "Venta"}</p>
              </td>
              <td style={{ padding: "14px 24px 14px 0" }}>
                <span style={{ background: "#1C0A00", color: "#fff", fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "4px" }}>
                  {propiedad.tipo}
                </span>
              </td>
              <td style={{ padding: "14px 24px 14px 0", fontWeight: 700, color: "#C2540A", fontSize: "14px" }}>
                {formatearPrecio(propiedad.precio, propiedad.moneda)}
              </td>
              <td style={{ padding: "14px 24px 14px 0" }}>
                <span style={{ display: "block", fontSize: "12px", fontWeight: 700, color: propiedad.disponible ? "#166534" : "#92400E", marginBottom: "4px" }}>{propiedad.disponible ? "Disponible" : "No disponible"}</span>
              </td>
              <td style={{ padding: "14px 24px 14px 0" }}>
                {!propiedad.disponible ? (
                  <span style={{ color: "#78716C", fontSize: "11px" }}>Oculta</span>
                ) : !propiedad.destacada ? (
                  <span style={{ background: "#F5F5F4", color: "#78716C", fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "4px" }}>No</span>
                ) : visibles.has(propiedad.id) ? (
                  <span style={{ background: "#FFF7ED", color: "#C2540A", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "4px", border: "1px solid #FFE4CC" }}>
                    Sí, visible
                  </span>
                ) : (
                  <span
                    title={`Marcada como destacada, pero no entra en el límite de ${limiteHome}`}
                    style={{ background: "#FEF3C7", color: "#92400E", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "4px" }}
                  >
                    No visible
                  </span>
                )}
              </td>
              <td style={{ padding: "14px 24px 14px 0" }}>
                <div className={styles.rowActions}>
                <button type="button" disabled={guardando || borrando} onClick={() => cambiarDisponibilidad(propiedad)} aria-label={`${propiedad.disponible ? "Marcar como no disponible" : "Volver a publicar"}: ${propiedad.titulo}`} className={styles.availability} data-available={propiedad.disponible}>
                  {guardando ? "Guardando…" : propiedad.disponible ? "Marcar no disponible" : "Volver a publicar"}
                </button>
                <Link href={`/admin/propiedades/${propiedad.id}`} style={{ color: "#C2540A", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
                  Editar →
                </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {filtradas.length === 0 && (
        <div style={{ padding: "48px 24px", textAlign: "center" }}>
          <p style={{ color: "#78716C", fontSize: "14px" }}>No hay propiedades que coincidan con la búsqueda. Probá otra ubicación o limpiá los filtros.</p>
        </div>
      )}
      <nav aria-label="Paginación de propiedades" className={styles.pagination}>
        <p>{totalFiltrado ? `${(filtros.pagina - 1) * PROPIEDADES_POR_PAGINA + 1}–${Math.min(filtros.pagina * PROPIEDADES_POR_PAGINA, totalFiltrado)} de ${totalFiltrado}` : "0 resultados"}</p>
        <div>
          {filtros.pagina > 1 ? <Link href={urlAdmin(filtros, filtros.pagina - 1)}>Anterior</Link> : <span aria-disabled="true">Anterior</span>}
          <span aria-current="page">Página {filtros.pagina} de {paginas}</span>
          {filtros.pagina < paginas ? <Link href={urlAdmin(filtros, filtros.pagina + 1)}>Siguiente</Link> : <span aria-disabled="true">Siguiente</span>}
        </div>
      </nav>
    </div>
  )
}
