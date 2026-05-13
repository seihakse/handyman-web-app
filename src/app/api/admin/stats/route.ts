// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const [
      totalUsers,
      totalHandymen,
      pendingApprovals,
      approvedHandymen,
      totalReports,
      pendingReports,
      totalCategories,
      totalReviews,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.handymanProfile.count(),
      prisma.handymanProfile.count({ where: { isApproved: false } }),
      prisma.handymanProfile.count({ where: { isApproved: true } }),
      prisma.report.count(),
      // @ts-ignore — remove after npx prisma generate
      prisma.report.count({ where: { status: 'PENDING' } }),
      prisma.serviceCategory.count(),
      // @ts-ignore — remove after npx prisma generate
      prisma.review.count(),
    ]);

    return NextResponse.json({
      totalUsers,
      totalHandymen,
      pendingApprovals,
      approvedHandymen,
      totalReports,
      pendingReports,
      totalCategories,
      totalReviews,
    });
  } catch (error) {
    console.error('[GET /api/admin/stats]', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}