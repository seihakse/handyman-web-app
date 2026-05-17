// src/app/api/admin/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ReportStatus } from '@prisma/client';

const UI_TO_DB: Record<string, ReportStatus> = {
  PENDING:   ReportStatus.PENDING,
  REVIEWED:  ReportStatus.UNDER_REVIEW,
  RESOLVED:  ReportStatus.RESOLVED,
  DISMISSED: ReportStatus.DISMISSED,
};

const DB_TO_UI: Record<ReportStatus, string> = {
  PENDING:      'PENDING',
  UNDER_REVIEW: 'REVIEWED',
  RESOLVED:     'RESOLVED',
  DISMISSED:    'DISMISSED',
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status') ?? 'ALL';

    const where =
      statusFilter === 'ALL' || !UI_TO_DB[statusFilter]
        ? {}
        : { status: UI_TO_DB[statusFilter] };

    const rawReports = await prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        handyman: {
          include: {
            user:     { select: { name: true } },
            warnings: {
              orderBy: { createdAt: 'desc' },
              take: 5,
              include: { admin: { select: { name: true } } },
            },
            _count: { select: { reports: true, warnings: true } },
          },
        },
        reporter: { select: { name: true, email: true } },
      },
    });

    // ── Lazy auto-unpause: if pausedUntil has passed, clear the pause ──
    const now = new Date();
    const toUnpause = rawReports
      .map(r => r.handyman)
      .filter(h => h.isPaused && h.pausedUntil && h.pausedUntil <= now)
      .map(h => h.id);

    if (toUnpause.length > 0) {
      await prisma.handymanProfile.updateMany({
        where: { id: { in: toUnpause } },
        data:  { isPaused: false, pausedUntil: null },
      });
      // Reflect unpause in memory so the response is already accurate
      rawReports.forEach(r => {
        if (toUnpause.includes(r.handyman.id)) {
          r.handyman.isPaused    = false;
          r.handyman.pausedUntil = null;
        }
      });
    }

    const reports = rawReports.map((r) => ({
      id:            r.id,
      handymanId:    r.handymanId,
      handymanName:  r.handyman.user.name,
      reason:        r.reason,
      description:   r.description,
      status:        DB_TO_UI[r.status],
      actionNote:    r.actionNote ?? null,
      proofImages:   r.proofImages ?? [],
      reporterName:  r.reporter?.name  ?? null,
      reporterEmail: r.reporter?.email ?? null,
      createdAt:     r.createdAt.toISOString(),
      // Handyman context shown in the action panel
      handyman: {
        isPaused:       r.handyman.isPaused,
        pausedUntil:    r.handyman.pausedUntil?.toISOString() ?? null,
        isBanned:       r.handyman.isBanned,
        warningCount:   r.handyman.warningCount,
        totalReports:   r.handyman._count.reports,
        recentWarnings: r.handyman.warnings.map(w => ({
          id:        w.id,
          note:      w.note,
          adminName: w.admin?.name ?? 'Admin',
          createdAt: w.createdAt.toISOString(),
        })),
      },
    }));

    return NextResponse.json({ reports, total: reports.length });
  } catch (error) {
    console.error('[GET /api/admin/reports]', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}