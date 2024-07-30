'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../Home.module.css';
import SessionProvider from '../components/SessionProvider';

const AboutPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header />
      <header className={styles.header}>
        <h1>Über das Einmal-Nachrichten-System</h1>
        <p>Das Einmal-Nachrichten-System ermöglicht es Ihnen, Nachrichten zu erstellen, die nach einmaligem Lesen zerstört werden. Dies bietet eine zusätzliche Sicherheitsschicht für vertrauliche Informationen.</p>
        <h2>Funktionen</h2>
        <ul>
          <li>Passwortschutz für zusätzliche Sicherheit</li>
          <li>Ablaufzeit für zeitlich begrenzte Nachrichten</li>
        </ul>
        <h2>Verwendung</h2>
        <ol>
          <li>Erstellen Sie eine Nachricht und optional ein Passwort und eine Ablaufzeit.</li>
          <li>Teilen Sie den generierten Link mit dem Empfänger.</li>
          <li>Die Nachricht wird nach einmaligem Lesen zerstört.</li>
        </ol>
      </header>
      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <SessionProvider>
      <AboutPage />
    </SessionProvider>
  );
};
