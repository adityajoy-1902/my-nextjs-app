'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AddSectionFormProps {
  courseId: string
}

export function AddSectionForm({ courseId }: AddSectionFormProps) {
  const [title, setTitle] = useState('')
  const [order, setOrder] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          order: parseInt(order),
          courseId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create section')
      }

      setTitle('')
      setOrder('')
      router.refresh()
    } catch (error) {
      console.error('Error creating section:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Section Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="order" className="block text-sm font-medium text-gray-700">
          Order
        </label>
        <input
          type="number"
          id="order"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          min="1"
        />
      </div>

      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Add Section
      </button>
    </form>
  )
} 