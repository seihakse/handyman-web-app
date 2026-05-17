// src/app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // ── Auth: read current-user cookie (same pattern as session route) ──
    const cookieValue = request.cookies.get('current-user')?.value;
    if (!cookieValue) {
      return NextResponse.json({ error: 'You must be logged in to leave a review' }, { status: 401 });
    }

    let currentUser: { id: string; role: string };
    try {
      currentUser = JSON.parse(cookieValue);
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // ── Parse body ──
    const body = await request.json();
    const { handymanId, rating, comment } = body;

    // ── Validate ──
    if (!handymanId || typeof handymanId !== 'string') {
      return NextResponse.json({ error: 'handymanId is required' }, { status: 400 });
    }
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be a number between 1 and 5' }, { status: 400 });
    }
    if (comment && comment.trim().length < 10) {
      return NextResponse.json({ error: 'Review must be at least 10 characters' }, { status: 400 });
    }

    // ── Fetch the handyman profile to get revieweeId (the handyman's userId) ──
    const handymanProfile = await prisma.handymanProfile.findUnique({
      where: { id: handymanId, isApproved: true, isPaused: false, isBanned: false },
      select: { id: true, userId: true, rating: true, totalReviews: true },
    });

    if (!handymanProfile) {
      return NextResponse.json({ error: 'Handyman not found' }, { status: 404 });
    }

    // ── Prevent handyman from reviewing themselves ──
    if (handymanProfile.userId === currentUser.id) {
      return NextResponse.json({ error: 'You cannot review yourself' }, { status: 403 });
    }

    // ── Create review + recompute rating in a transaction ──
    const result = await prisma.$transaction(async (tx) => {
      // Create the review (will throw on duplicate @@unique[reviewerId, handymanId])
      const review = await tx.review.create({
        data: {
          reviewerId: currentUser.id,
          handymanId: handymanProfile.id,
          revieweeId: handymanProfile.userId,
          rating,
          comment: comment?.trim() || null,
        },
        include: {
          reviewer: { select: { id: true, name: true, profilePicture: true } },
        },
      });

      // Recompute rating & totalReviews from the reviews table (source of truth)
      const aggregate = await tx.review.aggregate({
        where: { handymanId: handymanProfile.id },
        _avg: { rating: true },
        _count: { id: true },
      });

      const newRating = parseFloat((aggregate._avg.rating ?? 0).toFixed(1));
      const newTotal  = aggregate._count.id;

      await tx.handymanProfile.update({
        where: { id: handymanProfile.id },
        data: { rating: newRating, totalReviews: newTotal },
      });

      return { review, newRating, newTotal };
    });

    return NextResponse.json(
      {
        message: 'Review posted successfully',
        review: result.review,
        updatedRating: result.newRating,
        updatedTotalReviews: result.newTotal,
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Prisma unique constraint violation → already reviewed
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'You have already reviewed this handyman' },
        { status: 409 }
      );
    }
    console.error('[POST /api/reviews]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}