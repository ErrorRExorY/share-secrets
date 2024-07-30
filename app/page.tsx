// app/page.tsx
'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import Header from './components/Header';
import Footer from './components/Footer';
import styles from './Home.module.css';
import SessionProvider from './components/SessionProvider';
import { useSession } from 'next-auth/react';

const Home: React.FC = () => {
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [expiry, setExpiry] = useState('');
  const [link, setLink] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const { data: session, status } = useSession();

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

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
          placeholder="Nachricht (max. 2500 Zeichen)"
        ></textarea>
        <div className={styles.optionsContainer}>
          {showOptions && (
            <>
              <input
                className={styles.input}
                type="password"
                placeholder="Passwort (optional, min. 6, max. 100 Zeichen)"
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
            </>
          )}
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.button} type="submit">Nachricht erstellen</button>
          <button 
            className={styles.button} 
            type="button" 
            onClick={() => setShowOptions(!showOptions)}
          >
            Optionen {showOptions ? 'ausblenden' : 'einblenden'}
          </button>
        </div>
      </form>
      {link && (
        <div className={styles.linkContainer}>
          <p>Einmaliger Link:</p>
          <a className={styles.link} href={link} target="_blank" rel="noopener noreferrer">{link}</a>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <SessionProvider>
      <Home />
    </SessionProvider>
  );
};