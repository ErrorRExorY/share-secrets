import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <a href="/" className={styles.navItem}>Home</a>
        <a href="/about" className={styles.navItem}>About</a>
        <a href="/contact" className={styles.navItem}>Contact</a>
      </nav>
    </header>
  );
}
