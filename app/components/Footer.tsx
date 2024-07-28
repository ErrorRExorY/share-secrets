// app/components/Footer.tsx
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>&copy; 2024 WhyWaitServices. Alle Rechte vorbehalten.</p>
      <div className={styles.links}>
        <a href="/privacy" className={styles.link}>Datenschutz</a>
        <a href="/terms" className={styles.link}>Nutzungsbedingungen</a>
      </div>
    </footer>
  );
}
