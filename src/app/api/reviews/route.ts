// src/app/api/admin/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/admin/reviews?page=1&limit=20
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page  = Math.max(1, parseInt(searchParams.get('page')  ?? '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'));
    const skip  = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reviewer: { select: { id: true, name: true, email: true, profilePicture: true } },
          reviewee: { select: { id: true, name: true, profilePicture: true } },
          handyman: { select: { id: true, userId: true } },
        },
      }),
      prisma.review.count(),
    ]);

    return NextResponse.json({ reviews, total, page, limit });
  } catch (error) {
    console.error('[GET /api/admin/reviews]', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}