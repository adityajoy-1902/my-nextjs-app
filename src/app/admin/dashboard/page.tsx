'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/auth/login?callbackUrl=/admin/dashboard')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Course Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Course Management</h2>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/admin/courses/new')}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create New Course
            </button>
            <button
              onClick={() => router.push('/admin/courses')}
              className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
            >
              View All Courses
            </button>
          </div>
        </div>

        {/* Booking Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Booking Management</h2>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/admin/bookings')}
              className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
            >
              View All Bookings
            </button>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">User Management</h2>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/admin/users')}
              className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
            >
              View All Users
            </button>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/admin/analytics')}
              className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
            >
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 