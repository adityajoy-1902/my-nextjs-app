import { PrismaClient, UserRole, BookingType, BookingStatus } from '@prisma/client'
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  })

  // Create test student
  const studentPassword = await bcrypt.hash('student123', 10)
  const student = await prisma.user.create({
    data: {
      name: 'Test Student',
      email: 'student@example.com',
      password: studentPassword,
      role: UserRole.STUDENT,
    },
  })

  // Create test course
  const course = await prisma.course.create({
    data: {
      title: 'Introduction to Commerce',
      description: 'A comprehensive course covering the basics of commerce and accounting.',
      price: 999.99,
      sections: {
        create: [
          {
            title: 'Getting Started',
            order: 1,
            videos: {
              create: [
                {
                  title: 'Welcome to the Course',
                  url: 'https://example.com/video1',
                  order: 1,
                },
              ],
            },
          },
        ],
      },
    },
  })

  // Create test booking
  const booking = await prisma.booking.create({
    data: {
      type: BookingType.DOUBT,
      startTime: new Date('2024-03-25T10:00:00Z'),
      endTime: new Date('2024-03-25T11:00:00Z'),
      description: 'Need help understanding double-entry bookkeeping',
      userId: student.id,
      status: BookingStatus.PENDING,
    },
  })

  console.log({ admin, student, course, booking })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 