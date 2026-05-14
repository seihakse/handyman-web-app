// src/app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,       // ← was missing; drives the "Type" column
        createdAt: true,
        handymanProfile: {
          select: {
            id: true,
            isApproved: true,
            isPaused: true,
            isBanned: true,
            rating: true,
          },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('[ADMIN GET USERS]', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}