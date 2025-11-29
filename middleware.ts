export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/daily/:path*', '/weekly/:path*', '/settings/:path*']
}
