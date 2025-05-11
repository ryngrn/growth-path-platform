import NextAuth, { type NextAuthConfig } from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User, { IUser } from '@/models/User';
import type { JWT } from 'next-auth/jwt';
import type { User as NextAuthUser } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id?: string | null;
    email?: string | null;
    name?: string | null;
  }

  interface Session {
    user: {
      id?: string | null;
      email?: string | null;
      name?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string | null;
    name?: string | null;
    email?: string | null;
  }
}

export const authOptions: NextAuthConfig = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Invalid credentials');
          }

          await connectDB();
          const user = await User.findOne({ email: credentials.email });

          if (!user || !user?.password) {
            throw new Error('Invalid credentials');
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password as string,
            user.password as string
          );

          if (!isCorrectPassword) {
            throw new Error('Invalid credentials');
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.firstName,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      try {
        if (trigger === 'update' && session?.user) {
          token.name = session.user.name;
          token.email = session.user.email;
        }
        
        if (user) {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
        }
        return token;
      } catch (error) {
        console.error('JWT callback error:', error);
        throw error;
      }
    },
    async session({ session, token }) {
      try {
        if (token) {
          session.user = {
            id: token.id || '',
            email: token.email || null,
            name: token.name || null,
          };
        }
        return session;
      } catch (error) {
        console.error('Session callback error:', error);
        throw error;
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(authOptions); 