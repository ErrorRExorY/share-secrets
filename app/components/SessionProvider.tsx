// components/SessionProvider.tsx
'use client';

import { ReactNode } from 'react';
import { SessionProvider as NextAuthProvider } from 'next-auth/react';

interface SessionProviderProps {
  children: ReactNode;
}

export default function SessionProvider({ children }: SessionProviderProps) {
  return <NextAuthProvider>{children}</NextAuthProvider>;
}
