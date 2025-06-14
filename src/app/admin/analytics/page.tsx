import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/login?callbackUrl=/admin/analytics')
  }

  const [
    totalCourses,
    totalStudents,
    totalEnrollments,
    recentEnrollments,
    bookingsByStatus
  ] = await Promise.all([
    prisma.course.count(),
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.enrollment.count(),
    prisma.enrollment.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        course: true
      }
    }),
    prisma.booking.groupBy({
      by: ['status'],
      _count: true
    })
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Courses</h3>
          <p className="text-3xl font-bold text-blue-600">{totalCourses}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Students</h3>
          <p className="text-3xl font-bold text-green-600">{totalStudents}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Enrollments</h3>
          <p className="text-3xl font-bold text-purple-600">{totalEnrollments}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Enrollments</h3>
          <div className="space-y-4">
            {recentEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{enrollment.user.name}</p>
                  <p className="text-sm text-gray-500">{enrollment.course.title}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(enrollment.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bookings by Status</h3>
          <div className="space-y-4">
            {bookingsByStatus.map((status) => (
              <div key={status.status} className="flex items-center justify-between">
                <p className="font-medium capitalize">{status.status.toLowerCase()}</p>
                <p className="text-2xl font-bold">{status._count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 