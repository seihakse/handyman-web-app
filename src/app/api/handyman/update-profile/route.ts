// app/api/handyman/update-profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

async function getCurrentSession(): Promise<{ userId: string; role: string } | null> {
  try {
    const cookieStore = cookies();
    const raw = (await cookieStore).get('session')?.value;
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// GET — load existing handyman profile into the settings form
export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'handyman') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const profile = await prisma.handymanProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Get handyman profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PATCH — save handyman profile from settings form
export async function PATCH(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'handyman') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const {
      bio,
      skills,           // arrives as comma-separated string from the form
      telegramUsername,
      yearsOfExperience,
      serviceArea,
      availability,
      certificate,
      portfolioImage,
    } = body;

    // upsert — safe whether profile exists or not
    const profile = await prisma.handymanProfile.upsert({
      where: { userId: session.userId },
      update: {
        bio: bio || null,
        skills: skills || null,
        certificate: certificate || null,
        portfolioImage: portfolioImage || null,
        availability: availability || 'AVAILABLE',
        telegramUsername: telegramUsername || null,
        yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : null,
        serviceArea: serviceArea || null,
      },
      create: {
        userId: session.userId,
        bio: bio || null,
        skills: skills || null,
        certificate: certificate || null,
        portfolioImage: portfolioImage || null,
        availability: availability || 'AVAILABLE',
        telegramUsername: telegramUsername || null,
        yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : null,
        serviceArea: serviceArea || null,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Update handyman profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}