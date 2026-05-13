// src/app/api/admin/reports/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json(); // 'REVIEWED' | 'RESOLVED' | 'DISMISSED'

    const validStatuses = ['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // @ts-ignore — Report model exists after `npx prisma generate`
    const updated = await prisma.report.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ report: updated });
  } catch (error) {
    console.error('[ADMIN PATCH REPORT]', error);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}