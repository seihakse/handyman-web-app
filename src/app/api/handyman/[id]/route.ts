// app/api/handyman/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        profilePicture: true,
        address: true,
        createdAt: true,
        role: true,
        handymanProfile: {
          select: {
            bio: true,
            skills: true,
            certificate: true,
            portfolioImage: true,
            availability: true,
            rating: true,
            totalReviews: true,
            isApproved: true,
            telegramUsername: true,
            yearsOfExperience: true,
            serviceArea: true,
          },
        },
      },
    });

    if (!user || user.role !== 'handyman') {
      return NextResponse.json({ error: 'Handyman not found' }, { status: 404 });
    }

    if (!user.handymanProfile?.isApproved) {
      return NextResponse.json({ error: 'Profile not available' }, { status: 403 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Fetch handyman profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}