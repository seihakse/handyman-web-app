// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  address: z.string().optional(),
  role: z.enum(['customer', 'handyman']),
  userType: z.enum(['customer', 'handyman']).optional(),
  profilePicture: z.string().optional().nullable(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  certificate: z.string().optional(),
  idCardImage: z.string().optional(),
  portfolioImage: z.string().optional(),
  // Must be a cuid-shaped string or absent — validated against DB below
  categoryId: z.string().optional().nullable(),
  serviceArea: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received signup data:', body)

    if (body.userType && !body.role) {
      body.role = body.userType
    }

    const validatedData = signUpSchema.parse(body)

    // ── Validate categoryId exists in DB ─────────────────────────────────────
    if (validatedData.categoryId) {
      const category = await prisma.serviceCategory.findUnique({
        where: { id: validatedData.categoryId },
        select: { id: true },
      })
      if (!category) {
        return NextResponse.json(
          { error: 'Selected category does not exist' },
          { status: 400 }
        )
      }
    }

    // ── Check duplicate email ─────────────────────────────────────────────────
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        password: hashedPassword,
        address: validatedData.address || null,
        role: validatedData.role,
        profilePicture: validatedData.profilePicture || null,
      },
    })

    let handymanProfile = null
    if (validatedData.role === 'handyman') {
      const existingProfile = await prisma.handymanProfile.findUnique({
        where: { userId: user.id },
      })

      if (!existingProfile) {
        handymanProfile = await prisma.handymanProfile.create({
          data: {
            userId: user.id,
            bio: validatedData.bio || null,
            skills: validatedData.skills ? validatedData.skills.join(', ') : null,
            certificate: validatedData.certificate || null,
            idCardImage: validatedData.idCardImage || null,
            portfolioImage: validatedData.portfolioImage || null,
            categoryId: validatedData.categoryId || null,
            serviceArea: validatedData.serviceArea || null,
          },
        })
      }
    }

    const { password: _, ...userWithoutPassword } = user

    const responseUser = {
      ...userWithoutPassword,
      userType: userWithoutPassword.role,
      ...(handymanProfile && { handymanProfile }),
    }

    const response = NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: responseUser,
        id: responseUser.id,
        name: responseUser.name,
        email: responseUser.email,
        role: responseUser.role,
        userType: responseUser.role,
        profilePicture: responseUser.profilePicture,
      },
      { status: 201 }
    )

    response.cookies.set({
      name: 'current-user',
      value: JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.role,
        profilePicture: user.profilePicture,
        phone: user.phone,
        address: user.address,
      }),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Detailed signup error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: (error.issues[0] ? error.issues[0].path.join('.') + ': ' + error.issues[0].message : 'Invalid data'),
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}