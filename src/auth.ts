import NextAuth from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';
import { authOptions } from './app/utils/authOptions';

declare module 'next-auth' {
  interface User {
    id?: string;
    email?: string | null;
    name?: string | null;
    familyName?: string;
  }

  interface Session {
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      familyName?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    familyName?: string;
  }
}

export const { auth, signIn, signOut } = NextAuth(authOptions); 