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
  userType: z.enum(['customer', 'handyman']).optional(), // Accept both role and userType
  profilePicture: z.string().optional().nullable(),
  // Handyman specific fields (optional for now, will be used in profile creation)
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  certificate: z.string().optional(),
  idCardImage: z.string().optional(),
  portfolioImage: z.string().optional(),
  categoryId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received signup data:', body)
    
    // Map userType to role if provided
    if (body.userType && !body.role) {
      body.role = body.userType
    }
    
    const validatedData = signUpSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user with all fields
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        password: hashedPassword,
        address: validatedData.address || null,
        role: validatedData.role,
        profilePicture: validatedData.profilePicture || null,
      }
    })

    // If user is a handyman, create handyman profile
    let handymanProfile = null
    if (validatedData.role === 'handyman') {
      // Check if handyman profile already exists (shouldn't, but just in case)
      const existingProfile = await prisma.handymanProfile.findUnique({
        where: { userId: user.id }
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
          }
        })
      }
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    // Prepare response user object
    const responseUser = {
      id: userWithoutPassword.id,
      name: userWithoutPassword.name,
      email: userWithoutPassword.email,
      phone: userWithoutPassword.phone,
      address: userWithoutPassword.address,
      role: userWithoutPassword.role,
      userType: userWithoutPassword.role, // Include userType for frontend compatibility
      profilePicture: userWithoutPassword.profilePicture,
      createdAt: userWithoutPassword.createdAt,
      updatedAt: userWithoutPassword.updatedAt,
      ...(handymanProfile && { handymanProfile }) // Include handyman profile if exists
    }

    // Create response with user data
    const response = NextResponse.json(
      { 
        success: true,
        message: 'User created successfully',
        user: responseUser,
        // Also include flat structure for backward compatibility
        id: responseUser.id,
        name: responseUser.name,
        email: responseUser.email,
        role: responseUser.role,
        userType: responseUser.userType,
        profilePicture: responseUser.profilePicture,
      },
      { status: 201 }
    )

    // Set user data in cookie for immediate authentication
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
        address: user.address
      }),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Detailed signup error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid data', 
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      )
    }

    // Handle Prisma errors
    if (error instanceof Error && error.message.includes('Prisma')) {
      console.error('Prisma error:', error)
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}