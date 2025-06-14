import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequestWithAuth } from 'next-auth/middleware'

export default async function middleware(request: NextRequestWithAuth) {
  const token = await getToken({ req: request })

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/courses',
    '/consultation'
  ]

  if (
    publicRoutes.includes(request.nextUrl.pathname) ||
    request.nextUrl.pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next()
  }

  // Protected routes
  if (!token) {
    const url = new URL('/auth/login', request.url)
    url.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Admin routes
  if (
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/api/admin')
  ) {
    if (token.role !== 'ADMIN') {
      return new NextResponse(null, { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 