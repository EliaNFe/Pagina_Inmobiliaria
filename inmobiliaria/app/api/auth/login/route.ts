import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const VENTANA_MINUTOS = 5
const MAX_INTENTOS = 5


async function checkRateLimit(
  supabase: ReturnType<typeof createServerClient>,
  ip: string
): Promise<boolean> {
  const ahora = new Date()

  const { data: registro } = await supabase
    .from("login_intentos")
    .select("*")
    .eq("ip", ip)
    .single()

  if (!registro) {
    await supabase.from("login_intentos").insert({
      ip,
      intentos: 1,
      primer_intento: ahora.toISOString(),
    } as never)
    return true
  }

  const r = registro as unknown as { ip: string; intentos: number; primer_intento: string }
  const minutosPasados = (ahora.getTime() - new Date(r.primer_intento).getTime()) / 60000

  if (minutosPasados > VENTANA_MINUTOS) {
    await supabase
      .from("login_intentos")
      .update({ intentos: 1, primer_intento: ahora.toISOString() } as never)
      .eq("ip", ip)
    return true
  }

  if (r.intentos >= MAX_INTENTOS) {
    return false
  }

  await supabase
    .from("login_intentos")
    .update({ intentos: r.intentos + 1 } as never)
    .eq("ip", ip)
  return true
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown"
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

  const dentroDelLimite = await checkRateLimit(supabase, ip)

  if (!dentroDelLimite) {
    return NextResponse.json(
      { error: "Demasiados intentos. Esperá 5 minutos e intentá de nuevo." },
      { status: 429 }
    )
  }

  const { email, password } = await request.json()

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.session) {
    return NextResponse.json({ error: "Email o contraseña incorrectos" }, { status: 401 })
  }

  return NextResponse.json({ success: true })
}
