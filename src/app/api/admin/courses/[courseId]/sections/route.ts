import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const sections = await prisma.section.findMany({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        order: 'asc',
      },
      include: {
        _count: {
          select: {
            lessons: true,
            materials: true,
          },
        },
      },
    })

    return NextResponse.json(sections)
  } catch (error) {
    console.error('Sections error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const json = await request.json()
    const { title, order } = json

    if (!title || typeof order !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: {
        id: params.courseId,
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const section = await prisma.section.create({
      data: {
        title,
        order,
        courseId: params.courseId,
      },
      include: {
        _count: {
          select: {
            lessons: true,
            materials: true,
          },
        },
      },
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error('Section creation error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 