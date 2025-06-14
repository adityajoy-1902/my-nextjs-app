'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface CourseFormProps {
  initialData?: {
    id: string
    title: string
    description: string
    price: number
    thumbnail?: string | null
    isEnrollmentEnabled: boolean
  }
}

export default function CourseForm({ initialData }: CourseFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    initialData?.thumbnail || null
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      // If editing and no new thumbnail is selected, remove it from formData
      if (initialData && !thumbnail) {
        formData.delete('thumbnail')
      }

      const response = await fetch(
        initialData
          ? `/api/admin/courses/${initialData.id}`
          : '/api/admin/courses',
        {
          method: initialData ? 'PUT' : 'POST',
          body: formData,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      router.push('/admin/courses')
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Something went wrong')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnail(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Course Title
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={initialData?.title}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={initialData?.description}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="price"
              id="price"
              min="0"
              step="0.01"
              defaultValue={initialData?.price}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="thumbnail"
            className="block text-sm font-medium text-gray-700"
          >
            Thumbnail
          </label>
          <div className="mt-1 flex items-center space-x-6">
            {thumbnailPreview && (
              <div className="relative h-32 w-32">
                <Image
                  src={thumbnailPreview}
                  alt="Course thumbnail"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <input
              type="file"
              name="thumbnail"
              id="thumbnail"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isEnrollmentEnabled"
              id="isEnrollmentEnabled"
              defaultChecked={initialData?.isEnrollmentEnabled ?? true}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label
              htmlFor="isEnrollmentEnabled"
              className="ml-2 block text-sm text-gray-700"
            >
              Enable enrollment
            </label>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Students will be able to enroll in this course if enabled.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting
            ? initialData
              ? 'Saving...'
              : 'Creating...'
            : initialData
            ? 'Save Changes'
            : 'Create Course'}
        </button>
      </div>
    </form>
  )
} 