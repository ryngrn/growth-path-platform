import NextAuth, { type NextAuthConfig } from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { compare } from 'bcryptjs';
import clientPromise from '@/lib/mongodb-adapter';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';

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
  }

  interface Session {
    user: {
      id?: string | null;
      email?: string | null;
      name?: string | null;
      emailVerified?: Date | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    emailVerified?: Date | null;
  }
}

export const authOptions: NextAuthConfig = {
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
          const user = await User.findOne({ email });

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
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            emailVerified: user.emailVerified,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user = {
          id: token.id || '',
          email: token.email || '',
          name: token.name || '',
          emailVerified: token.emailVerified || null,
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
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
    callbackUrl: {
      name: '__Secure-next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
    csrfToken: {
      name: '__Host-next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(error: Error) {
      console.error('NextAuth error:', error);
    },
    warn(message: string) {
      console.warn('NextAuth warning:', message);
    },
    debug(message: string, metadata?: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.log('NextAuth debug:', message, metadata);
      }
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions);

// Export getServerSession separately
export const getServerSession = async () => {
  const session = await auth();
  return session;
}; 