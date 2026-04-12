// app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const handymanId = formData.get('handymanId') as string;
    const handymanName = formData.get('handymanName') as string;
    const rating = parseInt(formData.get('rating') as string);
    const reviewText = formData.get('reviewText') as string;
    const userId = formData.get('userId') as string;
    const images = formData.getAll('images') as File[];

    // Validate required fields
    if (!handymanId || !rating || !reviewText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (reviewText.length < 10) {
      return NextResponse.json(
        { error: 'Review must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Upload images to cloud storage (Cloudinary, AWS S3, etc.)
    // 2. Save review to database
    // 3. Update handyman's average rating
    
    // Example image upload (commented - implement with your storage solution)
    /*
    const uploadedImages = [];
    for (const image of images) {
      const buffer = await image.arrayBuffer();
      const uploadResult = await cloudinary.uploader.upload(
        `data:${image.type};base64,${Buffer.from(buffer).toString('base64')}`,
        { folder: `reviews/${handymanId}` }
      );
      uploadedImages.push(uploadResult.secure_url);
    }
    */

    // Example database save (commented - implement with your DB)
    /*
    await prisma.review.create({
      data: {
        handymanId,
        userId: userId || null,
        rating,
        content: reviewText,
        images: uploadedImages || [],
        createdAt: new Date(),
      }
    });

    // Update handyman's average rating
    await prisma.handyman.update({
      where: { id: handymanId },
      data: {
        averageRating: await prisma.review.aggregate({
          where: { handymanId },
          _avg: { rating: true }
        }).then(res => res._avg.rating || 0)
      }
    });
    */

    console.log('Review submitted:', {
      handymanId,
      handymanName,
      rating,
      reviewText,
      userId,
      imagesCount: images.length,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { message: 'Review submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to fetch reviews for a handyman
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const handymanId = searchParams.get('handymanId');

  if (!handymanId) {
    return NextResponse.json(
      { error: 'handymanId is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch reviews from database (commented - implement with your DB)
    /*
    const reviews = await prisma.review.findMany({
      where: { handymanId },
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    });
    */

    // Mock data for demonstration
    const mockReviews = [
      {
        id: '1',
        userName: 'John Doe',
        userAvatar: 'https://ui-avatars.com/api/?background=3B82F6&color=fff',
        rating: 5,
        content: 'Excellent service! Very professional and thorough.',
        images: [],
        createdAt: new Date().toISOString(),
        helpful: 12
      }
    ];

    return NextResponse.json(mockReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}