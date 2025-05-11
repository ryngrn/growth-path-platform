import NextAuth from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { compare } from 'bcryptjs';
import clientPromise from '@/lib/mongodb-adapter';
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

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
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
          throw new Error('Email and password are required');
        }

        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found with this email');
        }

        const isValid = await compare(
          credentials.password as string,
          user.password as string
        );

        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
}); 