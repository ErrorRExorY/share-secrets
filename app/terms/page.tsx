'use client';

import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../Home.module.css';

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <Header />
      <header className={styles.header}>
        <h1>Nutzungsbedingungen</h1>
        <p>Diese Nutzungsbedingungen regeln Ihre Nutzung des Einmal-Nachrichten-Systems. Durch die Nutzung des Dienstes stimmen Sie diesen Bedingungen zu.</p>
        <h2>Verwendung des Dienstes</h2>
        <p>Sie verpflichten sich, den Dienst nur für rechtmäßige Zwecke zu nutzen und keine Inhalte zu erstellen, die illegal, beleidigend oder anderweitig unangemessen sind.</p>
        <h2>Verantwortung für Inhalte</h2>
        <p>Sie sind allein verantwortlich für die Inhalte, die Sie über den Dienst erstellen und teilen. Wir übernehmen keine Haftung für die von Ihnen erstellten Inhalte.</p>
        <h2>Datenschutz</h2>
        <p>Unsere Datenschutzrichtlinie erklärt, wie wir Ihre persönlichen Daten behandeln und schützen. Durch die Nutzung des Dienstes stimmen Sie der Erfassung und Verwendung Ihrer Daten gemäß unserer Datenschutzrichtlinie zu.</p>
        <h2>Änderungen der Nutzungsbedingungen</h2>
        <p>Wir können diese Nutzungsbedingungen von Zeit zu Zeit ändern. Änderungen werden auf dieser Seite veröffentlicht. Durch die fortgesetzte Nutzung des Dienstes nach Veröffentlichung der Änderungen stimmen Sie den geänderten Bedingungen zu.</p>
        <h2>Haftungsausschluss</h2>
        <p>Der Dienst wird &ldquo;wie besehen&rdquo; ohne jegliche Gewährleistung bereitgestellt. Wir übernehmen keine Haftung für Schäden, die aus der Nutzung des Dienstes entstehen.</p>
      </header>
      <Footer />
    </div>
  );
}
