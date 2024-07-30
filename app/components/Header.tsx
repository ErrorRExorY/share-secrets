import { useSession, signIn, signOut } from 'next-auth/react';
import styles from './Header.module.css';

export default function Header() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <header className={styles.header}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <a href="/" className={styles.navItem}>Home</a>
        <a href="/about" className={styles.navItem}>About</a>
        <a href="/contact" className={styles.navItem}>Contact</a>
        {session ? (
          <>
            <a href="/profile" className={styles.navItem}>Profile</a>
            <button onClick={() => signOut()} className={styles.navItem}>Logout</button>
          </>
        ) : (
          <button onClick={() => signIn()} className={styles.navItem}>Login</button>
        )}
      </nav>
    </header>
  );
}
