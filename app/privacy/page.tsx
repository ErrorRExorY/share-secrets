'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../Home.module.css';

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <Header />
      <header className={styles.header}>
        <h1>Datenschutzrichtlinie</h1>
        <p>Wir legen großen Wert auf den Schutz Ihrer persönlichen Daten. Diese Datenschutzrichtlinie erklärt, wie wir Ihre Daten sammeln, verwenden und schützen.</p>
        <h2>Sammlung und Nutzung von Daten</h2>
        <p>Wir sammeln nur die minimal erforderlichen Daten, um unseren Service bereitzustellen und zu verbessern. Ihre Nachrichteninhalte und Passwörter werden verschlüsselt gespeichert und nach dem ersten Lesen gelöscht.</p>
        <h2>Weitergabe von Daten</h2>
        <p>Wir geben Ihre Daten nicht an Dritte weiter, außer wenn dies gesetzlich vorgeschrieben ist oder um unsere Nutzungsbedingungen durchzusetzen.</p>
        <h2>Sicherheit</h2>
        <p>Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten vor unbefugtem Zugriff und Missbrauch zu schützen.</p>
        <h2>Änderungen an dieser Richtlinie</h2>
        <p>Wir können diese Datenschutzrichtlinie von Zeit zu Zeit aktualisieren. Änderungen werden auf dieser Seite veröffentlicht.</p>
      </header>
      <Footer />
    </div>
  );
}
