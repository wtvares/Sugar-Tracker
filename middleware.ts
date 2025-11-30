import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Allow access - authentication is optional
    // Users can use localStorage if not authenticated
  },
  {
    callbacks: {
      authorized: () => true, // Always allow access
    },
  }
)

export const config = {
  matcher: ['/daily/:path*', '/weekly/:path*', '/settings/:path*']
}
