import Link from "next/link"
import styles from "./privacidad.module.css"

export const metadata = { title: "Política de Privacidad | Inmobiliaria Liliana Cirigliano", description: "Información sobre el uso de datos y privacidad en el sitio de Inmobiliaria Liliana Cirigliano." }

export default function PrivacidadPage() {
  return <main className={styles.page}>
    <article className={styles.content}>
      <p className={styles.eyebrow}>Inmobiliaria Liliana Cirigliano</p>
      <h1>Política de Privacidad</h1>
      <p className={styles.updated}>Última actualización: 24 de septiembre de 2026</p>
      <p>Queremos contarte de forma sencilla qué información se utiliza cuando visitás este sitio y cómo se maneja.</p>
      <section><h2>Consultas por WhatsApp</h2><p>El formulario de consulta solicita tu nombre, un email opcional y un mensaje. Esa información no se envía a un servidor propio ni se guarda en una base de datos del sitio. Al continuar, se prepara un mensaje y se te redirige directamente a WhatsApp, al número de la inmobiliaria. Meta, responsable de WhatsApp, procesa ese mensaje como cualquier otra conversación que inicies en su servicio.</p></section>
      <section><h2>Mapa de Google</h2><p>La página de Contacto incluye un mapa de Google Maps integrado. Al cargarlo, Google puede utilizar sus propias cookies y tecnologías según sus políticas.</p></section>
      <section><h2>Panel de administración</h2><p>El panel de administración es de uso exclusivamente interno y no está destinado a visitantes. Utiliza Supabase para autenticar a la persona administradora. Ese inicio de sesión puede generar cookies técnicas de sesión, necesarias para mantener la autenticación.</p><p>Para limitar los intentos de acceso al panel, el sistema registra temporalmente la dirección IP de los intentos de inicio de sesión. Esta medida de seguridad interna no se aplica a quienes consultan por propiedades.</p></section>
      <section><h2>Registros técnicos del alojamiento</h2><p>Vercel, proveedor de alojamiento del sitio, puede generar registros técnicos básicos, como la dirección IP y el navegador (user-agent), y conservarlos por un tiempo limitado como parte de la prestación del servicio.</p></section>
      <section><h2>Responsable y consultas</h2><p>La responsable de los datos es Liliana Cirigliano. Si tenés alguna consulta sobre tus datos o sobre esta política, podés escribir a <a href="mailto:LILYCIRIGLIANO@YAHOO.COM.AR">LILYCIRIGLIANO@YAHOO.COM.AR</a>.</p></section>
      <Link className={styles.back} href="/">Volver al inicio</Link>
    </article>
  </main>
}
