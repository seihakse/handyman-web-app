// src/app/api/admin/handymen/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// PATCH /api/admin/handymen/[id] — approve or reject
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await req.json(); // action: 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const profile = await prisma.handymanProfile.findFirst({
      where: { userId: params.id },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Handyman profile not found' }, { status: 404 });
    }

    const updated = await prisma.handymanProfile.update({
      where: { id: profile.id },
      data: { isApproved: action === 'approve' },
      select: {
        id: true,
        userId: true,
        isApproved: true,
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({ handyman: updated });
  } catch (error) {
    console.error('[ADMIN PATCH HANDYMAN]', error);
    return NextResponse.json({ error: 'Failed to update handyman' }, { status: 500 });
  }
}

// DELETE /api/admin/handymen/[id] — remove handyman profile
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const profile = await prisma.handymanProfile.findFirst({
      where: { userId: params.id },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Handyman profile not found' }, { status: 404 });
    }

    await prisma.handymanProfile.delete({ where: { id: profile.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ADMIN DELETE HANDYMAN]', error);
    return NextResponse.json({ error: 'Failed to delete handyman' }, { status: 500 });
  }
}