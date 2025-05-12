import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/server/mongodb';
import { User as UserModel } from '@/models/User';
import { compare } from 'bcryptjs';
import clientPromise from '@/lib/server/mongodb-adapter';
import { ObjectId } from 'mongodb';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';

// Define types for next-auth
interface User {
  id: string;
  email: string;
  name?: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  firstName?: string;
  familyName?: string;
}

interface Session {
  user: User;
}

interface JWT {
  id: string;
  email: string;
  name?: string;
  emailVerified?: Date;
  image?: string;
}

// Add server-side only check
if (typeof window !== 'undefined') {
  throw new Error('This module can only be used on the server side');
}

declare module 'next-auth' {
  interface User {
    id?: string | null;
    email?: string | null;
    name?: string | null;
    emailVerified?: Date | null;
    image?: string | null;
  }

  interface Session {
    user: {
      id?: string | null;
      email?: string | null;
      name?: string | null;
      emailVerified?: Date | null;
      image?: string | null;
    };
  }
}

export const authConfig = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectToDatabase();
          const email = String(credentials.email).toLowerCase();
          const user = await UserModel.findOne({ email });

          if (!user) {
            return null;
          }

          const password = String(credentials.password);
          const hashedPassword = String(user.password);
          const isValid = await compare(password, hashedPassword);

          if (!isValid) {
            return null;
          }

          return {
            ...user,
            id: (user._id as ObjectId).toString(),
            emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
            email: user.email || null,
          } as User;
        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.emailVerified = user.emailVerified;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user = {
          id: token.id as string || '',
          email: token.email as string || '',
          name: token.name as string || '',
          emailVerified: token.emailVerified as Date | null || null,
          image: token.image as string | null || null,
        };
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: '__Secure-next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: true,
      },
    },
    callbackUrl: {
      name: '__Secure-next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: true,
      },
    },
    csrfToken: {
      name: '__Host-next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
        path: '/',
        secure: true,
      },
    },
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code: string, metadata: Error | { [key: string]: unknown; error: Error }) {
      if (process.env.NODE_ENV === 'development') {
        console.error('NextAuth error:', code, metadata);
      }
    },
    warn(code: string) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('NextAuth warn:', code);
      }
    },
    debug(code: string, metadata?: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('NextAuth debug:', code, metadata);
      }
    },
  },
};