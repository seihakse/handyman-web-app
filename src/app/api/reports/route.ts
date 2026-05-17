// src/app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ReportType } from '@prisma/client';

const REASON_MAP: Record<string, ReportType> = {
  'Suspicious Account':                 ReportType.FRAUD,
  'Fake Profile / Identity Theft':      ReportType.FRAUD,
  'Not responding / Phone unreachable': ReportType.OTHER,
  'Scam/Fraud':                         ReportType.FRAUD,
  'Unprofessional Conduct':             ReportType.INAPPROPRIATE_BEHAVIOR,
  'Overcharging / Invalid pricing':     ReportType.INAPPROPRIATE_BEHAVIOR,
  'Wrong service category':             ReportType.OTHER,
  'Duplicate profile':                  ReportType.SPAM,
  'Inappropriate content':              ReportType.INAPPROPRIATE_BEHAVIOR,
  'Other':                              ReportType.OTHER,
};

const AUTO_BAN_THRESHOLD = 5;
const MAX_IMAGES         = 5;
const MAX_IMAGE_SIZE_MB  = 5;

// Convert a File (from FormData) → base64 data URL
async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  return `data:${file.type};base64,${base64}`;
}

export async function POST(request: NextRequest) {
  try {
    // ── Auth: read current-user cookie ──
    const cookieValue = request.cookies.get('current-user')?.value;
    let currentUserId: string | null = null;
    if (cookieValue) {
      try {
        const parsed = JSON.parse(cookieValue);
        currentUserId = parsed.id ?? null;
      } catch { /* anonymous allowed */ }
    }

    // ── Parse FormData (supports both text fields + image files) ──
    const formData   = await request.formData();
    const handymanId  = formData.get('handymanId') as string | null;
    const reason      = formData.get('reason')     as string | null;
    const description = formData.get('description') as string | null;
    const imageFiles  = formData.getAll('images')  as File[];

    // ── Validate text fields ──
    if (!handymanId) {
      return NextResponse.json({ error: 'handymanId is required' }, { status: 400 });
    }
    if (!reason) {
      return NextResponse.json({ error: 'reason is required' }, { status: 400 });
    }
    if (!description || description.trim().length < 10) {
      return NextResponse.json({ error: 'Description must be at least 10 characters' }, { status: 400 });
    }

    // ── Validate images ──
    const validImages = imageFiles.filter(f => f && f.size > 0);
    if (validImages.length > MAX_IMAGES) {
      return NextResponse.json({ error: `Maximum ${MAX_IMAGES} images allowed` }, { status: 400 });
    }
    for (const img of validImages) {
      if (img.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        return NextResponse.json(
          { error: `Each image must be under ${MAX_IMAGE_SIZE_MB}MB` },
          { status: 400 }
        );
      }
      if (!img.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
      }
    }

    // ── Map reason → enum ──
    const reportType: ReportType = REASON_MAP[reason] ?? ReportType.OTHER;

    // ── Fetch handyman ──
    const handymanProfile = await prisma.handymanProfile.findUnique({
      where: { id: handymanId },
      select: { id: true, userId: true, isBanned: true },
    });

    if (!handymanProfile) {
      return NextResponse.json({ error: 'Handyman not found' }, { status: 404 });
    }
    if (currentUserId && handymanProfile.userId === currentUserId) {
      return NextResponse.json({ error: 'You cannot report yourself' }, { status: 403 });
    }

    // ── Convert images to base64 ──
    const proofImages: string[] = await Promise.all(validImages.map(fileToBase64));

    // ── Save report + check auto-ban threshold in a transaction ──
    const { report, autoBanned } = await prisma.$transaction(async (tx) => {
      const report = await tx.report.create({
        data: {
          handymanId:  handymanProfile.id,
          reporterId:  currentUserId,
          reportedId:  handymanProfile.userId,
          reason:      reportType,
          description: description.trim(),
          status:      'PENDING',
          proofImages,
        },
      });

      // Count total PENDING/UNDER_REVIEW/RESOLVED reports (exclude dismissed noise)
      const activeReportCount = await tx.report.count({
        where: {
          handymanId: handymanProfile.id,
          status: { not: 'DISMISSED' },
        },
      });

      let autoBanned = false;
      if (activeReportCount >= AUTO_BAN_THRESHOLD && !handymanProfile.isBanned) {
        await tx.handymanProfile.update({
          where: { id: handymanProfile.id },
          data: {
            isBanned:    true,
            isPaused:    false,
            pausedUntil: null,
          },
        });
        autoBanned = true;
      }

      return { report, autoBanned };
    });

    return NextResponse.json(
      {
        message: 'Report submitted successfully',
        reportId: report.id,
        autoBanned, // useful for admin logs; not shown to reporter
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/reports]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}