// app/message/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import homeStyles from '../../Home.module.css';

export default function MessagePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [retry, setRetry] = useState(false);

  useEffect(() => {
    // Remove the message ID from the URL immediately after the page loads
    window.history.replaceState(null, '', '/#hidden');
  }, []);

  const handleConfirm = async () => {
    try {
      // Reset error before new request
      setError(null);

      const response = await fetch(`/api/messages?id=${id}&password=${password}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setMessage(null);
        setRetry(true); // Allow retry
      } else {
        setMessage(data.content);
        setShowConfirmation(false);
        setRetry(false); // Disable retry after successful fetch
      }
    } catch {
      setError('Fehler beim Abrufen der Nachricht.');
      setRetry(true); // Allow retry on error
    }
  };

  const handleDecline = () => {
    setError('Sie haben sich entschieden, die Nachricht nicht zu lesen.');
    setShowConfirmation(false);
  };

  const handleRetry = () => {
    setRetry(false);
    setPassword('');
    setError(null);
  };

  return (
    <div className={homeStyles.container}>
      <Header />
      <div className={homeStyles.header}>
        <h1>Einmal-Nachrichten-System</h1>
        <p>Lesen Sie eine Nachricht, die nach einmaligem Lesen zerstört wird.</p>
      </div>
      {showConfirmation ? (
        <div className={homeStyles.form}>
          <p className={homeStyles.header}>Wollen Sie die Nachricht lesen?</p>
          <input
            className={homeStyles.input}
            type="password"
            placeholder="Passwort eingeben"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <div className={homeStyles.buttonContainer}>
            <button className={homeStyles.button} onClick={handleConfirm}>Ja</button>
            <button className={homeStyles.button} onClick={handleDecline}>Nein</button>
          </div>
          {retry && (
            <div className={homeStyles.retryContainer}>
              <button className={homeStyles.retryButton} onClick={handleRetry}>Erneut versuchen</button>
            </div>
          )}
          {error && <p className={homeStyles.error}>{error}</p>}
        </div>
      ) : (
        <div className={homeStyles.form}>
          {error ? <p className={homeStyles.error}>{error}</p> : <p className={homeStyles.message}>{message}</p>}
        </div>
      )}
      <Footer />
    </div>
  );
}