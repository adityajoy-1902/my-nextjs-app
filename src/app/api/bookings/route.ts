import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Please login to make a booking' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, startTime, endTime, description } = body

    if (!type || !startTime || !endTime || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user from database to ensure they exist
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const booking = await prisma.booking.create({
      data: {
        type: type.toUpperCase(),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        description,
        user: {
          connect: { id: user.id }
        },
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking. Please try again.' },
      { status: 500 }
    )
  }
} 