// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './Dashboard.module.css';
import { useSession } from 'next-auth/react';
import SessionProvider from '../components/SessionProvider';

interface Message {
  id: string;
  content: string;
  expiry: string;
}

const Dashboard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [expiry, setExpiry] = useState('');
  const [link, setLink] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/user/messages', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        setMessages(data);
      } catch (error) {
        toast.error('Error fetching messages', {
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

    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/user/messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      setMessages(messages.filter((message) => message.id !== id));
      toast.success('Message deleted successfully', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    } catch (error) {
      toast.error('Error deleting message', {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/messages', {
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
        <h1>User Dashboard</h1>
      </header>
      <div className={styles.content}>
        <h2>Your Messages</h2>
        {messages.length > 0 ? (
          <ul className={styles.messageList}>
            {messages.map((message) => (
              <li key={message.id} className={styles.messageItem}>
                <div>
                  <p>{message.content}</p>
                  <p>Expiry: {new Date(message.expiry).toLocaleString()}</p>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(message.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No messages found.</p>
        )}

        <h2>Create a New Message</h2>
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
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function Page() {
  return (
    <SessionProvider>
      <Dashboard />
    </SessionProvider>
  );
};
