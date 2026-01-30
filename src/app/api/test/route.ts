// src/app/api/test/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const users = await prisma.user.findMany()
    return NextResponse.json({ 
      success: true, 
      count: users.length,
      users: users.map(u => ({ email: u.email, name: u.name, role: u.role }))
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}