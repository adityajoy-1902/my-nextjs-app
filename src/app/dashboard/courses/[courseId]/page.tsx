import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Enrollment, Course, Section, Lesson } from '@prisma/client'

interface CourseDetailsPageProps {
  params: { courseId: string }
}

interface EnrollmentWithDetails extends Omit<Enrollment, 'progress'> {
  progress: number
  course: Course & {
    sections: (Section & {
      lessons: (Lesson & { completed: boolean })[]
      materials: {
        id: string
        title: string
        url: string
      }[]
    })[]
  }
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/dashboard/courses')
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      courseId: params.courseId,
      userId: session.user.id
    },
    include: {
      course: {
        include: {
          sections: {
            include: {
              lessons: true,
              materials: true
            },
            orderBy: {
              order: 'asc'
            }
          }
        }
      }
    }
  }) as EnrollmentWithDetails | null

  if (!enrollment) {
    redirect('/dashboard/courses')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{enrollment.course.title}</h1>
        <Link
          href="/dashboard/courses"
          className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
        >
          Back to My Courses
        </Link>
      </div>

      <div className="mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Course Progress</h2>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${enrollment.progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">{enrollment.progress}% Complete</p>
        </div>
      </div>

      <div className="space-y-6">
        {enrollment.course.sections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
              {section.order}. {section.title}
            </h3>

            <div className="space-y-4">
              {section.lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between bg-gray-50 p-4 rounded">
                  <div>
                    <p className="font-medium">{lesson.title}</p>
                    <p className="text-sm text-gray-500">{lesson.description}</p>
                  </div>
                  <Link
                    href={`/dashboard/courses/${params.courseId}/lessons/${lesson.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {lesson.completed ? 'Review' : 'Start'}
                  </Link>
                </div>
              ))}

              {section.materials.map((material) => (
                <div key={material.id} className="flex items-center justify-between bg-gray-50 p-4 rounded">
                  <div>
                    <p className="font-medium">{material.title}</p>
                    <p className="text-sm text-gray-500">Supplementary Material</p>
                  </div>
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    View Material
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 