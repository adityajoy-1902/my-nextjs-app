import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const [
      totalCourses,
      totalStudents,
      totalEnrollments,
      pendingBookings,
    ] = await Promise.all([
      prisma.course.count(),
      prisma.user.count({
        where: {
          role: 'STUDENT',
        },
      }),
      prisma.enrollment.count(),
      prisma.booking.count({
        where: {
          status: 'PENDING',
        },
      }),
    ])

    return NextResponse.json({
      totalCourses,
      totalStudents,
      totalEnrollments,
      pendingBookings,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 