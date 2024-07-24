'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import Header from './components/Header';
import Footer from './components/Footer';
import styles from './Home.module.css';

export default function Home() {
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [expiry, setExpiry] = useState('');
  const [link, setLink] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, password, expiry }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Erstellen der Nachricht');
      }

      const data = await response.json();
      const messageLink = `${window.location.origin}/message/${data.id}`;
      setLink(messageLink);

      navigator.clipboard.writeText(messageLink).then(() => {
        toast.success('Der Link wurde in die Zwischenablage kopiert!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });
      }).catch(() => {
        toast.error('Fehler beim Kopieren des Links in die Zwischenablage.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark',
        });
      });

      setContent('');
      setPassword('');
      setExpiry('');
    } catch (error) {
      toast.error('Fehler beim Erstellen der Nachricht.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <header className={styles.header}>
        <h1>Einmal-Nachrichten-System</h1>
        <p>Erstellen Sie eine Nachricht, die nach einmaligem Lesen zerstört wird.</p>
        <p>Optionen:</p>
        <ul>
          <li>Passwortschutz für zusätzliche Sicherheit</li>
          <li>Ablaufzeit für zeitlich begrenzte Nachrichten</li>
        </ul>
      </header>
      <form className={styles.form} onSubmit={handleSubmit}>
        <textarea
          className={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <input
          className={styles.input}
          type="password"
          placeholder="Passwort (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className={styles.input}
          type="datetime-local"
          placeholder="Ablaufzeit (optional)"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        />
        <button className={styles.button} type="submit">Nachricht erstellen</button>
      </form>
      {link && (
        <div className={styles.linkContainer}>
          <p>Einmaliger Link:</p>
          <a className={styles.link} href={link}>{link}</a>
        </div>
      )}
      
    </div>
  );
}
