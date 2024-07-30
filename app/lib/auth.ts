// app/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { findUserByEmail, comparePassword } from '@/app/models/User';

interface CredentialInput {
  email: string;
  password: string;
}

interface User {
  id: number;
  email: string;
  username: string;
  password: string;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      userId: number;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: number;
    userId: number;
    email: string;
    name: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('Credentials are required');
        }

        const { email, password } = credentials as CredentialInput;

        try {
          const user = await findUserByEmail(email);

          if (!user) {
            throw new Error('No user found with the provided email');
          }

          const isValidPassword = await comparePassword(user.password, password);

          if (!isValidPassword) {
            throw new Error('Invalid password');
          }

          // Ensure the returned object matches the User interface
          return {
            id: user.id,
            userId: user.id,
            email: user.email,
            name: user.username,
            // Optionally add more fields if needed
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw new Error('Invalid credentials');
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as number;
        session.user.userId = token.id as number;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  debug: false,
};
