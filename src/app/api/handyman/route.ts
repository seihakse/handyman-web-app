// src/app/api/handyman/route.ts
// Returns only APPROVED handymen for the public listing and home page
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const handymen = await prisma.handymanProfile.findMany({
      where: { isApproved: true },
      orderBy: { rating: 'desc' },
      select: {
        id: true,
        userId: true,
        bio: true,
        skills: true,
        rating: true,
        totalReviews: true,
        availability: true,
        isApproved: true,
        yearsOfExperience: true,
        serviceArea: true,
        telegramUsername: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ handymen });
  } catch (error) {
    console.error('[GET HANDYMEN]', error);
    return NextResponse.json({ error: 'Failed to fetch handymen' }, { status: 500 });
  }
}