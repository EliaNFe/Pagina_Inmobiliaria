"use client"

import { useState } from "react"

export default function CarruselImagenes({ imagenes, titulo }: { imagenes: string[]; titulo: string }) {
  const [actual, setActual] = useState(0)

  if (imagenes.length === 0) {
    return (
      <div style={{
        background: "#FFE4CC", borderRadius: "16px", height: "360px",
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <span style={{color: "#C2540A", opacity: 0.4, fontSize: "14px"}}>Sin imágenes</span>
      </div>
    )
  }

  return (
    <div>
      <div style={{position: "relative", borderRadius: "16px", overflow: "hidden", height: "360px"}}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagenes[actual]}
          alt={titulo}
          style={{width: "100%", height: "100%", objectFit: "cover"}}
        />
        {imagenes.length > 1 && (
          <>
            <button
              onClick={() => setActual(prev => prev === 0 ? imagenes.length - 1 : prev - 1)}
              style={{
                position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                background: "rgba(0,0,0,0.45)", color: "#fff", border: "none",
                borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer",
                fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center"
              }}
            >
              ‹
            </button>
            <button
              onClick={() => setActual(prev => prev === imagenes.length - 1 ? 0 : prev + 1)}
              style={{
                position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                background: "rgba(0,0,0,0.45)", color: "#fff", border: "none",
                borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer",
                fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center"
              }}
            >
              ›
            </button>
            <div style={{
              position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)",
              display: "flex", gap: "6px"
            }}>
              {imagenes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActual(i)}
                  style={{
                    width: i === actual ? "20px" : "8px", height: "8px",
                    borderRadius: "999px", border: "none", cursor: "pointer",
                    background: i === actual ? "#fff" : "rgba(255,255,255,0.5)",
                    transition: "all 0.2s", padding: 0
                  }}
                />
              ))}
            </div>
          </>
        )}
        <div style={{
          position: "absolute", top: "12px", right: "12px",
          background: "rgba(0,0,0,0.45)", color: "#fff",
          fontSize: "12px", fontWeight: 600, padding: "4px 10px", borderRadius: "999px"
        }}>
          {actual + 1} / {imagenes.length}
        </div>
      </div>

      {imagenes.length > 1 && (
        <div style={{display: "flex", gap: "8px", marginTop: "12px", overflowX: "auto"}}>
          {imagenes.map((img, i) => (
            <button key={i} onClick={() => setActual(i)} style={{
              border: i === actual ? "2px solid #C2540A" : "2px solid transparent",
              borderRadius: "8px", overflow: "hidden", width: "64px", height: "64px",
              flexShrink: 0, cursor: "pointer", padding: 0, background: "none"
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`foto ${i+1}`} style={{width: "100%", height: "100%", objectFit: "cover"}} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
