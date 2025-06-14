'use client'

import { useState } from 'react'

interface Section {
  id: string
  title: string
  order: number
  _count?: {
    videos: number
    materials: number
  }
}

interface SectionFormProps {
  initialData?: Section | null
  onSubmit: (section: Omit<Section, 'id' | '_count'>) => void
  onCancel: () => void
}

export default function SectionForm({
  initialData,
  onSubmit,
  onCancel,
}: SectionFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [order, setOrder] = useState(initialData?.order || 0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit({
        title,
        order,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Section Title
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="order"
          className="block text-sm font-medium text-gray-700"
        >
          Order
        </label>
        <div className="mt-1">
          <input
            type="number"
            name="order"
            id="order"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value))}
            required
            min="0"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          The order in which this section appears in the course.
        </p>
      </div>

      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
        >
          {isSubmitting
            ? initialData
              ? 'Saving...'
              : 'Creating...'
            : initialData
            ? 'Save Changes'
            : 'Create Section'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  )
} 