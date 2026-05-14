// src/app/api/admin/handymen/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/admin/handymen?status=pending|approved|all
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') ?? 'pending';

    const where =
      status === 'pending'
        ? { isApproved: false, isBanned: false }
        : status === 'approved'
        ? { isApproved: true, isBanned: false }
        : status === 'paused'
        ? { isPaused: true, isBanned: false }
        : status === 'banned'
        ? { isBanned: true }
        : {}; // 'all'

    const handymen = await prisma.handymanProfile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        bio: true,
        skills: true,
        rating: true,
        totalReviews: true,
        availability: true,
        isApproved: true,
        isPaused: true,
        isBanned: true,
        yearsOfExperience: true,
        serviceArea: true,
        telegramUsername: true,
        createdAt: true,
        user: {
          select: { id: true, name: true, email: true, profilePicture: true },
        },
      },
    });

    return NextResponse.json({ handymen });
  } catch (error) {
    console.error('[ADMIN GET HANDYMEN]', error);
    return NextResponse.json({ error: 'Failed to fetch handymen' }, { status: 500 });
  }
}