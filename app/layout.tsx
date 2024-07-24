import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importiere die CSS für die Toast-Nachrichten

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OneTime Message",
  description: "Encrypted with Vault",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {/* Füge ToastContainer am Ende des Layouts hinzu */}
        <ToastContainer
          position="top-right" // Position der Toast-Nachricht
          autoClose={5000}    // Automatische Schließzeit in Millisekunden
          hideProgressBar={false} // Fortschrittsbalken anzeigen
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
          theme="dark" // Verwende das dunkle Theme für Toasts
        />
      </body>
    </html>
  );
}
