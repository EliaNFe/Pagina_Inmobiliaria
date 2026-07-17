import Link from "next/link"

export default function Nosotros() {
  return (
    <main className="antialiased">

      {/* HERO */}
      <section style={{ background: "#1C0A00" }} className="relative text-white pt-40 pb-16 px-6">
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div style={{ width: "28px", height: "1.5px", background: "#C2540A" }} />
            <span className="text-xs tracking-[0.2em] font-semibold text-orange-500 uppercase">
              Sobre nosotros
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-[1.02] mb-4">
            Liliana Cirigliano
          </h1>
          <p className="text-white/50 text-[15px] max-w-lg">
            Gestión inmobiliaria integral y transparente en la ciudad de Necochea.
          </p>
        </div>
      </section>

      {/* HISTORIA — panel de foto + texto */}
      <section style={{ background: "#FDFBF9" }} className="py-24">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">

          {/* Panel de foto */}
          <div>
            <div
              className="relative overflow-hidden"
              style={{
                border: "1px solid #F0E4D8",
                borderRadius: "8px",
                aspectRatio: "4/5",
                background: "#F5F0EA",
              }}
            >
              {/* Cuando tengas la foto, reemplazá este bloque por:
                  <img src="/liliana-nosotros.jpg" alt="Liliana Cirigliano" className="w-full h-full object-cover" /> */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C2540A" strokeWidth="1.5" opacity="0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-stone-400 text-sm">Foto de Liliana</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div style={{ width: "18px", height: "1.5px", background: "#C2540A" }} />
              <p className="text-xs text-stone-500 tracking-wide">Liliana Cirigliano — Necochea, Buenos Aires</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-5">
              <div style={{ width: "24px", height: "1.5px", background: "#C2540A" }} />
              <span className="text-xs tracking-[0.15em] font-semibold text-orange-700 uppercase">Atención personalizada</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-stone-900 mb-6 leading-tight">
              Conocemos el mercado, entendemos lo que buscás
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              El rubro inmobiliario requiere mucho más que simplemente mostrar propiedades; se trata de escuchar y entender la necesidad real de cada persona que entra a la oficina. Ese es el enfoque principal de nuestra inmobiliaria: un trato directo, realista y sin vueltas.
            </p>
            <p className="text-stone-600 leading-relaxed mb-4">
              Ya sea para tasaciones, ventas o alquileres, nos enfocamos en que el proceso sea dinámico y ordenado. Sabemos que el papeleo y los trámites pueden ser estresantes, por lo que nos ocupamos de filtrar el ruido y dejar las condiciones claras desde el primer momento.
            </p>
            <p className="text-stone-600 leading-relaxed mb-8">
              Trabajar de forma personalizada nos permite estar encima de cada detalle de la operación. Acá hablás siempre con la misma persona, asegurando respuestas concretas y priorizando la tranquilidad de tu inversión.
            </p>
            <Link
              href="/contacto"
              className="inline-flex font-semibold text-stone-900 pb-1 border-b-2 border-transparent hover:border-[#C2540A] hover:text-[#C2540A] transition-all duration-300"
              >
              Hablar con Liliana
            </Link>
          </div>
        </div>
      </section>

      {/* CÓMO TRABAJAMOS */}
      <section style={{ background: "#FFF7ED" }} className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-16 justify-center">
            <div style={{ width: "24px", height: "1.5px", background: "#C2540A" }} />
            <span className="text-xs tracking-[0.15em] font-semibold text-orange-700 uppercase">Cómo trabajamos</span>
            <div style={{ width: "24px", height: "1.5px", background: "#C2540A" }} />
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {[
              { num: "01", titulo: "Asesoramiento inicial", desc: "Escuchamos qué estás buscando comprar, vender o alquilar para entender tus prioridades y presupuesto real desde el primer día." },
              { num: "02", titulo: "Búsqueda y gestión", desc: "Seleccionamos propiedades o compradores adecuados. Filtramos las opciones para que no pierdas tiempo en visitas innecesarias." },
              { num: "03", titulo: "Cierre de operación", desc: "Nos ocupamos de la documentación, escribanía y coordinación. Un proceso prolijo y sin sorpresas de último momento." },
            ].map((item) => (
              <div key={item.num} className="relative pt-6">
                {/* Línea divisoria superior completa (sutil) */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-orange-900/10" />
                {/* Acento naranja corto sobre la línea */}
                <div className="absolute top-0 left-0 w-12 h-[2px] bg-[#C2540A]" />
                
                <div className="mb-4">
                  <span className="font-display font-light text-5xl text-[#C2540A]/40 tracking-tighter">
                    {item.num}
                  </span>
                </div>
                <h4 className="font-display font-bold text-stone-900 mb-3 text-lg">{item.titulo}</h4>
                <p className="text-stone-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/10" style={{ background: "#0A0300" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm font-medium">
            © {new Date().getFullYear()} Inmobiliaria Liliana Cirigliano — Necochea, Buenos Aires
          </p>
          <nav className="flex gap-6">
            {[
              { href: "/propiedades", label: "Propiedades" },
              { href: "/nosotros", label: "Nosotros" },
              { href: "/contacto", label: "Contacto" },
            ].map(link => (
              <Link key={link.href} href={link.href} className="text-white/40 text-sm font-medium hover:text-white transition-colors" style={{ textDecoration: "none" }}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  )
}