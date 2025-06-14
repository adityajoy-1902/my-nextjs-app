import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function POST(
  request: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: params.lessonId },
      include: {
        section: {
          include: {
            course: {
              include: {
                enrollments: {
                  where: {
                    userId: session.user.id
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    if (lesson.section.course.enrollments.length === 0) {
      return NextResponse.json(
        { error: 'Not enrolled in this course' },
        { status: 403 }
      )
    }

    // Update lesson completion status
    const updatedLesson = await prisma.lesson.update({
      where: { id: params.lessonId },
      data: {
        completed: !lesson.completed
      }
    })

    // Calculate new progress percentage
    const totalLessons = await prisma.lesson.count({
      where: {
        section: {
          courseId: lesson.section.course.id
        }
      }
    })

    const completedLessons = await prisma.lesson.count({
      where: {
        section: {
          courseId: lesson.section.course.id
        },
        completed: true
      }
    })

    const progress = Math.round((completedLessons / totalLessons) * 100)

    // Update enrollment progress
    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: lesson.section.course.id
        }
      },
      data: {
        progress
      }
    })

    return NextResponse.json(updatedLesson)
  } catch (error) {
    console.error('Lesson completion error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
} 