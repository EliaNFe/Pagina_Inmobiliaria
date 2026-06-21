"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginAdmin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setLoading(false)
      return
    }

    window.location.href = "/admin"
  }

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-xs text-stone-400 tracking-widest uppercase mb-1">Inmobiliaria</p>
          <h1 className="text-2xl font-bold text-stone-900">Liliana Cirigliano</h1>
          <p className="text-stone-400 text-sm mt-2">Panel de administración</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors"
              placeholder="tu@email.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg disabled:opacity-50 transition-colors text-sm"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </div>
      </div>
    </main>
  )
}
