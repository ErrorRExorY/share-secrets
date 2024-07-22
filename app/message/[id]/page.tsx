'use client';

import { useState } from 'react';
import styles from './MessagePage.module.css';

export default function MessagePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');

  const handleConfirm = async () => {
    try {
      const response = await fetch(`/api/messages?id=${id}&password=${password}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setMessage(null);
      } else {
        setMessage(data.content);
        setShowConfirmation(false);
      }
    } catch {
      setError('Fehler beim Abrufen der Nachricht.');
    }
  };

  const handleDecline = () => {
    setError('Sie haben sich entschieden, die Nachricht nicht zu lesen.');
    setShowConfirmation(false);
  };

  return (
    <div className={styles.container}>
      {showConfirmation ? (
        <div>
          <p className={styles.header}>Wollen Sie die Nachricht lesen?</p>
          <input
            className={styles.input}
            type="password"
            placeholder="Passwort eingeben"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={handleConfirm}>Ja</button>
            <button className={styles.button} onClick={handleDecline}>Nein</button>
          </div>
        </div>
      ) : (
        <div>
          {error ? <p className={styles.error}>{error}</p> : <p className={styles.message}>{message}</p>}
        </div>
      )}
    </div>
  );
}
