import NextAuth from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { compare } from 'bcryptjs';
import clientPromise from '@/lib/mongodb-adapter';

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

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
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
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error('Missing credentials');
            return null;
          }

          let db;
          try {
            db = await connectToDatabase();
            console.log('Connected to database successfully');
          } catch (dbError) {
            console.error('Database connection error:', dbError);
            throw new Error('Unable to connect to database');
          }

          let user;
          try {
            const email = String(credentials.email).toLowerCase();
            user = await User.findOne({ email });
            console.log('User lookup result:', user ? 'User found' : 'User not found');
          } catch (userError) {
            console.error('User lookup error:', userError);
            throw new Error('Error looking up user');
          }

          if (!user) {
            console.error('No user found with email:', credentials.email);
            return null;
          }

          let isValid;
          try {
            const password = String(credentials.password);
            const hashedPassword = String(user.password);
            isValid = await compare(password, hashedPassword);
            console.log('Password validation result:', isValid ? 'Valid' : 'Invalid');
          } catch (compareError) {
            console.error('Password comparison error:', compareError);
            throw new Error('Error validating password');
          }

          if (!isValid) {
            console.error('Invalid password for user:', credentials.email);
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
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
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
    csrfToken: {
      name: `__Host-next-auth.csrf-token`,
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
}); 