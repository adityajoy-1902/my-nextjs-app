import CourseForm from '@/components/admin/CourseForm'

export default function NewCoursePage() {
  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Create Course</h1>
        <div className="mt-8">
          <CourseForm />
        </div>
      </div>
    </div>
  )
} 