import { Lesson, Section, Course } from '@prisma/client'

export interface LessonWithDetails extends Omit<Lesson, 'completed'> {
  completed: boolean
  section: Section & {
    course: Course & {
      enrollments: {
        id: string
        createdAt: Date
        updatedAt: Date
        userId: string
        courseId: string
        progress: number
        status: string
      }[]
    }
  }
} 