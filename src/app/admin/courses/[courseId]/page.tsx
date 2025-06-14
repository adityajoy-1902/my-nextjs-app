import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AddSectionForm } from '@/components/admin/AddSectionForm'
import { AddLessonForm } from '@/components/admin/AddLessonForm'
import { AddMaterialForm } from '@/components/admin/AddMaterialForm'

interface AdminCoursePageProps {
  params: { courseId: string }
}

export default async function AdminCoursePage({ params }: AdminCoursePageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
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
  })

  if (!course) {
    redirect('/admin/courses')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Course: {course.title}</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Course Sections</h2>
        <AddSectionForm courseId={course.id} />
      </div>

      <div className="space-y-6">
        {course.sections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {section.order}. {section.title}
              </h3>
            </div>

            <div className="mb-6">
              <h4 className="text-md font-medium mb-2">Lessons</h4>
              <div className="space-y-2">
                {section.lessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <span>{lesson.title}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <AddLessonForm sectionId={section.id} />
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium mb-2">Materials</h4>
              <div className="space-y-2">
                {section.materials.map((material) => (
                  <div key={material.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <span>{material.title}</span>
                    <a 
                      href={material.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <AddMaterialForm sectionId={section.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 