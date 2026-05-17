// src/app/api/admin/reports/[id]/action/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type Action = 'WARN' | 'PAUSE' | 'BAN' | 'DISMISS';

const VALID_ACTIONS: Action[] = ['WARN', 'PAUSE', 'BAN', 'DISMISS'];
const VALID_PAUSE_DAYS = [3, 7, 14, 30];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params;

    // ── Auth: get admin from cookie ──
    const cookieValue = req.cookies.get('current-user')?.value;
    let adminId: string | null = null;
    if (cookieValue) {
      try {
        const parsed = JSON.parse(cookieValue);
        if (parsed.role === 'admin') adminId = parsed.id;
      } catch { /* ignore */ }
    }

    const body = await req.json();
    const { action, note, pauseDays = 7 } = body as {
      action: Action;
      note?: string;
      pauseDays?: number;
    };

    // ── Validate ──
    if (!action || !VALID_ACTIONS.includes(action)) {
      return NextResponse.json(
        { error: `Invalid action. Must be one of: ${VALID_ACTIONS.join(', ')}` },
        { status: 400 }
      );
    }
    if (action === 'PAUSE' && !VALID_PAUSE_DAYS.includes(pauseDays)) {
      return NextResponse.json(
        { error: `pauseDays must be one of: ${VALID_PAUSE_DAYS.join(', ')}` },
        { status: 400 }
      );
    }

    // ── Fetch the report + handyman profile ──
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        handyman: { select: { id: true, userId: true, isBanned: true, isPaused: true } },
      },
    });

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const handymanProfileId = report.handyman.id;

    // ── Execute action in a transaction ──
    await prisma.$transaction(async (tx) => {
      // 1. Update the report: mark resolved (or dismissed) + save admin note
      await tx.report.update({
        where: { id: reportId },
        data: {
          status:     action === 'DISMISS' ? 'DISMISSED' : 'RESOLVED',
          actionNote: note?.trim() || null,
        },
      });

      // 2. Take action on the handyman profile
      if (action === 'WARN') {
        // Create a warning record + increment counter
        await tx.warning.create({
          data: {
            handymanId: handymanProfileId,
            adminId,
            reportId,
            note: note?.trim() || null,
          },
        });
        await tx.handymanProfile.update({
          where: { id: handymanProfileId },
          data: { warningCount: { increment: 1 } },
        });

      } else if (action === 'PAUSE') {
        const pausedUntil = new Date();
        pausedUntil.setDate(pausedUntil.getDate() + pauseDays);

        await tx.handymanProfile.update({
          where: { id: handymanProfileId },
          data: {
            isPaused:   true,
            pausedUntil,
          },
        });

      } else if (action === 'BAN') {
        await tx.handymanProfile.update({
          where: { id: handymanProfileId },
          data: {
            isBanned:   true,
            isPaused:   false,   // ban supersedes pause
            pausedUntil: null,
          },
        });

      }
      // DISMISS: only the report status update above — no handyman change
    });

    return NextResponse.json(
      { message: `Action "${action}" applied successfully` },
      { status: 200 }
    );
  } catch (error: any) {
    // P2025 = record not found (Prisma)
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    // P2003 = foreign key violation, P2002 = unique constraint, etc.
    console.error('[POST /api/admin/reports/[id]/action] code:', error?.code, 'message:', error?.message, error);
    return NextResponse.json(
      { error: error?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}