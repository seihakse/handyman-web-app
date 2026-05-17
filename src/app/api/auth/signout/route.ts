// src/app/api/auth/signout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Signed out' });

  response.cookies.set({
    name: 'current-user',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // immediately expire
    path: '/',
  });

  return response;
}