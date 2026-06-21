import Link from "next/link"

export default function Nosotros() {
  return (
    <main>
      <section className="bg-stone-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-orange-400 text-xs font-semibold tracking-widest uppercase mb-3">Sobre nosotros</p>
          <h1 className="text-4xl font-bold">Liliana Cirigliano</h1>
          <p className="text-stone-400 mt-3 max-w-lg">Inmobiliaria familiar con más de 20 años en el mercado de Tandil</p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="bg-stone-100 rounded-2xl h-80 flex items-center justify-center">
              <span className="text-stone-300 text-sm">Foto de Liliana</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-4">Más de dos décadas acompañando familias</h2>
            <p className="text-stone-500 leading-relaxed mb-4">
              Liliana Cirigliano fundó la inmobiliaria en Tandil con una convicción simple: el proceso de comprar o vender una propiedad tiene que ser claro, honesto y sin presiones. En una industria donde a veces la urgencia reemplaza la confianza, ella eligió el camino contrario.
            </p>
            <p className="text-stone-500 leading-relaxed mb-4">
              A lo largo de más de 20 años, acompañó a cientos de familias en decisiones que cambiaron su vida. Eso da perspectiva, y también responsabilidad.
            </p>
            <p className="text-stone-500 leading-relaxed mb-8">
              Hoy la inmobiliaria sigue siendo un emprendimiento personal, donde cada cliente habla directamente con quien tiene la experiencia y el conocimiento del mercado local.
            </p>
            <Link
              href="/contacto"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3.5 rounded-lg transition-colors text-sm"
            >
              Hablar con Liliana
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-stone-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-xl font-bold text-stone-900 mb-8 text-center">Cómo trabajamos</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", titulo: "Primera consulta", desc: "Nos contás qué estás buscando o qué querés vender. Sin formularios, sin burocracia. Una charla." },
              { num: "02", titulo: "Propuesta a medida", desc: "Te mostramos opciones reales que se ajustan a lo que necesitás, con precios y condiciones claras." },
              { num: "03", titulo: "Acompañamiento total", desc: "Desde la primera visita hasta la escritura. Y después también, si surge alguna duda." },
            ].map((item) => (
              <div key={item.num} className="bg-white rounded-xl p-6 border border-stone-100">
                <p className="text-orange-600 text-2xl font-bold mb-3">{item.num}</p>
                <h4 className="font-semibold text-stone-900 mb-2">{item.titulo}</h4>
                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-stone-950 text-stone-500 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© 2025 Inmobiliaria Liliana Cirigliano — Tandil, Buenos Aires</p>
          <div className="flex gap-6">
            <Link href="/propiedades" className="hover:text-white transition-colors">Propiedades</Link>
            <Link href="/nosotros" className="hover:text-white transition-colors">Nosotros</Link>
            <Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
