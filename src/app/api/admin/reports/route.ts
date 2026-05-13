// src/app/api/admin/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where = status && status !== 'ALL' ? { status } : {};

    // @ts-ignore — Report model exists after `npx prisma generate`
    const reports = await prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        handyman: {
          select: {
            user: { select: { name: true } },
          },
        },
      },
    });

    const formatted = reports.map((r: any) => ({
      id: r.id,
      handymanId: r.handymanId,
      handymanName: r.handyman?.user?.name ?? 'Unknown',
      reason: r.reason,
      description: r.description,
      status: r.status,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({ reports: formatted });
  } catch (error) {
    console.error('[ADMIN GET REPORTS]', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}