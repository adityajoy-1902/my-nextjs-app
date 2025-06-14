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

    const course = await prisma.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        _count: {
          select: {
            enrollments: true,
            sections: true,
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Course error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function PUT(
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
    const { title, description, price, thumbnail } = json

    if (!title || !description || typeof price !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: {
        id: params.courseId,
      },
    })

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const course = await prisma.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        title,
        description,
        price,
        thumbnail,
      },
      include: {
        _count: {
          select: {
            enrollments: true,
            sections: true,
          },
        },
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Course update error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: {
        id: params.courseId,
      },
    })

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // TODO: Delete thumbnail from cloud storage if exists
    if (existingCourse.thumbnail) {
      // Implement file deletion logic here
    }

    await prisma.course.delete({
      where: {
        id: params.courseId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Course deletion error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 