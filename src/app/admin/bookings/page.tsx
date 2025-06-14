import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

async function confirmBooking(bookingId: string) {
  'use server'
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CONFIRMED' }
  })
}

async function rejectBooking(bookingId: string) {
  'use server'
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED' }
  })
}

export default async function AdminBookingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  const bookings = await prisma.booking.findMany({
    include: {
      user: true
    },
    orderBy: {
      startTime: 'desc'
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize">{booking.type.toLowerCase()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(booking.startTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {booking.status === 'PENDING' && (
                      <div className="flex space-x-2">
                        <form action={confirmBooking.bind(null, booking.id)}>
                          <button
                            type="submit"
                            className="text-green-600 hover:text-green-900"
                          >
                            Accept
                          </button>
                        </form>
                        <form action={rejectBooking.bind(null, booking.id)}>
                          <button
                            type="submit"
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {bookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 