import { BookingForm } from '@/components/BookingForm'

interface BookingPageProps {
  searchParams: {
    type?: string
  }
}

export default function BookingPage({ searchParams }: BookingPageProps) {
  const bookingType = searchParams.type || 'doubt'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {bookingType === 'consultation' ? 'Book CA Consultation' : 'Book Doubt Clearing Session'}
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <BookingForm type={bookingType} />
        </div>
      </div>
    </div>
  )
} 