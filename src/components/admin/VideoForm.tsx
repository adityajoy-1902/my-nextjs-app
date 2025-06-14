'use client'

import { useState } from 'react'

interface Video {
  id: string
  title: string
  description: string
  youtubeId: string
  order: number
}

interface VideoFormProps {
  initialData?: Video | null
  onSubmit: (video: Omit<Video, 'id'>) => void
  onCancel: () => void
}

export default function VideoForm({
  initialData,
  onSubmit,
  onCancel,
}: VideoFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [youtubeId, setYoutubeId] = useState(initialData?.youtubeId || '')
  const [order, setOrder] = useState(initialData?.order || 0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate YouTube ID
      if (!youtubeId.match(/^[a-zA-Z0-9_-]{11}$/)) {
        throw new Error('Invalid YouTube video ID')
      }

      await onSubmit({
        title,
        description,
        youtubeId,
        order,
      })
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Video Title
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
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="youtubeId"
          className="block text-sm font-medium text-gray-700"
        >
          YouTube Video ID
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="youtubeId"
            id="youtubeId"
            value={youtubeId}
            onChange={(e) => setYoutubeId(e.target.value)}
            required
            pattern="[a-zA-Z0-9_-]{11}"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          The 11-character ID from the YouTube video URL (e.g.,
          youtube.com/watch?v=VIDEO_ID)
        </p>
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
          The order in which this video appears in the section.
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
            : 'Add Video'}
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