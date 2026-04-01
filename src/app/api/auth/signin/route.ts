// app/api/auth/signin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Use Prisma's UserRole type
import { $Enums } from '@prisma/client';
type UserRole = $Enums.UserRole;

// You can set admin credentials in environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@handypro.com';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH; // Pre-hashed admin password

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Special handling for admin
    let user = null;
    let isAdminUser = false;

    if (email === ADMIN_EMAIL) {
      // Check if admin exists in database, if not, create admin user
      const adminUser = await prisma.user.findUnique({
        where: { email: ADMIN_EMAIL }
      });

      if (!adminUser) {
        // Create admin user if it doesn't exist
        const hashedPassword = await bcrypt.hash(password, 12);
        user = await prisma.user.create({
          data: {
            name: 'System Admin',
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin' as UserRole,
            phone: null,
            address: null,
          }
        });
        isAdminUser = true;
      } else {
        user = adminUser;
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          );
        }
        isAdminUser = user.role === ('admin' as UserRole);
      }
    } else {
      // Regular user authentication
      user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json(userWithoutPassword);
    
    // Set session cookie
    response.cookies.set({
      name: 'session',
      value: JSON.stringify({ userId: user.id, role: user.role }),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}