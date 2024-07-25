'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../Home.module.css';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Senden der Nachricht');
      }

      toast.success('Nachricht erfolgreich gesendet!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });

      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      toast.error('Fehler beim Senden der Nachricht.', {
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
        <h1>Kontaktieren Sie uns</h1>
        <p>Haben Sie Fragen oder Anmerkungen? Füllen Sie das untenstehende Formular aus, um uns eine Nachricht zu senden.</p>
      </header>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          placeholder="Ihr Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="email"
          placeholder="Ihre E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <textarea
          className={styles.textarea}
          placeholder="Ihre Nachricht"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
        <div className={styles.buttonContainer}>
          <button className={styles.button} type="submit">Nachricht senden</button>
        </div>
      </form>
      <Footer />
    </div>
  );
}
