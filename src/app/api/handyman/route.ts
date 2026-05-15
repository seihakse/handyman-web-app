// src/app/api/handyman/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');   // filter by category
    const area       = searchParams.get('area');          // filter by serviceArea

    const handymen = await prisma.handymanProfile.findMany({
      where: {
        isApproved: true,
        isPaused:   false,
        isBanned:   false,
        ...(categoryId ? { categoryId } : {}),
        ...(area ? { serviceArea: { contains: area, mode: 'insensitive' } } : {}),
      },
      orderBy: { rating: 'desc' },
      select: {
        id:                true,
        userId:            true,
        bio:               true,
        skills:            true,
        rating:            true,
        totalReviews:      true,
        availability:      true,
        isApproved:        true,
        yearsOfExperience: true,
        serviceArea:       true,
        telegramUsername:  true,
        createdAt:         true,
        category: {
          select: { id: true, name: true },
        },
        user: {
          select: {
            id:             true,
            name:           true,
            profilePicture: true,
            address:        true,
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