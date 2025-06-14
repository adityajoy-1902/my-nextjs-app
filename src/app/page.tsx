import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Learn from Expert Instructors
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Access high-quality courses and get personalized consultation from industry experts.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/courses"
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Browse Courses
              </Link>
              <Link
                href="/consultation"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Book Consultation <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              Why Choose Us
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to succeed
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  Expert Instructors
                </dt>
                <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Learn from industry experts with years of practical experience.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  Personalized Learning
                </dt>
                <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Get one-on-one consultation and doubt clearing sessions.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  Quality Content
                </dt>
                <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Access high-quality video content and learning materials.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
} 