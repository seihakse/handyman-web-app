// src/app/api/auth/signin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { $Enums } from '@prisma/client';
type UserRole = $Enums.UserRole;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@handypro.com';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    let user = null;

    if (email === ADMIN_EMAIL) {
      const adminUser = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

      if (!adminUser) {
        // First-time admin bootstrap
        const hashedPassword = await bcrypt.hash(password, 12);
        user = await prisma.user.create({
          data: {
            name: 'System Admin',
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin' as UserRole,
            phone: null,
            address: null,
          },
        });
      } else {
        const isValid = await bcrypt.compare(password, adminUser.password);
        if (!isValid) {
          return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
        user = adminUser;
      }
    } else {
      user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
    }

    // Strip password before sending / storing
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json(userWithoutPassword);

    // ── Single cookie used by: session route, reviews API, reports API ──
    // Stored as the full safe user object so any route can read id, role, etc.
    response.cookies.set({
      name: 'current-user',
      value: JSON.stringify(userWithoutPassword),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[POST /api/auth/signin]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}