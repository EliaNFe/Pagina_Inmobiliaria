import styles from "./detalle.module.css"

export default function LoadingDetalle() {
  return (
    <main className={styles.loading} aria-label="Cargando propiedad" aria-busy="true">
      <div className={styles.loadingHero}><span /><span /><span /></div>
      <div className={styles.loadingGallery} />
      <div className={styles.loadingContent}><div><span /><span /><span /></div><aside /></div>
    </main>
  )
}
