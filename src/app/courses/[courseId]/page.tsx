import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { EnrollButton } from '@/components/EnrollButton'
import Link from 'next/link'

interface CoursePageProps {
  params: {
    courseId: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const session = await getServerSession(authOptions)
  
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      sections: {
        include: {
          lessons: {
            select: {
              id: true,
              title: true,
              description: true,
              order: true
            }
          }
        }
      },
      enrollments: session?.user ? {
        where: {
          userId: session.user.id
        }
      } : false
    }
  })

  if (!course) {
    notFound()
  }

  const isEnrolled = course.enrollments && course.enrollments.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-600 mb-6">{course.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${course.price}</span>
              {session?.user ? (
                isEnrolled ? (
                  <Link
                    href={`/dashboard/courses/${course.id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Continue Learning
                  </Link>
                ) : (
                  <EnrollButton courseId={params.courseId} />
                )
              ) : (
                <Link
                  href="/auth/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Login to Enroll
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {course.sections.map((section) => (
            <div key={section.id} className="border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
              <div className="space-y-4">
                {section.lessons?.map((lesson) => (
                  <div key={lesson.id} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">{lesson.order}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{lesson.title}</h3>
                      <p className="text-gray-500 text-sm">{lesson.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 