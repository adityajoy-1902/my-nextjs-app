import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Lesson } from '@prisma/client'

interface LessonPageProps {
  params: {
    courseId: string
    lessonId: string
  }
}

interface LessonWithDetails extends Lesson {
  completed: boolean
  section: {
    course: {
      id: string
      title: string
    }
  }
}

function getYouTubeVideoId(url: string): string {
  const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return videoIdMatch ? videoIdMatch[1] : url;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      courseId: params.courseId,
      userId: session.user.id
    }
  })

  if (!enrollment) {
    redirect('/dashboard/courses')
  }

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: params.lessonId
    },
    include: {
      section: {
        include: {
          course: {
            select: {
              id: true,
              title: true
            }
          }
        }
      }
    }
  }) as LessonWithDetails | null

  if (!lesson) {
    redirect(`/dashboard/courses/${params.courseId}`)
  }

  const videoId = getYouTubeVideoId(lesson.videoUrl)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
          <p className="text-gray-600">{lesson.section.course.title}</p>
        </div>
        <Link
          href={`/dashboard/courses/${params.courseId}`}
          className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
        >
          Back to Course
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Lesson Description</h2>
        <p className="text-gray-600 mb-6">{lesson.description}</p>

        <form action={`/api/lessons/${lesson.id}/complete`} method="POST">
          <button
            type="submit"
            className={`w-full ${
              lesson.completed
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-4 py-2 rounded`}
          >
            {lesson.completed ? 'Completed' : 'Mark as Completed'}
          </button>
        </form>
      </div>
    </div>
  )
} 