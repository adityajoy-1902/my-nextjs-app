import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardCoursesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/dashboard/courses')
  }

  const enrollments = await prisma.enrollment.findMany({
    where: {
      user: {
        email: session.user.email!
      }
    },
    include: {
      course: true
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map(({ course }) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {course.thumbnail && (
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              <Link 
                href={`/dashboard/courses/${course.id}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Continue Learning →
              </Link>
            </div>
          </div>
        ))}

        {enrollments.length === 0 && (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium text-gray-600 mb-4">
              You haven't enrolled in any courses yet
            </h3>
            <Link
              href="/courses"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse Courses →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
} 