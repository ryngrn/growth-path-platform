import { config } from '@/auth';
import NextAuth from 'next-auth';
import type { NextRequest } from 'next/server';

const handler = NextAuth(config);

export const GET = handler;
export const POST = handler; 