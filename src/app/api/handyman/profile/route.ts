// src/app/api/handyman/profile/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const handymanProfileSchema = z.object({
  userId: z.string(),
  bio: z.string().optional(),
  skills: z.string().optional(),
  certificate: z.string().optional(),
  idCardImage: z.string().optional(),
  portfolioImage: z.string().optional(),
  categoryId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validatedData = handymanProfileSchema.parse(body)

    // Create handyman profile
    const handymanProfile = await prisma.handymanProfile.create({
      data: {
        userId: validatedData.userId,
        bio: validatedData.bio,
        skills: validatedData.skills,
        certificate: validatedData.certificate,
        idCardImage: validatedData.idCardImage,
        portfolioImage: validatedData.portfolioImage,
        categoryId: validatedData.categoryId,
      }
    })

    return NextResponse.json(
      { message: 'Handyman profile created successfully', profile: handymanProfile },
      { status: 201 }
    )
  } catch (error) {
    console.error('Handyman profile creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}