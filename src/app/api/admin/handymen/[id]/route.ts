// src/app/api/admin/handymen/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// PATCH /api/admin/handymen/[id]
// Body: { action: 'approve' | 'reject' | 'pause' | 'unpause' | 'ban' | 'unban' }
// [id] is the handymanProfile.id (NOT userId)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ← Next.js 15: await params
) {
  try {
    const { id } = await params;
    const { action } = await req.json();

    const validActions = ['approve', 'reject', 'pause', 'unpause', 'ban', 'unban'];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Build the update payload per action
    let data: Record<string, boolean> = {};
    switch (action) {
      case 'approve':
        data = { isApproved: true, isBanned: false, isPaused: false };
        break;
      case 'reject':
        data = { isApproved: false };
        break;
      case 'pause':
        data = { isPaused: true };
        break;
      case 'unpause':
        data = { isPaused: false };
        break;
      case 'ban':
        // Ban overrides approval — handyman disappears from public site
        data = { isBanned: true, isApproved: false, isPaused: false };
        break;
      case 'unban':
        data = { isBanned: false };
        break;
    }

    const updated = await prisma.handymanProfile.update({
      where: { id }, // ← profile id directly, no extra findFirst needed
      data,
      select: {
        id: true,
        userId: true,
        isApproved: true,
        isPaused: true,
        isBanned: true,
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({ handyman: updated });
  } catch (error) {
    console.error('[ADMIN PATCH HANDYMAN]', error);
    return NextResponse.json({ error: 'Failed to update handyman' }, { status: 500 });
  }
}

// DELETE /api/admin/handymen/[id] — remove handyman profile entirely
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.handymanProfile.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ADMIN DELETE HANDYMAN]', error);
    return NextResponse.json({ error: 'Failed to delete handyman' }, { status: 500 });
  }
}