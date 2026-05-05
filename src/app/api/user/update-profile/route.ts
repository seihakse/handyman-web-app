// app/api/user/update-profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

// Matches signin: cookies.set('session', JSON.stringify({ userId, role }))
async function getCurrentSession(): Promise<{ userId: string; role: string } | null> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get('session')?.value;
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, phone, address, profilePicture } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Ensure email isn't taken by someone else
    const conflict = await prisma.user.findFirst({
      where: { email, NOT: { id: session.userId } },
    });
    if (conflict) {
      return NextResponse.json({ error: 'Email is already in use' }, { status: 409 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        name,
        email,
        phone: phone || null,
        address: address || null,
        profilePicture: profilePicture || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        profilePicture: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}