// src/app/api/handyman/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

function getCurrentUser(req: NextRequest) {
  const cookieValue = req.cookies.get('current-user')?.value;
  if (!cookieValue) return null;
  try { return JSON.parse(cookieValue); } catch { return null; }
}

// GET /api/handyman/me — fetch the current handyman's professional profile
export async function GET(req: NextRequest) {
  const user = getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const profile = await prisma.handymanProfile.findUnique({
      where: { userId: user.id },
      select: {
        id:               true,
        bio:              true,
        skills:           true,
        telegramUsername: true,
        yearsOfExperience: true,
        serviceArea:      true,
        availability:     true,
        category:         { select: { id: true, name: true } },
      },
    });

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    return NextResponse.json(profile);
  } catch (error) {
    console.error('[GET /api/handyman/me]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/handyman/me — update professional fields only
export async function PATCH(req: NextRequest) {
  const user = getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'handyman') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await req.json();
    const { bio, telegramUsername, yearsOfExperience, serviceArea, skills } = body;

    const updated = await prisma.handymanProfile.update({
      where: { userId: user.id },
      data: {
        bio:               bio              ?? undefined,
        telegramUsername:  telegramUsername ?? undefined,
        yearsOfExperience: yearsOfExperience !== undefined
                             ? (yearsOfExperience === null ? null : Number(yearsOfExperience))
                             : undefined,
        serviceArea:       serviceArea      ?? undefined,
        skills:            skills           ?? undefined,
      },
      select: {
        id:               true,
        bio:              true,
        skills:           true,
        telegramUsername: true,
        yearsOfExperience: true,
        serviceArea:      true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[PATCH /api/handyman/me]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}