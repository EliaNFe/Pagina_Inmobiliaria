import styles from "./propiedades.module.css"

export default function Loading() {
  return <main className={styles.page} aria-label="Cargando propiedades" aria-busy="true"><div className={styles.loadingHero} /><section className={styles.catalogue}><div className={styles.container}><div className={styles.loadingToolbar} /><div className={styles.grid}>{Array.from({ length: 6 }, (_, i) => <div key={i} className={`${styles.loadingCard} property-skeleton`} />)}</div></div></section></main>
}
