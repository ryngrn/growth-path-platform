import 'next-auth';
import { JWT } from 'next-auth/jwt';

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