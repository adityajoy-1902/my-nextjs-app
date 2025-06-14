import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { sectionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const section = await prisma.section.findUnique({
      where: {
        id: params.sectionId,
      },
      include: {
        _count: {
          select: {
            videos: true,
            materials: true,
          },
        },
      },
    })

    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(section)
  } catch (error) {
    console.error('Section error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { sectionId: string } }
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

    // Check if section exists
    const existingSection = await prisma.section.findUnique({
      where: {
        id: params.sectionId,
      },
    })

    if (!existingSection) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      )
    }

    const section = await prisma.section.update({
      where: {
        id: params.sectionId,
      },
      data: {
        title,
        order,
      },
      include: {
        _count: {
          select: {
            videos: true,
            materials: true,
          },
        },
      },
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error('Section update error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { sectionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if section exists
    const existingSection = await prisma.section.findUnique({
      where: {
        id: params.sectionId,
      },
    })

    if (!existingSection) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      )
    }

    await prisma.section.delete({
      where: {
        id: params.sectionId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Section deletion error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 