// app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { handymanId, handymanName, reason, description, userId } = body;

    // Validate required fields
    if (!handymanId || !reason || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (description.length < 10) {
      return NextResponse.json(
        { error: 'Description must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save the report to your database
    // 2. Send notification to admin
    // 3. Log the report for review
    
    // Example database save (commented out - implement with your DB)
    /*
    await prisma.report.create({
      data: {
        handymanId,
        reason,
        description,
        userId: userId || null,
        status: 'PENDING',
        createdAt: new Date(),
      }
    });
    */

    // Send email notification to admin (optional)
    // await sendAdminNotification({ handymanId, reason, description });

    console.log('Report submitted:', {
      handymanId,
      handymanName,
      reason,
      description,
      userId,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { message: 'Report submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}