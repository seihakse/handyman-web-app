// src/app/api/handyman/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const profile = await prisma.handymanProfile.findUnique({
      where: {
        id,
        isApproved: true,
        isPaused:   false,
        isBanned:   false,
      },
      select: {
        id:                true,
        bio:               true,
        skills:            true,
        certificate:       true,
        idCardImage:       true,
        portfolioImage:    true,
        availability:      true,
        rating:            true,
        totalReviews:      true,
        isApproved:        true,
        telegramUsername:  true,
        yearsOfExperience: true,
        serviceArea:       true,
        category: {
          select: { id: true, name: true },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: {
            id:        true,
            rating:    true,
            comment:   true,
            createdAt: true,
            reviewer: {
              select: {
                name:           true,
                profilePicture: true,
              },
            },
          },
        },
        user: {
          select: {
            id:             true,
            name:           true,
            email:          true,
            phone:          true,
            profilePicture: true,
            address:        true,
            createdAt:      true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const { user, ...rest } = profile;
    return NextResponse.json({
      id:              user.id,
      name:            user.name,
      email:           user.email,
      phone:           user.phone,
      profilePicture:  user.profilePicture,
      address:         user.address,
      createdAt:       user.createdAt,
      handymanProfile: rest,
    });

  } catch (error) {
    console.error('[GET /api/handyman/[id]]', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}