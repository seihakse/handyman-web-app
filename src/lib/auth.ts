// src/lib/auth.ts
import NextAuth, { SessionStrategy, Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { JWT } from 'next-auth/jwt'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Extend next-auth types
declare module 'next-auth' {
  interface User {
    id: string
    role: string
  }
  
  interface Session {
    user: {
      id: string
      role: string
      email: string
      name?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
  }
}

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' as SessionStrategy },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials)
        
        if (!validatedFields.success) {
          console.log('Validation failed:', validatedFields.error)
          return null
        }

        const { email, password } = validatedFields.data

        try {
          console.log('Looking for user with email:', email)
          const user = await prisma.user.findUnique({
            where: { email }
          })

          console.log('Found user:', user ? 'Yes' : 'No')
          
          if (!user || !user.password) {
            console.log('User not found or no password')
            return null
          }

          console.log('Comparing passwords...')
          const passwordsMatch = await bcrypt.compare(password, user.password)

          console.log('Password match:', passwordsMatch)
          
          if (!passwordsMatch) {
            return null
          }

          console.log('Authentication successful for:', user.email)
          
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          console.error('Authorize error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async session({ token, session }: { token: JWT; session: Session }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.email = token.email as string
        session.user.name = token.name
      }
      return session
    },
    async jwt({ token, user }: { token: JWT; user?: import('next-auth').User }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    }
  },
  pages: {
    signIn: '/signin',
    error: '/signin'
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug in development
  secret: process.env.NEXTAUTH_SECRET
}

// Create and export NextAuth instance
const { handlers, auth, signIn, signOut } = NextAuth(authOptions)

export { handlers, auth, signIn, signOut }