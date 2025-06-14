import Link from 'next/link'

export default function ConsultationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">CA Consultation</h1>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Book a Consultation with Our CA</h2>
          <p className="text-gray-600 mb-6">
            Get expert guidance on your accounting and financial matters from our experienced Chartered Accountant.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <svg
                className="h-6 w-6 text-primary-600 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>One-on-one consultation sessions</span>
            </div>
            <div className="flex items-center">
              <svg
                className="h-6 w-6 text-primary-600 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Flexible scheduling</span>
            </div>
            <div className="flex items-center">
              <svg
                className="h-6 w-6 text-primary-600 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span>Personalized advice and solutions</span>
            </div>
          </div>
          <div className="mt-8">
            <Link
              href="/bookings/new?type=consultation"
              className="block w-full bg-primary-600 text-white text-center px-4 py-3 rounded-md hover:bg-primary-700 transition"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 