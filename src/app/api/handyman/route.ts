// app/api/handyman/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const handymen = await prisma.user.findMany({
      where: {
        role: 'handyman',
        handymanProfile: {
          isApproved: true,
        },
      },
      select: {
        id: true,
        name: true,
        profilePicture: true,
        address: true,
        handymanProfile: {
          select: {
            bio: true,
            skills: true,
            availability: true,
            rating: true,
            totalReviews: true,
            isApproved: true,
            yearsOfExperience: true,
            serviceArea: true,
            telegramUsername: true,
          },
        },
      },
      orderBy: {
        handymanProfile: {
          rating: 'desc',
        },
      },
    });

    return NextResponse.json(handymen);
  } catch (error) {
    console.error('Fetch handymen error:', error);
    return NextResponse.json({ error: 'Failed to fetch handymen' }, { status: 500 });
  }
}