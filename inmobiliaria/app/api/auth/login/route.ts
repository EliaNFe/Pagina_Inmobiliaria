import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const intentos = new Map<string, { count: number; lastAttempt: number }>()

function checkRateLimit(ip: string): boolean {
  const ahora = Date.now()
  const ventana = 5 * 60 * 1000 // 5 minutos
  const maxIntentos = 5

  const registro = intentos.get(ip)

  if (!registro) {
    intentos.set(ip, { count: 1, lastAttempt: ahora })
    return true
  }

  if (ahora - registro.lastAttempt > ventana) {
    intentos.set(ip, { count: 1, lastAttempt: ahora })
    return true
  }

  if (registro.count >= maxIntentos) {
    return false
  }

  registro.count++
  registro.lastAttempt = ahora
  return true
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown"

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Demasiados intentos. Esperá 5 minutos e intentá de nuevo." },
      { status: 429 }
    )
  }

  const { email, password } = await request.json()
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.session) {
    return NextResponse.json({ error: "Email o contraseña incorrectos" }, { status: 401 })
  }

  return NextResponse.json({ success: true })
}