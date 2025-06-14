'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BookingFormProps {
  type: string
}

export function BookingForm({ type }: BookingFormProps) {
  const router = useRouter()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const startTime = new Date(`${date}T${time}`)
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // 1 hour session

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: type === 'consultation' ? 'CONSULTATION' : 'DOUBT',
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          description,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to create booking')
      }

      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>

      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
          Time
        </label>
        <select
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        >
          <option value="">Select a time</option>
          <option value="09:00">9:00 AM</option>
          <option value="10:00">10:00 AM</option>
          <option value="11:00">11:00 AM</option>
          <option value="12:00">12:00 PM</option>
          <option value="14:00">2:00 PM</option>
          <option value="15:00">3:00 PM</option>
          <option value="16:00">4:00 PM</option>
          <option value="17:00">5:00 PM</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder={
            type === 'consultation'
              ? 'Describe what you would like to discuss in the consultation...'
              : 'Describe your doubt or question...'
          }
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Booking...' : 'Book Session'}
      </button>
    </form>
  )
} 