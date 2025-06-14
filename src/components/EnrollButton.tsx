'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EnrollButtonProps {
  courseId: string
}

export function EnrollButton({ courseId }: EnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleEnroll = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to enroll')
      }

      // Refresh the page to show updated enrollment status
      router.refresh()
      
      // Redirect to dashboard
      router.push(`/dashboard/courses/${courseId}`)
    } catch (error) {
      console.error('Error enrolling:', error)
      alert(error instanceof Error ? error.message : 'Failed to enroll in course')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={isLoading}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Enrolling...' : 'Enroll Now'}
    </button>
  )
} 