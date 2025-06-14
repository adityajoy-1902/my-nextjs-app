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

    const { searchParams } = new URL(request.url)
    const sort = searchParams.get('sort')

    const courses = await prisma.course.findMany({
      orderBy: sort === 'enrollments'
        ? {
            enrollments: {
              _count: 'desc',
            },
          }
        : {
            createdAt: 'desc',
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

    return NextResponse.json({ courses })
  } catch (error) {
    console.error('Courses error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const thumbnail = formData.get('thumbnail') as File | null
    const isEnrollmentEnabled = formData.get('isEnrollmentEnabled') === 'on'

    if (!title || !description || isNaN(price)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // TODO: Upload thumbnail to cloud storage (e.g. Cloudinary)
    let thumbnailUrl = null
    if (thumbnail) {
      // Implement file upload logic here
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price,
        thumbnail: thumbnailUrl,
        isEnrollmentEnabled,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Course creation error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 