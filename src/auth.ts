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
    id?: string;
    email?: string | null;
    name?: string | null;
  }

  interface Session {
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    name?: string | null;
    email?: string | null;
  }
}

export const authOptions: NextAuthConfig = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
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
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session?.user) {
        token.name = session.user.name || null;
        token.email = session.user.email || null;
      }
      
      if (user) {
        token.id = user.id || '';
        token.email = user.email || null;
        token.name = user.name || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id || '';
        session.user.email = token.email || null;
        session.user.name = token.name || null;
      }
      return session;
    },
  },
};

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(authOptions); 