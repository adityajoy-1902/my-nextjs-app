import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      sections: true,
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-primary-600 font-semibold">₹{course.price}</span>
                <Link
                  href={`/courses/${course.id}`}
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 