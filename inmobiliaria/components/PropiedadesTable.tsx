"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { borrarPropiedadesMultiples } from "@/lib/property-actions"
import { formatearPrecio } from "@/lib/formatear-precio"

type Propiedad = {
  id: string
  titulo: string
  ubicacion: string
  tipo: string
  moneda?: string
  precio: number
  destacada: boolean
}

export default function PropiedadesTable({
  propiedades,
  idsVisiblesEnHome,
  limiteHome,
}: {
  propiedades: Propiedad[]
  idsVisiblesEnHome: string[]
  limiteHome: number
}) {
  const router = useRouter()
  const [seleccionadas, setSeleccionadas] = useState<Set<string>>(new Set())
  const [borrando, setBorrando] = useState(false)

  const visibles = new Set(idsVisiblesEnHome)
  const todasSeleccionadas = propiedades.length > 0 && seleccionadas.size === propiedades.length

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
      setSeleccionadas(new Set(propiedades.map(p => p.id)))
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
            Todas las propiedades
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
                onChange={toggleTodas}
                style={{ width: "16px", height: "16px", accentColor: "#C2540A", cursor: "pointer" }}
              />
            </th>
            {["Propiedad", "Tipo", "Precio", "Home", ""].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "10px 24px 10px 0", fontSize: "11px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {propiedades.map((propiedad) => (
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
                  onChange={() => toggleUna(propiedad.id)}
                  style={{ width: "16px", height: "16px", accentColor: "#C2540A", cursor: "pointer" }}
                />
              </td>
              <td style={{ padding: "14px 24px 14px 0" }}>
                <p className="font-display" style={{ fontWeight: 700, color: "#1C0A00", fontSize: "14px" }}>{propiedad.titulo}</p>
                <p style={{ color: "#A8A29E", fontSize: "12px", marginTop: "2px" }}>{propiedad.ubicacion}</p>
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
                {!propiedad.destacada ? (
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
                <Link href={`/admin/propiedades/${propiedad.id}`} style={{ color: "#C2540A", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
                  Editar →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {propiedades.length === 0 && (
        <div style={{ padding: "48px 24px", textAlign: "center" }}>
          <p style={{ color: "#A8A29E", fontSize: "14px" }}>Todavía no cargaste ninguna propiedad.</p>
        </div>
      )}
    </div>
  )
}
